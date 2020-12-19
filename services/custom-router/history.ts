export const history = {
  push: (url: string) => window.history.pushState({}, undefined as any, url),

  replace: (url: string) =>
    window.history.replaceState({}, undefined as any, url),

  getHref:
    typeof window === "undefined"
      ? () => "/"
      : () =>
          window.location.pathname +
          window.location.search +
          window.location.hash,
};
