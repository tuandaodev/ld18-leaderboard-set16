import styled from 'styled-components';
import bg5 from '@images/f5/bg.png';
import bgMobile from '@images/mobile/f5/bg.png';

export const Frame5Wrapper = styled.section`
  width: 100%;
  height: auto;
  min-height: 100vh;
  background-image: url(${bg5});
  background-size: cover;
  background-position: top;
  // background-position-y: 60px;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    background-image: url(${bgMobile});
    background-size: 100% 100%;
    height: auto;
    min-height: auto;
    padding: 20px 30px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

export const TitleDecorator = styled.img`
  position: absolute;
  top: 80px;
  left: 120px;
  width: auto;
  height: 550px;
  object-fit: contain;
  pointer-events: none;
  z-index: 1;

  @media (max-width: 1600px) {
    top: 60px;
    left: 60px;
    height: 440px;
  }

  @media (max-width: 1366px) {
    top: 50px;
    left: 60px;
    height: 360px;
  }

  @media (max-width: 1024px) {
    top: 35px;
    left: 30px;
    height: 230px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const MobileTitle = styled.img`
  display: none;

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    max-width: 100%;
    height: auto;
    object-fit: contain;
    margin: 0 auto 15px auto;
    pointer-events: none;
    z-index: 1;
  }
`;

export const MobileMainText = styled.img`
  display: none;

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    max-width: 90%;
    height: auto;
    object-fit: contain;
    margin: -20px auto 10px auto;
    pointer-events: none;
    z-index: 1;
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  gap: 60px;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1400px;
  padding: 40px;
  margin-top: 100px;

  @media (max-width: 1920px) {
    gap: 50px;
    max-width: 1300px;
    padding: 35px;
    margin-top: 80px;
  }

  @media (max-width: 1600px) {
    gap: 40px;
    max-width: 1200px;
    padding: 30px;
    margin-top: 60px;
  }

  @media (max-width: 1366px) {
    gap: 35px;
    max-width: 1100px;
    padding: 25px;
  }

  @media (max-width: 1024px) {
    gap: 30px;
    max-width: 900px;
    padding: 20px;
  }

  @media (max-width: 768px) {
    flex-direction: row;
    gap: 10px;
    padding: 10px 0px;
    margin-top: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 100%;
  }
`;

export const Column = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 600px;
  width: 100%;
  
  img {
    width: 100%;
    height: auto;
    object-fit: contain;
    transition: filter 0.3s ease, opacity 0.3s ease;
    cursor: pointer;

    &:hover {
      filter: drop-shadow(0 10px 30px rgba(121, 59, 2, 0.6));
    }
  }

  @media (max-width: 1920px) {
    max-width: 420px;
  }

  @media (max-width: 1600px) {
    max-width: 380px;
  }

  @media (max-width: 1366px) {
    max-width: 340px;
  }

  @media (max-width: 1024px) {
    max-width: 300px;
  }

  @media (max-width: 768px) {
    max-width: 48%;
    width: 48%;
    flex: 0 0 48%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    img {
      max-width: 100%;
      width: 100%;
      height: auto;
      display: block;
      margin: 0 auto;
    }
  }
`;

