import React, { useState, useEffect } from "react";

export const config = { amp: false };

const key = "__amp_pwa_next";

const Page = () => {
  const [id, setId] = useState(null as null | string);

  useEffect(() => {
    let i = localStorage.getItem(key);

    if (!i) {
      i = Math.random()
        .toString(16)
        .slice(2);

      localStorage.setItem(key, i);
    }

    setId(i);
  }, []);

  return (
    <>
      <h1>Your page</h1>

      <p>This is your id: {id}</p>
    </>
  );
};

export default Page;
