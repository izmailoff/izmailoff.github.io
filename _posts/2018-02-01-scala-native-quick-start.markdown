---
layout: post
title:  "Scala Native - Quick Start"
date:   2018-02-01 19:19:14 +0800
categories: [Programming Languages]
---
## Why
[`JVM`](https://en.wikipedia.org/wiki/Java_virtual_machine) is a great platform for many scenarios and sometimes runs faster than `C`/`C++`. However, it has its own downsides. Its portability comes at a cost of *startup time* and lack of *low level hardware access*. If you need to run a small command line utility, by the time JVM will start, a native application or even a script might already finish the job. Another issue is: due to portability tradeoffs we can't directly work with memory, hardware instructions and native libraries.

[JNI](https://en.wikipedia.org/wiki/Java_Native_Interface) provides such capabilities, but incurrs aditional performance overheads when calling functions in both directions and if data structures have to be copied between JVM and native environments. Additional configuration and boilerplate code cost plays role when considering JNI as well. 

[JNA](https://en.wikipedia.org/wiki/Java_Native_Access) ([docs](https://github.com/java-native-access/jna#readme)) tries to address JNI's boilerplate and performance problems but can be slower/faster dependending on how it's used.

Overall, JNI, JNA and the likes can be great solutions but won't always be perfect. Sometimes you need to write your code in an optimized fashion that only low level languages would let you do.

Now that you feel a little bit motivated let's take a look at [Scala Native](http://www.scala-native.org):

> Scala Native is an optimizing ahead-of-time compiler and lightweight managed runtime designed specifically for Scala. It features: low-level primitives, seamless interop with native code, instant startup time.

You should go to their site and read the docs to get a good idea. I'll summarize most relevant points here:

* It **compiles** via `LLVM` ([link](https://en.wikipedia.org/wiki/LLVM)).
* It relies on **garbage collection** (GC). You can chose between [multiple supported GCs](http://www.scala-native.org/en/latest/user/sbt.html#garbage-collectors) or run without one if your program is short-lived. I guess you can't have all of the Scala's OOP and FP features without GC.
* The code looks exactly like **regular Scala**! There is **additional syntax** for native types, memory allocation, accessing external libraries, etc.
* **Limited library support** and no multithreading at the moment. I'm very curious how they will solve this interesting problem. [Here](https://github.com/tindzk/awesome-scala-native) is the list of some libraries you can use.
* You can call **native libraries** directly!
* You can use **familiar tools** like SBT, IDEs, etc. Artefact publishing works same way via Sonatype and similar services.
* [Some operations](http://www.scala-native.org/en/latest/user/interop.html#undefined-behavior) are **undefined** like `null` dereferencing, division by `0`, stack overflows and `free` related missuses.

## Quick Start
Great, now you must be really itching to start. You need to do 2 things:

* [Setup the environment](http://www.scala-native.org/en/latest/user/setup.html) which includes installing `Java >= 8, SBT, LLVM/CLang` and some runtime dependencies. If you don't have SBT installed just run this to get the launcher script: `curl -s https://raw.githubusercontent.com/paulp/sbt-extras/master/sbt > sbt && chmod 0755 sbt`. Then simply run `./sbt` and off you go. It will download the rest for you.
* [Create a project](http://www.scala-native.org/en/latest/user/sbt.html#) with `sbt new scala-native/scala-native.g8` or clone my example from [here](https://github.com/izmailoff/scala-native-example).

Now you can generate native binary with:

    sbt nativeLink

This should produce a binary at this path: `./target/scala-2.11/scala_native_hello_world-out`.

That's it, just run the binary to see how it works. Here is an example of `wc -l`-like program from my repo:

{% highlight console %}
# ./target/scala-2.11/scala_native_hello_world-out build.sbt 
Number of lines: 3
{% endhighlight %}

