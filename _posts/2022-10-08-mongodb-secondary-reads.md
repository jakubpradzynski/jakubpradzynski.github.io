---
title: How to easily optimize replica set resource consumption & performance in MongoDB?
author: jakubpradzynski
date: 2022-10-08 10:00:00 +0800
categories: [IT, MongoDB]
tags: [it, mongodb, replica set, optimization, read preference]
pin: false
toc: true
---

# Setup

I created new [free MongoDB cluster on Atlas](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/)
and [loaded sample data](https://www.mongodb.com/docs/atlas/sample-data/) into this cluster.

![](/assets/img/mongodb_secondary_reads/free_atlas_cluster.png)

As you can see cluster:

- has version 5.0.13
- is deployed on GCP / Belgium
- contains 3 nodes in Replica Set

So, what is this "replica set"?

# Replica set

According to [documentation](https://www.mongodb.com/docs/v6.0/replication/):
> A _replica set_ in MongoDB is a group of [mongod](https://www.mongodb.com/docs/v6.0/reference/program/mongod/#mongodb-binary-bin.mongod) processes
> that maintain the same data set.

Thanks to that we can get redundancy and high availability.

Always one of the nodes in replica set is selected as _primary_ and others are called _secondary_ or sometimes _arbiter_.
But we will not focus on what type is responsible for.

The most important things to remember are:

- All writes goes through primary and are replicated to secondaries
- Reads can be executed both on primary and on secondaries
- When current primary will stop responding, new one will be selected

If you want to learn more, I recommend that you check the [documentation](https://www.mongodb.com/docs/v6.0/replication/).

# Read preference

As I mention above, reads can be executed from primary or secondary.

**[Read preference](https://www.mongodb.com/docs/v6.0/core/read-preference/) is option which lets us specify where reads operations should be sent**

## Modes

Available modes for `readPreference` are:

- `primary` - reads only from primary node
- `primaryPreferred` - mostly from primary, if unavailable then from secondaries
- `secondary` - reads only from secondary nodes
- `secondaryPreferred` - mostly from secondaries, if unavailable then from primary
- `nearest` - reads from selected replica set member based on
  latency ([details](https://www.mongodb.com/docs/v6.0/core/read-preference/#mongodb-readmode-nearest))

## Default mode

When you connect to yours MongoDB cluster by default **`primary`** read preference is used.

I've created simple [script](https://www.mongodb.com/docs/mongodb-shell/write-scripts/#execute-a-javascript-file) to generate traffic on my cluster:

```javascript
db = connect('${mongodb_uri}');

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

for (let i = 0; i < 1_000; i++) {
  delay(500).then(() => db.posts.findOne({}));
}
```

After running it, metrics look like:
![](/assets/img/mongodb_secondary_reads/only_primary_reads.png)

So, all reads were made from `primary` node (it is marked by letter *P* above chart).

## Reads from secondary

When I simply modify script (only but adding `?readPreference=secondary` at the end of the `mongo_uri`) and run it again,
I can see difference on the charts:

![](/assets/img/mongodb_secondary_reads/secondary_reads.png)

Read operations were made from `secondary` nodes, so now the whole read traffic to database is split to two secondaries.
Now primary will be responsible only for write operations. It should have significant impact on resource consumption and database performance.

## Warnings

1. This may not be the best choice for everyone. Replication from primary to secondaries may take some time or even fails. It will depend on the
   replica set configuration. Few use cases for various modes are described
   in [MongoDB documentation](https://www.mongodb.com/docs/v6.0/core/read-preference-use-cases/#read-preference-use-cases).

2. If you have MongoDB in version below 4.0, reading from secondaries may lead to slower responses from database. It's because that in previous
   versions reading from secondaries was blocking. In 4.0 version Non-blocking secondary reads have been introduced (more
   details [here](https://www.mongodb.com/blog/post/secondary-reads-mongodb-40)).
