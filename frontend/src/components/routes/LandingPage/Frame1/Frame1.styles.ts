import bg1 from '@images/f1/bg.png';
import bgMobile from '@images/mobile/f1/bg.png';
import styled from 'styled-components';

export const Frame1Wrapper = styled.section`
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  background-image: url(${bg1});
  background-size: cover;
  background-position: top;
  // background-position-y: 60px;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 4rem 0;

  @media (max-width: 1920px) {
    padding: 3rem 0;
  }

  @media (max-width: 1366px) {
    padding: 2rem 0;
  }

  @media (max-width: 768px) {
    height: 565px;
    min-height: 565px;
    background-image: url(${bgMobile});
    background-size: cover;
    padding: 0.5rem 0 2rem 0;
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  max-width: 90%;

  @media (max-width: 768px) {
    max-width: 95%;
    gap: 0.75rem;
    padding: 0 0.5rem;
  }
`;

export const TitleTop = styled.img`
  height: 67px;
  width: auto;
  object-fit: contain;
  margin-top: 90px;

  @media (max-width: 1920px) {
    height: 50px;
    margin-top: 90px;
  }

  @media (max-width: 1600px) {
    height: 50px;
    margin-top: 50px;
  }

  @media (max-width: 768px) {
    height: 35px;
    margin-top: 5px;
  }
`;

export const TitleMain = styled.img`
  height: 450px;
  width: auto;
  object-fit: contain;
  margin: -90px 0 -120px;

  @media (max-width: 2560px) {
    height: 400px;
    margin: -70px 0 -100px;
  }

  @media (max-width: 1920px) {
    height: 300px;
    margin: -60px 0 -85px;
  }

  @media (max-width: 1600px) {
    height: 250px;
    margin: -50px 0 -75px;
  }

  @media (max-width: 768px) {
    height: 140px;
    margin: -50px 0 -73px;
    max-width: 100%;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 50px;
  // margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  @media (max-width: 1920px) {
    gap: 35px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const DescriptionText = styled.p`
  color: #fff;
  font-size: 2rem;
  text-align: center;
  margin-top: 1.5rem;
  line-height: 1.7;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.9), 0 4px 12px rgba(161, 24, 24, 0.8), 0 0 20px rgba(161, 24, 24, 0.6);
  max-width: 1200px;

  @media (max-width: 2560px) {
    font-size: 1.75rem;
    margin-top: 1.75rem;
    max-width: 900px;
  }

  @media (max-width: 1920px) {
    font-size: 1.25rem;
    margin-top: 1.25rem;
    max-width: 700px;
  }

  @media (max-width: 1366px) {
    font-size: 1.125rem;
    margin-top: 1.25rem;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
    margin-top: 1rem;
    line-height: 1.4;
    max-width: 100%;
    padding: 0 1.5rem;
  }
`;

export const MobileImageContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0 1rem;
  }
`;

export const MobileImage = styled.img`
  width: auto;
  height: auto;
  max-width: 30%;
  object-fit: contain;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const MobileImageBangHoi = styled(MobileImage)`
  margin-top: 80px;
`;

