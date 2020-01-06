import { useEffect, useReducer } from "react";
import { getAbsoluteBoundingBox } from "./getAbsoluteBoundingBox";
import { reduce } from "./reduce";

export const usePageTransitionState = () => {
  const [state, dispatch] = useReducer(reduce, { status: "idle" });

  /**
   * attach click handler to intercept navigation event
   */
  useEffect(() => {
    const onClick = (event: MouseEvent | any) => {
      // check for navigation event
      // look for valid a tag
      const a = getAncestorLink(event.path ? event.path[0] : event.target);
      if (!a || !a.href || a.href === window.location.href) return;

      // check if the link have an image to use as transition
      const el = a.querySelector("[data-image-link-id]");

      const img =
        el && ((el.tagName === "IMG" && el) || el.querySelector("img"));

      if (img) {
        dispatch({
          type: "navigation-started",
          id: el.getAttribute("data-image-link-id"),
          box: getAbsoluteBoundingBox(img),
          element: img,
          imageUrl: img.getAttribute("src")
        });
      } else {
        dispatch({
          type: "navigation-started",
          id: null,
          box: null,
          element: null,
          imageUrl: null
        });
      }
    };

    document.addEventListener("click", onClick, true);

    return () => document.removeEventListener("click", onClick, true);
  }, []);

  /**
   * attach mutation observer handler to intercept page transition
   */
  useEffect(() => {
    if (state.status !== "waiting-page") return;

    const onMutate = async () => {
      const img = await findImageLingAccrossAllDocuments(state.id);

      if (img)
        dispatch({
          type: "page-mounted",
          element: img,
          box: getAbsoluteBoundingBox(img)
        });
    };

    const observer = new MutationObserver(onMutate);

    observer.observe(document, {
      attributes: false,
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, [state.status === "waiting-page" && state.id]);

  /**
   * attach load listener on the image
   */
  useEffect(() => {
    if (state.status !== "transition") return;

    const onLoaded = () => {
      dispatch({ type: "image-loaded" });
    };

    if (state.toElement.naturalWidth) {
      onLoaded();
      return;
    }

    state.toElement.addEventListener("load", onLoaded);

    return () => state.toElement.removeEventListener("load", onLoaded);
  }, [state.status === "transition" && state.id]);

  const onAnimationFinish = () => {
    if (state.status === "transition")
      dispatch({
        type: "transition-ended",
        id: state.id
      });
  };

  return [state, onAnimationFinish] as const;
};

const getAncestorLink = (el: HTMLElement | null) => {
  if (!el) return;

  if (el.tagName === "A") return el;

  return getAncestorLink(el.parentElement);
};

/**
 * look for the image with the appropriate data attribute
 * this is a bit tricky since docuent.querySelecor doesn't look inside shadow dom
 */
export const findImageLingAccrossAllDocuments = async (
  id: string
): Promise<undefined | HTMLImageElement> => {
  const shadowRoots = Array.from(document.getElementsByTagName("*"))
    .map(el => el.shadowRoot)
    .filter(Boolean) as ShadowRoot[];

  const documents = [document, ...shadowRoots];

  const el = documents.reduce(
    (el, doc) => el || doc.querySelector(`[data-image-link-id="${id}"]`),
    null as any
  );

  if (!el) return;

  if (el.tagName === "IMG") return el;

  // wait for the amp script to append the actual image
  // which can be loaded as placeholder in first place
  if (el.tagName === "AMP-IMG") {
    while (!el.querySelector("img")) await nextTic();
    return el.querySelector("img");
  }
};

const nextTic = () => new Promise(resolve => requestAnimationFrame(resolve));
