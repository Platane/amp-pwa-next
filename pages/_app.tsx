import React from "react";
import App from "next/app";
import Head from "next/head";
import { MainLayout } from "../components/Layout/MainLayout";
import { CustomRouterProvider } from "../services/customRouter";
import { ServiceWorkerInstaller } from "../services/service-worker/ServiceWorkerInstaller";
import { PageTransitionProvider } from "../services/pageTransition";
// @ts-ignore
import { description, author, homepage } from "../package.json";
import {
  getInitialProps,
  NextHostGetterProvider
} from "../services/next-host-getter";

export default class Application extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps =
      Component.getInitialProps && (await Component.getInitialProps(ctx));

    return { pageProps, ...getInitialProps(ctx) };
  }

  render() {
    const { Component } = this.props;

    const title = "amp pwa next";
    const url = homepage;

    return (
      <>
        <Head>
          <title>amp pwa next</title>
          <meta property="og:type" content="website" />
          <meta property="og:url" content={url} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:email" content={author.email} />
          <meta name="description" content={description} />
          <meta name="author" content={author.name} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:author" content={(author as any).twitter} />

          <link rel="preconnect" href="https://cdn.ampproject.org" />
        </Head>

        <ServiceWorkerInstaller />
        <NextHostGetterProvider host={(this.props as any).host}>
          <PageTransitionProvider>
            <CustomRouterProvider>
              <MainLayout>
                <Component {...this.props.pageProps} />
              </MainLayout>
            </CustomRouterProvider>
          </PageTransitionProvider>
        </NextHostGetterProvider>
      </>
    );
  }
}
