import "twin.macro";
import React from "react";

function Loading() {
  return (
    <div
      tw="absolute top-[-0.25rem] bottom-[-0.25rem] left-[-0.25rem] right-[-0.25rem] rounded-xl"
      className="animated-background"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    ></div>
  );
}

export default Loading;
