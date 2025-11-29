import { HTMLAttributes } from "react";
import { StyledPageTitle } from "./PageTitle.styles";

interface PageTitleProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function PageTitle({ children, ...props }: PageTitleProps) {
  return (
    <StyledPageTitle {...props}>
      {children}
    </StyledPageTitle>
  );
}

