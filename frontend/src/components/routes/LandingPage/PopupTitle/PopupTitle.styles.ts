import styled from 'styled-components';
import bgPopupTitleSmall from '../../../../images/popup/bg_popup_title_small.png';
import bgPopupTitleLarge from '../../../../images/popup/bg_popup_title_large.png';

interface StyledPopupTitleProps {
  size?: 'small' | 'large';
}

export const StyledPopupTitle = styled.div<StyledPopupTitleProps>`
  background-color: transparent;
  background-image: url(${props => props.size === 'large' ? bgPopupTitleLarge : bgPopupTitleSmall});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  padding: 0.8rem 5rem;
  color: #fafefe;
  font-family: 'UVN La Xanh', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-shadow: none;
  min-width: 450px;
  // width: ${props => props.size === 'small' ? '100%' : 'auto'};
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  @media (max-width: 1920px) {
    font-size: 1.7rem;
    padding: 0.75rem 4.5rem;
    min-width: 420px;
    letter-spacing: 1.9px;
  }

  @media (max-width: 1600px) {
    font-size: 1.6rem;
    padding: 0.7rem 4rem;
    min-width: 400px;
    letter-spacing: 1.8px;
  }

  @media (max-width: 1366px) {
    font-size: 1.5rem;
    padding: 0.7rem 3.5rem;
    min-width: 380px;
    letter-spacing: 1.7px;
  }

  @media (max-width: 1200px) {
    font-size: 1.4rem;
    padding: 0.65rem 3rem;
    min-width: 350px;
    letter-spacing: 1.6px;
  }

  @media (max-width: 1024px) {
    font-size: 1.3rem;
    padding: 0.6rem 2.5rem;
    min-width: 320px;
    letter-spacing: 1.5px;
  }

  @media (max-width: 968px) {
    font-size: 1.2rem;
    padding: 0.6rem 2.2rem;
    min-width: 300px;
    letter-spacing: 1.4px;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 0.55rem 2rem;
    min-width: 280px;
    letter-spacing: 1.2px;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.5rem 1.5rem;
    min-width: 250px;
    letter-spacing: 1px;
    white-space: nowrap;
  }
`;

