---
title: Setting readPreference option in Spring Data MongoDB projects
author: jakubpradzynski
date: 2022-10-10 10:00:00 +0800
categories: [IT, MongoDB]
tags: [it, mongodb, read preference, spring data]
pin: false
toc: true
---

# Introduction

In [previous](https://jakubpradzynski.pl/posts/mongodb-secondary-reads/) post I wrote about MongoDB optimization by reading from secondary nodes.

In this post I will show you how to use this option in Spring Boot project.

# Using secondary reads globally

If you use [Spring Data MongoDB](https://spring.io/projects/spring-data-mongodb) on daily basis, you probably create `MongoRepository` like this:

```kotlin
@Document(collection = "books")
data class Book(@Id val id: String, val title: String)

interface BooksRepository : MongoRepository<Book, String>
```

`SimpleMongoRepository` which is basic implementation of `MongoRepository` uses `MongoTemplate` to execute queries.

So if you want to switch all reads to for example `secondaryPreferred` you can just create new bean with the `readPreference` option set properly.
Like this:

```kotlin
@Configuration
class MongoConfig {

  @Bean
  fun mongoTemplate(@Value("\${mongoUri}") mongoUri: String): MongoTemplate {
    val mongoTemplate = MongoTemplate(SimpleMongoClientDatabaseFactory(mongoUri))
    mongoTemplate.setReadPreference(ReadPreference.secondaryPreferred())
    return mongoTemplate
  }
}
```

After setting this bean in your project all repositories will use `MongoTemplate` which will execute queries with `readPreference` set
to `secondaryPreferred`.

# Using secondary reads on specific queries

Unfortunately, there is no option to set `readPreference` option on specific queries.
Or maybe only I don't know how to do that and you can give me a hint in comments.

The only option which I found is to use annotation

```kotlin
interface BooksRepository : MongoRepository<Book, String> {
  @Meta(flags = [CursorOption.SECONDARY_READS])
  override fun findAll(): List<Book>
}
```

Or if you code queries by your own using `MongoOperations` or `FluentMongoOperations` you can allow secondary reads like that:

```kotlin
@Repository
class MyBooksRepository(private val mongoOperations: MongoOperations) {
  fun findAll(): List<Book> =
    mongoOperations.find(
      Query
        .query(Criteria())
        .allowSecondaryReads(),
      Book::class.java
    )
}
```

-----
**But be careful!**

This option set `readPreference` only to `primaryPreferred` (you can see it
in `MongoTemplate` [implementation](https://github.com/spring-projects/spring-data-mongodb/blob/ae2846c5bf7a9fe8193600650de7cf529724af1a/spring-data-mongodb/src/main/java/org/springframework/data/mongodb/core/MongoTemplate.java#L3221-L3225)).

This means that queries will be executed on `primary` anyway, unless `primary` becomes unavailable.

-----

So if you want to execute some of queries with different `readPrefence` you have to create many `MongoTemplate` with option set appropriately.
Then use the appropriate `MongoTemplate` for specific queries.
