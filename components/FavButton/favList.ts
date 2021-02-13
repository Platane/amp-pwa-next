export const get = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem("favList") as any).map((id: any) =>
      id.toString()
    );
  } catch (err) {}
  return [];
};

export const set = (ids: string[]) =>
  localStorage.setItem("favList", JSON.stringify(ids));
