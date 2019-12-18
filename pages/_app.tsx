import React from "react";
import App from "next/app";
import Head from "next/head";
import { MainLayout } from "../components/Layout/MainLayout";
import { NormalizeCss } from "../components/NormalizeCss";
import { CustomRouterProvider } from "../services/customRouter";
import { ServiceWorkerInstaller } from "../services/service-worker/ServiceWorkerInstaller";

export default class Application extends App {
  render() {
    const { Component } = this.props;

    return (
      <>
        <ServiceWorkerInstaller />
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
