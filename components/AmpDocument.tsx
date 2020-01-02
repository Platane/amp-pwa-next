/**
 * load a whole amp document
 * leverage amp.attachShadowDoc ( see: https://amp.dev/documentation/guides-and-tutorials/integrate/amp-in-pwa )
 *
 * delegate navigation event to loop back into the internal router
 *
 */

import React, { useEffect, useRef } from "react";
import Head from "next/head";
import { fetchDocument } from "../services/fetchDocument";

export const AmpDocument = ({ src, onNavigate, ...props }) => {
  const refContainer = useRef(null as null | any);
  const ampedDoc = useRef(null as null | any);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = window.location.origin + src;

    let canceled = false;
    const req = fetchDocument(url);

    Promise.all([ampPromise, req])
      .then(([amp, doc]: any) => {
        if (canceled) return;

        // close the previous doc
        if (ampedDoc.current) ampedDoc.current.close();

        const container = refContainer.current;

        // empty the container
        while (container.children[0])
          container.removeChild(container.children[0]);

        const domDoc = document.createElement("div");
        container.appendChild(domDoc);

        // prune redundant ui elements
        for (const el of doc.querySelectorAll(".layout-static")) el.remove();

        // attach the new doc
        ampedDoc.current = amp.attachShadowDoc(domDoc, doc, url);

        // scroll back to  top
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      })
      .catch(err => {
        if (err.message === "Request aborted") return;
        throw err;
      });

    // avoid race condition, "cancel" the current execution
    return () => {
      req.abort();
      canceled = true;
    };
  }, [src, refContainer.current]);

  // bind event listener
  // using the onClick props doesn't work here, because the synthetic event does not includes properties related to shadow dom (.path)
  useEffect(() => {
    const container = refContainer.current;

    const handler = createClickHandler(onNavigate);

    container.addEventListener("click", handler);

    return () => container.removeEventListener("click", handler);
  }, [refContainer.current]);

  return (
    <>
      <Head>
        <script async src="https://cdn.ampproject.org/shadow-v0.js" />
      </Head>
      <div {...props} ref={refContainer} id="amp-document-container" />
    </>
  );
};

// will resolve when amp is ready
const ampPromise = new Promise((resolve, reject) => {
  if (typeof window === "undefined") return;

  // @ts-ignore
  (window.AMP = window.AMP || []).push(() => resolve(window.AMP));
});

// create a handler which determine if the click is an internal navigation
// if so prevent default and loop back to the internal router
const createClickHandler = (onNavigate: (url: string) => void) => event => {
  if (event.ctrlKey || event.shiftKey) return;

  if (event.defaultPrevented) return;

  const a = getAncestorLink(event.path ? event.path[0] : event.target);

  if (a && a.href) {
    const url = new URL(a.href);

    if (url.origin === window.location.origin) {
      event.preventDefault();

      onNavigate(url.pathname + url.search + url.hash);

      document.body.focus();
    }
  }
};

const getAncestorLink = (el: HTMLElement | null, container?: HTMLElement) => {
  if (!el || el === container) return;

  if (el.tagName === "A") return el;

  return getAncestorLink(el.parentElement, container);
};
