import React from "react";

export const BottomBanner = ({ children, ...props }) => (
  <div
    {...props}
    style={{
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
      padding: "12px",
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
