---
title: Quick dump MongoDB to BigQuery using Dataflow
author: jakubpradzynski
date: 2023-03-16 15:00:00 +0800
categories: [IT, MongoDB]
tags: [it, mongodb, gcp, bigquery, dataflow]
pin: false
toc: true
---

In this post, I want to share one way of dumping MongoDB collection into the BigQuery table to analyze data using Google Cloud Platform resources.

# What is Dataflow?

Dataflow is one of the services on the Google Cloud Platform, which allows processing stream and batch data that's serverless, fast, and
cost-effective.

More about the Dataflow you can see here: [Dataflow](https://cloud.google.com/dataflow).

Google provides plenty of ready-to-use templates (list of available templates you can see
here: [Provided templates](https://cloud.google.com/dataflow/docs/guides/templates/provided-templates).

Few of them use MongoDB:

- [Streaming] MongoDB to BigQuery (CDC)
- [Streaming] Pub/Sub to MongoDB
- [Batch] BigQuery to MongoDB
- [Batch] MongoDB to BigQuery

I want to focus on the last one.

# MongoDB to BigQuery template

Thanks to this template, you can easily dump MongoDB collection into a BigQuery table by running a job.

How to do this is very well described on the GCP
website: [MongoDB Atlas and BigQuery dataflow templates](https://cloud.google.com/blog/products/data-analytics/mongodb-atlas-and-bigquery-dataflow-templates).

So I won't copy it here.

I show you a command (uses gcloud) that allows you to run such processing.

```shell
gcloud dataflow flex-template run my-dataflow-name \
 --template-file-gcs-location gs://dataflow-templates-europe-west1/latest/flex/MongoDB_to_BigQuery \
 --region europe-west1 \
 --parameters mongoDbUri=mongodb+srv://username:password@host:port/database_name?authSource=admin,database=database_name,collection=collection_name,outputTableSpec=project:dataset.table,userOption=NONE,javascriptDocumentTransformGcsPath=gs://path
```

`gcloud dataflow flex-template run my-dataflow-name` runs new Dataflow processing with given name.

Parameters `template-file-gcs-location` and `region` are global and allow you to specify which template you want to use and on which region it should
run.

The parameter `parameters` is specific to the selected template. In it, you can
specify: `mongoDbUri`, `database`, `collection`, `outputTableSpec`, `userOption`, `javascriptDocumentTransformGcsPath`.

The first four, in my opinion, are quite clear. I'll tell you about the last two.

# Result table schema

`userOption` parameter is responsible for the result schema of the dump.
You have two options here:

- `NONE` - stores the whole document as JSON string.
- `FLATTEN` - flatten the document to the first level. Nested documents are stored as JSON string.

With the default `NONE` option, the result schema looks like this:
![](/assets/img/monogdb_to_bigquery_dataflow_template/result_table_schema.png)

With example data:

| id                                   | source_data                                                    | timestamp                      |
|--------------------------------------|----------------------------------------------------------------|--------------------------------|
| e6570932-b152-4898-95b9-a1debdab685e | {"_id":"e6570932-b152-4898-95b9-a1debdab685e", "name":"Jakub"} | 2023-03-15 16:59:25.982000 UTC |

At first glance, such a dump may seem challenging to use, but I will show you how to use it in the following.

# UDF - map data on the fly

Dataflow templates (globally, not only in MongoDB templates) can extend it using User Defined Functions.

UDFs are functions written in JavaScript like this:

```javascript
function process(inJson) {
  var obj = JSON.parse(inJson);
  // Map object here
  return JSON.stringify(obj);
}
```

As a parameter, it takes JSON string, and as a result, it expects JSON string.

More about using UDFs you can read
here: [Extend your Dataflow template with UDFs](https://cloud.google.com/blog/topics/developers-practitioners/extend-your-dataflow-template-with-udfs).

It may be helpful when you want to: extract from an array, calculate, drop some data, etc.

# Working with JSON data in BigQuery

BigQuery supports `JSON` column type.

Using function [PARSE_JSON](https://cloud.google.com/bigquery/docs/reference/standard-sql/json_functions#parse_json) we can change from JSON string to
JSON column type.

After that, you can work with JSON columns like described
here: [Working with JSON data in GoogleSQL](https://cloud.google.com/bigquery/docs/reference/standard-sql/json-data).

Example query:

```SQL
WITH dump_with_parser_json AS (SELECT id, PARSE_JSON(source_data) AS source_data, timestamp
FROM `sc-6014-pmd-dev.temp.tecdoc_relations`)
SELECT source_data._id
FROM dump_with_parser_json LIMIT 1000
```

<br>

---

<br>

**The whole dump process and the possibility of working with JSON data in BigQuery may be helpful when you want to dump your database quickly into
BigQuery and analyze it there.**
