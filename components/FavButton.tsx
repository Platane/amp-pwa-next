import React from "react";
import Head from "next/head";
// import { AmpScript } from "react-amphtml";

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
            <amp-script layout="container" script="fav-button-script"><div>000</div></amp-script>
            `
        }}
      />

      <button
        id="fav-button"
        data-movie-id={movie.id}
        style={{
          display: "inline-block",
          margin: 0,
          border: "none",
          background: "none",
          padding: "2px 12px",
          fontSize: "26px"
        }}
      >
        {"♥"}
      </button>
    </>
  );
};

const Script = props => <script {...props} />;

const code = `

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

`;

const codeHash = "xxxx";
