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
  overflow: hidden;

  @media (max-width: 1600px) {
    padding: 60px 80px;
    gap: 30px;
  }

  @media (max-width: 1366px) {
    padding: 50px 60px;
    gap: 25px;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    padding: 32px 24px;
    gap: 16px;
    height: 470px;
    background-size: 100% 100%;
  }
`;

export const FirstRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 1600px;

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    gap: 10px;
  }
`;

export const TitleImage = styled.img`
  height: 204px;
  width: auto;

  @media (max-width: 1600px) {
    height: 150px;
  }

  @media (max-width: 1366px) {
    height: 130px;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    height: 60px;
  }
`;

export const TitleDescImage = styled.img`
  height: 44px;
  width: auto;

  @media (max-width: 1600px) {
    height: 34px;
  }

  @media (max-width: 1366px) {
    height: 28px;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    height: 20px;
  }
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

  @media (max-width: 1600px) {
    max-width: 1100px;
    gap: 12px;
  }

  @media (max-width: 1366px) {
    max-width: 950px;
    gap: 10px;
  }

  @media (max-width: 968px) {
    max-width: 700px;
    gap: 20px;
  }

  @media (max-width: 768px) {
    gap: 15px;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    max-width: 675px;
    gap: 10px;
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
    gap: 15px;
  }

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

export const Col1Image = styled.img`
  width: auto;
  height: 643px;

  @media (max-width: 1600px) {
    height: 500px;
  }

  @media (max-width: 1366px) {
    height: 420px;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    height: 210px;
  }
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

  @media (max-width: 1600px) {
    margin-top: -60px;
    margin-left: 40px;

    img {
      height: 85px;
    }
  }

  @media (max-width: 1366px) {
    margin-top: -50px;
    margin-left: 35px;

    img {
      height: 75px;
    }
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    margin-top: -36px;
    margin-left: 22px;

    img {
      height: 33px;
    }
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
    gap: 15px;
  }

  @media (max-width: 768px) {
    gap: 10px;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    gap: 10px;
  }
`;

export const Col2TextImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  display: block;

  @media (max-width: 1024px) and (orientation: landscape) {
  }
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

  @media (max-width: 1600px) {
    width: 520px;
    height: 300px;
  }

  @media (max-width: 1366px) {
    width: 440px;
    height: 255px;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    width: 260px;
    height: 150px;
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

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    img {
      height: 30px;
    }
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

  @media (max-width: 1600px) {
    margin-top: -85px;
  }

  @media (max-width: 1366px) {
    margin-top: -70px;
  }

  @media (max-width: 968px) {
    width: 100%;
    margin-top: 0;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    margin-top: -40px;
  }
`;

export const Col3Image = styled.img`
  width: auto;
  height: 789px;

  @media (max-width: 1600px) {
    height: 620px;
  }

  @media (max-width: 1366px) {
    height: 530px;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    height: 300px;
  }
`;
