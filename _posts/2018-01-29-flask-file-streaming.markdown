---
layout: post
title:  "Flask File Streaming"
date:   2018-01-29 20:00:00 +0800
categories: [Web]
---
## What
Sometimes you have a need to receive or send large files in chunks. To do this properly you don't want to hold the whole file in memory or save it to disk. Ideally, you would use a stream that processes that file in chunks as it's being read or written. I had this need at work and it was hard to find good examples of this done in `Python` with `Flask` - since that's what our machine learning (ML) applications use. I've put a small example in [this repo](https://github.com/izmailoff/python_flask_file_streaming).

## How It Works
Flask's `request` has a `stream`, that will have the file data you are uploading. You can read from it treating it as a `file`-like object. The trick seems to be that you shouldn't use other `request` attributes like `request.form` or `request.file` because this will materialize the stream into memory/file. Flask by default saves files to disk if they exceed `500Kb`, so don't touch `file`.

## Example
You can follow the [README](https://github.com/izmailoff/python_flask_file_streaming) to try out the project. I'm posting the same code here for convenience. There are 3 scenarios covered:

* **Upload** file to disk
* **Download** from a URL, could be replaced with a file instead of URL
* **Proxy** - pipe it from a client to this server and to another server

{% highlight python %}
from flask import Flask
from flask import Response
from flask import stream_with_context
import requests
from flask import request

app = Flask(__name__)


# Upload file as stream to a file.
@app.route("/upload", methods=["POST"])
def upload():
    with open("/tmp/output_file", "bw") as f:
        chunk_size = 4096
        while True:
            chunk = request.stream.read(chunk_size)
            if len(chunk) == 0:
                return
            f.write(chunk)


# Download from provided URL.
@app.route('/<path:url>')
def download(url):
    req = requests.get(url, stream=True)
    return Response(stream_with_context(req.iter_content()), content_type=req.headers['content-type'])


# Proxy uploaded files as stream to another web API without saving them to disk or holding them in memory.
# This example uses multipart form data upload for both this API and destination API.
#
# Test this endpoint with:
# curl -F "file=@some_binary_file.pdf" http://127.0.0.1:5000/proxy
@app.route("/proxy", methods=["POST"])
def proxy():
    # use data=... or files=..., etc in the call below - this affects the way data is POSTed: form-encoded for `data`,
    # multipart encoding for `files`. See the code/docs for more details here:
    # https://github.com/requests/requests/blob/master/requests/api.py#L16
    resp = requests.post('http://destination_host/upload_api', files={'file': request.stream})
    return resp.text, resp.status_code


if __name__ == '__main__':
    app.run()
{% endhighlight %}

## Other Options
I'm more of a `Scala` guy rather than `Python`, so I couldn't stop myself from posting an example of Scala multipart file upload using `Spray`/[Akka-HTTP](https://doc.akka.io/docs/akka-http/current):

{% highlight scala %}
  case class MyFile(name: String, filename: Option[String], bytes: Array[Byte])

  implicit val materializer: ActorMaterializer = ActorMaterializer(ActorMaterializerSettings(actorSystem))

  val route: Route =
    pathPrefix("convert") {
      entity(as[Multipart.FormData]) { (formData: Multipart.FormData) =>
        val uploadedFilesFuture = formData.parts.mapAsync(1) { bodyPart =>
          val bytesFuture = bodyPart.entity.dataBytes.runFold(Array[Byte]())(_ ++: _.toArray)
          bytesFuture map {
            bytes => MyFile(bodyPart.name, bodyPart.filename, bytes) // put `bytes` processing logic here
          }
        }.runFold(Seq.empty[MyFile])(_ :+ _)
        complete {
          uploadedFilesFuture
        }
      }
    }
{% endhighlight %}

Here the uploaded file being processed asynchronously as a stream of chunks of bytes. It supports multiple file uploads, i.e. `curl -F "file=@file1.pdf" -F "file=@file2.doc" http://localhost/convert`.
[Reactive Streams and Flows](https://doc.akka.io/docs/akka/current/stream/stream-flows-and-basics.html?language=scala) for the win!