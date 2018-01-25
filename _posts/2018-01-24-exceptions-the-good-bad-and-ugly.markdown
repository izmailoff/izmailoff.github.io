---
layout: post
title:  "Exceptions - the Good, Bad, and Ugly"
date:   2018-01-23 19:19:14 +0800
categories: [Programming Languages]
---
## Long Long Time Ago ...
... There existed languages without exceptions as we know them now. You'd have to be very careful when programming those beasts. If your program would encounter an abnormal situation, such as division by zero or `NULL` pointer dereference, it would most likely crash.

CPU was aware of how to handle errors of that kind by calling an **exception handler initialized by OS**. This would execute one of the interrupt handlers or exception handlers ([fault/trap](https://en.wikipedia.org/wiki/Trap_(computing))) defined for each kind of error. If a language didn't provide any special mechanisms to handle such events the OS would terminate the program, cleanup the resources and maybe perform a core dump.

Our old friend `C` doesn't have exceptions like ones found in `C++` or `Java`. There are a few ways to simulate exceptions in `C`.

Many libraries use external variable `errno` available via `<errno.h>` to communicate which error has occured. You have to check returned value from library function - usually `-1` or `NULL` together with `errno` to understand whether the call resulted in an error, and what cased it. Don't forget to reset `errno` to `0` before the next library call! This looks very tedious and not quite close to exceptions that we know and "love". Feel free to read more on this in [`man`](http://man7.org/linux/man-pages/man3/errno.3.html).

Another alternative in `C` that actually simulates exceptions to some degree is to use [`setjmp`](https://en.wikipedia.org/wiki/Setjmp.h) and `longjmp`:

{% highlight c %}
jmp_buf jumper;

int divide(int a, int b)
{
  if (b == 0) // can't divide by 0
     longjmp(jumper, -3);
  return a / b;
}

void main(void)
{
  if (setjmp(jumper) == 0)
  {
     int result = divide(7, 0);
     // continue using valid result value
  }
  else
     printf("an error occured\n");
}
{% endhighlight %}

This is rather cumbersome, unsafe and doesn't provide same power as exception handlers but gets us a bit closer.

For more on error handling in `C`, and how to make it safer, check [Wikipedia](https://en.wikipedia.org/wiki/Setjmp.h) and this [C Programming](https://en.wikibooks.org/wiki/C_Programming/Error_handling) Wikibook, also [Exception Handling in C without C++](http://www.on-time.com/ddj0011.htm).

## Try/Catch is Born
A `try`, `catch`/`except` construct together with `throw`/`raise` improved situation significantly by allowing developers to execute "unsafe" portion of code without doing explicit checks for everything that might go wrong. If exception is encountered it can be handled in **developer provided exception handler** or propagated all the way to the top of the caller stack, which will terminate the program.

Try/catch really improved code quality by reducing boilerplate and enhancing readability, making it more clear what went wrong in the code and at runtime, and making it easier to free up resources.

## Exceptions get Abused
### Checked Exceptions
Of course the progress didn't stop there. Try/catch was good, but could we do better? Java came up with [Checked Exceptions](https://en.wikibooks.org/wiki/Java_Programming/Checked_Exceptions) which forced developers to either declare explicitly which exceptions a method might be throwing and not handling, or to catch them in the method. Most practitioners agree that it was a good idea gone bad. Let's hear out a few criticisms (found on Wikipedia):

> As any Java programmer knows, the volume of try catch code in a typical Java application is sometimes larger than the comparable code necessary for explicit formal parameter and return value checking in other languages that do not have checked exceptions. In fact, the general consensus among in-the-trenches Java programmers is that dealing with checked exceptions is nearly as unpleasant a task as writing documentation. Thus, many programmers report that they “resent” checked exceptions. This leads to an abundance of checked-but-ignored exceptions.  
[Kiniry, J. R.]

>The throws clause, at least the way it's implemented in Java, doesn't necessarily force you to handle the exceptions, but if you don't handle them, it forces you to acknowledge precisely which exceptions might pass through. It requires you to either catch declared exceptions or put them in your own throws clause. To work around this requirement, people do ridiculous things. For example, they decorate every method with, "throws Exception." That just completely defeats the feature, and you just made the programmer write more gobbledy gunk. That doesn't help anybody.  
[Anders Hejlsberg]

[Wikipedia](https://en.wikipedia.org/wiki/Exception_handling) summarizes the problem quite well:

> Using a `throws Exception` declaration or `catch (Exception e)` is usually sufficient for satisfying the checking in Java. While this may have some use, it essentially circumvents the checked exception mechanism, which Oracle discourages.

### Silent Exception Swallowing
Related to previous point on checked exceptions abuse, let's touch upon exception swallowing. It's well summarized on [SO](https://stackoverflow.com/questions/3335376/why-do-good-programmers-sometimes-silently-swallow-exceptions), so I'll just cite this "definition" of exception swallowing in code and the reason it happens which I completely agree with:

{% highlight java %}
try
{
    //Some code
}
catch(Exception){}
{% endhighlight %}

> Of course the REAL reason why even good programmers sometimes swallow exceptions is: "I'm trying to get the basic logic working, I'm not sure what to do if this exception happens, I don't want to mess with it right now, I'm having too much trouble with the normal logic flow but I'll get back to it later." And then they forget to get back to it.

### Flow Control
Use of exceptions as a flow control mechanism is generally discouraged because it makes reader more confused, there are better constructs for controlling the flow, and exceptions are meant to be used for exceptional cases. Exceptions usually incur performance penalty (see **Performance** below) and might also hide subtle bugs when used for flow control. For example, did you get an `IndexOutOfBoundsException` exception because you purposely let the code throw it to indicate end of iterable (bad idea), or because another piece of code threw it, when it was supposed to always work, and you have a bug there?

There are cases when using exceptions to control flow are justified, but those are few. Try to avoid this practice whenever possible. Here is example of `Breaks` in Scala from [Scala doc](http://www.scala-lang.org/api/2.12.2/scala/util/control/Breaks$.html):

{% highlight scala %}
import Breaks.{break, breakable}

breakable {
  for (...) {
    if (...) break
  }
}
{% endhighlight %}

`Breakable` and `break` is implemented using exceptions in Scala: 

{% highlight scala %}
def breakable(op: => Unit) {
    try {
      op
    } catch {
      case ex: BreakControl =>
        if (ex ne breakException) throw ex
    }
  }

def break(): Nothing = { throw breakException }
{% endhighlight %}

You might wonder why Scala uses exceptions to control flow in this case. This is an example of one of those rare cases where you want to break out of a loop, fold, etc and doing it in other way is not going to be worth it in either efficiency or code clarity.

### Performance
In many languages exceptions are slower than regular control structures like `if`/`else`. The reasons being are:

* Exceptions usually **populate stack trace** which gets more expensive at deeper levels of nesting.
* At runtime, when code throws an exception, execution environment has to look for exception handler at the enclosing scope/caller. If no handler is found, we go up the call stack popping off the stack frames until we find a handler - **stack unwinding**.

I have to mention opportunities to reduce the cost of stack generation during exception construction. In `Java 7` you can use `Throwable(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace)` to avoid constructing stack trace. Prior to Java 7 you could achieve similar effect via overriding:

{% highlight java %}
class MyException extends Throwable { 
    @Override
    public synchronized Throwable fillInStackTrace() { return this; } 
}
{% endhighlight %}

In Scala you can do similar thing via a mixin:

{% highlight scala %}
import scala.util.control.NoStackTrace

new Exception("some error") with NoStackTrace
{% endhighlight %}

Additionally your compiler or runtime environment such as JVM is able to optimize and inline some of exception handling (stack unwinding). However, overall exception raising/handling costs differ greatly between JVMs and other runtimes, and their use of optimizing flags and other factors such as your code structure. As a rule of thumb exceptions will be slower than other flow control structures.

In general, to avoid performance hit don't use exceptions everywhere in your code for flow control. Using exceptions in exceptional cases has negligible performance impact and won't have much effect on your code structure or architecture overall.

For more analysis of exception performance see this well detailed [article](https://shipilev.net/blog/2014/exceptional-performance).

## Best OOP Practices
Let me just quote the outline of *Chapter 9 - Effective Java (2nd edition)*:

> Exceptions ... 241  
Item 57: Use exceptions only for exceptional conditions ... 241  
Item 58: Use checked exceptions for recoverable conditions and runtime exceptions for programming errors ... 244  
Item 59: Avoid unnecessary use of checked exceptions ... 246  
Item 60: Favor the use of standard exceptions ... 248  
Item 61: Throw exceptions appropriate to the abstraction ... 250  
Item 62: Document all exceptions thrown by each method ... 252  
Item 63: Include failure-capture information in detail messages ... 254  
Item 64: Strive for failure atomicity ... 256  
Item 65: Don’t ignore exceptions ... 258  

If you haven't read the book, I highly recommend it, especially if you are using one of the mainstream OOP languages like Java or C#.

## A Better Try?
So far we've gone all the way from procedural languages with no exceptions to OOP languages with rich exception handling capabilities. Now you can forget all that because we are going to talk about Functional Programming (FP).

FP doesn't encourage use of exceptions and leaves them to represent a very tiny fraction of cases where you, as developer, can do nothing else but give up and let an exception be thrown. Generally, in any language there are two kinds of exceptions: programming errors (Java calls them `Exception`), and runtime errors from which you can't recover (Java calls them `Error`). If you get `OutOfMemoryError` you can't simply ignore it or recover your application. At best you might hope to print something to a log, or maybe close some critical resources, but usually you just don't even try to handle it. Coming back to FP, if you get an error - you can't do much, let it crash. Most of the times your FP code will be very strict and handle possible failures in non-exception style. Let's take a look at Scala's `Try` for initial inspiration. This is a copy of code and description from [Scala docs](http://www.scala-lang.org/api/2.12.3/scala/util/Try.html):

{% highlight scala %}
import scala.io.StdIn
import scala.util.{Try, Success, Failure}

def divide: Try[Int] = {
  val dividend = Try(StdIn.readLine("Enter an Int that you'd like to divide:\n").toInt)
  val divisor = Try(StdIn.readLine("Enter an Int that you'd like to divide by:\n").toInt)
  val problem = dividend.flatMap(x => divisor.map(y => x/y))
  problem match {
    case Success(v) =>
      println("Result of " + dividend.get + "/"+ divisor.get +" is: " + v)
      Success(v)
    case Failure(e) =>
      println("You must've divided by zero or entered something that's not an Int. Try again!")
      println("Info from the exception: " + e.getMessage)
      divide
  }
}
{% endhighlight %}

> An important property of `Try` shown in the above example is its ability to *pipeline*, or chain, operations, catching exceptions along the way. The `flatMap` and `map` combinators in the above example each essentially pass off either their successfully completed value, wrapped in the `Success` type for it to be further operated upon by the next combinator in the chain, or the exception wrapped in the `Failure` type usually to be simply passed on down the chain. Combinators such as `recover` and `recoverWith` are designed to provide some type of default behavior in the case of failure.

> Note: only non-fatal exceptions are caught by the combinators on Try (see scala.util.control.NonFatal). Serious system errors, on the other hand, will be thrown.
  
> Note:: all Try combinators will catch exceptions and return failure unless otherwise specified in the documentation.
  
> Try comes to the Scala standard library after years of use as an integral part of Twitter's stack.

I'll give an even more succint example of my own for a similar function:

{% highlight scala %}
import scala.io.StdIn
import scala.util.Try

def divide: Try[Int] =
    for {
        dividend <- Try(StdIn.readLine("Enter an Int that you'd like to divide:\n").toInt)
        divisor <- Try(StdIn.readLine("Enter an Int that you'd like to divide by:\n").toInt)
    } yield dividend/divisor
{% endhighlight %}

Imagine doing something similar with regular `try`/`catch` or `if`/`else` where you have multiple code points where your code can fail. You'd have to either nest exception handlers or check which exception is thrown, or what error value is produced. Take a look at the **Appendix** where I put a code listing for another style of error handling with `Either`. It compares traditional vs FP style error handling. Notice the nesting or multiple returns as a common approach.

In short, if you expect some sort of validation error to happen in FP, you usually represent it as a value such as `Try`, `Either`, `Option` (all are part of standard Scala library). This way you can decide how to compose/chain these errors and you are forced to deal with them explicitly. You can't just use a value inside of `Try` or any other "container". The type system explicitly tells you that there might be no valid value in it, you have to decide how you want to handle it. This makes your code much more robust because it's easy to ignore or forget to catch unchecked exceptions, but you can't simply get value of type `T` from "container" `Try[T]` without at least thinking of the consequences. Checked exceptions tried to achieve same goal but failed in practice.

In fact, there are many great libraries in FP languages, and in Scala specifically, that provide very rich validation error handling semantics. I'll provide one more example from ScalaZ library copied from [here](https://www.47deg.com/blog/fp-for-the-average-joe-part-1-scalaz-validation):

{% highlight scala %}
def toInts(maybeInts : List[String]): ValidationNel[Throwable, List[Int]] = {
    val validationList = maybeInts map { s =>
        Validation.fromTryCatchNonFatal(s.toInt :: Nil).toValidationNel
    }
    validationList reduce (_ +++ _)
}
{% endhighlight %}

Which produces these results:

    scala> toInts(List("1", "2", "3"))
    res1: scalaz.ValidationNel[Throwable,List[Int]] = Success(List(1, 2, 3))

    scala> toInts(List("1", "2", "3", "x", "z"))
    res2: scalaz.ValidationNel[Throwable,List[Int]] =
        Failure(
            NonEmptyList(
                java.lang.NumberFormatException: For input string: "x",
                java.lang.NumberFormatException: For input string: "z"))

If you are using a FP language, and maybe in OOP language wherever it applies, treat validation errors as values. Don't throw exceptions, but wrap them into containers that can be composed in different ways. Most prominent choices for chaining exceptions are:

* **Stop** at the **first error** and return a failure (like in Try example above)
* **Accumulate all errors** and then return an error that contains all failures (like in ScalaZ example above)

Representing exceptions as values becomes important in multithreaded and distributed contexts where non-local control flow provided by exception handler is limited to a thread it's executing on. In such cases we need to communicate failures in other ways such as passing errors as values or sending them as messages.

## Continuations
Another alternative to exceptions, or even more precisely put - a generalization that can be used to implement exceptions is [Continuation](https://en.wikipedia.org/wiki/Continuation). Wikipedia defines it as:

> In computer science and computer programming, a continuation is an abstract representation of the control state of a computer program. A continuation reifies the program control state, i.e. the continuation is a data structure that represents the computational process at a given point in the process's execution; the created data structure can be accessed by the programming language, instead of being hidden in the runtime environment. Continuations are useful for encoding other control mechanisms in programming languages such as exceptions, generators, coroutines, and so on.

Many languages support continuations to some degree and under different names. Continuations can be simulated, otherwise, with closures and proper tail calls.

I thought it's worth mentioning continuations as an alternative here, but I won't get into details due to the limitations of the scope of this article. I might write another post on that later on. The takeaway here is that continuation is a control flow abstraction. It allows us to capture the state of a program and execute it later (recover from exception in our case and continue), or to do something else (handle an exception and take an alternative route). Of course continuations are not only about exceptions, but here I was interested to mention them solely as an alternative.

## Conclusion
There are many approaches to handling errors in procedural, OOP and FP languages. If you do scripting in `bash` you can check value of `$?` to be greater than 0 for any error, or enable error checking for the whole script with `set -e`. There's been a lot of progress since `bash` and `C` times, though, which sometimes lead to dubious features like checked exceptions.

One thing for sure is that you don't want to force an error handling paradigm from other languages onto your language if it makes things very unnatural, inconvenient and confusing. However, it's good to be aware of various options, their pros and cons and use them as you see the fit. Exceptions are an appropriate measure for error handling in many languages, but might get abused quite a lot when they are used unwarranted for flow control, get [silently swallowed](https://stackoverflow.com/questions/3335376/why-do-good-programmers-sometimes-silently-swallow-exceptions) by lazy developers, or used to indicate every validation error.

It's good to know the limitations of using exceptions when it comes to composability (FP), multithreading and performance. We also have to appreciate the convenience and power of exceptions in suitable situations where we really need to use them.

## Appendix
The code below compares traditional error handling with functional approach, which provides better composability and more code robustness. It's also easier on the eyes once you get used to it.

<script src="https://gist.github.com/izmailoff/aa8663de3b9bd787391b3c0adf1d1146.js"></script>
