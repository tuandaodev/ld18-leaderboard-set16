import styled from 'styled-components';
import bg1 from '../../../../img/f1/bg.png';
import btn from '../../../../img/f1/btn.png';
import btnActive from '../../../../img/f1/btn_active.png';
import videoBorder from '../../../../img/f1/video_border.png';

export const Frame1Wrapper = styled.section`
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  background-image: url(${bg1});
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  scroll-snap-align: start;
  scroll-snap-stop: always;

  @media (max-width: 1600px) {
    padding: 3rem 1.5rem;
  }

  @media (max-width: 1366px) {
    padding: 2.5rem 1rem;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    padding: 2rem 0.4rem 0 0.4rem;
    height: 400px;
    background-size: 100% 100%;
    scroll-snap-align: none;
    scroll-snap-stop: normal;
  }
`;

export const ContentContainer = styled.div`
  width: 100%;
  max-width: 1800px;
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: center;
  gap: 4rem;
  margin: 0 auto;

  @media (max-width: 1600px) {
    max-width: 1400px;
    gap: 3rem;
    zoom: 88%;
  }

  @media (max-width: 1366px) {
    max-width: 1200px;
    gap: 2.5rem;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    max-width: 600px;
    gap: 1rem;
    align-items: center;
  }
`;

export const Column1 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;
  flex: 1;
  max-width: 50%;

  @media (max-width: 1920px) {
   gap: 1.75rem;
  }

  @media (max-width: 1600px) {
    gap: 1.5rem;
  }

  @media (max-width: 1366px) {
    gap: 1.25rem;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    gap: 0.64rem;
  }
`;

export const Column2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;
  flex: 1;
  max-width: 50%;

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    gap: 0.64rem;
  }
`;

export const VideoPlayerContainer = styled.div`
  width: 854px;
  height: 492px;
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

  iframe,
  video {
    width: 854px;
    height: 492px;
    border: none;
    object-fit: cover;
    position: relative;
    z-index: 1;
  }

  @media (max-width: 1600px) {
    width: 680px;
    height: 392px;

    iframe,
    video {
      width: 680px;
      height: 392px;
    }
  }

  @media (max-width: 1366px) {
    width: 580px;
    height: 335px;

    iframe,
    video {
      width: 580px;
      height: 335px;
    }
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    width: 256px;
    height: 144px;

    iframe,
    video {
      width: 256px;
      height: 144px;
    }
  }
`;

export const VideoButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  height: 75px;

  @media (max-width: 1600px) {
    height: 65px;
    gap: 0.8rem;
  }

  @media (max-width: 1366px) {
    height: 60px;
    gap: 0.7rem;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    height: 38.4px;
    gap: 0.4rem;
  }
`;

export const VideoButton = styled.button<{ active?: boolean }>`
  padding: 0.75rem 1.5rem;
  height: ${props => props.active ? '75px' : '45px'};
  background-image: url(${props => props.active ? btnActive : btn});
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-color: transparent;
  border: none;
  // border-radius: 8px;
  color: ${props => props.active ? '#fff' : '#08175a'};
  font-family: 'GS3 Sachsenwald', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(0);

  }

  @media (max-width: 1600px) {
    font-size: 0.85rem;
    min-width: 180px;
    height: ${props => props.active ? '65px' : '40px'};
    padding: 0.65rem 1.3rem;
  }

  @media (max-width: 1366px) {
    font-size: 0.8rem;
    min-width: 160px;
    height: ${props => props.active ? '60px' : '38px'};
    padding: 0.6rem 1.2rem;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    font-size: 0.544rem;
    min-width: 72px;
    height: ${props => props.active ? '36.8px' : '25.6px'};
    padding: 0.4rem 0.72rem;
  }
`;

export const CTAButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 0;
  width: auto;
  height: auto;

  img {
    display: block;
    width: auto;
    height: 95px;
    max-width: 100%;
  }

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.2) drop-shadow(-13px 11px 35px rgba(12, 110, 170, 0.46));
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 1920px) {
    img {
      height: 85px;
    }
  }

  @media (max-width: 1600px) {
    img {
      height: 75px;
    }
  }

  @media (max-width: 1366px) {
    img {
      height: 65px;
    }
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    img {
      height: 38.4px;
    }
  }
`;

export const TitleImage = styled.img`
  height: 241px;
  width: auto;

  @media (max-width: 1600px) {
    height: 200px;
  }

  @media (max-width: 1366px) {
    height: 170px;
  }

  @media (max-width: 1024px) and (orientation: landscape) {
    height: 96px;
  }
`;

export const DescImage = styled.img`
  height: 307px;
  width: auto;

  @media (max-width: 1600px) {
    height: 255px;
  }

  @media (max-width: 1366px) {
    height: 220px;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    height: 88px;
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  max-width: 90%;
`;

export const TitleTop = styled.img`
  height: 67px;
  width: auto;
  object-fit: contain;
  margin-top: 90px;
`;

export const TitleMain = styled.img`
  height: 450px;
  width: auto;
  object-fit: contain;
  margin: -90px 0 -120px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 50px;
  // margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

export const DescriptionText = styled.p`
  color: #fff;
  font-size: 2rem;
  text-align: center;
  margin-top: 1.5rem;
  line-height: 1.7;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.9), 0 4px 12px rgba(161, 24, 24, 0.8), 0 0 20px rgba(161, 24, 24, 0.6);
  max-width: 1200px;
`;

export const MobileImageContainer = styled.div`
  display: none;
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

