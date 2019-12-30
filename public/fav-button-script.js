const element = document.querySelector("#fav-button");
const id = element.getAttribute("data-movie-id");

let favList = [];
try {
  favList = JSON.parse(localStorage.getItem("favList"));
} catch (err) {}

element.style.color = favList.includes(id) ? "red" : "black";

element.addEventListener("click", () => {
  favList = favList.includes(id)
    ? favList.filter(i => i !== id)
    : [...favList, id];

  localStorage.setItem("favList", JSON.stringify(favList));

  element.style.color = favList.includes(id) ? "red" : "black";
});
