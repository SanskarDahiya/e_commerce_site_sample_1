import React from "react";
interface LoadingProps {
  text?: string;
  className?: string;
}
function Loading({ text, className = "" }: LoadingProps) {
  return (
    <div
      className={
        "animated-background absolute top-[-0.25rem] bottom-[-0.25rem] left-[-0.25rem] right-[-0.25rem] rounded-xl flex justify-center items-center " +
        className
      }
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {text || ""}
    </div>
  );
}

export default Loading;
