import { ButtonHTMLAttributes } from "react";
import { StyledPrimaryButton } from "./PrimaryButton.styles";

interface PrimaryButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'variant'> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export default function PrimaryButton({ children, variant = "primary", ...props }: PrimaryButtonProps) {
  return (
    <StyledPrimaryButton variant={variant} {...props}>
      {children}
    </StyledPrimaryButton>
  );
}

