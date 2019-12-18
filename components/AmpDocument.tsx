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
        doc.querySelector(".mainlayout-topbar").remove();

        // attach the new doc
        ampedDoc.current = amp.attachShadowDoc(domDoc, doc, url);
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
  }, [src]);

  // bind event listener
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
      <div ref={refContainer} />
    </>
  );
};

const ampPromise = new Promise((resolve, reject) => {
  if (typeof window === "undefined") return;

  // @ts-ignore
  (window.AMP = window.AMP || []).push(() => resolve(window.AMP));
});

const createClickHandler = onNavigate => (
  event: MouseEvent & { path?: any }
) => {
  if (event.ctrlKey || event.shiftKey) return;

  if (event.defaultPrevented) return;

  const path = event.path || getAncestors(event.target);

  const i = path.findIndex(el => el === event.currentTarget);

  const a = path.slice(0, i).find(el => el.tagName === "A");

  if (a && a.href) {
    const url = new URL(a.href);
    if (url.origin === window.location.origin) {
      event.preventDefault();

      const u = url.pathname + url.search + url.hash;

      onNavigate(u);
    }
  }
};

const getAncestors = e => (!e ? [] : [e, ...getAncestors(e.parentNode)]);
