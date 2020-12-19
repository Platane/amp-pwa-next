import React from "react";
import { repository, description } from "../package.json";

export const config = { amp: true };

const AboutPage = () => {
  const githubUrl = repository && repository.replace("github:", "github.com/");

  return (
    <>
      <h1>About</h1>

      <p>{description}</p>

      <p>
        The source code can be found on github{" "}
        <a href={`https://${githubUrl}`}>{githubUrl}</a>
      </p>

      <p>
        The data comes from{" "}
        <a href="https://www.themoviedb.org/">themoviedb.org</a>
      </p>
    </>
  );
};

export default AboutPage;
