---
layout: post
title:  "SBT Dependency Graph"
date:   2019-02-25 01:19:14 +0800
categories: [Hacks]
---
## What
You can generate a graph of all your dependencies for **troubleshooting dependency conflicts** or just to understand which libraries are being (transitively) pulled into your project.
As usual, there is a nice SBT plugin for that: [sbt-dependency-graph](https://github.com/jrudolph/sbt-dependency-graph).

## How
I suggest to install the plugin globally by adding it to your `plugins` directory. This way you don't have to add it to all your SBT projects. For instance:

    > echo 'addSbtPlugin("net.virtual-void" % "sbt-dependency-graph" % "0.9.2")' > ~/.sbt/1.0/plugins/sbt-dependency-graph.sbt

Now reload/restart your SBT and you can start running commands. There are many options available out of which I prefer:

  - `dependencyBrowseGraph` to open nice graphical view in your web browser.
  - `dependencyTree` if you don't have a browser, and like pain :).
  - `dependencyDot` to generate a `dot` file similar to the one shown in your browser. This is the most useful option for getting an image file for later use.

## Example

Here is an example of `dependencyDot` scenario for generating a PGN image. Firstly, install `graphviz` on your OS for converting `dot` to other formats:

Ubuntu:

    > sudo apt-get install graphviz

OSX:

    > brew install graphviz

Next, generate the dot file:

    > sbt dependencyDot

    [info] Wrote dependency graph to 'target/dependencies-compile.dot'

Finally, convert that dot file to png or other formats like pdf that are supported by graphviz:

    > dot target/dependencies-compile.dot -Tpng -o /tmp/dependencies-compile.png

Enjoy a dependency graph that looks something like this:

![Project Dependencies](/assets/dependency_graph/dependencies-compile.png){:class="img-responsive"}

As you can notice in this example there is a dependency `com.typesafe.config` that was at conflict with its newever version and it got automatically evicted by SBT. 

## Additionally
It has other cool commands like:

### Size Stats

    > sbt dependencyStats

    [info]    TotSize    JarSize #TDe #Dep Module
    [info]  34.422 MB ------- MB   35   10 default:coach_service_2.12:0.1
    [info]  14.062 MB   2.474 MB   11    7 org.reactivemongo:reactivemongo_2.12:0.16.2
    [info]   9.694 MB   4.043 MB    7    4 com.typesafe.akka:akka-stream_2.12:2.5.13
    [info]   7.380 MB   0.088 MB    7    3 com.github.melrief:purecsv_2.12:0.1.1
    [info]   6.519 MB   0.016 MB    4    2 com.typesafe.akka:akka-http-spray-json_2.12:10.1.5
    [info]   6.217 MB   1.713 MB    2    1 com.typesafe.akka:akka-http_2.12:10.1.5
    [info]   4.750 MB   0.016 MB    4    2 com.typesafe.akka:akka-slf4j_2.12:2.5.13
    [info]   4.693 MB   3.242 MB    2    2 com.typesafe.akka:akka-actor_2.12:2.5.13
    [info]   4.508 MB   4.508 MB    0    0 org.reactivemongo:reactivemongo-shaded:0.16.2
    [info]   4.504 MB   3.533 MB    1    1 com.typesafe.akka:akka-http-core_2.12:10.1.5
    [info]   4.439 MB   0.552 MB    3    1 com.github.marklister:product-collections_2.12:1.4.5
    [info]   3.887 MB   0.227 MB    2    2 com.lihaoyi:utest_2.12:0.4.4
    [info]   3.645 MB   3.645 MB    0    0 org.scala-lang:scala-reflect:2.12.8
    [info]   2.833 MB   2.830 MB    1    1 com.chuusai:shapeless_2.12:2.3.2
    [info]   1.166 MB   1.166 MB    0    0 org.scala-lang.modules:scala-java8-compat_2.12:0.8.0
    [info]   1.018 MB   0.425 MB    1    1 com.typesafe.play:play-iteratees_2.12:2.6.1
    [info]   0.971 MB   0.971 MB    0    0 com.typesafe.akka:akka-parsing_2.12:10.1.5
    [info]   0.803 MB   0.290 MB    2    2 ch.qos.logback:logback-classic:1.2.3
    [info]   0.757 MB   0.246 MB    2    2 com.typesafe:ssl-config-core_2.12:0.2.3
    [info]   0.641 MB   0.641 MB    0    0 joda-time:joda-time:2.10.1
    [info]   0.593 MB   0.593 MB    0    0 org.scala-stm:scala-stm_2.12:0.8
    [info]   0.573 MB   0.146 MB    1    1 org.reactivemongo:reactivemongo-bson-macros_2.12:0.16.2
    [info]   0.485 MB   0.485 MB    0    0 com.typesafe.akka:akka-protobuf_2.12:2.5.13
    [info]   0.472 MB   0.472 MB    0    0 ch.qos.logback:logback-core:1.2.3
    [info]   0.427 MB   0.427 MB    0    0 org.reactivemongo:reactivemongo-bson_2.12:0.16.2
    [info]   0.335 MB   0.335 MB    0    0 commons-codec:commons-codec:1.11
    [info]   0.315 MB   0.315 MB    0    0 dnsjava:dnsjava:2.1.8
    [info]   0.286 MB   0.286 MB    0    0 com.typesafe:config:1.3.2
    [info]   0.286 MB   0.286 MB    0    0 io.spray:spray-json_2.12:1.3.4
    [info]   0.225 MB   0.225 MB    0    0 org.scala-lang.modules:scala-parser-combinators_2.12:1.1.0
    [info]   0.147 MB   0.147 MB    0    0 org.apache.logging.log4j:log4j-api:2.5
    [info]   0.041 MB   0.041 MB    0    0 org.slf4j:slf4j-api:1.7.25
    [info]   0.020 MB   0.020 MB    0    0 net.sf.opencsv:opencsv:2.3
    [info]   0.015 MB   0.015 MB    0    0 org.scala-sbt:test-interface:1.0
    [info]   0.003 MB   0.003 MB    0    0 org.typelevel:macro-compat_2.12:1.1.1
    [info]   0.002 MB   0.002 MB    0    0 org.reactivestreams:reactive-streams:1.0.2
    [info] 
    [info] Columns are
    [info]  - Jar-Size including dependencies
    [info]  - Jar-Size
    [info]  - Number of transitive dependencies
    [info]  - Number of direct dependencies
    [info]  - ModuleID

### Licence Info

    > sbt dependencyLicenseInfo

    [info] No license specified
    [info]   default:coach_service_2.12:0.1
    [info] 
    [info] Apache 2
    [info]   net.sf.opencsv:opencsv:2.3
    [info]   com.chuusai:shapeless_2.12:2.3.2
    [info]   org.typelevel:macro-compat_2.12:1.1.1
    [info]   io.spray:spray-json_2.12:1.3.4
    [info]   joda-time:joda-time:2.10.1
    [info] 
    [info] Apache 2.0
    [info]   org.reactivemongo:reactivemongo_2.12:0.16.2
    [info]   org.reactivemongo:reactivemongo-bson-macros_2.12:0.16.2
    [info]   org.reactivemongo:reactivemongo-bson_2.12:0.16.2
    [info]   org.reactivemongo:reactivemongo-shaded:0.16.2
    [info] 
    [info] Apache License, Version 2.0
    [info]   commons-codec:commons-codec:1.11
    [info]   com.typesafe.akka:akka-slf4j_2.12:2.5.13
    [info]   com.typesafe.akka:akka-stream_2.12:2.5.13
    [info]   com.typesafe:ssl-config-core_2.12:0.2.3
    [info]   com.typesafe.akka:akka-protobuf_2.12:2.5.13
    [info]   com.typesafe.akka:akka-actor_2.12:2.5.13
    [info]   com.typesafe:config:1.3.2
    [info] 
    [info] Apache-2.0
    [info]   org.scala-lang:scala-reflect:2.12.8
    [info]   com.typesafe.play:play-iteratees_2.12:2.6.1
    [info]   com.typesafe.akka:akka-http-spray-json_2.12:10.1.5
    [info]   com.typesafe.akka:akka-http_2.12:10.1.5
    [info]   com.typesafe.akka:akka-http-core_2.12:10.1.5
    [info]   com.typesafe.akka:akka-parsing_2.12:10.1.5
    [info] 
    [info] Apache2
    [info]   com.github.melrief:purecsv_2.12:0.1.1
    [info] 
    [info] BSD
    [info]   org.scala-sbt:test-interface:1.0
    [info]   org.scala-stm:scala-stm_2.12:0.8
    [info] 
    [info] BSD 2-Clause license
    [info]   dnsjava:dnsjava:2.1.8
    [info] 
    [info] BSD 3-clause
    [info]   org.scala-lang.modules:scala-parser-combinators_2.12:1.1.0
    [info]   org.scala-lang.modules:scala-java8-compat_2.12:0.8.0
    [info] 
    [info] BSD Simplified
    [info]   com.github.marklister:product-collections_2.12:1.4.5
    [info] 
    [info] CC0
    [info]   org.reactivestreams:reactive-streams:1.0.2
    [info] 
    [info] Eclipse Public License - v 1.0
    [info]   ch.qos.logback:logback-classic:1.2.3
    [info]   ch.qos.logback:logback-core:1.2.3
    [info] 
    [info] MIT License
    [info]   org.slf4j:slf4j-api:1.7.25
    [info] 
    [info] MIT license
    [info]   com.lihaoyi:utest_2.12:0.4.4
    [info] 
    [info] The Apache Software License, Version 2.0
    [info]   org.apache.logging.log4j:log4j-api:2.5

That's it.
