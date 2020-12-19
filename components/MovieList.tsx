import React from "react";
import Head from "next/head";
import { renderToString } from "react-dom/server";
import { AmpList } from "react-amphtml";
import { AmpImg } from "react-amphtml";
import { getSrcSet, getImageUrl } from "../services/tmdb/image";
import Link from "next/link";
import type { Movie } from "../services/tmdb";

export const MovieList = ({
  src,
  maxItems = 3,
}: {
  src: string;
  maxItems?: number;
}) => {
  // render to string at render time, so we can write the item as react component
  // instead of plain, error prone, string
  const template = renderToString(
    <MovieItem
      movie={
        ({
          title: "{{title}}",
          poster_path: "{{poster_path}}",
          id: "{{id}}",
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
        <template
          // @ts-ignore
          type="amp-mustache"
          dangerouslySetInnerHTML={{ __html: template }}
        ></template>
      </AmpList>
    </>
  );
};

const MovieItem = ({ movie }: { movie: Movie }) => (
  <a href={`/movie/${movie.id}`}>
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "80px",
        alignItems: "center",
      }}
    >
      <AmpImg
        data-image-link-id={movie.id}
        style={{ flex: "auto 0 0" }}
        alt="movie poster"
        specName="default"
        width={(70 / 750) * 500}
        height="70"
        srcset={getSrcSet(movie.poster_path)}
        src={getImageUrl(movie.poster_path)}
      />

      <span>{movie.title}</span>
    </div>
  </a>
);
