---
title: Using declarative HTTP client in Spring Shell project with Kotlin
author: jakubpradzynski
date: 2023-02-03 14:00:00 +0800
categories: [IT, Spring Framework]
tags: [it, spring shell, declarative http client, kotlin]
pin: false
toc: true
---

# Introduction

Since January 25, 2023, we got [new version of Spring Shell](https://spring.io/blog/2023/01/25/spring-shell-2-1-6-and-3-0-0-are-now-available) -
3.0.0.

This [release](https://github.com/spring-projects/spring-shell/releases) uses Spring Boot 3.0.2. Hence, Spring 6. Hence, we can use [declarative HTTP
client](https://www.youtube.com/watch?v=A1V71peRNn0).

# Project setup

You can generate a new Spring Shell project using [start.spring.io](https://start.spring.io/).

It does not matter how you create a project.
It is essential to have declared dependencies:

```kotlin
    implementation("org.springframework.shell:spring-shell-starter") // version above 3.0.0
    implementation("org.springframework.boot:spring-boot-starter-webflux") // version above 3.0.2
```

# Creating a sample declarative HTTP client

For example, we create an HTTP client for GitHub to fetch a list of repositories.

```kotlin
@HttpExchange(url = "https://api.github.com")
internal interface GithubClient {
    @GetExchange("/users/{username}/repos")
    fun getUserRepos(
        @PathVariable username: String,
        @RequestParam page: Int = 1,
        @RequestParam per_page: Int = 100,
        @RequestHeader("Authorization") token: String,
        @RequestHeader("Accept") accept: String = "application/vnd.github+json",
        @RequestHeader("X-GitHub-Api-Version") githubApiVersion: String = "2022-11-28",
    ): List<Repo>
}

data class Repo(val id: String, val name: String)
```

As you can see, Spring 6 allows us to create an interface with a declaration of requests we want to send.
We can define essential things for an HTTP request, such as URL, path, path variables, query params, and headers.

If you are interested in this topic, I encourage you to watch the video: [🚀 New in Spring Framework 6: HTTP Interfaces](https://www.youtube.com/watch?v=A1V71peRNn0).

Now, we have to create a bean from that interface.

```kotlin
@Configuration
internal class GithubClientConfig {

    @Bean(name = ["githubWebClient"])
    fun webClient(): WebClient = WebClient.builder()
      .exchangeStrategies(exchangeStrategies())
      .build()

    @Bean
    fun githubClient(@Qualifier("githubWebClient") webClient: WebClient): GithubClient = HttpServiceProxyFactory
            .builder(WebClientAdapter.forClient(webClient))
            .build()
            .createClient(GithubClient::class.java)

    private fun exchangeStrategies(): ExchangeStrategies {
        val objectMapper = ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
            .registerModule(KotlinModule.Builder().build())
        return ExchangeStrategies
            .builder()
            .codecs { configurer: ClientCodecConfigurer ->
                configurer.defaultCodecs().jackson2JsonEncoder(Jackson2JsonEncoder(objectMapper))
                configurer.defaultCodecs().jackson2JsonDecoder(Jackson2JsonDecoder(objectMapper))
            }.build()
    }
}
```

For declarative HTTP clients, it is essential to use `HttpServiceProxyFactory` with `WebClient` to create a new instance of `GithubClient`.

`ExchangeStrategies` are to support Kotlin to JSON conversion.

We must remember that WebFlux project is quite big and has some requirements.
For example, we will see log `Netty started on port 8080 after starting the shell.

I may limit the required dependency for declarative HTTP clients in the future.


# Create a sample Shell Command

Now, we can create a command in our project:
```kotlin
@ShellComponent
internal class GithubSampleCommand(private val githubClient: GithubClient) {

    @ShellMethod
    fun userRepos(username: String): List<Repo> = githubClient.getUserRepos(
        username = username,
        token = "Bearer {your_github_token}"
    )
}
```

And that's all.

We can run our project. Using `help` command in shell we can see the following:
```
...

Github Sample Command
       user-repos:
```

And after running the command `user-repos --username jakubpradzynski`, we will see the output:
```
[Repo(id=226322355, name=advent-of-code-2019), Repo(id=139764856, name=azariah), Repo(id=124221129, name=crispus), Repo(id=192063330, name=digits-predictor), Repo(id=377232244, name=fake-news-predictor), Repo(id=238491138, name=google_tasks_cli), Repo(id=242139319, name=google_translate_cli), Repo(id=515534896, name=jakubpradzynski.github.io), Repo(id=545125921, name=jvm-bloggers), Repo(id=549828075, name=mongodb-spring-kurs-dla-poczatkujacych), Repo(id=461206656, name=valuable-study-materials-it)]
```

If you want to know more about Spring Shell, I recommend reading [documentation](https://docs.spring.io/spring-shell/docs/3.0.0/docs/index.html#what-is-spring-shell).

# What's next?

I've been testing Spring Shell recently.
When I saw that it supports Spring 6 it seemed interesting to me.

I will probably use more of it and describe it in future posts.
Stay tuned.
