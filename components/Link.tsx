/**
 * this custom link component is pretty much a copy/ paste from next/router
 * execpt that it takes any router returned from useRouter
 * which allows to swap the next router for a custom one
 */

import React, { Children } from "react";
import { useRouter } from "../services/customRouter";
import { resolve, parse } from "url";

export const Link = ({ href, as = href, children, ...props }) => {
  const router = useRouter();

  // the following chunk of code is lifted from next/router

  const child: any = Children.only(children);

  props.onClick = async e => {
    if (child.props && typeof child.props.onClick === "function") {
      child.props.onClick(e);
    }

    if (!e.defaultPrevented) {
      const { nodeName, target } = e.currentTarget;
      if (
        nodeName === "A" &&
        ((target && target !== "_self") ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          (e.nativeEvent && e.nativeEvent.which === 2))
      ) {
        // ignore click for new tab / new window behavior
        return;
      }

      if (!isLocal(href)) {
        // ignore click if it's outside our scope (e.g. https://google.com)
        return;
      }

      const { pathname } = window.location;
      href = resolve(pathname, href);
      as = resolve(pathname, as);

      e.preventDefault();

      //  avoid scroll for urls with anchor refs
      let { scroll } = props;
      if (scroll == null) {
        scroll = as.indexOf("#") < 0;
      }

      // replace state instead of push if prop is present
      await router[props.replace ? "replace" : "push"](href, as, {
        shallow: props.shallow
      });

      if (scroll) {
        window.scrollTo(0, 0);
        document.body.focus();
      }
    }
  };

  if (props.passHref || (child.type === "a" && !("href" in child.props))) {
    props.href = as || href;
  }

  return React.cloneElement(child, props);
};

const isLocal = (href: string) => {
  const url = parse(href, false, true);

  return (
    !url.host ||
    (url.protocol === window.location.protocol &&
      url.host === window.location.host)
  );
};
