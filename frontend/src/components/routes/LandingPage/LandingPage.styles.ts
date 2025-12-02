import styled from 'styled-components';
import floatBg from '../../../img/float/float_bg.png';

export const LandingPageContainer = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;

  @media (max-width: 1024px) and (orientation: landscape) {
    scroll-snap-type: none;
  }
`;

export const PortraitOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at top, #1a2640, #050814 60%, #020308);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  color: #ffffff;
  z-index: 2000;
`;

export const PortraitTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;

  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

export const PortraitDescription = styled.div`
  font-size: 16px;
  line-height: 1.5;
  max-width: 480px;
  opacity: 0.9;

  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

export const FloatTopupWrapper = styled.div`
  position: fixed;
  right: 0px;
  bottom: 30px;
  width: 313px;
  height: 194px;
  background-image: url(${floatBg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 1000;
  display: flex;
  align-items: end;
  justify-content: center;
  pointer-events: none;
  transition: transform 0.2s ease, filter 0.2s ease;

  /* 1920px and below */
  @media (max-width: 1920px) {
    bottom: 30px;
    width: 313px;
    height: 194px;
    right: 0;
  }

  /* 1600px and below */
  @media (max-width: 1600px) {
    bottom: 10px;
    width: 228px;
    height: 141px;
    right: 0;
  }

  /* Tablet and below (768px) */
  @media (max-width: 768px) {
    bottom: 10px;
    right: 0;
    width: 180px;
    height: 112px;
  }

  @media (max-width: 1024px) and (orientation: landscape) {
    bottom: 8px;
    right: -24px;
    width: 144px;
    height: 90px;
  }

  &:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.8));
  }
`;

export const FloatTopupButton = styled.img`
  width: 190px;
  height: 91px;
  cursor: pointer;
  pointer-events: auto;
  transition: transform 0.2s ease, filter 0.2s ease;
  margin-left: -30px;

  /* 1920px and below */
  @media (max-width: 1920px) {
    width: 190px;
    height: 91px;
    margin-left: -30px;
  }

  /* 1600px and below */
  @media (max-width: 1600px) {
    width: 168px;
    height: 80px;
    margin-left: -24px;
  }

  /* Tablet and below (768px) */
  @media (max-width: 768px) {
    width: 138px;
    height: 65px;
    margin-left: -18px;
  }

  // &:hover {
  //   transform: scale(1.05);
  //   filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.8));
  // }

  @media (max-width: 1024px) and (orientation: landscape) {
    width: 120px;
    height: 57px;
    margin-left: -16px;
  }
`;
