import { ButtonHTMLAttributes } from "react";
import { StyledPrimaryPopupButton } from "./PrimaryPopupButton.styles";

interface PrimaryPopupButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'variant'> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}


export default function PrimaryPopupButton({ children, variant = "primary", ...props }: PrimaryPopupButtonProps) {
  return (
    <StyledPrimaryPopupButton variant={variant} {...props}>
      {children}
    </StyledPrimaryPopupButton>
  );
}

