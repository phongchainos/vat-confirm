import React from "react";

export default function ServiceNotAvailable({ content }) {
  return (
    <div>
      <h5><div>{content}</div></h5>
      <h5><div style={{ marginBottom: "20px" }}>
      </div></h5>
    </div>
  );
}