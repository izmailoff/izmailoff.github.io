---
layout: post
title:  "Purelly Functional Sets"
date:   2016-06-06 15:15:14 +0800
categories: functional programming, functional sets
---
## Intro
This is a quick example of functional sets.

You are probably intimately familiar with Java's [sets](https://docs.oracle.com/javase/7/docs/api/java/util/Set.html) `java.util.Set<E>` interface and it's most common implementation `java.util.HashSet<E>`, or with Python's [set](https://docs.python.org/3/tutorial/datastructures.html#sets) `set` / `{1, 2}`, or even Scala's `scala.collection.immutable.Set`. This
example of purelly functional sets might bend your thinking a little if you've never seen it before.
I don't remember whether I've seen it in one of the Scala books or in a great "Functional Programming Course in Scala" by Martin Odersky. Nevertheless it's worth checking out and all credit goes to them.

## Example

Most commonly used sets store their values in one of the efficient data structures like hash map (if you don't care about order), tree map (sorted order), hash map with linked list (order of insertion), bit vectors for enum based sets (compact representation), and so on. The common feature is that all elements of a set are stored in some data structure, and the interface provides methods to iterate and update the set whether it's mutable or immutable (new copy). Today we'll forget about all these nice engineering practices and focus on mathematical part of a set definition.

>"In mathematics, a set is a collection of distinct objects, considered as an object in its own right."
[Wikipedia](https://en.wikipedia.org/wiki/Set_(mathematics))

Without getting too much into a set theory let's agree that we are most interested in element membership operation of a set. That is we want to be able to tell whether some element belongs to a set. We'll also need to build supporting operations for constructing sets from elements and other sets. Here is the implementation in Scala (see Python version in Appendix below):

<script src="https://gist.github.com/izmailoff/fe1f99d4265edbc1096ee42badeabad7.js"></script>

First we define a type `Set`. Mathematically speaking it's just a function `Int => Boolean` that takes `Int` element, and returns `Boolean` result of whether the element is part of a set.

Next we show an example of constructing a set with one element of value 1. Again, this set of 1 is a function as we just discussed. If you pass it values to test membership, you'll get `true` only if you've passed `1`. Simple enough, but already opens up a lot of options.

Next we define an empty set `empty`, which is yet again a function as you've might have expected. It always returns `false` no matter what you pass to it. I hope you are catching the groove by now.

A `union` of sets is when you check whether an element exists in one set or in the other one - that's just an 'OR'ing of two boolean check results. Couldn't be simpler!

Finally, an `intersect` of two sets is the common set of elements which exist in both sets. We can use the same trick as with `union` by checking element membership in each set and 'AND'ing results in this case.

Take a look at examples of using these functions and convince yourself that it works. Here is the same code ran through Scala REPL to show resulting values.

{% highlight scala %}
scala> type Set = Int => Boolean
defined type alias Set


scala> val setOf_1: Set = (i: Int) => (i == 1)
setOf_1: Set = <function1>


scala> val empty: Set = (i: Int) => false
empty: Set = <function1>


scala> val union: (Set, Set) => Set =
     |   (s1: Set, s2: Set) => (i: Int) => s1(i) || s2(i)
union: (Set, Set) => Set = <function2>


scala> val intersect: (Set, Set) => Set =
     |   (s1: Set, s2: Set) => (i: Int) => s1(i) || s2(i)
intersect: (Set, Set) => Set = <function2>


scala> val setOf_5_3_2 = intersect(intersect(_ == 5, _ == 3), _ == 2)
setOf_5_3_2: Set = <function1>


scala> setOf_5_3_2(5)
res0: Boolean = true


scala> setOf_5_3_2(2)
res1: Boolean = true


scala> setOf_5_3_2(1)
res2: Boolean = false


scala> val setOf_5_3_2_1 = intersect(setOf_1, setOf_5_3_2)
setOf_5_3_2_1: Set = <function1>


scala> setOf_5_3_2_1(3)
res3: Boolean = true


scala> setOf_5_3_2_1(1)
res4: Boolean = true
{% endhighlight %}

Notice how we don't store elements of our `Set` in any of traditional datastructures. Instead, we store them inside definitions of our functions. This looks a lot like closures, but is actually just a value within a function. There is no value from outside context being closed over in this case. See [this article]({{ site.baseurl }}{% post_url 2017-12-12-functions-procedures-lambdas-closures %}) for more on closures and lambdas.

However, in case of `union` and `intersect` we are actually using closures that capture `s1` and `s2` values. We've extensively used lambda's lightweight syntax in this example instead of defining functions every time for each new set.

## Conclusion
FP tricks like this one help you start thinking in functional way, and solve problems in more elegant style in real life. For example, if you have some custom implementation of a set, two instances of which contain huge number of elements, you don't have to copy one into another if you want to get a union. You might write a wrapping object that will proxy calls to those sets and do membership test in similar fashion.

This functional implementation of a set is obviously not production grade, since membership test is `O(n)` (worst case), while standard libraries give you `O(1)` for both mutable and immutable sets. However, mathematicians "don't care" about these engineering details and it's been fun to pretend to be one even if only for a moment.

## Appendix - Python Example
Same example in Python:

<script src="https://gist.github.com/izmailoff/57154c3dd6bed6e63b3d7d65264f7f36.js"></script>

REPL output of the code above:

{% highlight python %}
>>> 
>>> set_of_1 = lambda i: i == 1
>>> 
>>> set_of_1(1)
True
>>> 
>>> set_of_1(2)
False
>>> 
>>> empty = lambda i: False
>>> 
>>> empty(1)
False
>>> 
>>> union = lambda s1, s2: lambda i: s1(i) or s2(i)
>>> 
>>> intersect = lambda s1, s2: lambda i: s1(i) and s2(i)
>>> 
>>> set_of_5_3_2 = union(union(lambda x: x == 5, lambda x: x == 3), lambda x: x == 2)
>>> 
>>> set_of_5_3_2(5)
True
>>> 
>>> set_of_5_3_2(2)
True
>>> 
>>> set_of_5_3_2(1)
False
>>> 
>>> set_of_5_3_2_1 = union(set_of_1, set_of_5_3_2)
>>> 
>>> set_of_5_3_2_1(3)
True
>>> 
>>> set_of_5_3_2_1(1)
True
>>> 
>>> intersect(set_of_5_3_2, set_of_5_3_2_1)(1)
False
>>> 
>>> intersect(set_of_5_3_2, set_of_5_3_2_1)(5)
True
>>> 
{% endhighlight %}


