import styled from 'styled-components';
import floatBg from '../../../img/float/float_bg.png';

export const LandingPageContainer = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  scroll-behavior: smooth;
`;

export const FloatTopupWrapper = styled.div`
  position: fixed;
  right: 0px;
  bottom: 30px;
  width: 521px;
  height: 324px;
  background-image: url(${floatBg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 1000;
  display: flex;
  align-items: end;
  justify-content: center;
  pointer-events: none;

  /* 1920px and below */
  @media (max-width: 1920px) {
    bottom: 30px;
    width: 521px;
    height: 324px;
    right: -70px;
  }

  /* 1600px and below */
  @media (max-width: 1600px) {
    bottom: 10px;
    width: 380px;
    height: 235px;
    right: -50px;
  }

  /* Tablet and below (768px) */
  @media (max-width: 768px) {
    bottom: 10px;
    right: -32px;
    width: 300px;
    height: 187px;
  }
`;

export const FloatTopupButton = styled.img`
  width: 317px;
  height: 151px;
  cursor: pointer;
  pointer-events: auto;
  transition: transform 0.2s ease, filter 0.2s ease;
  margin-left: -50px;

  /* 1920px and below */
  @media (max-width: 1920px) {
    width: 317px;
    height: 151px;
    margin-left: -50px;
  }

  /* 1600px and below */
  @media (max-width: 1600px) {
    width: 280px;
    height: 133px;
    margin-left: -40px;
  }

  /* Tablet and below (768px) */
  @media (max-width: 768px) {
    width: 230px;
    height: 109px;
    margin-left: -30px;
  }

  &:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.8));
  }
`;
