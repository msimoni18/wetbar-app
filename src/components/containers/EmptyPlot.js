import React from "react";

export default function EmptyPlot({ layout }) {
  return (
    <div style={ {
      width: layout.width,
      height: layout.height,
      border: "1px solid lightgrey",
      borderRadius: "5px",
      position: "relative"
    } }
    >
      <div style={ {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "14px"
      } }
      >
        No data to show
      </div>
    </div>
  );
}