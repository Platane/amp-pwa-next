/**
 * expose provider and hook to replace react/next with a custom router implementation
 * this is useful to workaround next page loading
 *
 * this way one page can take control of the routing
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo
} from "react";
import { useRouter as useNextRouter } from "next/router";
import { parse } from "url";
import { createBrowserHistory, createMemoryHistory } from "history";
import { isAmpPage } from "./isAmpPage";

const CustomRouterContext = createContext({
  pathname: "" as string | null,
  query: null as any,
  push: (href: string, as: string, o?: { shallow: boolean }) => {},
  replace: (href: string, as: string, o?: { shallow: boolean }) => {}
});

export const CustomRouterProvider = ({ initialUrl = "/", children }) => {
  const nextRouter = useNextRouter();
  const [url, setUrl] = useState(initialUrl);

  const history = useMemo(
    () =>
      typeof window === "undefined"
        ? createMemoryHistory()
        : createBrowserHistory(),
    []
  );

  useEffect(() => {
    const handler = () => {
      setUrl(
        history.location.pathname +
          history.location.search +
          history.location.hash
      );
    };

    return history.listen(handler);
  }, []);

  const navigate = (replace = false) => async (
    href: string,
    as: string,
    options
  ) => {
    const nextIsAmp = isAmpPage(parse(as).pathname);
    const currentIsShell = nextRouter.pathname === "/pwa-shell";

    if (nextIsAmp && currentIsShell) {
      history[replace ? "replace" : "push"](as);
      setUrl(as);
      return nextTic();
    }

    if (nextIsAmp && !currentIsShell) {
      await nextRouter.push("/pwa-shell");
      history.replace(as);
      setUrl(as);
      return nextTic();
    }

    if (!nextIsAmp) {
      setUrl(as);
      return nextRouter[replace ? "replace" : "push"](href, as, options);
    }
  };

  const { pathname, query } = parse(url);

  return (
    <CustomRouterContext.Provider
      value={{
        pathname,
        query,
        push: navigate(false),
        replace: navigate(true)
      }}
    >
      {children}
    </CustomRouterContext.Provider>
  );
};

export const useRouter = () => useContext(CustomRouterContext);

const nextTic = () => new Promise(resolve => setTimeout(resolve, 0));
