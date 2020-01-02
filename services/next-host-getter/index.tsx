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

export const useOrigin = () => {
  const host = useHost();
  return getOrigin(host);
};

const getOrigin = host =>
  host.startsWith("localhost") ? `http://${host}` : `https://${host}`;

export const extractHost = ctx =>
  (ctx.req && ctx.req.headers.host) ||
  (typeof location !== "undefined" && location.host) ||
  "";

export const extractOrigin = ctx => getOrigin(extractHost(ctx));

export const getInitialProps = ctx => ({
  host: extractHost(ctx)
});
