---
layout: post
title:  "Currying and Partial Application"
date:   2017-12-20 15:15:14 +0800
categories: [Programming Languages, Functional Programming]
---
Let's talk about currying and partial application - two related but distinct topics. It might help to get familiar with [lambdas and closures]({{ site.baseurl }}{% post_url 2017-12-12-functions-procedures-lambdas-closures %}) first before diving into this topic.

## Definitions
Let's define a function we'll work with. It takes 3 parameters: `Int, String, Boolean` and returns a `String` result. It's type signature: `(Int, String, Boolean) => String`.

### Function Application
Let's first clarify function application definition:

>"In mathematics, function application is the act of applying a function to an argument from its domain so as to obtain the corresponding value from its range."
[Wikipedia](https://en.wikipedia.org/wiki/Function_application)

In programming terms function application is a regular function call or evaluation of a function given its arguments. In FP we like to view functions and their arguments as two separate pieces of data which can be combined together.

Call pipeline would look like this:

{% highlight scala %}
// given a function:
(Int, String, Boolean) => String
// provide all 3 args, get back:
String
{% endhighlight %}

### Partial Function Application

Partial application is somewhat special: you provide only some arguments and get back un-evaluated function, not the final result/value. 

>"Partial application (or partial function application) refers to the process of fixing a number of arguments to a function, producing another function of smaller arity."
[Wikipedia](https://en.wikipedia.org/wiki/Partial_application).

In layman terms we just pass one or more arguments to a function (fixing/binding passed arguments) without evaluating the function. What we get as a result is that same function which requires less arguments. We have to pass number of arguments that is less than the total number of arguments (partial application), otherwise the function would get evaluated (regular function call).

Call pipeline might look like this:

{% highlight scala %}
// given a function:
(Int, String, Boolean) => String
// provide 1 Int arg, get back:
(String, Boolean) => String
// provide String arg, get:
Boolean => String
// provide last Boolean arg, get final result:
String
{% endhighlight %}

This pipeline illustrates passing single argument at a time, but more than one argument can be passed if needed.

### Currying

>"In mathematics and computer science, currying is the technique of translating the evaluation of a function that takes multiple arguments (or a tuple of arguments) into evaluating a sequence of functions, each with a single argument."
[Wikipedia](https://en.wikipedia.org/wiki/Currying)

In other words we take a regular function and "curry it" to get a function that takes only one argument and returns another function that also takes only one argument, which in turn returns another function ... until the last function that takes last argument and returns the final result.

Call pipeline would look like this:

{% highlight scala %}
// given a function:
(Int, String, Boolean) => String
// transform it to curried function:
Int => (String => (Boolean => String))
// provide 1 Int arg, get back:
String => (Boolean => String)
// provide String arg, get:
Boolean => String
// provide "last" Boolean arg, get final result:
String
{% endhighlight %}

### Partial Function
It's easy to confuse partially applied function with a partial function. Those are completely different concepts altogether. Check [this article]({{ site.baseurl }}{% post_url 2017-11-11-partial-functions %}) for more details.

## Examples

It's much easier to understand things by looking at examples as usual. This is our regular function mentioned above: `(Int, String, Boolean) => String`.

{% highlight scala %}
scala> def f(x: Int, y: String, z: Boolean): String = x + y + z
f: (x: Int, y: String, z: Boolean)String

scala> // Now let's test it by calling it in a regular way:

scala> f(1, "2", true)
res0: String = 12true
{% endhighlight %}

### Currying
In Scala you can create a curried function, i.e. perform currying by calling `curried`. In some languages like Haskell all functions are curried to start with. I like Haskell's approach because there is only one way to deal with function arguments and it fits both needs: fixing some arguments or evaluating a function. 

{% highlight scala %}
// Let's define a new variant of this function that is a curried function:
scala> val f_curried = f _ curried
f_curried: Int => (String => (Boolean => String)) =
  scala.Function3$$Lambda$1074/2097217770@357bc488
// Notice how the signature has changed from
// (Int, String, Boolean) => String
// to
// Int => (String => (Boolean => String))
// Instead of single parameter list with multiple arguments
// we've got 3 parameter lists each with a single argument!

// Let's test it by calling it with all arguments:
scala> f_curried(1)("2")(true)
res1: String = 12true
// Same result as before currying but we had to use 3! parameter lists.
// That's because after each param list we would get a function until
// the last application of boolean param that evaluates the function
// and returns final result.

// Let's see what we get if we provide arguments one by one:
scala> f_curried(1)
res2: String => (Boolean => String) =
  scala.Function3$$Lambda$1183/1598068850@29f3185c
// A function from String parameter to Boolean => String result,
// where later is a function itself

scala> f_curried(1)("2")
res3: Boolean => String = scala.Function3$$Lambda$1184/1417325106@3fe98084
// A function from Boolean parameter to String result,
// where later is a final result

scala> f_curried(1)("2")(true)
res4: String = 12true
// Finally we get the result by passing arguments,
// getting back shorter curried functions until
// those run out of params and get evaluated.

{% endhighlight %}

### Uncurrying
The opposite operation to currying is uncurrying.That is if we take a curried function and convert it back to a regular function with a single parameter list.

Let's make a curried function and convert it back to normal:

{% highlight scala %}
// Let's remind ourselves of the signature:
scala> f _
res3: (Int, String, Boolean) => String = <function3>

// Curried function:
scala> val curried_f = f _ curried
curried_f: Int => (String => (Boolean => String)) = <function1>

// Back to normal:
scala> val uncurried_f = Function.uncurried(curried_f)
uncurried_f: (Int, String, Boolean) => String = <function3>
{% endhighlight %}

As usual type signatures tell the story so we don't need to test how it works.


### Partial Application
{% highlight scala %}
// This underscore usage:
scala> f _
res5: (Int, String, Boolean) => String = $$Lambda$1185/871550850@bea283b
// is equivalent to this:
scala> f(_, _, _)
res7: (Int, String, Boolean) => String = $$Lambda$1196/569670093@102fd71d
// This just serves as an example that if we use underscores 
// (variable placeholders), and don't provide any parameters to a function
// it's still the same function - no partial application happened.
// (Technically speaking in Scala this is just a way to convert 
// from a method to a function).

// Now let's provide only 1 argument, and leave other two out:
scala> f(1, _: String, _: Boolean)
res12: (String, Boolean) => String = $$Lambda$1208/1386938427@1174e173
// We get a function with reduced number of parameters

// Let's provide one more arg, still one to go:
scala> f(1, "2", _: Boolean)
res13: Boolean => String = $$Lambda$1209/1369080285@5608e254
// Again it's a function, not a final String value yet.

// Finally let's provide all arguments as a reminder of what
// we were trying to achieve:
scala> f(1, "2", true)
res10: String = 12true
{% endhighlight %}

## Conclusion
Currying and partial application are quite useful techniques for achieving FP style abstractions. They are related but still different things. Both allow you to fill in function arguments progressively to eventually pass all arguments and evaluate a function.

## Appendix - Python Example
Python doesn't natively support partial function application, but has required ingredients to implement such support. Python's [functools](https://docs.python.org/2/library/functools.html#functools.partial) library provides `functools.partial(func[,*args][, **keywords])` function to perform partial function application. Let's go through a similar example as above:

Our regular function we'll mess with:

{% highlight python %}
def f(x, y, z):
  return str(x) + str(y) + str(z)
 
>>> f(1, "2", True)
'12True'
{% endhighlight %}

### Partial Application

{% highlight python %}
>>> from functools import partial

>>> partial(f, 1)
functools.partial(<function f at 0x10d048048>, 1)
 
>>> partial(f, 1, 2)
functools.partial(<function f at 0x10d048048>, 1, 2)
 
>>> partial(f, 1, 2, True)
functools.partial(<function f at 0x10d048048>, 1, 2, True)
 
>>> partial(f, 1, 2, True)()
'12True'
 
# You can't force evaluation with () if you didn't provide all arguments:
>>> partial(f, 1, 2)()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: f() missing 1 required positional argument: 'z' 
{% endhighlight %}

Notice how we provide 1 - n number of arguments and get back partially applied function. Here is a similar example where we provide arguments in multiple `partial` invocations. There is essentially no difference as you can see:

{% highlight python %}
>>> partial(partial(f, 1), 2)
functools.partial(<function f at 0x10d048048>, 1, 2)

>>> partial(partial(f, 1), 2)(True)
'12True'
{% endhighlight %}

Great, but how do we implement partial function application without this library ourselves? Let's ignore some details like `__doc__` and `kwargs`. Let's also not use any Python hacks with regards to how functions and arguments are defined - no monkey patching business. You can check `partial` docs and implementation for more Pythonic and production grade code. Here we try to express ourselves in a straightforward way that would also work in many other languages.

{% highlight python %}
def papply(func, *args):
  return lambda *rem_args: func(*(args + rem_args))
{% endhighlight %}

Let's break it down. Our `papply` function takes 2 arguments: the function we want to use for partial application and its arguments (you can add `kwargs` to it as an excercise). We return a lambda which expects even more arguments. I called them remaining arguments - `rem_args`. This is the basis of partial application: allow a function to capture/bind/fix some arguments and return another function which will be expecting the remaining arguments. Finally, we pass all these arguments together to the function to execute it. Notice an important point here that since we return a lambda our `func` is not going to be executed at that time. It will be applied when you pass `rem_args` to that returned lambda directly (without calling `papply`) even if that number of arguments is 0, i.e. `()`.

Examples:

{% highlight python %}
>>> papply(f, 1)("2", True)
'12True'

>>> papply(f, 1)("2")
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 2, in <lambda>
TypeError: f() missing 1 required positional argument: 'z'

>>> papply(f, 1, "2", True)
<function papply.<locals>.<lambda> at 0x10d66ad90>

>>> papply(f, 1, "2", True)()
'12True'

>>> papply(papply(f, 1), "2")
<function papply.<locals>.<lambda> at 0x10d66aea0>

>>> papply(papply(f, 1), "2")(True)
'12True'

>>> papply(papply(papply(f, 1), "2"), True)
<function papply.<locals>.<lambda> at 0x10d66af28>

>>> papply(papply(papply(f, 1), "2"), True)()
'12True'
{% endhighlight %}

It works as expected.

### Currying
{% highlight python %}
def curry(func):
    def nest_lambdas(func, n):
        if n == 0:
            return func()
        else:
            return lambda y: nest_lambdas(partial(func, y), n - 1)
    arity = func.__code__.co_argcount  # Python 3
    return nest_lambdas(func, arity)

>>> curry(f)(1)("2")(True)
'12True'

>>> curry(f)(1)("2")
<function curry.<locals>.nest_lambdas.<locals>.<lambda> at 0x10474ae18>
{% endhighlight %}

To implement `curry` we need to build a sequence of lambda functions each taking a single argument - this is what `nest_lambdas` does, given `n` number of arguments/nesting levels. For each lambda's argument we use `partial` to pass it to our `func` without evaluating it (fixing/binding an argument). Once we exhaust all arguments we just call the partially applied function which already has all arguments filled in.

These implementations are not meant to be complete, nor ready for production use. They are rather meant for illustrating the mechanisms behind currying and partial application.


