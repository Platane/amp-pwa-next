export type Box = { x: number; y: number; width: number; height: number };

type State =
  | { status: "idle" }
  | {
      status: "waiting-page";
      id: string;
      imageUrl: string;
      fromBox: Box;
      fromElement: HTMLImageElement;
    }
  | {
      status: "transition";
      id: string;
      imageUrl: string;
      fromBox: Box;
      fromElement: HTMLImageElement;
      toBox: Box;
      toElement: HTMLImageElement;

      imageLoaded: boolean;
      transitionEnded: boolean;
    };

type Action =
  | {
      type: "navigation-started";
      id: string;
      box: Box;
      element: HTMLImageElement;
      imageUrl: string;
    }
  | {
      type: "navigation-started";
      id: null;
      box: null;
      element: null;
      imageUrl: null;
    }
  | {
      type: "page-mounted";
      element: HTMLImageElement;
      box: Box;
    }
  | {
      type: "page-mounted";
      element: null;
      box: null;
    }
  | {
      type: "transition-ended";
      id: string;
    }
  | {
      type: "image-loaded";
    };

export const reduce = (state: State, action: Action): State => {
  switch (action.type) {
    case "navigation-started": {
      if (action.id)
        return {
          status: "waiting-page",
          id: action.id,
          imageUrl: action.imageUrl,
          fromBox: action.box,
          fromElement: action.element
        };
      else return { status: "idle" };
    }

    case "page-mounted": {
      if (state.status === "waiting-page" && action.element)
        return {
          ...state,
          status: "transition",
          toBox: action.box,
          toElement: action.element,
          imageLoaded: false,
          transitionEnded: false
        };
      return { status: "idle" };
    }

    case "transition-ended": {
      if (state.status === "transition" && state.id === action.id) {
        const nextState = { ...state, transitionEnded: true };
        if (nextState.transitionEnded && nextState.imageLoaded)
          return { status: "idle" };
        return nextState;
      }
      return { status: "idle" };
    }

    case "image-loaded": {
      if (state.status === "transition") {
        const nextState = { ...state, imageLoaded: true };
        if (nextState.transitionEnded && nextState.imageLoaded)
          return { status: "idle" };
        return nextState;
      }
      return { status: "idle" };
    }
  }
};
