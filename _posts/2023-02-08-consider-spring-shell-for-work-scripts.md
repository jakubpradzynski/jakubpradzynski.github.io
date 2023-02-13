---
title: Do you write scripts? Consider using Spring Shell for it!
author: jakubpradzynski
date: 2023-02-08 15:00:00 +0800
categories: [IT, Spring Framework]
tags: [it, spring shell]
pin: false
toc: true
---

# Introduction

Are you one of those who prefer to spend 5 hours writing a script for something that takes 10 minutes?
Me too!

Sometimes, when I want to write a new script, I decide to do this in a new language, e.g., [GO](https://go.dev/).

Most of the time, it is enjoyable and educational but also very ineffective.

A few weeks ago, I found a post about [Spring Shell](https://docs.spring.io/spring-shell/docs/3.0.0/docs/index.html#what-is-spring-shell) supporting
Spring Boot 3.
Previously, I didn't use [Spring Shell](https://docs.spring.io/spring-shell/docs/3.0.0/docs/index.html#what-is-spring-shell), so it seemed interesting
to me.
I decided to test it a little and consider using it daily. And I think you should do this too 😉

You can prepare your own shell with defined commands to execute many times thanks to Spring Shell.
You can run it directly from the command line in non-interactive or interactive mode.
When you collect many scripts that help you work daily, you can have opened shell in your terminal to run some steps quickly.

# Pros of using [Spring Shell](https://docs.spring.io/spring-shell/docs/3.0.0/docs/index.html#what-is-spring-shell)

## The same technology stack as in everyday work

If you work with:

- JVM languages (e.g., Java, Kotlin)
- Spring Framework

You can write scripts in the same stack daily.
For example, you can use Spring Data to connect to a database.

You have access to everything that Spring offers. Also, you can generate new Spring Shell projects just by
using [start.spring.io](https://start.spring.io).

## Testing scripts or even TDD

How often do you write tests for your scripts? I thought so.

When you use generated Spring Shell project, you have prepared the infrastructure for tests.

You can either code something and write a test or even use TDD for it.

## Script should be in service - easy to migrate

Do you write scripts at work? For example, when you have to prepare some data for testing in many microservices?
Or do some technical stuff, but automatically.

When you work in Spring Framework and decide that script or part of it should be in the service repository, you can copy and reuse it.

## Declarative HTTP client from Spring 6

In previous [post](https://jakubpradzynski.pl/posts/spring-shell-with-declarative-http-client-in-kotlin/) I describe how use Spring Shell with
declarative HTTP client available since Spring 6.

It makes sending HTTP requests from such a shell script very easy.

## Extended scripts with [Flow](https://docs.spring.io/spring-shell/docs/3.0.0/docs/index.html#using-shell-components-flow)

Do you want to write a script that allows doing something step by step, collecting another user input?

Spring Shell allows creation [flow](https://docs.spring.io/spring-shell/docs/3.0.0/docs/index.html#using-shell-components-flow) easily.

Thanks to that, you will have a script that executes the next step after the following user input.

# Summary

Of course, there are some cons of using Spring Shell.

For example, it's a whole shell, not a single script. It's Spring Framework. It may be extensive.

Also, there may be better choices when most of your scripts use bash commands.
Maybe instead of that, you should look at [zx](https://github.com/google/zx).

I don't try to convince you that Spring Shell is the best choice. It may not.

I want to show you some pros, so you can decide if it will be a handful in your work.

I will try Spring Shell more and see how it will work after a few months.
