import styled from 'styled-components';
import bg4 from '../../../../img/f4/bg.png';
import bgMobile from '@images/mobile/f4/bg.png';
import eventBorder from '../../../../img/f4/event_border.png';
import tenBg from '../../../../img/f4/ten_bg.png';

export const Frame4Wrapper = styled.section`
  width: 100%;
  min-height: 100vh;
  background-image: url(${bg4});
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;

  @media (max-width: 1920px) {
    padding: 60px 30px;
  }

  @media (max-width: 1600px) {
    padding: 50px 25px;
  }

  @media (max-width: 1366px) {
    padding: 45px 20px;
  }

  @media (max-width: 768px) {
    background-image: url(${bgMobile});
    background-size: cover;
    background-position: top;
    padding: 40px 20px;
    flex-direction: column;
  }
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;

  @media (max-width: 1920px) {
    max-width: 1600px;
  }

  @media (max-width: 1600px) {
    max-width: 1400px;
  }

  @media (max-width: 1366px) {
    max-width: 1200px;
  }
`;

export const Column1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: -50px;
  margin-left: -30px;

  @media (max-width: 1920px) {
    margin-right: -40px;
    margin-left: -25px;
  }

  @media (max-width: 1600px) {
    margin-right: -35px;
    margin-left: -20px;
  }

  @media (max-width: 1366px) {
    margin-right: -30px;
    margin-left: -18px;
  }

  @media (max-width: 768px) {
    order: 2;
    margin-right: 0;
    margin-left: 0;
  }
`;

export const ArtImage = styled.img`
  height: 1005px;
  width: auto;

  @media (max-width: 1920px) {
    height: 760px;
  }

  @media (max-width: 1600px) {
    height: 640px;
  }

  @media (max-width: 1366px) {
    height: 550px;
  }
`;

export const Column2 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 1100px;
  align-items: center;

  @media (max-width: 1920px) {
    max-width: 950px;
    gap: 25px;
  }

  @media (max-width: 1600px) {
    max-width: 820px;
    gap: 22px;
  }

  @media (max-width: 1366px) {
    max-width: 700px;
    gap: 20px;
  }

  @media (max-width: 768px) {
    order: 1;
    gap: 20px;
    max-width: 100%;
  }
`;

export const TitleImage = styled.img`
  height: 138px;
  width: auto;
  max-width: none;
  display: block;
  object-fit: contain;

  @media (max-width: 1920px) {
    height: 105px;
  }

  @media (max-width: 1600px) {
    height: 90px;
  }

  @media (max-width: 1366px) {
    height: 78px;
  }
`;

export const DescImage = styled.img`
  width: auto;
  height: 57px;
  max-width: none;
  display: block;
  object-fit: contain;

  @media (max-width: 1920px) {
    height: 43px;
  }

  @media (max-width: 1600px) {
    height: 37px;
  }

  @media (max-width: 1366px) {
    height: 32px;
  }
`;

export const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  margin-top: 10px;

  @media (max-width: 1920px) {
    gap: 30px;
    margin-top: 8px;
  }

  @media (max-width: 1600px) {
    gap: 25px;
    margin-top: 7px;
  }

  @media (max-width: 1366px) {
    gap: 20px;
    margin-top: 6px;
  }
`;

export const EventBox = styled.div`
  position: relative;
  width: 475px;
  height: 275px;
  // aspect-ratio: 16 / 9;
  background-image: url(${eventBorder});
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  padding: 8px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 1920px) {
    width: 360px;
    height: 208px;
    padding: 6px;
  }

  @media (max-width: 1600px) {
    width: 310px;
    height: 180px;
    padding: 5px;
  }

  @media (max-width: 1366px) {
    width: 270px;
    height: 156px;
    padding: 5px;
  }

  @media (max-width: 1024px) {
    padding: 5px;
  }

  @media (max-width: 768px) {
    width: 100%;
    aspect-ratio: 16 / 10;
    padding: 4px;
  }
`;

export const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 4px;
`;

export const EventName = styled.div`
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  width: fit-content;
  max-width: 90%;
  background-image: url(${tenBg});
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  padding: 10px 15px;
  color: #08175a;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  font-family: 'GS3 Sachsenwald', sans-serif;
  min-width: 200px;

  @media (max-width: 1920px) {
    font-size: 18px;
    padding: 8px 12px;
    bottom: -20px;
    min-width: 150px;
  }

  @media (max-width: 1600px) {
    font-size: 16px;
    padding: 7px 11px;
    bottom: -18px;
    min-width: 130px;
  }

  @media (max-width: 1366px) {
    font-size: 14px;
    padding: 6px 10px;
    bottom: -16px;
    min-width: 115px;
  }
`;
