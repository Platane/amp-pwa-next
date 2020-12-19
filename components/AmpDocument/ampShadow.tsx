const load = () => {
  if (typeof window === "undefined") return Promise.reject();

  const script = document.createElement("script");
  script.src = "https://cdn.ampproject.org/shadow-v0.js";
  document.body.appendChild(script);

  return new Promise<AMP>((resolve) => {
    const win = window as any;

    if (win.AMP?.attachShadowDoc) resolve(win.AMP);
    else (win.AMP = win.AMP || []).push(() => resolve(win.AMP));
  });
};

let promise: ReturnType<typeof load>;
export const loadAmpShadow = () => (promise = promise || load());

export type ShadowDoc = {
  /*
   * the writer that can be used to stream the AMP document. Only available for attachShadowDocAsStream.
   */
  writer: any;
  /*
   * the URL used in the attachShadowDoc or attachShadowDocAsStream.
   */
  url: string;
  /*
   * the title of the AMP document.
   */
  title: string;
  /*
   * the canonical URL of the AMP document.
   */
  canonicalUrl: string;
  /*
   * the instance of the AMP document.
   */
  ampdoc: {
    /*
     * returns a promise when the AMP document has been fully rendered.
     */
    whenReady: () => Promise<void>;
  };
  /*
   * changes the visibility state of the AMP document.
   */
  setVisibilityState: (v: string) => void;
  /*
   * closes the AMP document, frees the resources, and returns a promise that resolves when cleanup is complete.
   */
  close: () => Promise<void>;
  /*
   * Get an amp-bind state from the AMP document using a JSON expression string, e.g. foo.bar
   */
  getState: (expr: any) => any;
  /*
   * Deep merge an object into the AMP document's global amp-bind state. state can be passed as either an Object or an expression string matching the syntax used by amp-bind in on="AMP.setState() attributes.
   */
  setState: (state: any) => void;
  // postMessage() and shadowDoc.onMessage() - can be used to message with the AMP document.
};

export type AMP = {
  attachShadowDoc: (
    hostElement: HTMLElement,
    fetchedDoc: Document,
    url: string,
    options?: {
      visibilityState: "prerender" | "visibile";
    }
  ) => ShadowDoc;
};
