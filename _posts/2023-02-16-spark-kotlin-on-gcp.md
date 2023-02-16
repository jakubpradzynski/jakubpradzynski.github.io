---
title: Deploy Spark-Kotlin project on GCP Dataproc cluster
author: jakubpradzynski
date: 2023-02-16 15:00:00 +0800
categories: [IT, Apache Spark]
tags: [it, apache spark, kotlin, gcp]
pin: false
toc: true
---

# Introduction

In the previous post ["How to create an example Spark-Kotlin-Gradle project?"](https://jakubpradzynski.pl/posts/example-spark-kotlin-gradle-project/) I
showed you how to create an example [Apache Spark](https://spark.apache.org/) project written in [Kotlin](https://kotlinlang.org/) lang and
using [Gradle](https://gradle.org/) build system.

You can run this [project](https://github.com/jakubpradzynski/example-spark-kotlin-gradle-project) locally, but Spark was designed to work with a lot
of data and a big, distributed compute cluster so to unleash the full potential of this tool you may want to run it on a cloud. For example on [Google
Cloud Platform](https://cloud.google.com/).

In this post, I'll show you how to run an example Spark-Kotlin-Gradle project on [GCP](https://cloud.google.com/)
using [gcloud command line tool](https://cloud.google.com/cli).

[Repository](https://github.com/jakubpradzynski/spark-kotlin-on-gcp) with an example project is available
on [my GitHub](https://github.com/jakubpradzynski/spark-kotlin-on-gcp).

# Adapt project to GCP

## Versions

GCP delivers specific VM images which contain particular versions of Java, Scala, Spark, etc.

The newest image is `2.1.2-debian11` with the following:

- `Apache Spark 3.3.0`
- `Java 11`
- `Scala 2.12.14`

You can see a list of available components version [here](https://cloud.google.com/dataproc/docs/concepts/versioning/dataproc-release-2.1).

Because of that, you have to set specific versions of Java and dependencies in `build.gradle.kts`:

- JVM version 11 (`jvmToolchain(11)`)
- Apache Spark version 3.3.0 with Scala 2.12 (`compileOnly("org.apache.spark:spark-sql_2.12:3.3.0")`)
- Kotlin Spark API (`implementation("org.jetbrains.kotlinx.spark:kotlin-spark-api_3.3.0_2.12:1.2.3")`)

## Spark BigQuery Connector

For using GCP tools like BigQuery, Google Cloud Storage, etc., from Apache Spark you should use additional
library [Spark BigQuery Connector](https://github.com/GoogleCloudDataproc/spark-bigquery-connector).

It has very well described `README.md`, so I encourage you to familiarize yourself with it.

You have to add a dependency with a matching version:
`implementation("com.google.cloud.spark:spark-bigquery_2.12:0.28.0")`

## Example code & data

In the example project, I want to show you how to read & write data using Google Cloud Storage bucket.
I downloaded publicly available data
of [ESA air pollution measurements in Poland](https://dane.gov.pl/pl/dataset/2913,dane-pomiarowe-esa-edukacyjna-siec-antysmogowa) and put in
into [CSV](https://github.com/jakubpradzynski/spark-kotlin-on-gcp/blob/master/data/esa_air_pollution_measurements_poland.csv), which you can copy into
bucket and load in Spark.

Let's look at the example code, initially only for data containers.

CSV is a flat file so that you can load data into some DTO classes:

```kotlin
data class MeasurementDto(
  val school_name: String,
  val school_street: String?,
  val school_post_code: String,
  val school_city: String,
  val school_longitude: String,
  val school_latitude: String,
  val data_humidity_avg: String,
  val data_pressure_avg: String,
  val data_temperature_avg: String,
  val data_pm10_avg: String,
  val data_pm25_avg: String,
  val timestamp: String
) : Serializable
```

which you can map into more domain models like:

```kotlin
data class Measurement(
  val school: School,
  val data: MeasurementData,
  val timestamp: Timestamp
) : Serializable

data class School(
  val name: String,
  val street: String?,
  val postCode: String,
  val city: String,
  val longitude: Double,
  val latitude: Double
) : Serializable

data class MeasurementData(
  val humidityAverage: Double,
  val pressureAverage: Double,
  val temperatureAverage: Double,
  val pm10Average: Double,
  val pm25Average: Double
) : Serializable
```

using function:

```kotlin
data class MeasurementDto(
  ...
) : Serializable {
  fun toDomainObject(): Measurement = Measurement(
    school = School(
      name = school_name,
      street = school_street,
      postCode = school_post_code,
      city = school_city,
      longitude = school_longitude.toDouble(),
      latitude = school_latitude.toDouble()
    ),
    data = MeasurementData(
      humidityAverage = data_humidity_avg.toDouble(),
      pressureAverage = data_pressure_avg.toDouble(),
      temperatureAverage = data_temperature_avg.toDouble(),
      pm10Average = data_pm10_avg.toDouble(),
      pm25Average = data_pm25_avg.toDouble()
    ),
    timestamp = Timestamp.valueOf(timestamp)
  )
}
```

Now, you can look at the code executed by Spark:

```kotlin
fun main() {
  withSpark(appName = "Measurements per city counter") {
    val inputPath = "gs://example-data/esa_air_pollution_measurements_poland.csv"
    val resultPath = "gs://example-data/measurements_per_city.csv"
    println("Starting job...")
    spark
      .read()
      .setDelimiter(";")
      .firstRowAsHeader()
      .csv(inputPath)
      .`as`<MeasurementDto>()
      .map { it.toDomainObject() }
      .groupByKey { it.school.city }
      .count()
      .repartition(1)
      .write()
      .csv(resultPath)
    println("Job done.")
  }
}

private fun DataFrameReader.setDelimiter(delimiter: String) = this.option("delimiter", delimiter)
private fun DataFrameReader.firstRowAsHeader() = this.option("header", "true")
```

The job is simple:

- Reads data from Google Cloud Storage bucket (DTO class)
- Maps to the domain model
- Groups by city
- Counts elements in group
- Saves result in GCS

# Deployment steps

1. First of all, you must have a package ready to be deployed:

```shell
./gradlew clean && ./gradlew shadowJar
```

2. Secondly, you must have a place to share this package on GCP and upload data. For that, you have to create your own Google Cloud Storage
   bucket (something like a folder in the cloud) and upload package & data there:

```shell
gsutil mb gs://example-data
gsutil cp build/libs/spark-kotlin-on-gcp-1.0-SNAPSHOT-all.jar gs://example-data/
gsutil cp data/esa_air_pollution_measurements_poland.csv gs://example-data/
```

3. Thirdly, Apache Spark requires compute instances on which it can run. GCP supplies creating such clusters, and it's called `Dataproc`:

```shell
gcloud dataproc clusters create my-cluster --region europe-west1 --image-version 2.1.2-debian11
```

4. Now, you are ready to submit Apache Spark job to run on the created cluster:

```shell
gcloud dataproc jobs submit spark --cluster my-cluster --region europe-west1 --jars gs://example-data/spark-kotlin-on-gcp-1.0-SNAPSHOT-all.jar --class pl.jakubpradzynski.measurements.MeasurementsPerCityCounterJobKt
```

5. When the job is done, you can clean up on GCP:

```shell
gcloud -q dataproc clusters delete my-cluster --region europe-west1
gsutil rm -r gs://example-data
```

All those steps are available in the single shell script, which you can
check [here](https://github.com/jakubpradzynski/spark-kotlin-on-gcp/blob/master/deploy/gcp.sh).

# Summary

If you want to read more about it, I refer you to some documentation:

- [Creating Dataproc cluster](https://cloud.google.com/dataproc/docs/guides/create-cluster)
- [Write and run Spark Scala jobs on Dataproc](https://cloud.google.com/dataproc/docs/tutorials/spark-scala)
- [Dataproc versioning](https://cloud.google.com/dataproc/docs/concepts/versioning/dataproc-release-2.1)
- [Spark BigQuery Connector](https://github.com/GoogleCloudDataproc/spark-bigquery-connector)

You can use my example project from
GitHub: [Example Spark-Kotlin-Gradle project](https://github.com/jakubpradzynski/example-spark-kotlin-gradle-project).

Above, I only describe a simple happy path of deployment. It's worth exploring more about: different or more complex dataproc clusters, cost
optimizations, more complex Spark jobs, or Spark optimization. In the future, I plan to cover some of those topics.
