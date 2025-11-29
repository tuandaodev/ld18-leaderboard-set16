import { HTMLAttributes } from "react";
import { StyledPopupTitle } from "./PopupTitle.styles";

interface PopupTitleProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'small' | 'large';
}

export default function PopupTitle({ children, size = 'small', ...props }: PopupTitleProps) {
  return (
    <StyledPopupTitle size={size} {...props}>
      {children}
    </StyledPopupTitle>
  );
}

