const element = document.getElementById("fav-button");

const id = element.getAttribute("data-movie-id");

let favList;
try {
  favList = JSON.parse(localStorage.getItem("favList"));
} catch (err) {
  favList = [];
}

if (!Array.isArray(favList)) favList = [];

element.children[0].style.color = favList.includes(id) ? "red" : "#999";
element.parentNode.children[1].style.color = "auto";

element.addEventListener("click", () => {
  favList = favList.includes(id)
    ? favList.filter(i => i !== id)
    : [...favList, id];

  localStorage.setItem("favList", JSON.stringify(favList));

  element.children[0].style.color = favList.includes(id) ? "red" : "#999";
});
