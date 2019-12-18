import React from "react";
import App from "next/app";
import Head from "next/head";
import { MainLayout } from "../components/Layout/MainLayout";
import { NormalizeCss } from "../components/NormalizeCss";
import { CustomRouterProvider } from "../services/customRouter";
import { ServiceWorkerInstaller } from "../services/service-worker/ServiceWorkerInstaller";

//<ServiceWorkerInstaller />

export default class Application extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component } = this.props;

    return (
      <>
        <CustomRouterProvider>
          <MainLayout>
            <Component {...this.props.pageProps} />
          </MainLayout>
        </CustomRouterProvider>
      </>
    );
  }
}

// <NormalizeCss />
