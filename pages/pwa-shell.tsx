import React from "react";
import { AmpDocument } from "../components/AmpDocument";
import { useRouter } from "../services/custom-router";

export const config = { amp: false };

export const Page = () => {
  const router = useRouter();

  const onNavigate = (url: string) => router.push(url, url);
  const pageUrl = router.pathname;

  return (
    <>
      {pageUrl && <AmpDocument onNavigate={onNavigate} src={pageUrl} />}

      <footer
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "10px",
          backgroundColor: "#f6f6f5",
          fontSize: "12px",
          textAlign: "center"
        }}
      >
        <span>
          visiting the page <a href={pageUrl || undefined}>{pageUrl}</a> inside
          the pwa shell
        </span>
      </footer>
    </>
  );
};

export default Page;
