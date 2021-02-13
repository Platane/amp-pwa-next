import React from "react";
import { useRouter } from "next/router";
import { AmpDocument } from "../components/AmpDocument/AmpDocument";

export const config = { amp: false };

export const ShellPage = () => {
  const router = useRouter();

  const pageUrl = router.asPath;
  const { pop } = router as any;

  const onReady = () =>
    router.events.emit("shell-routeChangeComplete", pageUrl);

  return (
    <>
      {pageUrl && (
        <AmpDocument
          pageUrl={pageUrl}
          onNavigate={router.push}
          onReady={onReady}
          preserve={!pop}
          scroll
        />
      )}

      <footer
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "6px 10px",
          backgroundColor: "#f6f6f5",
          fontSize: "0.7em",
          textAlign: "center",
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

export default ShellPage;
