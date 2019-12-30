import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo
} from "react";
import { useAmp } from "next/amp";

const PageTransitionContext = createContext({
  onPageTransitionEnd: (doc: any) => {}
});

type Box = { x: number; y: number; width: number; height: number };

export const PageTransitionProvider = ({ children }) => {
  const floatingImageRef = useRef(null as any);

  const container = useMemo(() => ({ current: { status: "idle" } }), []) as any;

  const [animation, setAnimation] = useState(null as any);

  const onPageTransitionEnd = async doc => {
    if (container.current.status === "loading") {
      const { id, src, from } = container.current;

      await nextTic();

      const shadowDoc = Array.from(document.getElementsByTagName("*"))
        .map(el => el.shadowRoot)
        .filter(Boolean) as ShadowRoot[];

      const el = [document, ...shadowDoc].reduce(
        (el, doc) => el || doc.getElementById(id),
        null as any
      );

      if (el) {
        const r = el.getBoundingClientRect();
        const to = { width: r.width, height: r.height, x: r.x, y: r.y };

        el.style.opacity = 0.2;

        setAnimation({ id, from, to, src, el });
      }
    }
  };

  useEffect(() => {
    const onClick = event => {
      const a = getAncestorLink(event.path ? event.path[0] : event.target);

      if (!a) return;

      const img = a.querySelector("img[amp-img-id]");

      if (!img) return;

      const id = img.getAttribute("amp-img-id");

      if (!id) return;

      const r = img.getBoundingClientRect();
      const box = { width: r.width, height: r.height, x: r.x, y: r.y };

      container.current = {
        id,
        status: "loading",
        from: box,
        src: img.getAttribute("src")
      };
    };

    document.addEventListener("click", onClick);

    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!animation) return;
    if (!floatingImageRef.current) return;

    const { id, from, to, src, el } = animation;

    floatingImageRef.current.style.width = from.width + "px";
    floatingImageRef.current.style.height = from.height + "px";
    floatingImageRef.current.style.position = "fixed";
    floatingImageRef.current.style.display = "block";
    floatingImageRef.current.style.transformOrigin = "0 0";
    floatingImageRef.current.style.top = 0;
    floatingImageRef.current.style.left = 0;
    floatingImageRef.current.style.zIndex = 999;
    floatingImageRef.current.style.transform =
      `translate(${to.x}px,${to.y}px)` +
      `scale(${to.width / from.width},${to.height / from.height})`;
    floatingImageRef.current.src = src;

    const domAnim = floatingImageRef.current.animate(
      [
        { transform: `translate(${from.x}px,${from.y}px)` },
        {
          transform:
            `translate(${to.x}px,${to.y}px)` +
            `scale(${to.width / from.width},${to.height / from.height})`
        }
      ],
      { duration: 320, easing: "cubic-bezier(.45,1.51,.57,.98)" }
    );

    const onEnd = () => {
      if (container.current.id === id) {
        floatingImageRef.current.style.display = "none";
        el.style.opacity = 1;
        container.current = { status: "idle" };
      }
    };

    domAnim.addEventListener("finish", onEnd);

    return () => domAnim.cancel();
  }, [animation, floatingImageRef]);

  const isAmp = useAmp();

  return (
    <PageTransitionContext.Provider value={{ onPageTransitionEnd }}>
      {!isAmp && <img ref={floatingImageRef} />}
      {children}
    </PageTransitionContext.Provider>
  );
};

const getAncestorLink = el => {
  if (!el) return;

  if (el.tagName === "A") return el;

  return getAncestorLink(el.parentNode);
};

export const usePageTransitionEnd = () =>
  useContext(PageTransitionContext).onPageTransitionEnd;

const nextTic = () => new Promise(resolve => setTimeout(resolve, 0));

const createKeyFrames = (a: Box, b: Box) => [];
