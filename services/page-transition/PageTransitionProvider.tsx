/**
 * This provider intercept navigation,
 * determine if an image transition is possible
 * wait for the next page to be mounted
 * make the image float from previous to the next position
 */

import React, { useEffect, useRef } from "react";
import { useAmp } from "next/amp";
import { createTransitionAnimation, createPendingAnimation } from "./animation";
import { usePageTransitionState } from "./usePageTransitionState";
import { getAbsoluteBoundingBox } from "./getAbsoluteBoundingBox";

export const PageTransitionProvider = ({ children }) => {
  const floatingImageRef = useRef(null as any);
  const isAmp = useAmp();
  const [state, onAnimationFinish] = usePageTransitionState();
  const c: any = useRef({ current: null });

  useEffect(() => {
    const img = floatingImageRef.current;

    if (state.status === "transition") {
      state.toElement.style.opacity = "0.2";

      img.style.display = "block";
      img.setAttribute("src", state.imageUrl);

      const animation = createTransitionAnimation(
        img,
        c.current || state.fromBox,
        state.toBox
      );

      animation.addEventListener("finish", onAnimationFinish);

      return () => {
        onAnimationFinish();
        animation.removeEventListener("finish", onAnimationFinish);
        animation.cancel();
        img.style.display = "none";
        img.removeAttribute("src");
        state.toElement.style.opacity = "1";
      };
    }

    if (state.status === "waiting-page") {
      state.fromElement.style.opacity = "0.2";

      img.style.display = "block";
      img.setAttribute("src", state.imageUrl);

      const animation = createPendingAnimation(img, state.fromBox);

      return () => {
        c.current = getAbsoluteBoundingBox(img);
        animation.cancel();
        img.style.display = "none";
      };
    }
  }, [floatingImageRef.current, state.status]);

  return (
    <>
      {!isAmp && (
        <img
          ref={floatingImageRef}
          style={{
            top: 0,
            left: 0,
            position: "absolute",
            display: "none",
            zIndex: 999
          }}
        />
      )}
      {children}
    </>
  );
};
