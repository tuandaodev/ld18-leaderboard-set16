import styled from 'styled-components';
import btnBg from '../../../../images/btn_bg.png';
import btnSecondBg from '../../../../images/btn_second_bg.png';

interface StyledPrimaryPopupButtonProps {
  variant?: "primary" | "secondary";
}

export const StyledPrimaryPopupButton = styled.button<StyledPrimaryPopupButtonProps>`
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
  min-width: 400px;
  height: 72px;
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
    font-size: 1.4rem;
    padding: 0.75rem 2.3rem;
    min-width: 380px;
    height: 68px;
    letter-spacing: 1.4px;
  }

  @media (max-width: 1600px) {
    font-size: 1.3rem;
    padding: 0.7rem 2.1rem;
    min-width: 350px;
    height: 65px;
    letter-spacing: 1.3px;
  }

  @media (max-width: 1366px) {
    font-size: 1.2rem;
    padding: 0.7rem 2rem;
    min-width: 320px;
    height: 62px;
    letter-spacing: 1.2px;
  }

  @media (max-width: 1200px) {
    font-size: 1.1rem;
    padding: 0.65rem 1.9rem;
    min-width: 300px;
    height: 60px;
    letter-spacing: 1.1px;
  }

  @media (max-width: 1024px) {
    font-size: 1rem;
    padding: 0.6rem 1.8rem;
    min-width: 280px;
    height: 58px;
    letter-spacing: 1px;
  }

  @media (max-width: 968px) {
    font-size: 0.95rem;
    padding: 0.6rem 1.7rem;
    min-width: 250px;
    height: 55px;
    letter-spacing: 0.9px;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.55rem 1.5rem;
    min-width: 220px;
    height: 52px;
    letter-spacing: 0.8px;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 0.5rem 0.5rem;
    min-width: 150px;
    height: 40px;
    letter-spacing: 0.7px;
  }
`;

