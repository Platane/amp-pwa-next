import React, { useState, useEffect } from "react";
import { NextRouter, useRouter as useNextRouter } from "next/router";
import { RouterContext } from "next/dist/next-server/lib/router-context";
import { isAmpPage } from "./isAmpPage";
import { history } from "./history";

const shellRoute = "/app-shell";

/**
 * change the router in the context
 * when navigating to amp pages, change the nextRouter route to the app shell
 *
 */
export const Provider = ({ children }: { children: any }) => {
  const [shellRouter, setShellRouter] = useState({
    href: history.getHref(),
    pop: false,
  });

  const nextRouter = useNextRouter();

  // handle state pop
  useEffect(() => {
    const onChange = async () => {
      const href = history.getHref();

      if (!isAmpPage(href)) nextRouter.replace(href);
      else {
        if (nextRouter.pathname !== shellRoute) {
          await nextRouter.replace(shellRoute, undefined, { shallow: true });
          history.replace(href);
        }
        setShellRouter({ href, pop: true });
      }
    };

    window.addEventListener("popstate", onChange);

    return () => window.removeEventListener("popstate", onChange);
  }, [nextRouter.pathname]);

  // modify router object
  const value: NextRouter = { ...nextRouter };

  // overwrite push and replace method
  for (const m of ["push", "replace"] as const) {
    value[m] = async (url, as, options) => {
      // parse url
      const { pathname, search, hash } =
        typeof url === "string" ? new URL(url, window.location.origin) : url;
      const href = pathname! + search! + hash!;

      if (!isAmpPage(pathname!)) {
        return await nextRouter[m](href, as, options);
      } else {
        if (nextRouter.route !== shellRoute) {
          // redirect the nextRouter to the shell
          // ensure that the history url stays the same so it gets put in the stack on push
          const currentHref = nextRouter.asPath;
          await nextRouter.replace(shellRoute, undefined, { shallow: true });
          history.replace(currentHref);
        }

        nextRouter.events.emit("shell-routeChangeStart", href);
        history[m](href);
        setShellRouter({ href, pop: false });

        return true;
      }
    };
  }

  // overwrite pathname / asPath / query if the route is the app shell
  if (value.route === shellRoute) {
    const { pathname, searchParams } = new URL(shellRouter.href, "http://a");

    value.pathname = pathname;
    value.asPath = shellRouter.href;
    value.query = Object.fromEntries((searchParams as any).entries());
    (value as any).pop = shellRouter.pop;
  }

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  );
};
