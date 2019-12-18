import React from "react";
import Head from "next/head";
import { renderToString } from "react-dom/server";
import { AmpList } from "react-amphtml";
import { MovieListItem } from "./MovieListItem";
import { Movie } from "../services/omdb/type";

export const MovieList = ({ src, ...props }) => {
  const template = renderToString(
    <MovieListItem
      movie={
        {
          Title: "{{Title}}",
          Poster: "{{Poster}}",
          imdbID: "{{imdbID}}"
        } as Movie
      }
    />
  );

  return (
    <>
      <Head>
        <script
          async
          custom-element="amp-list"
          src="https://cdn.ampproject.org/v0/amp-list-0.1.js"
        ></script>
        <script
          async
          custom-template="amp-mustache"
          src="https://cdn.ampproject.org/v0/amp-mustache-0.2.js"
        ></script>
      </Head>

      <AmpList
        specName="default"
        width="auto"
        height={3 * 80}
        layout="fixed-height"
        max-items={3}
        src={src}
      >
        <Template
          type="amp-mustache"
          dangerouslySetInnerHTML={{ __html: template }}
        ></Template>
      </AmpList>
    </>
  );
};

// trick to silent ts error on non standard type attribute
const Template = (props: any) => <template {...props}></template>;
