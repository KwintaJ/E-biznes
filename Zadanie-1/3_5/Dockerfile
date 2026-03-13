FROM ubuntu:24.04
RUN apt-get update && apt-get install -y curl unzip

RUN apt-get install -y openjdk-8-jdk
ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-arm64

RUN curl -L https://github.com/JetBrains/kotlin/releases/download/v2.3.10/kotlin-compiler-2.3.10.zip -o /tmp/kotlin.zip
RUN unzip /tmp/kotlin.zip -d /opt
RUN rm /tmp/kotlin.zip

ENV PATH="/opt/kotlinc/bin:${JAVA_HOME}/bin:${PATH}"
