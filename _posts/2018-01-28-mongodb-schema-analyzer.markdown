---
layout: post
title:  "MongoDB Schema Analyzer"
date:   2018-01-28 20:00:00 +0800
categories: [Tools, Databases]
---
## Motivation
If you are using MongoDB for development/production you might find yourself in situation that you need to check your collection schema. Since MongoDB doesn't enforce you to have a rigid schema for all documents in a collection like SQL databases do, you might be wondering if there are documents with diverging schemas. I certainly did when I started development with one schema and ended up with a different one. Sometimes I ran into various errors because my documents didn't have fields I expected or these fields have changed their types (scalar -> array/document, etc).

Another scenario happens in production instead of development. Perhaps you migrated some of your documents to a new schema, or simply updated your code, changing schema structure of new documents. You might want to check if there are any surprises.

[`mongodbschema`](https://github.com/izmailoff/MongoDB-Schema-Analyzer) is a simple tool that just goes through your collection and finds unique JSON ASTs (structures) based on document structure and field types. It ignores actual values except for presense of values within arrays, i.e. it differentiates between empty and non-empty arrays and what types of values they store, but not the count or actual values. An example is worth thousand words, so let's see it in action.

## Example
Let's insert a few documents into a test collection using `mongo` shell to have some sample data:

{% highlight js %}
> db.docs.insert({name: "Alex", age: 123})
> db.docs.insert({name: "Alex", age: 123})
> db.docs.insert({name: "Alex", age: 123})
> db.docs.insert({name: "Bob"})
> db.docs.insert({age: 123, name: "Alex"})
> db.docs.insert({tags: ["one", "two", "three"]})
> db.docs.insert({tags: ["one", "two", "three"]})
> db.docs.insert({tags: ["one", "two"]})
> db.docs.insert({tags: ["one", "two", "something else"]})
> db.docs.insert({tags: [12, 23434, 344]})
> db.docs.insert({tags: [12, 23434, 344]})
> db.docs.insert({tags: [12, "23434", 344]})
> db.docs.insert({tags: [12, "23434", 344]})
> db.docs.insert({tags: [12, 23434, "344"]})
{% endhighlight %}

Now if we run the tool we get the following output:

{% highlight js %}
{
  "_id":{
    "$oid":"String"
  },
  "name":"String"
}
{
  "_id":{
    "$oid":"String"
  },
  "tags":["Double","String"]
}
{
  "_id":{
    "$oid":"String"
  },
  "name":"String",
  "age":"Double"
}
{
  "_id":{
    "$oid":"String"
  },
  "tags":["String"]
}
{
  "_id":{
    "$oid":"String"
  },
  "tags":["Double"]
}
{% endhighlight %}

These are all unique ASTs/document schemas that the tool found.

One more example of running this tool on `fs.chunks` (GridFS) - binary data:

{% highlight js %}
{
  "_id":{
    "$oid":"String"
  },
  "files_id":{
    "$oid":"String"
  },
  "n":"Integer",
  "data":"<Binary Data>"
}
{% endhighlight %}

I might add more features later on and consider improving the code a bit, but it's a simple functional tool that you can use now.

## How to Run
Take a look at the project [README](https://github.com/izmailoff/MongoDB-Schema-Analyzer/blob/master/README.md) which has details on how to build and run the project.
I'm not publishing an artefact to maven central repository yet, so you'll need to simply compile it using SBT to generate a self-contained JAR file.

Once you got the JAR you can run it like this:

    java -jar mongodbschema_2.12-0.0.3-one-jar.jar <collection name>

## Disclaimer
Since this tool will open a DB cursor and eventually fetch all documents from the collection, it might produce a high load on DB - take that into account. If you need to do more specific or advanced schema analysis you might find regular mongo queries or aggregation framework queries more suitable. For instance, if you need to count documents or check only for specific fields, etc a well crafted query will be more appropriate and efficient.

Let me know if you want to see any other features in this tool, I might add them. Pull requests are always welcome too!
