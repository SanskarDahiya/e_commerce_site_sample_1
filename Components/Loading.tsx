import React from "react";

function Loading() {
  return (
    <div
      className="animated-background absolute top-[-0.25rem] bottom-[-0.25rem] left-[-0.25rem] right-[-0.25rem] rounded-xl"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    ></div>
  );
}

export default Loading;
