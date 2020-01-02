import React, { useEffect } from "react";
import Head from "next/head";
import { useAmp } from "next/amp";

import { AmpInstallServiceworker } from "react-amphtml";

export const ServiceWorkerInstaller = () => {
  const amp = useAmp();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js");
      });
    }
  }, []);

  if (!amp) return null;

  return (
    <>
      <Head key="amp-container">
        <script
          key="amp-container"
          async
          custom-element="amp-install-serviceworker"
          src="https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js"
        />
        <script key="amp-core" src="https://cdn.ampproject.org/v0.js" />
      </Head>

      <AmpInstallServiceworker_ src="/sw.js" layout="nodisplay" />
    </>
  );
};

// trick to silent ts error on non standard type attribute
const AmpInstallServiceworker_ = AmpInstallServiceworker as any;
