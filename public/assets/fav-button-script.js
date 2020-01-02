const element = document.getElementById("fav-button");

const id = element.getAttribute("data-movie-id");

let favList;
try {
  favList = JSON.parse(localStorage.getItem("favList"));
} catch (err) {
  favList = [];
}

if (!Array.isArray(favList)) favList = [];

element.innerHTML = favList.includes(id)
  ? "❤️ remove from favourite"
  : "add to favourite";

// toggle on click
element.addEventListener("click", () => {
  favList = favList.includes(id)
    ? favList.filter(i => i !== id)
    : [...favList, id];

  localStorage.setItem("favList", JSON.stringify(favList));

  element.innerHTML = favList.includes(id)
    ? "❤️ remove from favourite"
    : "add to favourite";
});
