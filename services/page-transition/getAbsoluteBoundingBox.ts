/**
 * return the bounding box of the element,
 * relative to the top left corner of the whole page
 * ( it works here because the only scollable container is the document )
 */
export const getAbsoluteBoundingBox = (element: Element) => {
  const r = element.getBoundingClientRect();
  const box = { x: r.x, y: r.y, width: r.width, height: r.height };

  if (document.scrollingElement) {
    box.y += document.scrollingElement.scrollTop;
    box.x += document.scrollingElement.scrollLeft;
  }

  return box;
};

export type Box = { x: number; y: number; width: number; height: number };
