import React from "react";
import { repository } from "../package.json";

export const config = { amp: true };

const Page = () => {
  const githubUrl = repository && repository.replace("github:", "github.com/");

  return (
    <>
      <h1>About</h1>

      <p>This is a demo with amp in pwa</p>

      <p>
        The source code can be found on github{" "}
        <a href={`https://${githubUrl}`}>{githubUrl}</a>
      </p>
    </>
  );
};

export default Page;
