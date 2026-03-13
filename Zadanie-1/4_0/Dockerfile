FROM ubuntu:24.04
RUN apt-get update && apt-get install -y curl unzip

# Java 17 for Gradle & Java 8
RUN apt-get install -y openjdk-8-jdk openjdk-17-jdk
ENV JAVA17_HOME=/usr/lib/jvm/java-17-openjdk-arm64
ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-arm64

RUN curl -L https://github.com/JetBrains/kotlin/releases/download/v2.3.10/kotlin-compiler-2.3.10.zip -o /tmp/kotlin.zip && \
    unzip /tmp/kotlin.zip -d /opt && \
    rm /tmp/kotlin.zip

# Gradle newest version search 
RUN GRADLE_VERSION=$(curl -s https://services.gradle.org/versions/current | grep '"version"' | tr -dc '0-9.') && \
    curl -L https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip -o /tmp/gradle.zip && \
    unzip /tmp/gradle.zip -d /opt && \
    rm /tmp/gradle.zip && \
    ln -s /opt/gradle-${GRADLE_VERSION} /opt/gradle

# Set Java 8 in path, Java 17 for Gradle
ENV PATH="/opt/gradle/bin:/opt/kotlinc/bin:${JAVA_HOME}/bin:${PATH}"
ENV GRADLE_OPTS="-Dorg.gradle.java.home=${JAVA17_HOME}"

WORKDIR /app

# Build Gradle
COPY build.gradle /app/
RUN gradle help --no-daemon
