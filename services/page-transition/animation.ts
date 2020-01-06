import { Box } from "./reduce";

/**
 * animate a floating element
 * start at the same position as the target
 * does a scale dowm instant feedback
 * oscillate scale as pending animation
 */
export const createPendingAnimation = (
  floatingElement: HTMLElement,
  from: Box
) => {
  floatingElement.style.width = from.width + "px";
  floatingElement.style.height = from.height + "px";
  floatingElement.style.transform = `translate(${from.x}px,${from.y}px) scale(0.01,0.01)`;
  floatingElement.style.transformOrigin = "50% 50%";

  return floatingElement.animate(
    {
      transform: [
        //
        `translate(${from.x}px,${from.y}px) scale(1,1) rotate(0deg)`,
        `translate(${from.x}px,${from.y}px) scale(0.4,0.4) rotate(4deg)`,
        `translate(${from.x}px,${from.y}px) scale(0.2,0.2) rotate(8deg)`,
        `translate(${from.x}px,${from.y}px) scale(1.5,1.5) rotate(-8deg)`,
        `translate(${from.x}px,${from.y}px) scale(0.2,0.2) rotate(7deg)`,
        `translate(${from.x}px,${from.y}px) scale(0.8,0.8) rotate(-4deg)`,
        `translate(${from.x}px,${from.y}px) scale(0.01,0.01) rotate(0deg)`
      ],
      offset: [
        //
        0,
        0.05,
        0.1,
        0.3,
        0.5,
        0.7,
        1
      ],
      easing: "ease-in-out"
    },
    { duration: 3200 }
  );
};

/**
 * animate a floating element
 * start at the current position of the floating element
 * end at the same position as the target
 */
export const createTransitionAnimation = (
  floatingElement: HTMLElement,
  from: Box,
  to: Box
) => {
  floatingElement.style.width = to.width + "px";
  floatingElement.style.height = to.height + "px";
  floatingElement.style.transformOrigin = "0 0";
  floatingElement.style.transform = `translate(${to.x}px,${to.y}px)`;

  return floatingElement.animate(
    {
      transform: [
        `translate(${from.x}px,${from.y}px)` +
          `scale(${from.width / to.width},${from.height / to.height})`,

        `translate(${to.x}px,${to.y}px)`
      ]
    },
    { duration: 380, easing: "cubic-bezier(.45,1.51,.57,.98)" }
  );
};
