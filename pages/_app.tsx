import React from "react";
import App from "next/app";
import Head from "next/head";
import { MainLayout } from "../components/Layout/MainLayout";
// @ts-ignore
import { description, author, homepage as url } from "../package.json";
import {
  getInitialProps,
  NextHostGetterProvider
} from "../services/next-host-getter";
import { ServiceWorkerInstaller } from "../services/service-worker/ServiceWorkerInstaller";

export default class Application extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps =
      Component.getInitialProps && (await Component.getInitialProps(ctx));

    return { pageProps, ...getInitialProps(ctx) };
  }

  render() {
    const { Component } = this.props;

    const title = "amp pwa next";

    return (
      <>
        <Head>
          <title>amp pwa next</title>
          <meta property="og:type" content="website" />
          <meta property="og:url" content={url} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:email" content={author.email} />
          <meta property="og:image" content="/assets/img/icon-192x192.png" />
          <meta property="og:image:width" content="192" />
          <meta property="og:image:height" content="192" />
          <meta name="description" content={description} />
          <meta name="author" content={author.name} />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:creator" content={(author as any).twitter} />

          <link rel="manifest" href="/manifest.json" />

          {[16, 32, 96, 144, 192, 512].map(s => (
            <link
              key={s}
              rel="icon"
              type="image/png"
              sizes={`${s}x${s}`}
              href={`/assets/img/icon-${s}x${s}.png`}
            />
          ))}
          <link rel="apple-touch-icon" href="/assets/img/icon-192x192.png" />
          <meta name="theme-color" content="#ffffff" />

          <link rel="preconnect" href="https://image.tmdb.org" />
        </Head>

        <ServiceWorkerInstaller />

        <NextHostGetterProvider host={(this.props as any).host}>
          <MainLayout>
            <Component {...this.props.pageProps} />
          </MainLayout>
        </NextHostGetterProvider>
      </>
    );
  }
}
