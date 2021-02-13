import { useEffect } from "react";
import { useRouter } from "next/router";
import { getAbsoluteBoundingBox, Box } from "./getAbsoluteBoundingBox";
import { EventEmitter } from "events";



export const create = (src: string, startBox: Box, endBox?: Box) => {
  const floatingImage = new Image();
  floatingImage.src = src;
  floatingImage.style.position = "absolute";
  floatingImage.style.pointerEvents = "none";
  floatingImage.style.opacity = "0.01";
  floatingImage.style.top = "0";
  floatingImage.style.left = "0";
  floatingImage.style.width = startBox.width + "px";
  floatingImage.style.height = startBox.height + "px";
  floatingImage.style.transform = `translate3d(${startBox.x},${startBox.y},0)`;

  document.body.appendChild(floatingImage);

  let started = true;

  const dispose = () => {
    floatingImage.removeEventListener("load", onImageLoaded);
    floatingImage.removeEventListener("transitionend", onTransitionEnd);
    document.body.removeChild(floatingImage);
    cancel()
  };

  const ee = new EventEmitter();

  const cancel = () => {
    ee.removeAllListeners()
  }
  
  const onImageLoaded = () => {
    ee.emit("start");
    floatingImage.style.opacity = "0.01";
    floatingImage.style.transition = "transform 180ms ease-out";

    // trigger reflow
    const a = floatingImage.offsetLeft;
  };
  let onTransitionEnd = () => undefined as void;

  // if (floatingImage.naturalWidth === 0) onImageLoaded();
  // else floatingImage.addEventListener("load", onImageLoaded);
  floatingImage.addEventListener("load", onImageLoaded);

  const setEndBox = (eb: Box) => {
    endBox = eb;
  };

  const start = () => {
    started = 
  };

  return {
    dispose,
    setEndBox,

    onEnd: (h: () => void) => ee.once("end", h),
    onStart: (h: () => void) => ee.once("start", h),
    onCancel: (h: () => void) => ee.once("cancel", h),
  };
};
