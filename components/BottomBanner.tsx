import React from "react";
import styled from "@emotion/styled";

export const BottomBanner = ({ children, ...props }) => (
  <div
    {...props}
    style={{
      position: "fixed",
      minHeight: "40px",
      left: 0,
      right: 0,
      bottom: 0,
      padding: "10px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f6f6f5"
    }}
  >
    {children}
  </div>
);

// export const BottomBanner = ({ children, ...props }) => (
//   <Container {...props}>{children}</Container>
// );
//
// const Container = styled.div`
//   position: fixed;
//   min-height: 40px;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   padding: 10px;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   background-color: #f6f6f5;
// `;
