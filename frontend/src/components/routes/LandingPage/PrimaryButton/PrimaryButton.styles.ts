import styled from 'styled-components';
import btnBg from '../../../../images/btn_bg.png';
import btnSecondBg from '../../../../images/btn_second_bg.png';

interface StyledPrimaryButtonProps {
  variant?: "primary" | "secondary";
}

export const StyledPrimaryButton = styled.button<StyledPrimaryButtonProps>`
  background-color: transparent;
  background-image: url(${props => props.variant === "secondary" ? btnSecondBg : btnBg});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  border: none;
  padding: 0.8rem 2.5rem;
  color: #f9f7da;
  font-family: 'NTH Justice', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  height: 82px;
  min-width: 415px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));

  &:hover {
    filter: brightness(1.3) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
  }

  &:active {
    filter: brightness(1.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      filter: none;
    }
  }

  @media (max-width: 1920px) {
    font-size: 1.2rem;
    padding: 0.5rem 2rem;
    height: 70px;
    min-width: 350px;
  }

  @media (max-width: 1366px) {
    font-size: 1rem;
    padding: 0rem 1.9rem;
    height: 55px;
    min-width: 320px;
    letter-spacing: 1.2px;
  }

  @media (max-width: 1200px) {
    font-size: 0.95rem;
    padding: 0.7rem 2rem;
    min-width: 180px;
  }

  @media (max-width: 968px) {
    font-size: 0.9rem;
    padding: 0.6rem 1.8rem;
    min-width: 160px;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 0.5rem 1.5rem;
    min-width: 160px;
  }
`;

