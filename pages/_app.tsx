import React from "react";
import App from "next/app";
import Head from "next/head";
import { MainLayout } from "../components/Layout/MainLayout";
import { Provider as CustomRouterProvider } from "../services/custom-router";
import { ServiceWorkerInstaller } from "../services/service-worker/ServiceWorkerInstaller";
import { PageTransition } from "../services/page-transition";

export default class Application extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <link rel="preconnect" href="https://image.tmdb.org" />
        </Head>

        <CustomRouterProvider>
          <PageTransition />

          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </CustomRouterProvider>

        {!false && <ServiceWorkerInstaller />}
      </>
    );
  }
}
