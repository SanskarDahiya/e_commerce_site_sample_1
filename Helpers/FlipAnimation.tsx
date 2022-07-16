import React, { useEffect, useMemo, useState } from "react";
const allTr = "transition-all duration-200 ease-in-out ";

interface FlipAnimationProps {
  primaryCardIndex?: number;
  largestSizeIndex?: number;
  children: (value: any) => React.ReactElement[];
}
function FlipAnimation(props: FlipAnimationProps) {
  const { largestSizeIndex = 0, primaryCardIndex = 0, children } = props;
  const [frontCardIndex, setFrontCardIndex] = useState(primaryCardIndex);
  const [Elements, SetElements] = useState<React.ReactElement[]>([]);

  const params = useMemo(() => {
    return {
      flipToIndex: (index: number) => {
        index = +index;
        if (index < 0 || index > Elements.length) {
          index = 0;
        }
        setFrontCardIndex(index);
      },
    };
  }, [Elements.length]);

  useEffect(() => {
    SetElements(children(params));
  }, [children, params]);

  return (
    <div className="h-full w-full relative">
      {Elements.map((elem, index) => {
        const css = [allTr, "back-invisible"];
        if (index === largestSizeIndex) {
          css.push("relative");
        } else {
          css.push("absolute inset-0");
        }
        if (frontCardIndex === index) {
          css.push("rotate-0");
        } else {
          css.push("rotate_y_180 invisible");
        }
        return (
          <div className={css.join(" ")} key={index}>
            {elem}
          </div>
        );
      })}
    </div>
  );
}

export default FlipAnimation;
