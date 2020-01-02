/**
 * helper to get the origin of the next deployment
 * read either from the req header, or from the window
 */

import React, { createContext, useContext } from "react";

const NextHostGetterContext = createContext({
  host: ""
});

export const NextHostGetterProvider = ({ children, host }) => {
  return (
    <NextHostGetterContext.Provider value={{ host }}>
      {children}
    </NextHostGetterContext.Provider>
  );
};

export const useHost = () => useContext(NextHostGetterContext).host;

const getOrigin = host =>
  host.startsWith("localhost") ? `http://${host}` : `https://${host}`;

const extractHost = ctx =>
  (ctx.req && ctx.req.headers.host) ||
  (typeof location !== "undefined" && location.host) ||
  "";

export const extractOrigin = ctx => getOrigin(extractHost(ctx));

export const useOrigin = () => {
  const host = useHost();
  return getOrigin(host);
};

export const getInitialProps = ctx => ({
  host: extractHost(ctx)
});
