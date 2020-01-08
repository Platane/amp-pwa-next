# amp pwa next

![homepage screenshot](https://github.com/Platane/amp-pwa-next/raw/master/doc/screenshots/homepage.gif)

![type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)
![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/platane/amp-pwa-next/test?label=test&style=flat-square)](https://github.com/Platane/amp-pwa-next/actions?query=workflow%3Atest)

> A simple movie list app featuring amp pages embedded in pwa and nice page transitions, deployed with nextjs

Featuring:

- ⚡ [valid](https://search.google.com/test/amp?id=w2Iw9XsyWt7Kx2S9GRkHAA) amp pages
- ⛵ navigate seamlessly across amp and non-amp pages
- 🧚‍ page transition
- 🍿 data from [The Movie DataBase](https://www.themoviedb.org/)
- 🚀 pretty decent [lighthouse score](https://www.webpagetest.org/result/200107_PW_65234e7ca797537e474ba6d595a53dd0)

# Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Background](#background)
  - [Motivation](#Motivation)
  - [Pros - Cons](#pros-cons)
  - [State of the Art](#state-of-the-art)
- [Features](#features)
  - [Simple Nextjs app](#simple-nextjs-app)
  - [Dynamic pages](#dynamic-pages)
  - [Cache control with Service worker](#cache-control-with-service-worker)
  - [PWA shell](#pwa-shell)
  - [Favorite list](#favorite-list)
  - [Page transition](#page-transition)
- [License](#license)

# Install

`yarn install`

# Usage

`yarn dev`

Which will run next in dev mode

You might want to have the `TMDB_API_KEY` available as env var

# Background

## Motivation

The standard approach to amp is to duplicate every pages: one regular react app, and one amp on a different url.

> nextjs offer this feature, with hybrid amp pages. serving amp on xx?amp=1 url

- For one, this requires to painfully **maintain react component to mimic amp ones**. It restrain developers to use the most advanced cool amp component, such as amp-story.

  Using **"Shadow AMP"** allows us to focus on amp components.

- Secondly, having **two url for the same page** (amp and non-amp) is confusing for the user.

  Placing the **responsibility to redirect on the service worker** allows to have one single url (as seen by the browser ) serving both amp at first, and pwa-shell once the app is installed.

## Pros - Cons

TL;DR

**Pros**

- no need to maintain both amp and non amp version of components
- unique url for amp and non amp version of one page

**Cons**

- sending full html pages as data (could impact network perf)

## State of the Art

- "Use AMP as a data source for your PWA" [official amp doc](https://amp.dev/documentation/guides-and-tutorials/integrate/amp-in-pwa/?format=websites)
- "A sample React PWA with AMP content" [github.com/choumx/amp-pwa](https://github.com/choumx/amp-pwa)

# Features

Here is every features of the app broke down into steps.

## Simple Nextjs app

[code](https://github.com/Platane/amp-pwa-next/tree/v1-simple-nextjs-app) • [diff](https://github.com/Platane/amp-pwa-next/commit/6056f19e9ee8fd58a1dcf07d1900cd1ae738e5aa) • [demo](https://amp-pwa-next-pfjwcwg3g.now.sh)

We start with the simplest nextjs config. With just one static page /about

## Dynamic pages

[code](https://github.com/Platane/amp-pwa-next/tree/v2-dynamic-pages) • [demo](https://amp-pwa-next-h0i9ervqx.now.sh)

Let's add the dynamic pages, build from the tmdb api ([ref](https://github.com/Platane/amp-pwa-next/blob/v2-dynamic-pages/services/tmdb/getMovie.ts#L11-L16)).

**Caching**

The movie page will likely never change. We set a long term caching policy to avoid from re-building it ([ref](https://github.com/Platane/amp-pwa-next/blob/v2-dynamic-pages/now.json#L35-L41)).

The root page is a list of popular movies and will change. We set a life time of one day ([ref](https://github.com/Platane/amp-pwa-next/blob/v2-dynamic-pages/now.json#L28-L31)).

**amp-list**

We use amp-list to async fetch the latest popular movie on the movie page ([ref](https://github.com/Platane/amp-pwa-next/blob/v2-dynamic-pages/components/MovieList.tsx#L39-L51)).

On the root page, since the lists are above the fold, this technique is not recommended.

## Cache control with Service worker

[code](https://github.com/Platane/amp-pwa-next/tree/v3-cache-control-with-service-worker) • [diff](https://github.com/Platane/amp-pwa-next/commit/1733a33ce03f4a90874477929700caed35653a25) • [demo](https://amp-pwa-next-q2q0bct73.now.sh)

We add a service worker to handle the content caching.

- All the assets are pre-cached upon installation.

- The content ( amp pages, json api results ) are cached at runtime.

We use the workbox webpack plugin ([ref](https://github.com/Platane/amp-pwa-next/blob/v3-cache-control-with-service-worker/next.config.js#L11-L21)), + some tweaking to make it works with nextjs ([ref](https://github.com/Platane/amp-pwa-next/blob/v3-cache-control-with-service-worker/services/service-worker/sw.js#L37-L54)).

## PWA shell

[code](https://github.com/Platane/amp-pwa-next/tree/v4-pwa-shell) • [diff](https://github.com/Platane/amp-pwa-next/commit/b08a02e67ac499f518b21177cbf3e3288a5d85ea) • [demo](https://amp-pwa-next-hmuyhr0je.now.sh)

**shadow amp**

The amp page are embedded into a react component using `amp.attachShadowDoc` ([ref](https://github.com/Platane/amp-pwa-next/blob/v4-pwa-shell/components/AmpDocument.tsx)).

**redirecting**

When the service worker is ready, whenever the user navigate to an amp page, the pwa shell get served instead ([ref](https://github.com/Platane/amp-pwa-next/blob/v4-pwa-shell/services/service-worker/sw.js#L86-L107)).

It then reads the actual url and initiate the loading of the amp doc ([ref](https://github.com/Platane/amp-pwa-next/blob/v4-pwa-shell/pages/pwa-shell.tsx#L15)).

**routing**

In order to navigate from an amp page to another, the nextjs router is bypassed. The pwa shell page have it's own router ([ref](https://github.com/Platane/amp-pwa-next/blob/v4-pwa-shell/services/custom-router/index.tsx)). Which prevent from re-mounting the page unnecessarily.

## Favorite list

[code](https://github.com/Platane/amp-pwa-next/tree/v5-favourite-list) • [diff](https://github.com/Platane/amp-pwa-next/commit/d8c28863b3cb8a05c50e4572ca5518afbe0cf921) • [demo](https://amp-pwa-next-g3zwk9iwz.now.sh)

We decide to have a page with user content.

This page synchronize data from the user localstorage, it is not an amp page.

**amp-script**

We leverage amp-script to add a small widget on every movie to allows user to add / remove the movie to their favorite list ([ref](https://github.com/Platane/amp-pwa-next/blob/v5-favourite-list/public/assets/fav-button-script.js)).

amp-script allow us to

- declare a click handler to update the localstorage value, and change the button label accordingly
- read the localstorage value at mount, and change the button label accordingly

## Page transition

[code](https://github.com/Platane/amp-pwa-next/tree/v6-page-transition) • [diff](https://github.com/Platane/amp-pwa-next/commit/6056f19e9ee8fd58a1dcf07d1900cd1ae738e5aa) • [demo](https://amp-pwa-next-p6gszc4zg.now.sh)

We add page transition. When clicking a movie on the homepage, it animate the movie poster.

The flow is:

- intercept click event on the link ([ref](https://github.com/Platane/amp-pwa-next/blob/v6-page-transition/services/page-transition/usePageTransitionState.ts#L8-L46))
- animate a pending stance for instant feedback
- load and mount the next page ([ref](https://github.com/Platane/amp-pwa-next/blob/v6-page-transition/services/page-transition/usePageTransitionState.ts#L48-L74))
- animate to the next position of the poster ([ref](https://github.com/Platane/amp-pwa-next/blob/v6-page-transition/services/page-transition/PageTransitionProvider.tsx#L20-L61))

# License

[MIT](./LICENSE)
