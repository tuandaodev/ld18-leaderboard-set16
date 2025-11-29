import styled from 'styled-components';
import bg2 from '../../../../img/f2/bg.png';
import videoBorder from '../../../../img/f2/video_border.png';

export const Frame2Wrapper = styled.section`
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  background-image: url(${bg2});
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 100px;
  box-sizing: border-box;
  gap: 40px;
`;

export const FirstRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 1600px;
`;

export const TitleImage = styled.img`
  height: 204px;
  width: auto;
`;

export const TitleDescImage = styled.img`
  height: 44px;
  width: auto;
`;

export const SecondRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 1600px;

  @media (max-width: 1920px) {
    max-width: 1200px;
    gap: 15px;
  }

  @media (max-width: 968px) {
    flex-direction: column;
    gap: 20px;
  }

  @media (max-width: 768px) {
    gap: 15px;
  }
`;

export const Column1 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  // gap: 20px;
  flex: 1;

  @media (max-width: 1920px) {
    gap: 15px;
  }

  @media (max-width: 968px) {
    width: 100%;
  }

  @media (max-width: 768px) {
    gap: 15px;
  }
`;

export const Col1Image = styled.img`
  width: auto;
  height: 643px;
`;

export const Col1Button = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 0;
  width: auto;
  height: auto;
  margin-top: -70px;
  margin-left: 50px;

  img {
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
  }

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.2) drop-shadow(-13px 11px 35px rgba(12, 110, 170, 0.46));
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const Column2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  flex: 1;

  @media (max-width: 1920px) {
    gap: 15px;
  }

  @media (max-width: 968px) {
    width: 100%;
  }

  @media (max-width: 768px) {
    gap: 15px;
  }
`;

export const Col2TextImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
`;

export const VideoPlayerContainer = styled.div`
  width: 673px;
  height: 388px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    background-image: url(${videoBorder});
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    pointer-events: none;
    z-index: 2;
  }

  video {
    width: 100%;
    height: 100%;
    border: none;
    object-fit: cover;
    position: relative;
    z-index: 1;
  }
`;

export const ThongTinButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 0;
  width: auto;
  height: auto;
  align-self: end;

  img {
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
  }

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.2) drop-shadow(-13px 11px 35px rgba(12, 110, 170, 0.46));
  }
`;

export const Column3 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  margin-top: -100px;

  @media (max-width: 968px) {
    width: 100%;
  }
`;

export const Col3Image = styled.img`
  width: auto;
  height: 789px;
`;
