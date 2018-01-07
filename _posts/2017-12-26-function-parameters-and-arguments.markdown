---
layout: post
title:  "Function Parameters and Arguments"
date:   2017-12-12 15:15:14 +0800
categories: parameters, arguments
---
Function parameters can be quite diverse. Programming languages use certain types of function parameters that go hand in hand with the language paradigm. I think just by looking at available parameter types in a language one can learn a lot about its flavor.

In this article I aim to cover the obvious and not-so-obvious aspects of parameters and arguments in different languages.

## Definitions

Let's start with trivial definitions to keep things clear.

>In computer programming, a **parameter** is a special kind of variable, used in a subroutine to refer to one of the pieces of data provided as input to the subroutine. These pieces of data are called **arguments**.
[Wikipedia](https://en.wikipedia.org/wiki/Parameter_(computer_programming)).

Clear and simple: parameters are variable declarations, arguments are actual values. Yet many practitioners use these terms interchangeably depending upon context so beware.

## Call by Value/Reference

Most common ways of passing parameters are:

* **By value** - a copy of an argument is made and passed to the function. Any changes to that argument, even if allowed, are *not visible to the caller*.
* **By reference** - a reference, similar to a pointer to a value, is passed to a function. A function can then change that reference to point to another value, and this effect will be *visible to the caller*.

This sounds quite simple on the surface, but the lines get blurry when you look at implementation in different languages.

For example, in Java there are no C++ style references and everything is passed by value. However, if you are trying to pass an object to a function in Java, a copy of a "reference" to that object is created and passed. This doesn't allow the function to change the original reference, but if the object is mutable, it can be changed within a function. Using this mechanism you can simulate 'by reference' call if you wrap a reference you wish to change in an object and use it in that object scope (setter/getter).

In pure FP languages, on the other hand, there is only call by value, or at least there is no distinction between value and reference since they are immutable. Due to efficiency considerations a call by value can be implemented as call by reference in such cases.

Wikipedia's [Evaluation Strategy](https://en.wikipedia.org/wiki/Evaluation_strategy) lists a few more options apart from call-by-reference and call-by-value, but they are similar in a sense to these major two options. Special language constructs might help you with copying modified objects back as in 'call by copy-restore' but can be simulated with either of our 2 main strategies.

## In/Out Arguments
There are three kinds/modes of parameters in terms of effects they have on caller:

* **In** - most common type of parameter where, from caller's point of view, they are never changed. Used only for providing values for a function.
* **Out** - used to provide value back to the caller from a function. Mostly used in languages where returning multiple values is not easy or idiomatic. In such cases, for example, a status of function call and it's result can be returned at the same time.
* **In/Out** - a mix of both in and out. A value can be passed and then returned back.

Example of **out** parameter in **C#**:
{% highlight c# %}
public static bool TryParse(string s, out int result)
int result;
if (Int32.TryParse(s, result)) {
    // It worked, yay!
}
{% endhighlight %}
I've seen lot's of code where `TryParse` is called directly without result status code being checked. Afterall, this API doesn't enforce programmers to do that. This is similar to how checked exceptions are treated in Java where many lazy programmers decide to just silently swallow the exception. A better idea for both cases would be to use something similar to `Try[T]`, `Option[T]` in Scala which forces you to deal with possible failure in order to be able to use the value, and allows you to compose this with the rest of the code.

## Parameter Lists
A parameter list is a list of 0-n parameters that you declare for your function: `def f(x, y, z)`. Here `(x, y, z)` is a parameter list.

There are 2 extremes with regard to parameter lists. Haskell has a single parameter list with a single argument, since all functions are curried by default. Most of the mainstream languages support only single parameter list. Scala allows for traditional single parameter list, but also supports multiple parameter lists: `def f(x: T, y: T)(z: T)`. This is one of the ways to declare curried functions in Scala.

Multiple parameter lists can be useful in Scala, but also introduce additional complexity to the language and it's users, especially when combined with default parameters, implicits, etc. Thus, care needs to be taken to keep your code clear and easy to understand. Python, for example, does not allow one to define functions with multiple parameter lists, but with help of currying it's easy to get the same effect. See [this post]({{ site.baseurl }}{% post_url 2017-12-20-currying-and-partial-application %}) of an example of transformation from `def f(x, y, z)` and `f(1, "2", True)` to `curry(f)(1)("2")(True)`.

## Varargs
Variable argument list or varargs for short, aka [variadic function](https://en.wikipedia.org/wiki/Variadic_function) allows one to seamlessly pass any number of arguments to a function without resorting to wrapping arguments in containers like lists or arrays. Most of the modern languages support this kind of mechanism. Haskell doesn't have special syntax for varargs, but there is a way to implement such functionality with [accumulator idiom](https://wiki.haskell.org/Varargs).

Let's take a look at a few examples:

In **C** varargs are used via `stdarg.h` header ([link](https://en.wikipedia.org/wiki/Stdarg.h)). Implementation essentially relies on a pointer to the first argument and size of that argument to step through the arguments with `va_start`, `va_arg`, `va_end`, etc. However, due to complications caused by [calling conventions](https://en.wikipedia.org/wiki/X86_calling_conventions) on different platforms this is implemented by compiler directly rather than a C library.

**C** example (from Wikipedia with minor changes):

{% highlight c %}
#include <stdio.h>
#include <stdarg.h>

/* print all args one at a time until a negative argument is seen;
   all args are assumed to be of int type.
   First argument - arg1 is required. */
void print_args(int arg1, ...)
{
  va_list ap;
  int i;

  va_start(ap, arg1); 
  for (i = arg1; i >= 0; i = va_arg(ap, int))
    printf("%d ", i);
  va_end(ap);
  putchar('\n');
}
{% endhighlight %}

Looks rather painful. Let's see a few more examples:

**Python**
{% highlight python %}
def print_args(*args):
   # args is a tuple, you can iterate over it, etc:
   for x in args:
     print(x)
{% endhighlight %}
See argument packing and unpacking for more details.

**Scala**
{% highlight python %}
def printArgs[T](args: T*) = args.foreach(println)
{% endhighlight %}

**Java**
{% highlight java %}
public static String format(String pattern, Object... arguments);
{% endhighlight %}

Caution! Overloading varargs methods might make your code very confusing.

## Parameter Data Types
In dynamically typed languages like Python you don't specify parameter types at function declaration, while in statically typed languages you are forced to do that to high degree. You can still provide [type annotations/type hints](https://docs.python.org/3/library/typing.html) in Python to help developers understand your API and to use type checkers to check correct usage when invoked.

Strongly typed languages provide many more capabilities with regards to type checks, type safety, and even type-level programming. Richness of type system varies a lot from languages with basic types like C to languages where there is a lot of focus put into correctness and safety like [Idris](https://www.idris-lang.org/) or even theorem provers like [Coq](https://coq.inria.fr/).

Another important aspect of parameter typing is [generics](https://en.wikipedia.org/wiki/Generic_programming). Generic programming can be implemented very differently in various languages. Compare C++ templates, Java generics, Scala generics, Haskell multiple! [approaches to generics](https://wiki.haskell.org/Generics) for instance. Since this is such a large topic we'll leave it at that.

I personally really like that in Haskell, by default, you are working with generic types most of the time. You start adding constraints to parameter types if you need to use certain type features, for example, you declare your parameter as `Integer` so that you could add something to it. In other languages where parametric polymorphism is overly complicated, you usually fix parameter types to implement what's needed and then see how to generalize it, which is another way around.

A parameter type can also be expressed via a [structural type](https://twitter.github.io/scala_school/advanced-types.html#structural). [Duck typing](https://en.wikipedia.org/wiki/Duck_typing) is similar, but dynamic, while structural typing is for static type systems. Let's see an example in Scala:

{% highlight scala %}
def foo(x: { def get: Int }) = 123 + x.get
{% endhighlight %}

This signature says that there is a parameter `x` which has a method `get`, which returns an `Int`. We don't care about where in a class hierarchy `x` is, as long as we can call this method.

When it comes to subtyping [variance](https://en.wikipedia.org/wiki/Covariance_and_contravariance_(computer_science)) is a very important concept, and in many languages you can annotate your parameters to let compiler know your choice of relation between simple types: **covariant, contravariant, invariant, bivariant**. Again, this is a big topic, so I'll just leave you with an example of [Scala's syntax](https://docs.scala-lang.org/tour/variances.html):

{% highlight scala %}
class Foo[+A] // A covariant class
class Bar[-A] // A contravariant class
class Baz[A]  // An invariant class
{% endhighlight %}

Note that variance is defined at class level here, but class methods will use parameter types that behave according to that definition.


## Default Arguments
[Default parameters](https://en.wikipedia.org/wiki/Default_argument) are quite common these days in many languages. Whenever they are not available they can be implemented via overloading. A function with less arguments will call overloaded function with additional arguments passing default values in.

An interesting gotcha in Python vs Scala is that default arguments in Python are evaluated once when the function is defined, not every time when it's called. More on this gotcha can be found [here](http://docs.python-guide.org/en/latest/writing/gotchas/).

Don't use default parameters solely for documenting parameter types in dynamically typed languages like Python. Developers will consider default parameters safe to ommit and might not provide arguments when they really matter. Use type hints or docstrings instead.

## Implicit Arguments
Sometimes arguments can be looked up automatically by the compiler. Scala has multiple uses for implicits, one of which is [implicit parameters](https://docs.scala-lang.org/tour/implicit-parameters.html). Whenever an implicit value can be located unambiguously (in the scope) which has the same type as the function's implicit parameter, compiler can pass that value atomatically for you. Hence, it's called an implicit argument as it's not provided explicitly. It can be very convenient, if used sparingly, to provide implicit parameters to functions. Usually, implicit parameters are used to avoid clutter, provide cleaner DSLs, default implementations, and values, which also can be overriden according to implicit resolution priority.

A quick example in **Scala**:

{% highlight scala %}
scala> def f(implicit i: Int) = println(i)
f: (implicit i: Int)Unit

scala> f
<console>:13: error: could not find implicit value for parameter i: Int
       f
       ^

scala> f(1) // we can always provide value explicitly
1

scala> implicit val j = 2 // define implicit value
j: Int = 2

scala> f // now we don't need to provide value explicitly anymore
2
{% endhighlight %}

One of the use cases is Scala's `Future` (see this [doc](https://docs.scala-lang.org/overviews/core/futures.html)). It's `apply` signature is:
{% highlight scala %}
def apply[T](body: ⇒ T)(implicit executor: ExecutionContext): Future[T]
{% endhighlight %}
Since Future implicitly takes an execution context, and executes it's `body` function on it, you would have to provide `executor` each time you call `apply` for all your futures, which is verbose. You can simplify your code from: `Future { ... } (executionContext)` to `Future { ... }`. Usually you would want to define your execution context once for all futures by default within your application, but not within your library. That's why implicit arguments are similar, but more flexible than default arguments, which can't be changed dynamically.

## Overloading and Overriding
Let's mention [function/method]({{ site.baseurl }}{% post_url 2017-12-12-functions-procedures-lambdas-closures %}) overloading and method overriding for completeness. They both depend on the number of parameters and their data types. While overloading requires two functions to have different signatures in parameter arity or types, overriding on the other hand requires all parameters to be the same. We can take a note of how parameters of an overriden method are related to one of the crucial features of OOP programming - inheritance.

## Parameter Coercion
Coercion or [type conversion](https://en.wikipedia.org/wiki/Type_conversion) is not restricted only to parameters. A function which parameters can be coerced implicitly or explicitly is considered to be polymorphic. More on various kinds of polymorphism [here](https://en.wikipedia.org/wiki/Polymorphism_(computer_science)).

## Self and This
*Self* and *this* are examples of special arguments available to a function. In Java you never declare `this` as a parameter, but it's available implicitly referencing to the current object instance. In Python `self`, named so by convention, must be declared as a first parameter of an object method. Python provides *self* automatically when method is called via object instance `foo`, but *self* can be provided explicitly when calling same method via class `C`:

{% highlight python %}
foo.meth(arg) == C.meth(foo, arg)
{% endhighlight %}

More on *self* and why it has to stay in Python rather than being a keyword as in Java [here](http://neopythonic.blogspot.sg/2008/10/why-explicit-self-has-to-stay.html).

As you can see by now `self` and `this` are quite similar parameters in a sense.

## Best Practices
I've included some advice on best practices in the sections above already. This section covers other concerns.

You might have guessed by now that the more high level and functionally pure language is, the less mutability it allows. Thus, use of pointers, mutable references, out parameters and similar mutable techniques would be restricted or eliminated.

Output parameters are frowned upon in today's practice. Apart from requiring extra ceremony to use, they make function composition harder and code less linear.

One interesting outlier in terms of usual combination of mutability and safety is [Rust](https://www.rust-lang.org). Although, Rust allows mutability and references, it uses a concept of ownership and [borrowing](https://doc.rust-lang.org/book/second-edition/ch04-02-references-and-borrowing.html) to guarantee memory safe programming and avoidance of null and dangling pointers. Rust's references allow you to pass values efficiently, but compiler checks that those can't be modified by function, or it's a mutable reference which doesn't cause data races. Thus, Rust makes references always valid and safer to work with.

## Conclusion
Hopefully now you've got that feeling of being the one with the universe. Errr, I mean you probably see how function's parameters are intertwined with the rest of the language.

As developers starting with a new language paradigm be it OOP, FP, or something else we usually try to learn about its fundamental properties. We often neglect the role of parameters in language design.

I hope you took a look back at what you know from a different angle when reading this post. Afterall, the main building blocks of any language are functions, and functions are nothing more than parameters plus code that operates on them. The feel for language comes from a look at how arguments come to life in caller context, how they are being passed to a function, what a function can do with them, and what comes back as a result, which in turn could become another parameter passed down the chain. Let me know if that resonated with you at all.


