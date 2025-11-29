import { ButtonHTMLAttributes } from "react";
import { StyledLoginButton } from "./LoginButton.styles";

interface LoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function LoginButton({ children, ...props }: LoginButtonProps) {
  return (
    <StyledLoginButton {...props}>
      {children}
    </StyledLoginButton>
  );
}

