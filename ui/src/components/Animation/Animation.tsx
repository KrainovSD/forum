import { CSSTransition } from "react-transition-group";
import { PropsWithChildren } from "react";
import "./Animation.scss";

interface IAnimationProps {
  isVisible: boolean;
  timeout?: number;
  className: "appear-anim" | "anim";
}

export const Animation: React.FC<PropsWithChildren<IAnimationProps>> = ({
  isVisible,
  className,
  timeout,
  children,
}) => {
  return (
    <CSSTransition
      in={isVisible}
      timeout={timeout ? timeout : 300}
      classNames={className}
      unmountOnExit
    >
      {children}
    </CSSTransition>
  );
};
