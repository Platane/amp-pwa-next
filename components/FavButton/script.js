const element = document.getElementById("fav-button");

const read = () => {
  try {
    return JSON.parse(localStorage.getItem("favList")).map((id) => id + "");
  } catch (err) {}
  return [];
};

const favList = read();

const toggle = (id) => {
  if (favList.includes(id)) favList.splice(favList.indexOf(id), 1);
  else favList.push(id);
  localStorage.setItem("favList", JSON.stringify(favList));
};

for (const element of document.querySelectorAll("[data-fav-button]")) {
  const id = element.getAttribute("data-movie-id");

  const updateElement = () => {
    element.textContent = favList.includes(id)
      ? "❤️ remove from favourite"
      : "add to favourite";
  };

  updateElement();

  // toggle on click
  element.addEventListener("click", () => {
    toggle(id);
    updateElement();
  });
}
