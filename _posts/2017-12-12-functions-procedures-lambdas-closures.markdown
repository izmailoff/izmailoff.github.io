---
layout: mypost
title:  "Functions, Procedures, Lambdas and Closures"
date:   2017-12-12 15:15:14 +0800
categories: [Programming Languages, Functional Programming]
---
This is the first part of a series of articles on functions.

## Definitions

A function is one the most basic units of abstraction in a computer program. It's a

>"sequence of program instructions that perform a specific task, packaged as a unit"
[Wikipedia](https://en.wikipedia.org/wiki/Subroutine). 

Wikipedia lists these synonyms for the term function: subroutine, procedure, routine, method, subprogram or a callable unit.

You'll find varying terminology in different programming languages and software products. Here is how I like to call things based on my procedural, OOP and FP background, and context I'm working in:

* **Function** - a code unit that exists in a global scope or a namespace and does not belong to any object. Pure functions that take input and produce output without any side effects can be also simply called functions.
* **Procedure** - a code unit that produces side effects and may or may not return a value.
* **Method** - a code unit that is a part of an object. Functions that are part of a class (static functions as in Java) but not of an object instance are not methods in OOP sense. They could be functions or procedures.

You usually can override a method in a subclass to redefine it's behavior, but not a standalone function, unless language specific tricks are used like shadowing or monkey patching.

In either case everything can be called a 'function' for simplicity, 'procedure' can be used to highlight side effect nature in FP context, and 'method' to refer to OOP function belonging to an object.

### Takeaway
The main point is that this terminology is confusing and in some contexts may provide additional hints, but essentially all these terms are interchangeable. 

Let's define a function that we can work with later on:

**Python:**

{% highlight python %}
def doublex(x):
  return x * 2
{% endhighlight %}

**Scala:**

{% highlight scala %}
def doublex(x: Int): Int = x * 2
{% endhighlight %}

Now we are off to lambdas.

## Lambdas - λ

> "Lambda is the eleventh letter of the Greek alphabet that is λ, and capital form Λ." (Wikipedia).

Let's try again. **Lambda is just an anonymous function**. That means it's a function for which we didn't bother to give a name because it doesn't deserve one.
Usually lambdas are fairly short functions that can be written inline and don't require regular function declaration.

Take a look at this example where lambda takes a value and doubles it:

**Python:**

{% highlight python %}
lambda x: x * 2
{% endhighlight %}

**Scala:**

{% highlight scala %}
(x: Int) => x * 2

// simplified:
x => x * 2

// even more simplified:
// here underscore means the parameter that you are passing it, like 'x' above
_ * 2
{% endhighlight %}

Imagine a situation where you need to pass or return behavior (function) from/to a function.
Let's reuse our `doublex` function to take a list of ints and double them:

**Python:**

{% highlight python %}
[doublex(i) for i in [1, 2, 3]]

# gives:
[2, 4, 6]
{% endhighlight %}

**Scala:**

{% highlight scala %}
List(1, 2, 3).map(doublex)

// alternatively:
for { i <- List(1, 2, 3) } yield doublex(i)

// gives:
List(2, 4, 6)
{% endhighlight %}

Ok great, but what does it have to do with lambdas?
You might have noticed that `doublex` function is so simple that we don't really want to bother declaring it.
Let's try to achieve the same with lambdas that we've already written above:

**Python:**

{% highlight python %}
list(map(lambda x: x * 2, [1, 2, 3]))

# same as:
list(map(doublex, [1, 2, 3]))

# gives:
[2, 4, 6]
{% endhighlight %}

**Scala:**

{% highlight scala %}
List(1, 2, 3).map(x => x * 2)

// same as:
List(1, 2, 3).map(_ * 2)

// gives:
List(2, 4, 6)
{% endhighlight %}

That's it for lambdas for now. You usually use lambdas with HOF 
([Higher-Order Functions](https://en.wikipedia.org/wiki/Higher-order_function)) - functions that take other 
functions as parameters (like our `map`), or return functions as their results.

Some languages like Python restrict lambdas to fit on a single line due to syntax constraints, while others, like Scala,
allow you to use code blocks `{ ... }` to write longer definitions. In general you should try to avoid defining long and
complex lambdas, and here is why. If you assign a lambda to some variable then it might be possible to unit test it separately and to reuse it.
Otherwise lambdas are not unit testable nor reusable by default, which is OK since they are usually small. Large lambdas
make code less readable, so consider refactoring them into functions when they grow too big.

## Closures

Now that lambdas don't look greek to you we are ready to look at closure which is a very simple
idea. **Closure is a function that captures outside context / environment / variables and uses it locally**.
That sounds a bit cryptic you might say. Essentially, closure references a variable defined in outside scope, locally in its inner scope (body).
This variable value is usually copied and stored together by the program with the "enclosing" function aka closure. Take a look at code examples
and read this part again afterwards.

**Python:**

Example from [Wikipedia](https://en.wikipedia.org/wiki/Closure_(computer_programming))

{% highlight python %}
def f(x): # just a normal function
    def g(y):
        # here we close over x from outside,
        # thus creating a closure when x is passed in
        return x + y
    # we return a function, not a value, thus 'f' is a HOF (see above)
    return g

def h(x):
    return lambda y: x + y
{% endhighlight %}

Both `f` and `h` contain nested functions which will become closures once `x` is bound to some value and these
nested functions capture that value.

{% highlight python %}
# The right side produces a closure that captured value of x = 1.
# This closure is assigned to 'a'.
# Effectively now 'a' is just a function that expects one argument 'y'
a = f(1)

# 'b' is functionally equivalent to 'a', it's just a function / closure.
b = h(1)

# Now we can call 'a' or 'b' like this:
a(2)
# results in:
3

# We can also directly call those functions.
# Execution steps will be exactly the same as before without using
# temporary assignment variables like 'a' and 'b'.
f(1)(2)
h(1)(2)
# in both cases result is:
3
{% endhighlight %}

Let's see the same example in Scala for completeness:

{% highlight scala %}
def f(x: Int) = x + (_: Int)
// type: f: (x: Int)Int => Int

// Let's close over x argument value 1,
// now we are waiting for the next unnamed argument - '_' (underscore)
f(1)
// type: Int => Int

// Call it directly:
// Steps under the hood (same as in Python),
// pipeline: Int => (Int => Int) => Int, or x => closure => result:
//   1) take 1 as argument, type: Int
//   2) create a closure that binds 1 and still expects '_' argument
//   3) return this closure, type: Int => Int
//   4) take 2, pass it to closure as '_' argument, "temp" type () => Int
//   5) evaluate the body of the closure and return 3 as result, type: Int
f(1)(2)
// results in:
3
{% endhighlight %}

One thing to note that if your function references a global variable it doesn't make it a closure.
Closures capture context from outside each time they are created, while referencing global variables requires no
special mechanisms as environment is always the same.

## Conclusion

Closures and lambdas are essential building blocks of many modern languages and especially shine in FP languages
like Scala, Haskell. They help to create many useful abstractions, but this is a topic for another article.

Next time let's talk about types of functions or methods, or subroutines, or whatever you prefer to call them, and their arguments.

