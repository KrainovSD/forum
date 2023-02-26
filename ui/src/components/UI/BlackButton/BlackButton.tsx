import { PropsWithChildren } from "react";
import "./BlackButton.scss";
interface BlackButtonProps {
  [key: string]: any;
}

export const BlackButton: React.FC<PropsWithChildren<BlackButtonProps>> = ({
  children,
  ...props
}) => {
  return (
    <div className="black-button" {...props}>
      {children}
    </div>
  );
};
