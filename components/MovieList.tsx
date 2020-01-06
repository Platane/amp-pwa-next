import React from "react";
import Head from "next/head";
import { renderToString } from "react-dom/server";
import { AmpList } from "react-amphtml";
import { MovieListItem } from "./MovieListItem";
import { Movie } from "../services/tmdb/type";

export const MovieList = ({ src, maxItems = 3, ...props }) => {
  // some little trick,
  // render to string at render time, so we can write the item as react component
  // instead of plain, error prone, string
  const template = renderToString(
    <MovieListItem
      movie={
        ({
          title: "{{title}}",
          poster_path: "{{poster_path}}",
          id: "{{id}}"
        } as any) as Movie
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
        height={maxItems * 80}
        layout="fixed-height"
        max-items={maxItems.toString()}
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
