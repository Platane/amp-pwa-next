import { useEffect } from "react";
import { useRouter } from "next/router";
import { getAbsoluteBoundingBox, Box } from "./getAbsoluteBoundingBox";

export const usePageTransition = () => {
  const router = useRouter();

  useEffect(() => {
    let clicked: { id: string; img: HTMLImageElement; box: Box } | null = null;
    let currentUrl = router.asPath;

    const floatingImage = new Image();
    floatingImage.style.display = "none";
    floatingImage.style.position = "absolute";
    floatingImage.style.transform = "rotate(0deg)";
    floatingImage.style.transition =
      "top 180ms ease-out, left 180ms ease-out, height 180ms ease-out, width 180ms ease-out, transform 180ms ease-out";

    document.body.appendChild(floatingImage);

    let onTransitionEnd = () => undefined as void;

    const onStart = (url: string) => {
      if (currentUrl === url) clicked = null;
      currentUrl = url;

      floatingImage.removeEventListener("transitionend", onTransitionEnd);
      floatingImage.style.display = "none";

      if (clicked) {
        const { img, box } = clicked;
        floatingImage.src = img.src;
        floatingImage.style.display = "block";
        floatingImage.style.opacity = "0.01";
        floatingImage.style.transform = "rotate(0deg)";
        setPosition(floatingImage, box);

        floatingImage.addEventListener(
          "load",
          () => {
            img.style.opacity = "0.01";
            floatingImage.style.opacity = "1";

            // force reflow
            floatingImage.offsetLeft;

            floatingImage.style.transition = "transform 300ms ease-out";
            floatingImage.style.transform = "rotate(16deg) scale(0.8)";
          },
          { once: true }
        );
      }
    };
    const onComplete = (url: string) => {
      if (!clicked) return;
      const img = getImage(
        documentsQuerySelector(`[data-image-link-id="${clicked.id}"]`)
      );

      if (!img) return;

      img.style.opacity = "0.01";

      floatingImage.src = clicked.img.src;
      setPosition(floatingImage, clicked.box);

      // this force a reflow
      const box = getAbsoluteBoundingBox(img);

      setPosition(floatingImage, box);
      floatingImage.style.transform = "rotate(0deg)";
      floatingImage.style.transition =
        "top 180ms ease-out, left 180ms ease-out, height 180ms ease-out, width 180ms ease-out, transform 180ms ease-out";

      clicked = null;

      floatingImage.addEventListener(
        "transitionend",
        (onTransitionEnd = () => {
          floatingImage.style.display = "none";
          img.style.opacity = "1";
        }),
        { once: true }
      );
    };

    const onRouteChangeStart = (url: string) => {
      if (url !== "/app-shell") onStart(url);
    };
    const onRouteChangeComplete = (url: string) => {
      if (url !== "/app-shell") onComplete(url);
    };

    const onClick = (event: any) => {
      const target = event.path ? event.path[0] : event.target;
      const element = getAncestorLink(target)?.querySelector(
        "[data-image-link-id]"
      );

      const id = element?.getAttribute("data-image-link-id");
      const img = getImage(element as any);

      if (id && img) clicked = { id, img, box: getAbsoluteBoundingBox(img) };
      else clicked = null;
    };

    window.addEventListener("click", onClick, { capture: true });

    router.events.on("routeChangeStart", onRouteChangeStart);
    router.events.on("routeChangeComplete", onRouteChangeComplete);
    router.events.on("shell-routeChangeStart", onStart);
    router.events.on("shell-routeChangeComplete", onComplete);

    return () => {
      document.body.removeChild(floatingImage);

      window.removeEventListener("click", onClick, { capture: true });

      router.events.off("routeChangeStart", onRouteChangeStart);
      router.events.off("routeChangeComplete", onRouteChangeComplete);
      router.events.off("shell-routeChangeStart", onStart);
      router.events.off("shell-routeChangeComplete", onComplete);
    };
  }, [router.events]);
};

export const PageTransition = () => {
  usePageTransition();
  return null;
};

const setPosition = (element: HTMLElement, { x, y, width, height }: Box) => {
  element.style.top = y + "px";
  element.style.left = x + "px";
  element.style.width = width + "px";
  element.style.height = height + "px";
  element.style.display = "block";
};

const getImage = (element: HTMLElement | null) =>
  element?.tagName === "IMG"
    ? (element as HTMLImageElement)
    : element?.querySelector("img");

// const getMovieBox = () => {
//   const x = 0;
//   const y = document.querySelector("header")?.offsetHeight ?? 0;
//   const width = Math.min(500, window.innerWidth);
//   const height = (width / 500) * 750;

//   return { x, y, width, height };
// };

const documentsQuerySelector = (query: string) => {
  const shadowRoots = Array.from(document.getElementsByTagName("*"))
    .map((el) => el.shadowRoot)
    .filter(Boolean) as ShadowRoot[];

  const documents = [document, ...shadowRoots];

  return documents.reduce(
    (el, doc) => el || doc.querySelector(query),
    null as null | HTMLElement
  );
};

const getAncestorLink = (
  el: HTMLElement | null,
  container?: HTMLElement
): HTMLAnchorElement | undefined => {
  if (!el || el === container) return;

  if (el.tagName === "A") return el as HTMLAnchorElement;

  return getAncestorLink(el.parentElement, container);
};
