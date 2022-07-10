import React, { useEffect, useMemo, useState } from "react";

interface SlideAnimationProps {
  children?: React.ReactNode | (({ closeModal }: any) => React.ReactNode);
  onRemove?: (value?: any) => void;
  className?: string;
  timeout?: number;
  inTransition?: string;
  outTransition?: string;
}

function SlideAnimation(props: SlideAnimationProps) {
  const {
    timeout,
    onRemove: onRemoveCb,
    inTransition,
    outTransition,
    className,
  } = props;
  const [transition_state, set_transition_state] = useState([
    "DISPLAY",
    "BEGAIN",
  ]);

  const startRemoveTransitionProcess = () => {
    set_transition_state(["REMOVE", "ENDS"]);
  };

  const stopStartTransitionProcess = () => {
    set_transition_state(["DISPLAY", "ENDS"]);
  };

  useEffect(() => {
    const startTranisitionRef = setTimeout(stopStartTransitionProcess, 10);
    const expireTransitionRef = setTimeout(
      startRemoveTransitionProcess,
      timeout
    );
    return () => {
      clearTimeout(startTranisitionRef);
      clearTimeout(expireTransitionRef);
    };
  }, [timeout]);

  const ModalTransition = useMemo(() => {
    if (
      transition_state[1] === "BEGAIN"
        ? transition_state[0] === "DISPLAY"
        : transition_state[0] === "REMOVE"
    ) {
      return "opacity-0 " + (inTransition || "translate-x-[-24rem]");
    } else {
      return "opacity-100 " + (outTransition || "translate-x-0");
    }
  }, [transition_state]);

  const ChildComponet =
    typeof props.children === "function"
      ? props.children({ closeModal: startRemoveTransitionProcess })
      : props.children;

  return (
    <div
      className={`transition-all duration-500 ease-in ${ModalTransition} ${className}`}
      onTransitionEnd={() => {
        if (transition_state.join("_") === "REMOVE_ENDS" && onRemoveCb) {
          onRemoveCb();
        }
      }}
    >
      {ChildComponet}
    </div>
  );
}

export default SlideAnimation;
