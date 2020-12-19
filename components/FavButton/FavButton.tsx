import React from "react";
import Head from "next/head";
import { AmpScript } from "react-amphtml";
// @ts-ignore
import script from "!!raw-loader!./script.js";

// hash of the script after amp minifies it
const hash =
  "sha384-r5zo61rK3EDeQ3AYQu4B9YlPo1FQgCN0oth6RZ4RssoOz-a-60tQMTal6mWk-TRj";

export const FavButton = ({ id }: { id: string | number }) => {
  return (
    <>
      <Head>
        <script
          async
          custom-element="amp-script"
          src="https://cdn.ampproject.org/v0/amp-script-0.1.js"
        ></script>

        <meta name="amp-script-src" content={hash} />

        <script
          id="fav-button-script"
          type="text/plain"
          // @ts-ignore
          target="amp-script"
          dangerouslySetInnerHTML={{ __html: script }}
        ></script>
      </Head>

      <AmpScript
        // @ts-ignore
        script="fav-button-script"
        // @ts-ignore
        layout="fixed"
        width="190"
        height="30"
        sandBox="allow-forms"
      >
        <button
          data-fav-button
          data-movie-id={id}
          style={{ width: "100%", height: "100%" }}
        >
          add to favourite
        </button>
      </AmpScript>
    </>
  );
};
