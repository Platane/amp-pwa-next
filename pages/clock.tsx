import React, { useEffect, useState } from "react";

export const config = { amp: false };

const ClockPage = () => {
  const [k, setK] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setK((k) => k + 1), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <>
      <h1>Clock</h1>

      <p>Simple page with a clock</p>

      <p>{k}</p>
    </>
  );
};

export default ClockPage;
