import styled from 'styled-components';
import btnLoginBg from '../../../../images/header/btn_login_bg.png';

export const StyledLoginButton = styled.button`
  background-color: transparent;
  background-image: url(${btnLoginBg});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  border: none;
  padding: 0.8rem 2.5rem;
  color: #fafefe;
  font-family: 'UVN La Xanh', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    filter: brightness(1.2);
  }

  &:active {
    transform: scale(0.98);
    filter: brightness(0.9);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      filter: none;
    }
  }

  @media (max-width: 1200px) {
    font-size: 0.95rem;
    padding: 0.7rem 2rem;
    min-width: 180px;
  }

  @media (max-width: 968px) {
    font-size: 0.9rem;
    padding: 0.6rem 1.8rem;
    min-width: 130px;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 0.5rem 1.5rem;
    min-width: 160px;
  }
`;

