FROM sbtscala/scala-sbt:eclipse-temurin-jammy-17.0.10_7_1.9.9_3.3.3

WORKDIR /app
COPY ./shop-api /app

RUN sbt compile

EXPOSE 9000

CMD ["sbt", "-Dhttp.port=9000", "run"]