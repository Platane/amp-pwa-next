import React from "react";
import Head from "next/head";

export const FavButton = ({ movie }) => {
  return (
    <>
      <Head>
        <script
          async
          custom-element="amp-script"
          src="https://cdn.ampproject.org/v0/amp-script-0.1.js"
        ></script>

        <meta name="amp-script-src" content={codeHash} />

        <Script
          id="fav-button-script"
          type="text/plain"
          target="amp-script"
          dangerouslySetInnerHTML={{ __html: code }}
        />
      </Head>

      <span
        dangerouslySetInnerHTML={{
          __html: `
            <amp-script layout="container" script="fav-button-script" sandbox="allow-forms">

              <button
                id="fav-button"
                data-movie-id="${movie.id}"
                style="display:inline-block;margin:0;border:none;background:none;padding:2px 12px;font-size:26px"
              >
              <span style="color:transparent">♥</span>
              </button>

              <a style="color:transparent" href="/my-favourite">go to my favourites</a>

            </amp-script>
            `
        }}
      />
    </>
  );
};

const Script = (props: any) => <script {...props} />;

const code = `
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
element.parentNode.children[1].style.color = 'auto'

element.addEventListener("click", () => {
  favList = favList.includes(id)
    ? favList.filter(i => i !== id)
    : [...favList, id];

  localStorage.setItem("favList", JSON.stringify(favList));

  element.children[0].style.color = favList.includes(id) ? "red" : "#999";
});

`;

export const codeHash =
  "sha384-a_9t65eHxONUqvrSnONgpL6rUbdB0l6J3dgYwLvSRX_EfBa2OBXMOzW1972YC7lW";
