import React from "react";
import App from "next/app";
import Head from "next/head";
import { MainLayout } from "../components/Layout/MainLayout";
import { CustomRouterProvider } from "../services/customRouter";
import { ServiceWorkerInstaller } from "../services/service-worker/ServiceWorkerInstaller";
import { PageTransitionProvider } from "../services/pageTransition";

export default class Application extends App {
  render() {
    const { Component } = this.props;

    const title = "amp pwa next";
    const url = "https://amp-pwa-next.platane0.now.sh";
    const description = "Tech demo showcasing amp in pwa with next.js";

    return (
      <>
        <Head>
          <title>amp pwa next</title>
          <meta property="og:type" content="website" />
          <meta property="og:url" content={url} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta name="description" content={description} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
        </Head>

        <ServiceWorkerInstaller />
        <PageTransitionProvider>
          <CustomRouterProvider>
            <MainLayout>
              <Component {...this.props.pageProps} />
            </MainLayout>
          </CustomRouterProvider>
        </PageTransitionProvider>
      </>
    );
  }
}
