---
layout: post
title:  "MQTT IoT Store with MongoDB"
date:   2016-06-06 15:15:14 +0800
categories: [IoT]
---
## Intro
On how to use MQTT protocol and save all messages to MongoDB. I'll quickly describe a little service I've built and how the whole setup works.

## MQTT
When I was looking for a low overhead IoT protocol to send and store messages from client IoT devices I came across MQTT. I really liked the idea and the fit of this protocol for IoT scenarios. You can learn MQTT in couple minutes and effectively use it afterwards. 

MQTT's idea is very simple: it's a Pub/Sub protocol that runs on TCP/IP. A publisher sends a message with payload and topic. Payload format is left up to you and to MQTT protocol it's just some bytes. This message is sent directly to MQTT broker - a server that handles Pub/Sub routing. Subscribers, well ... subscribe to a topic they are interested in. Once a broker receives a message it will send it to all subscribers to that topic. That's basically it: `Pub -> Broker -> Sub`. There is QoS with some guarantees regarding delivery but it's not really meant to be treated as a regular persistent queue.

Security is almost non-existent in MQTT as it allows you only to have username/password fields with no encryption, but that's fine. IoT devices usually try to do less encryption due to limited processing power and battery capacity. You have to pick your tradeoff based on situation.

If you really like to process event messages later on like I do, or if you simply want to store them as event log, you can use this tool I developed - `MQTT-Mongo` (MM). I could not find anything that fits exactly this purpose, so I had to code it up.

Pipeline now looks like this: `Pub -> Broker -> MM(Sub) -> MongoDB`.

## MQTT-Mongo
You can follow [these instructions](https://github.com/izmailoff/mqtt-mongo#fastest-way-to-get-started) to get quickly started. If you want to know more about the service read on.

The idea is simple: `MQTT-Mongo` (MM) subscribes to all topics listed in config and whenever a message is received it saves it in corresponding collection. Since we are using MongoDB everything saved in it is in JSON format, however, a few conversion options exist from original payload to DB format.

Take a look at this part of config (HOCON) and it should be quite clear how it works:

{% highlight hocon %}
# Defines how to save MQTT messages to MongoDB
mqttMongo {

  # Each topic can be saved to one or more collections.
  # The service will subscribe to all listed topics and
  # save them to corresponding collections.
  # Example:
  # [ { "topic1": "collection_name1" }, 
  #   { "topic2": "collection_name2;collection_name3" } ]
  # use ';' to separate multiple collections for one topic
  topicsToCollectionsMappings = [{
    "test": "messages"
  }]

  # A conversion format to be used when saving MQTT messages to Mongo DB.
  # Default format is "JSON".
  # Available options:
  #  * JSON - try to convert message payload to JSON and save it as it is.
  #    If conversion fails save it in "payload" field as String.
  #  * BINARY - save message payload in "payload" field as it is (bytes).
  #  * STRING - save message payload as String in "payload".
  serializationFormat = "JSON"
}
{% endhighlight %}

You can find all other MQTT-Mongo details in the [README](https://github.com/izmailoff/mqtt-mongo/blob/master/README.md).

## Conclusion
I was a bit surprised that I got 30 stars on MM github project. Seems like others have this need as well. That means I'll probably have to improve docs and code as much as I can and add a pre-compiled JAR. If that happens I'll extend this article to add step-by-step instructions. Otherwise just let me know if you need any help.

