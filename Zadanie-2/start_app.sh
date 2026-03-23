#!/bin/bash

docker stop shop-api || true
docker rm shop-api || true

docker build -t jankwinta/ebiznes-02 .
docker run -d --name shop-api -p 9000:9000 jankwinta/ebiznes-02

ngrok http 9000