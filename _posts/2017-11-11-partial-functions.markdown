---
layout: mypost
title:  "Partial Functions"
date:   2017-11-11 19:19:14 +0800
categories: [Programming Languages]
---
Let's talk about partial functions (PF). Don't confuse partial functions with partially applied functions which are described in [this article]({{ site.baseurl }}{% post_url 2017-12-20-currying-and-partial-application %}).

## Definition
>"In mathematics, a **partial function** from `X` to `Y` is a function f: `X' -> Y`, for some subset `X'` of `X`. It generalizes the concept of a function `f`: `X -> Y` by not forcing `f` to map *every* element of `X` to an element of `Y` (only some subset `X'` of `X`). If `X' = X`, then f is called a **total function** and is equivalent to a function."
[Wikipedia](https://en.wikipedia.org/wiki/Partial_function)

A Partial Function is defined only for some of its input values. If you try to use a partial function on values outside of its domain you'll get an error. Because of this possibility of errors, partial functions are less convenient to use and produce less robust code. Sometimes, however, they are really useful for pattern matching, for formally describing their restricted input (Scala's `PartialFunction
`), or for just cutting corners if you really have to.

A very true excerpt from [Haskell Wiki](https://wiki.haskell.org/Partial_functions):
>You should strive to avoid partial functions and instead write total ones. This makes it much easier to reason about your code and makes "if your code compiles, it probably works" true for your code more often. ... You almost never have an excuse for writing a partial function!

## Examples
Any language can express a concept of a partial function as long as you adhere to a certain contract. Scala defines a partial function as a trait (interface) with two methods: `isDefined` for checking if an input value is within its valid domain, and `apply` for applying a function to its arguments. Many other languages just throw exceptions for invalid arguments. 

Before we dive into Scala's `PartialFunction` let's look at more regular functions that fail on some of their input. We can call those functions partial.

Let's define our partial function that accepts only `Int`s from 1 to 9.

**Python**:
{% highlight python %}
def f(x):
  if x > 0 and x < 10:
    return str(x)
  else:
    raise ValueError("Only [1, 9] ints are allowed")

# or alternatively:
def f(x):
  assert x > 0 and x < 10
  return str(x)
{% endhighlight %}

We can do a similar thing in **Scala**:
{% highlight scala %}
def f(x: Int) = {
  require(x > 0 && x < 10)
  x.toString
}
{% endhighlight %}

This probably reminds you of your daily programming practice with less strict languages. You run your code, you see it fail, then you either fix the code or improve an error message and move on.

Now let's look at more compelling example from Scala's [docs](http://www.scala-lang.org/api/2.12.1/scala/PartialFunction.html) where instead of doing this sort of defensive programming we use PFs to our advantage:

{% highlight scala %}
val sample = 1 to 10
val isEven: PartialFunction[Int, String] = {
  case x if x % 2 == 0 => x+" is even"
}

// the method collect can use isDefinedAt to select which members to collect
val evenNumbers = sample collect isEven

val isOdd: PartialFunction[Int, String] = {
  case x if x % 2 == 1 => x+" is odd"
}

// the method orElse allows chaining another partial function to handle
// input outside the declared domain
val numbers = sample map (isEven orElse isOdd)
{% endhighlight %}

Here is a bit more on PFs with regards to their definitions and how you could use them.

{% highlight scala %}
// We start with a full blown version first:
val f = new PartialFunction[Int, String] { 
  def isDefinedAt(x: Int): Boolean = x > 0 && x < 10

  def apply(x: Int): String = x.toString
}
scala>
f: PartialFunction[Int,String] = <function1>

// A shorter, almost equivalent version can be defined this way instead:
val f: PartialFunction[Int, String] = { case x if x > 0 && x < 10 => x.toString }
scala> 
f: PartialFunction[Int,String] = <function1>

// Let's try it out:
scala> f(1)
res3: String = 1

scala> f(0)
scala.MatchError: 0 (of class java.lang.Integer)
	at scala.PartialFunction$$anon$1.apply(PartialFunction.scala:248)

scala> f.isDefinedAt(0)
res4: Boolean = false

scala> f.isDefinedAt(1)
res5: Boolean = true
{% endhighlight %}

As you can see it works only on values within its domain.

## Conclusion
You should *avoid using PFs* as much as possible. However, sometimes they are very convenient or unavoidably *practical* (like arithmetic division with a possibility of 0 in denominator). PFs are a handy tool when it's not easy to express restrictions on a function input. Some languages have special support for making it easy to work with PFs like Scala's `collect`. Contrast it with `map` which does not check if a function can be applied to a value which might result in an error. However, you could use `filter` before `map` to have `collect`'s behavior.


