---
layout: post
title:  "Testing Futures with ScalaTest"
date:   2019-03-20 01:01:01 +0800
categories: [Programming Languages]
---
## Multiple `Future[Assertion]` Problem

Most of the unit testing frameworks follow the style of unit tests where you can put multiple assertions in your test case and expect all of them to be validated during the test run (see "non-future assertions" test below). This works as expected in [ScalaTest](http://www.scalatest.org/) with regular `Assertion` type. However, when you start using `Async*Spec` you might be **caught by surprise** that only the last `Future[Assertion]` is being asserted. Let's take a look at the examples below and see how we could address this issue.

<script src="https://scastie.scala-lang.org/izmailoff/yrjw7LZKTiyOS6iDtekPUQ/3.js"></script>

One of the solutions shown in the snippet is to collect all your Futures and force assertions to happen "by hand" by referencing them inside the `map` and `foreach`. Other ideas are: split each assertion into a test case (too much repetion for my liking) or to use `Await` and to block. Await is usually frowned upon because of the blocking, but can be useful to simplify tests if you want to make sure your Future has completed before going on with another operation and you want to avoid complexity of composition functions like `flatMap`.

## Conclusion

This post is not intended to give the best solution to the problem, but rather to raise awareness of this potential pitfall. I think the reason it works this way is that regular `assert` macro provided by ScalaTest throws an exception which can immediately stop the test executor and will never go unnoticed. The thing with Futures though is that they wrap exceptions and never throw them, so perhaps the easiest solution for ScalaTest was to use last/return value of the test case, which is of type `Future[Assertion]` and to only check what's inside. It's much harder to try to find all such assertions in test cases automatically. Thus, assert exceptions within early Future assertions are just left unboxed. This is where we can combine them all with our `assertAll` and make sure ScalaTest will see them.

## Appendix

In case Scastie doesn't work, here is Gihub gist reference with the same code:

<script src="https://gist.github.com/izmailoff/fb343c93b29e73ab4c9ac870b3c6e312.js"></script>

