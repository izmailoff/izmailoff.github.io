---
layout: post
title:  "wifi_presense - Wi-Fi Sniffer for RPI"
date:   2018-01-15 15:15:14 +0800
categories: [IoT]
---
## Intro
There are many fun things that can be done with Wi-Fi since it transmits signal over the air. No matter what types of packets it sends, you can see the sender's MAC address, even though the payload is encrypted. I'm not encouraging you to try to hack your neighbours, rather use this feature for peaceful purposes.

We know that each device has unique MAC address, and you can passively sniff it over the air using common tools. This lets us implement a very simple, generic Wi-Fi sniffing application. Enter [wifi_presense](https://github.com/izmailoff/wifi_presense) - a generic, configurable Wi-Fi monitoring application.

The thing is, I don't want to limit your imagination with regards to what you can do with this tool. I personally created it because I thought it would be cool to turn the lights on/off when I arrive/leave home. Hence, it has Raspberry-Pi GPIO control library included. As a business case you can monitor how many visitors you have, or even their navigation path if you use signal strength and triangulation. There are lots of fun projects you can do with it, just be nice and stay within the boundaries of law.

## Implementation
The core packet sniffing tool used by this application is [tshark](https://www.wireshark.org/docs/man-pages/tshark.html)  - a command line brother of the famous Wireshark network analysis tool.

Before you can run tshark you need to put your network card into [monitor mode](https://en.wikipedia.org/wiki/Monitor_mode). This will allow it to listen to all packets on the network. There are different ways to do it based on OS and tools you are using. Here are couple examples assuming your wifi interface is `wlan0`:

**Linux**:

    sudo ifconfig wlan0 down
    sudo iwconfig wlan0 mode monitor

or:

    airmon-ng check kill
    airmon-ng start wlan0
    airodump-ng wlan0mon

**Mac/OSx**:

    ifconfig wlan0 down 
    macchanger -r wlan0 
    ifconfig wlan0 up

Make sure to check for exact commands and have the right packages installed on your system. Not all cards support monitor mode, check before you buy/try.

Once you are ready with your card in monitor mode, you can run tshark on it's own like this:

    stdbuf -oL \
    tshark -i wlan0 -I \
    -f 'broadcast' \
    -R 'wlan.fc.type == 0 && wlan.fc.subtype == 4' \
    -T fields \
    -e frame.time_epoch \
    -e wlan.sa \
    -e radiotap.dbm_antsignal

You should see network packets in your termnial output.

Great! But this is not very easy to use. That's why I created this tool which will capture packets with MAC address you are interested in and send them to wherever you want, well, almost. Currently [these](https://github.com/izmailoff/wifi_presense/tree/master/src/main/scala/com/wp/service/consumer) event consumers are supported:

* `GPIO` - activate RPI pins to turn things on and off.
* `MQTT` - send events down to MQTT broker. See [mqtt-mongo](https://github.com/izmailoff/mqtt-mongo) for event store using MongoDB. I describe it in more details [here](http://izmailoff.github.io/iot/iot-message-store/).
* `REST` - POST events to a web API.
* `STDOUT` - print to screen.
* `Web Socket` - send them over web socket.

More consumers can be added if need be. For extended configuration see [config](https://github.com/izmailoff/wifi_presense/blob/master/src/main/resources/application.conf).

The way it all works is that this application simply starts a process with a tshark command similar to the one above. Tshark prints all events to stdout, which is captured by wifi_presense, parsed and then published to consumers. Since packet sniffers can produce loads of events this application is designed to be non-blocking in processing of the events and consumers should be implemented so that they process messages very fast.

I'll add instructions on how to wire up RPI to turn LED on/off when your phone is in the area.

## Disclaimer
MAC addresses can be [spoofed](https://en.wikipedia.org/wiki/MAC_spoofing) easily, thus you can't rely on them to be true. Furthermore, if you want to detect your phone it might take a few seconds as it scans for available Wi-Fi networks periodically. Some phones allow you to disable Wi-Fi scanning completely.

Have fun with it and be mindful of others. If you want to help me improve the code, documentation, scripts, etc feel free to send a pull request!


