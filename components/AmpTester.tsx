import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

export const AmpTester = () => {
  const [x, setX] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setX(x => x + 1), 60);
    return () => clearInterval(i);
  }, []);

  return (
    <Container style={{ backgroundColor: x > 0 ? "lime" : "blue" }}>
      <Badge
        style={{
          transform: `rotateY(${x * 10}deg)`
        }}
      >
        {x > 0 ? "js" : "AMP"}
      </Badge>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 40px;
  right: 10px;
  width: 26px;
  height: 26px;
  border-radius: 20px;
  border: solid 2px grey;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Badge = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background: orange;
  display: flex;
  align-items: center;
  justify-content: center;
`;
