/**
 * load a whole amp document
 * leverage amp.attachShadowDoc ( see: https://amp.dev/documentation/guides-and-tutorials/integrate/amp-in-pwa )
 *
 * delegate navigation event to loop back into the internal router
 *
 */

import React, { useEffect, useRef, useState } from "react";
import { fetchDocument } from "./fetchDocument";
import { useNavigationIntercept } from "./useNavigationIntercept";
import { loadAmpShadow, ShadowDoc } from "./ampShadow";

type Props = {
  pageUrl: string;
  preserve?: boolean;
  scroll?: boolean;
  onNavigate?: (href: string) => void;
  onReady?: () => void;
};
export const AmpDocument = ({
  pageUrl,
  onReady,
  onNavigate,
  preserve = false,
  scroll = false,
}: Props) => {
  const refContainer = useRef<HTMLDivElement>();
  const [error, setError] = useState<Error>();

  const pageFullUrl = new URL(
    pageUrl,
    typeof window === "undefined" ? "http://a" : window.location.origin
  ).toString();

  useNavigationIntercept(refContainer, onNavigate);

  const options = useRef({ scroll, preserve, onReady });
  Object.assign(options.current, { scroll, preserve, onReady });

  const shadowDoc = useRef<ShadowDoc | null>(null);

  // clean up on unmount
  useEffect(() => () => void shadowDoc.current?.close?.(), []);

  useEffect(() => {
    let canceled = false;

    const req = fetchDocument(pageFullUrl);

    Promise.all([
      loadAmpShadow(),
      req,
      !options.current.preserve
        ? shadowDoc.current?.close?.()?.then(() => {
            shadowDoc.current = null;
            emptyDomElement(refContainer.current);
          })
        : null,
    ])
      .then(async ([amp, doc]) => {
        if (canceled) return;

        const container = refContainer.current!;

        // clean up
        await shadowDoc.current?.close?.().then(() => {
          shadowDoc.current = null;
          emptyDomElement(container);
        });

        if (canceled) return;

        // container, for some reason attaching the doc to the container itself leads to errors
        const wrapper = document.createElement("div");
        container.appendChild(wrapper);

        // prune redundant ui elements
        doc.querySelectorAll(".layout-static").forEach((el) => el.remove());

        // attach the new doc
        shadowDoc.current = amp.attachShadowDoc(wrapper, doc, pageFullUrl);

        // wait for the document to be ready
        await shadowDoc.current.ampdoc.whenReady();

        if (canceled) return;

        options.current?.onReady?.();

        if (options.current.scroll)
          // scroll back to  top
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      })
      .catch((err) => {
        if (err.message === "Request aborted") return;
        setError(err);
      });

    return () => {
      req.abort();
      canceled = true;
    };
  }, [pageFullUrl]);

  if (error) throw error;

  return <div ref={refContainer as any} id="amp-document-container" />;
};

const emptyDomElement = (container?: HTMLElement) => {
  while (container?.children?.[0]) container.removeChild(container.children[0]);
};
