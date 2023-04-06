---
title: Bootstrap project with Spring Boot, Kotest, Testcontainers & MongoDB
author: jakubpradzynski
date: 2023-04-06 16:00:00 +0800
categories: [IT, Spring Framework]
tags: [it, spring framework, kotest, testcontainers, mongodb]
pin: false
toc: true
---

I use [Spring Initializr](https://start.spring.io/) to generate project structure and dependencies when I create a new project.
After that, I need to add some additional dependencies and configuration to make it work with [Kotest](https://kotest.io/) and [Testcontainers](https://www.testcontainers.org/).
I must also add some configuration to make it work with [MongoDB](https://www.mongodb.com/).

I created a project template with all dependencies and configuration needed to start working with Spring Boot, Kotest, Testcontainers & MongoDB.

# Project template

The project template is available on my [GitHub](https://github.com/jakubpradzynski/example-spring-kotest-testcontainers-mongodb-project/tree/main).

What is essential in the project:

- Dependencies in [build.gradle.kts](https://github.com/jakubpradzynski/example-spring-kotest-testcontainers-mongodb-project/blob/main/build.gradle.kts):

```kotlin
    implementation("org.springframework.boot:spring-boot-starter-data-mongodb")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.testcontainers:junit-jupiter")
    testImplementation("org.testcontainers:mongodb")
    testImplementation("io.kotest:kotest-runner-junit5-jvm:5.5.5")
    testImplementation("io.kotest:kotest-assertions-core-jvm:5.5.5")
    testImplementation("io.kotest.extensions:kotest-extensions-spring:1.1.2")
    testImplementation("io.kotest.extensions:kotest-extensions-testcontainers:1.3.4")
```

- [IntegrationSpec](https://github.com/jakubpradzynski/example-spring-kotest-testcontainers-mongodb-project/blob/main/src/test/kotlin/pl/jakubpradzynski/examplespringkotesttestcontainersmongodbproject/IntegrationSpec.kt) which is the base for all integration tests:

```kotlin
@SpringBootTest
@ActiveProfiles("integration")
@AutoConfigureMockMvc
@Testcontainers
abstract class IntegrationSpec(body: ShouldSpec.() -> Unit = {}) : ShouldSpec(body) {
    override fun extensions(): List<Extension> = listOf(SpringExtension)

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var mongoOperations: MongoOperations

    override suspend fun beforeEach(testCase: TestCase) {
        super.beforeEach(testCase)
        mongoOperations.collectionNames.forEach { mongoOperations.dropCollection(it) }
    }

    companion object {
        @Container
        @JvmField
        var container = MongoDBContainer(DockerImageName.parse("mongo:6"))

        init {
            container.start()
        }

        @DynamicPropertySource
        @JvmStatic
        fun mongoDbProperties(registry: DynamicPropertyRegistry) {
            registry.add("spring.data.mongodb.uri") { container.replicaSetUrl }
        }
    }
}
```

With such a configuration, you can start writing tests using MongoDB runnig in a Docker container and create the whole Spring context.
