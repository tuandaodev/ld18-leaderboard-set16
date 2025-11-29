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
`;

export const Column1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: -50px;

  @media (max-width: 768px) {
    order: 2;
  }
`;

export const ArtImage = styled.img`
  height: 1005px;
  width: auto;
`;

export const Column2 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 1100px;
  align-items: center;

  @media (max-width: 768px) {
    order: 1;
    gap: 20px;
  }
`;

export const TitleImage = styled.img`
  height: 138px;
  width: auto;
  max-width: none;
  display: block;
  object-fit: contain;
`;

export const DescImage = styled.img`
  width: auto;
  height: 57px;
  max-width: none;
  display: block;
  object-fit: contain;
`;

export const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  margin-top: 10px;
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

  @media (max-width: 1366px) {
    padding: 6px;
  }

  @media (max-width: 1024px) {
    padding: 5px;
  }

  @media (max-width: 768px) {
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
`;
