import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/core";
import { Link } from "../Link";
// import { AmpTester } from "../../components/AmpTester";

export const MainLayout = ({ children }) => (
  <>
    <div className="mainlayout-topbar">
      <span> </span>
      <Link href="/">
        <a>home</a>
      </Link>
    </div>

    {children}

    <footer>
      <p>
        data from <a href="https://www.themoviedb.org/">themoviedb.org</a>
      </p>
    </footer>
  </>
);

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div`
  width: 24px;
  height: 4px;
  background-color: white;
  border-radius: 2px;
  border-left: solid 4px blue;
  border-right: solid 4px orange;
  animation: ${rotate} 3s linear infinite;
  margin: 4px;
`;

export const TopBar = styled.div`
  height: 30px;
  background-color: grey;
  width: 100%;
  left: 0;
  right: 0;
  border-bottom: solid 1px red;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
