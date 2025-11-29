import styled from 'styled-components';
import bg4 from '@images/f4/bg.png';
import bgMobile from '@images/mobile/f4/bg.png';
import textBg from '@images/f4/text_bg.png';
import ctaBg from '@images/f4/cta.png';

export const Frame4Wrapper = styled.section`
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  background-image: url(${bg4});
  background-size: cover;
  background-position: top;
  // background-position-y: 60px;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;

  @media (max-width: 768px) {
    background-image: url(${bgMobile});
    background-size: cover;
    background-position: top;
    height: 400px;
    min-height: 400px;
    justify-content: center;
    align-items: center;
    padding: 20px 15px;
  }
`;

export const TextContainer = styled.div`
  background-image: url(${textBg});
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px 80px;
  max-width: 1200px;
  text-align: center;

  @media (max-width: 1920px) {
    padding: 18px 70px;
    max-width: 1100px;
  }

  @media (max-width: 1366px) {
    padding: 15px 50px;
    max-width: 900px;
  }

  @media (max-width: 768px) {
    padding: 15px 30px;
    max-width: 100%;
    width: 100%;
    // margin-top: -150px;
  }
`;

export const TextContent = styled.p`
  font-size: 1.25rem;
  line-height: 1.8;
  color: #ffffff;
  margin: 0;
  text-shadow: 1px 1px 3px rgb(0 0 0);

  @media (max-width: 1920px) {
    font-size: 1.15rem;
    line-height: 1.75;
  }

  @media (max-width: 1366px) {
    font-size: 1rem;
    line-height: 1.7;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    line-height: 1.6;
  }
`;

export const CTAButton = styled.button`
  background-image: url(${ctaBg});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-color: transparent;
  border: none;
  width: 400px;
  height: 85px;
  margin: 20px 0 80px 0;
  cursor: pointer;
  transition: transform 0.2s ease;

  @media (max-width: 1920px) {
    width: 360px;
    height: 75px;
    margin: 18px 0 70px 0;
  }

  @media (max-width: 1366px) {
    width: 320px;
    height: 65px;
    margin: 15px 0 60px 0;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 250px;
    height: 55px;
    margin: 5px 0 0px 0;
  }

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;

