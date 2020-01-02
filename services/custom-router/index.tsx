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

/**
 * expose the same api as nextjs useRouter
 */
export const useRouter = () => useContext(CustomRouterContext);

const CustomRouterContext = createContext({
  pathname: "" as string | null,
  query: null as any,
  push: (href: string, as: string, o?: { shallow: boolean }) => {},
  replace: (href: string, as: string, o?: { shallow: boolean }) => {}
});

export const CustomRouterProvider = ({ initialUrl = "/", children }) => {
  const nextRouter = useNextRouter();
  const [url, setUrl] = useState(initialUrl);

  // instanciate the history
  const history = useMemo(
    () =>
      typeof window === "undefined"
        ? createMemoryHistory()
        : createBrowserHistory(),
    []
  );

  // at mount, initialize the url to the current
  // and listen to history change (with back / forth button)
  useEffect(() => {
    const handler = () => {
      setUrl(
        history.location.pathname +
          history.location.search +
          history.location.hash
      );
    };

    handler();

    return history.listen(handler);
  }, []);

  // navigate function
  // either set the history, or delegate to nextjs router
  // depending on whever the current and next page are amp (and therefor should be mounted in the pwa shell) or not
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

const nextTic = () => new Promise(resolve => setTimeout(resolve, 0));
