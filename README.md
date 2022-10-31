# Jakub Prądzyński's blog

## Source
The project has been generated using [chirpy-starter](https://github.com/cotes2020/chirpy-starter).

[Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) is theme for [Jekyll](https://jekyllrb.com/) projects.

## How to develop locally?

Install dependencies using:
```shell
bundle
```

Then run the following command:
```shell
bundle exec jekyll s
```

or to run in Docker:
```shell
docker run -it --rm \
    --volume="$PWD:/srv/jekyll" \
    -p 4000:4000 jekyll/jekyll \
    jekyll serve
```

## How to add a new post?

Create new file in `_posts` folder with patter: `YEAR-MONTH-DAY-title-of-post.md`

At the begging add:
```markdown
---
title: Example title (no markdown format)
author: jakubpradzynski
date: 2022-10-03 22:00:00 +0800
categories: [IT, MongoDB]
tags: [it, mongodb, spring data]
pin: false
toc: true
---
```

After `---` you can add anything you want in markdown format.

## Documentations

- [Jekyll](https://jekyllrb.com/docs/)
- [Chirpy](https://chirpy.cotes.page/)
- [Chirpy-starter](https://github.com/cotes2020/chirpy-starter)
