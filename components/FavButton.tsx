import React from "react";
import Head from "next/head";
import { useOrigin } from "../services/next-host-getter";

export const FavButton = ({ movie }) => {
  const origin = useOrigin();

  return (
    <>
      <Head>
        <script
          async
          custom-element="amp-script"
          src="https://cdn.ampproject.org/v0/amp-script-0.1.js"
        ></script>
      </Head>

      <span
        dangerouslySetInnerHTML={{
          __html: `
            <amp-script layout="container" src="${origin}/assets/fav-button-script.js" sandbox="allow-forms">

              <button
                id="fav-button"
                data-movie-id="${movie.id}"
              >
              add to favourite
              </button>

              <a href="/my-favourite">go to my favourites</a>

            </amp-script>
            `
        }}
      />
    </>
  );
};
