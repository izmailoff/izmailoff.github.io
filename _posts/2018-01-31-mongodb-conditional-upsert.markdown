---
layout: post
title:  "MongoDB - Conditional Upsert"
date:   2018-01-31 19:19:14 +0800
categories: [Databases]
---
## Problem
I've unswered this question on LinkedIn and [Stackoverflow](https://stackoverflow.com/questions/21649146/conditional-upsert-in-mongodb/21649147#21649147) and I thought it's an interesting pattern to share. Here is the problem statement:

> Suppose we have documents like `{_id: ..., data: ..., timestamp: ...}`.
Is there any way to write an update criteria which will satisfy following rules:  
1) If there are no documents with the same `_id` then insert a document  
2) If there exists a document with the same `_id` then:  
2.1) If new timestamp greater then stored timestamp, then update data  
2.2) Otherwise do nothing

In other words, we want to maintain only the latest version of data without any duplicates. If we receive updates out of order we should ignore those. Obviously, we want to do it atomically with a single DB request.

## Solution
The solution relies on the fact that MongoDB by default creates a unique index for `_id` (you can use other fields with unique indexes too). We will use an `update` command [(doc)](https://docs.mongodb.com/manual/reference/method/db.collection.update) with `upsert` option. If `upsert: true`, then mongo will create a *new document* with provided fields **only** if no document matched the query. Otherwise, if there was a match the document will be *updated*.

Here is what's happening in the code below:

* The first upsert will always succeed as there are no documents matching the query and there is no such `_id` in the DB. A new document will be **inserted**.
* Second identical upsert will **fail**. Here is why. The query didn't match anything because the same date can't be less than itself: `$lt : lastUpdateTime`. Since there was no match, mongo tries to insert the document and fails with unique key violation error. That's what we want.
* Next we try to upsert with the date (`tooOldToUpdate`) older than in DB (`lastUpdateTime`). Again the query finds 0 documents and **fails** with the same reason as previous one.
* Now we try with a date (`newUpdateTime`) that is newer than one in DB (`lastUpdateTime`). This time query finds the one and only match and **update** is performed.
* We finally verify that update worked as intended with a query. Yay! Profit!

{% highlight javascript %}
> var lastUpdateTime = ISODate("2013-09-10")
> var newUpdateTime = ISODate("2013-09-12")
>
> lastUpdateTime
ISODate("2013-09-10T00:00:00Z")
> newUpdateTime
ISODate("2013-09-12T00:00:00Z")
>
> var id = new ObjectId()
> id
ObjectId("52310502f3bf4823f81e7fc9")
>
> // collection is empty, first update will do insert:
> db.testcol.update(
... {"_id" : id, "ts" : { $lt : lastUpdateTime } },
... { $set: { ts: lastUpdateTime, data: 123 } },
... { upsert: true, multi: false }
... );
>
> db.testcol.find()
{ "_id" : ObjectId("52310502f3bf4823f81e7fc9"), "data" : 123, "ts" : ISODate("2013-09-10T00:00:00Z") }
>
> // try one more time to check that nothing happens (due to error):
> db.testcol.update(
... {"_id" : id, "ts" : { $lt : lastUpdateTime } },
... { $set: { ts: lastUpdateTime, data: 123 } },
... { upsert: true, multi: false }
... );
E11000 duplicate key error index: test.testcol.$_id_ dup key: { : ObjectId('52310502f3bf4823f81e7fc9') }
>
> var tooOldToUpdate = ISODate("2013-09-09")
>
> // update does not happen because query condition does not match
> // and mongo tries to insert with the same id (and fails with dup again):
> db.testcol.update(
... {"_id" : id, "ts" : { $lt : tooOldToUpdate } },
... { $set: { ts: tooOldToUpdate, data: 999 } },
... { upsert: true, multi: false }
... );
E11000 duplicate key error index: test.testcol.$_id_ dup key: { : ObjectId('52310502f3bf4823f81e7fc9') }
>
> // now query cond actually matches, so update rather than insert happens which works
> // as expected:
> db.testcol.update(
... {"_id" : id, "ts" : { $lt : newUpdateTime } },
... { $set: { ts: newUpdateTime, data: 999 } },
... { upsert: true, multi: false }
... );
>
> // check that everything worked:
> db.testcol.find()
{ "_id" : ObjectId("52310502f3bf4823f81e7fc9"), "data" : 999, "ts" : ISODate("2013-09-12T00:00:00Z") }
>
{% endhighlight %}

One inconvenience is that we get those pesky errors. However, they are cheap and safe so we can simply ignore them.

## Disclaimer
MongoDB has evolved a lot since I've started using it somewhere in 2011. They keep adding new operators and features to help developers with complex queries. Some of the patterns need to be revisited once in a while to check if there are better ways to do things. If you find an improvement that really works let me know.

