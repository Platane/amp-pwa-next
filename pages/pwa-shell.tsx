import React from "react";
import { BottomBanner } from "../components/BottomBanner";
import { AmpDocument } from "../components/AmpDocument";
import { useRouter } from "../services/customRouter";

export const config = { amp: false };

export const Page = () => {
  const router = useRouter();

  const onNavigate = (url: string) => router.push(url, url);
  const pageUrl = router.pathname;

  return (
    <>
      {pageUrl && <AmpDocument onNavigate={onNavigate} src={pageUrl} />}

      <BottomBanner>
        <span>
          you are visiting the page <a href={pageUrl || undefined}>{pageUrl}</a>{" "}
          inside the pwa shell
        </span>
      </BottomBanner>
    </>
  );
};

export default Page;
