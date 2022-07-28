---
title: Creating MongoDB case insensitive index in Spring based project
author: jakubpradzynski
date: 2022-07-28 23:45:00 +0800
categories: [IT, MongoDB]
tags: [it, mongodb, spring, index, compound index, case sensitiveness]
pin: false
toc: true
---

# Example problem to solve

One of the most popular class in our services is `User`.<br>
The user may enter his `nickname` during registration.<br>
Let's assume that our business requirement is:

- **user should be unique by his nickname**

# Solution in MongoDB - case insensitive index

If we use MongoDB, we can use unique index with appropriate option to achieve that requirement.

The appropriate option
is [collation](https://www.mongodb.com/docs/manual/reference/collation/#std-label-collation-document-fields) with
with set fields `locale` and `strength`.

Supported values for this fields you can find here:

- [locale](https://www.mongodb.com/docs/manual/reference/collation-locales-defaults/#std-label-collation-languages-locales)
- [strength](https://www.mongodb.com/docs/manual/reference/collation/#collation-document:~:text=%22simple%22.-,strength,-integer)

For this article let's assume that we want to focus on language English (United States) so we will use `en_US` value
for `locale`.

For `strength` we should use values `1` or `2` because this levels means that values comparison will ignore case.

So, our solution directly on MongoDB will look like:

```
db.users.createIndex( { nickname: 1}, { unique: true, collation: { locale: 'en_US', strength: 1 } } )
```

# How to create case insensitive index in MongoDB using Spring Framework?

Usually for creating indexes we can use annotations:

- [@Indexed](https://docs.spring.io/spring-data/mongodb/docs/current/api/org/springframework/data/mongodb/core/index/Indexed.html)
  on field
- [@CompoundIndex](https://docs.spring.io/spring-data/mongodb/docs/current/api/org/springframework/data/mongodb/core/index/CompoundIndex.html)
  on class

They have option for uniqueness to set but not for collation.

Fortunately, such option is available if we create index directly via `MongoTemplate`.
So, with such simple code we can meet the requirement.

```kotlin
@Configuration
@DependsOn("mongoTemplate")
class CollectionConfig(@Autowired private val mongoTemplate: MongoTemplate) {

  @PostConstruct
  fun ensureIndexes() {
    mongoTemplate.indexOps(User::class.java).ensureIndex(
      Index("username", Sort.Direction.ASC)
        .unique()
        .collation(
          of(Locale.US).strength(ComparisonLevel.primary())
        )
    )
  }

}
```

## Issue in `spring-boot-mongodb` project

I've created [issue](https://github.com/spring-projects/spring-data-mongodb/issues/4130) to add parameters in `@Indexed` and `@CompoundIndex` annotations for setting `collation` value.
You can watch this issue if you are interested in what will happen next.

# Sources

- [Case Insensitive Index](https://www.mongodb.com/docs/manual/core/index-case-insensitive/) in MongoDB documentation.
- [Question](https://stackoverflow.com/questions/45590749/compoundindex-spring-case-insensitive/60944702#60944702) on
  StackOverflow with mine answer as well.
