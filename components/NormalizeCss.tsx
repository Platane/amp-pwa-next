import React from "react";
import { Global, css } from "@emotion/core";

const normalized = css`
  html {
    -webkit-text-size-adjust: 100%;
    box-sizing: border-box;
    overflow-y: scroll;
  }
  *,
  *:before,
  *:after {
    box-sizing: inherit;
    margin: 0;
    padding: 0;
  }
  table {
    border-collapse: collapse;
  }
  td,
  th {
    border: none;
  }

  html,
  body,
  #root {
    margin: 0;
    min-height: 100%;
    height: 100%;
  }
  html {
    background-color: #f4f4f4;
  }
`;

export const NormalizeCss = () => <Global styles={normalized} />;
