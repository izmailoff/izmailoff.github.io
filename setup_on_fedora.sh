#!/bin/bash

sudo dnf install -y ruby-devel

# gem install jekyll
gem install bundler

bundle install

# now you are ready to run: ./serve.sh
