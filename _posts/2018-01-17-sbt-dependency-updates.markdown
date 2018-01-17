---
layout: post
title:  "SBT Dependency Updates Check"
date:   2018-01-16 19:19:14 +0800
categories: [Hacks]
---
## What
If you have an SBT project and wish to check **which dependencies can be updated** - you are in luck! [sbt-updates](https://github.com/rtimush/sbt-updates) will report latest versions compatible with your build's Scala version. You don't have to manually check https://mvnrepository.com or https://search.maven.org anymore.

## How
I suggest to install the plugin globally by adding it to your `plugins` directory. This way you don't have to add it to all your SBT projects. For instance:

    > echo 'addSbtPlugin("com.timushev.sbt" % "sbt-updates" % "0.3.3")' > ~/.sbt/0.13/plugins/sbt-updates.sbt

Now reload/restart your SBT and you can get reports like these:

    > sbt dependencyUpdates

    [info] Found 9 dependency updates for wifi_presense
    [info]   com.github.nscala-time:nscala-time : 2.4.0             -> 2.18.0
    [info]   com.pi4j:pi4j-core:compile         : 1.0               -> 1.1   
    [info]   com.pi4j:pi4j-device:compile       : 1.0               -> 1.1   
    [info]   com.sandinh:paho-akka_2.11         : 1.1.1  -> 1.1.2   -> 1.5.0 
    [info]   com.typesafe.akka:akka-actor       : 2.3.12 -> 2.3.16  -> 2.5.9 
    [info]   io.spray:spray-client              : 1.3.3  -> 1.3.4            
    [info]   io.spray:spray-json                : 1.3.2  -> 1.3.4            
    info]   org.java-websocket:Java-WebSocket  : 1.3.0  -> 1.3.7            
    [info]   org.scala-lang:scala-library       : 2.11.7 -> 2.11.12 -> 2.12.4
    [success] Total time: 2 s, completed 17 Jan, 2018 1:17:57 PM

Check the project [README](https://github.com/rtimush/sbt-updates) for more project, reporting and build options. This thing is simply awesome!
