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
  return host.startsWith("localhost") ? `http://${host}` : `https://${host}`;
};

export const getInitialProps = ctx => ({
  host: ctx.req && ctx.req.headers.host
});
