import styled from 'styled-components';
import bg2 from '@images/f2/bg.png';
import bgMobile from '@images/mobile/f2/bg.png';
import bgBorder from '@images/f2/bg_border.png';
import leaderTextBg from '@images/f2/leader_text_bg.png';

export const Frame2Wrapper = styled.section`
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  background-image: url(${bg2});
  background-size: cover;
  background-position: top;
  // background-position-y: 60px;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 100px;
  box-sizing: border-box;
  gap: 20px;

  @media (max-width: 1920px) {
    padding: 60px 75px;
    gap: 15px;
  }

  @media (max-width: 768px) {
    background-image: url(${bgMobile});
    background-size: cover;
    background-position: bottom;
    padding: 40px 5px;
    height: auto;
    min-height: unset;
    gap: 15px;
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  max-width: 1600px;
  // height: 80%;
  align-items: flex-start;
  position: relative;
  z-index: 1;

  @media (max-width: 1920px) {
    gap: 15px;
    max-width: 1200px;
  }

  @media (max-width: 968px) {
    flex-direction: column;
    gap: 20px;
    height: auto;
  }

  @media (max-width: 768px) {
    gap: 15px;
    max-width: 100%;
  }
`;

export const LeftColumn = styled.div`
  flex: 0 1 auto;
  // max-width: 617px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  // height: 100%;

  @media (max-width: 968px) {
    flex: 0 0 auto;
    width: 100%;
    height: auto;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 10px;
  }
`;

export const AvatarWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 517px;
  margin-top: 3px;

  @media (max-width: 1920px) {
    width: 383px;
  }

  @media (max-width: 768px) {
    width: 190px;
  }
`;

export const AvatarImage = styled.img`
  width: 517px;
  height: 517px;
  object-fit: cover;
  display: block;

  @media (max-width: 1920px) {
    height: 383px;
    width: 383px;
  }

  @media (max-width: 768px) {
    height: 190px;
    width: 190px;
    max-width: 100%;
  }
`;

export const AvatarCaption = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  text-align: center;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 10px 60px;
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${leaderTextBg});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  min-height: 90px;

  @media (max-width: 1920px) {
    font-size: 1.5rem;
    padding: 8px 40px;
    min-height: 70px;
  }

  @media (max-width: 968px) {
    font-size: 18px;
    width: 100%;
    min-height: 50px;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 5px 10px;
    min-height: 30px;
  }
`;

export const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;

  @media (max-width: 968px) {
    width: 100%;
    height: auto;
  }

  @media (max-width: 768px) {
    width: 100%;
    gap: 8px;
  }
`;

export const BannerImage = styled.img`
  height: 127px;
  width: auto;

  @media (max-width: 1920px) {
    height: 95px;
    max-width: 100%;
  }

  @media (max-width: 768px) {
    height: 50px;
    width: auto;
    max-width: 100%;
  }
`;

export const ScrollableWrapper = styled.div`
  flex: 1;
  background-image: url(${bgBorder});
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  margin-left: -3px;
  padding: 30px 30px 30px 40px;
  max-height: 484px;
  height: 484px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 1920px) {
    padding: 22px 22px 22px 30px;
    max-height: 360px;
    height: 360px;
    margin-left: -2px;
  }

  @media (max-width: 768px) {
    padding: 15px;
    max-height: 200px;
    height: 200px;
    margin-left: 0;
    background-size: 100% 100%;
  }
`;

export const ScrollableContent = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  padding-right: 10px;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #92805d;
    border-radius: 4px;
    outline: 2px solid #f7f1c7;
    
    &:hover {
      background: #956b40;
    }
  }
`;

export const ContentText = styled.div`
  // color: #ffffff;
  font-size: 18px;
  line-height: 1.8;
  text-align: justify;

  p {
    margin-bottom: 10px;
  }

  @media (max-width: 1920px) {
    font-size: 16px;
    line-height: 1.7;

    p {
      margin-bottom: 8px;
    }
  }

  @media (max-width: 968px) {
    font-size: 14px;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    line-height: 1.5;
    
    p {
      margin-bottom: 6px;
    }
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  width: 100%;
  position: relative;
  z-index: 3;
  gap: 50px;

  @media (max-width: 1920px) {
    gap: 35px;
    margin-top: 8px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    margin-top: 10px;
    width: 100%;
    padding: 0 10px;
  }
`;

export const DecoratorImage = styled.img`
  position: absolute;
  bottom: 10px;
  right: 20px;
  width: auto;
  height: 236px;
  z-index: 2;
  pointer-events: none;
  
  @media (max-width: 1920px) {
    height: 177px;
  }

  @media (max-width: 1366px) {
    height: 150px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;
