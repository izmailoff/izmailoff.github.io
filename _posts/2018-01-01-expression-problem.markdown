---
layout: post
title:  "Expression Problem"
date:   2018-01-01 19:19:14 +0800
categories: [Programming Languages]
---
## Definition
Let's talk about the expression problem and one of it's possible solutions. Expression problem has been re-discovered multiple times. Let's jump straight into it without diving into history.

>The expression problem is a new name for an old problem. The goal is to define a datatype by cases, where one can add new cases to the datatype and new functions over the datatype, without recompiling existing code, and while retaining static type safety (e.g., no casts).
[Philip Wadler](http://homepages.inf.ed.ac.uk/wadler/papers/expression/expression.txt)

Wadler goes on to say:
> Whether a language can solve the Expression Problem is a salient indicator of its capacity for expression.  One can think of cases as
rows and functions as columns in a table.  In a functional language, the rows are fixed (cases in a datatype declaration) but it is easy to add new columns (functions).  In an object-oriented language, the columns are fixed (methods in a class declaration) but it is easy to
add new rows (subclasses).  We want to make it easy to add either rows or columns.

In other words, if you use one of the popular OOP languages it's easy to add subclasses to define new data types / cases, but you have to modify interfaces and recompile code if you want to add new methods to all these cases. In functional languages it's the other way around: you can easily add new functions for existing data types, but if you add a new case you have to change existing functions.

Summarized expression problem requirements from [this paper](https://www.cs.utexas.edu/~wcook/Drafts/2012/ecoop2012.pdf) are:
* **Extensibility in both dimensions**: A solution must allow the addition of new data variants and new operations and support extending existing operations.
* **Strong static type safety**: A solution must prevent applying an operation to a data variant which it cannot handle using static checks.
* **No modification or duplication**: Existing code must not be modified nor duplicated.
* **Separate compilation and type-checking**: Safety checks or compilation steps must not be deferred until link or runtime.
* **Independent extensibility**: It should be possible to combine independently developed extensions so that they can be used jointly.

[Wikipedia](https://en.wikipedia.org/wiki/Expression_problem) identifies these solutions to the expression problem:

* **Multimethods**
* **Open classes**
* **Coproducts of functors**
* **Type classes**
* **Tagless-final / Object algebras**

We'll look at **type class** implementation in Scala via use of implicits. Detailed explanation of type classes in Scala can be found [here](https://blog.scalac.io/2017/04/19/typeclasses-in-scala.html). Allow me to cite this brief definition:
> Type classes were first introduced in Haskell as a new approach to ad-hoc polymorphism...
>
> Type class is a class (group) of types, which satisfy some **contract** defined in a trait with addition that such **functionality** (trait and implementation) **can be added without any changes** to the original code. One could say that the same could be achieved by extending a simple trait, but with type classes it is **not necessary to predict such a need** beforehand.

## Solution
The code below shows one possible solution in Scala. It can be massaged further to achieve production grade quality, but I kept it simple for clarity. It follows the same code structure as two other examples in Haskell and Closure found in the Appendix. Finally, a few words on [implicits in Scala](https://docs.scala-lang.org/overviews/core/implicit-classes.html): they allow you to perform implicit conversions from one type to another, or similarly "pimp" your types with new methods (pimp my library design pattern). Whenever compiler finds mismatch between the data type and it's use, like a missing method, it tries to look up an implicit which will allow for this to happen. In our case we implicitly wrap our shapes with implementations that contain desired methods. Compiler can automatically find and resolve such wrappers/conversions.

**Scala** example:

<script src="https://gist.github.com/izmailoff/41c7f790eb97042c307885388754a0be.js"></script>


## Conclusion
How does your language solve the expression problem? Do you have to pay the price upfront by defining all possible data types or all possible operations on them? Try to find the answer following one of the possible solutions outlined above.


## Appendix
**Haskell** example (not my code):

<script src="https://gist.github.com/izmailoff/e11e1efef5f93d81333bba9fb54b3f57.js"></script>

**Clojure** example (not my code):

<script src="https://gist.github.com/elnygren/e34368a86d62f0cb75f04ba903f7834a.js"></script>
