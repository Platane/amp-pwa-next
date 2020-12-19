import React from "react";
import Link from "next/link";

export const MainLayout = ({ children }: { children: any }) => (
  <>
    <style jsx global>{`
      body {
        margin: 0;
        color: #333;
        background-color: #fafafa;
        font-family: helvetica, Arial, sans-serif;
      }
    `}</style>

    <header
      className="layout-static"
      style={{
        padding: "20px 5px",
        background: "#eee",
        whiteSpace: "pre-wrap",
      }}
    >
      <Link href="/">
        <a>home</a>
      </Link>

      <Separator />

      <Link href="/my-favourite">
        <a>my-favourite</a>
      </Link>

      <Separator />

      <Link href="/clock">
        <a>clock</a>
      </Link>

      <Separator />

      <Link href="/about">
        <a>about</a>
      </Link>

      <Separator />
    </header>

    {children}
  </>
);

const Separator = () => <span>{"  "}</span>;
