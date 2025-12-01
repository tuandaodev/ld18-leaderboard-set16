import tabBg from '@images/f3/tab.png';
import tabHoverBg from '@images/f3/tab_hover.png';
import top1Bg from '@images/f3/top1_bg.png';
import top2Bg from '@images/f3/top2_bg.png';
import top3Bg from '@images/f3/top3_bg.png';
import styled from 'styled-components';
import bg3 from '../../../../img/f3/bg.png';
import tableBg from '../../../../img/f3/table_bg.png';
import tableHeaderBg from '../../../../img/f3/table_header_bg.png';

export const Frame3Wrapper = styled.section`
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  background-image: url(${bg3});
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 50px;

  @media (max-width: 1920px) {
    padding-top: 30px;
  }

  @media (max-width: 1600px) {
    padding-top: 25px;
  }

  @media (max-width: 1366px) {
    padding-top: 20px;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 20px;
  z-index: 10;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  padding: 15px 40px;
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.$active ?  '#000':'#f5efbf'};
  background-image: url(${props => props.$active ? tabBg : tabHoverBg});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  min-width: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-image: url(${tabBg});
    color: #000;
  }
`;

export const ContentContainer = styled.div`
  width: 100%;
  background: transparent;
  border: none;
  padding: 20px 30px;
  // overflow-y: auto;
  position: relative;

  @media (max-width: 1920px) {
    padding: 15px 20px;
  }

  @media (max-width: 1600px) {
    padding: 12px 18px;
  }

  @media (max-width: 1366px) {
    padding: 10px 15px;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  margin-right: auto;


  @media (max-width: 1920px) {
    max-width: 1400px;
    margin: 0 auto 0 0;
  }

  @media (max-width: 1600px) {
    max-width: 1200px;
  }

  @media (max-width: 1366px) {
    max-width: 1050px;
  }
`;

export const TitleImage = styled.img`
  height: 288px;
  width: auto;
  display: block;
  margin: 0 0 100px 100px;

  @media (max-width: 1920px) {
    height: 220px;
    margin: 0 0 60px 70px;
  }

  @media (max-width: 1600px) {
    height: 190px;
    margin: 0 0 50px 60px;
  }

  @media (max-width: 1366px) {
    height: 165px;
    margin: 0 0 40px 50px;
  }
`;

export const RankingsLayout = styled.div`
  display: flex;
  gap: 20px;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 1920px) {
    max-width: 1400px;
    gap: 15px;
    padding: 0 15px;
  }

  @media (max-width: 1600px) {
    max-width: 1200px;
    gap: 12px;
    padding: 0 12px;
  }

  @media (max-width: 1366px) {
    max-width: 1050px;
    gap: 10px;
    padding: 0 10px;
  }
`;

export const TopThreeContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 100%;
  justify-content: center;
  align-items: center;
`;

export const PhanThuongTextImage = styled.img`
  height: 72px;
  width: auto;
  object-fit: contain;

  @media (max-width: 1920px) {
    height: 55px;
  }

  @media (max-width: 1600px) {
    height: 48px;
  }

  @media (max-width: 1366px) {
    height: 42px;
  }
`;

export const Top1Image = styled.img`
  height: 163px;
  width: auto;
  object-fit: contain;
  cursor: pointer;
  transition: transform 0.3s ease, filter 0.3s ease;

  @media (max-width: 1920px) {
    height: 125px;
  }

  @media (max-width: 1600px) {
    height: 105px;
  }

  @media (max-width: 1366px) {
    height: 90px;
  }

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
`;

export const Top2Image = styled.img`
  height: 131px;
  width: auto;
  object-fit: contain;
  cursor: pointer;
  transition: transform 0.3s ease, filter 0.3s ease;

  @media (max-width: 1920px) {
    height: 100px;
  }

  @media (max-width: 1600px) {
    height: 85px;
  }

  @media (max-width: 1366px) {
    height: 73px;
  }

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
`;

export const Top3Image = styled.img`
  height: 122px;
  width: auto;
  object-fit: contain;
  margin-top: 10px;
  cursor: pointer;
  transition: transform 0.3s ease, filter 0.3s ease;

  @media (max-width: 1920px) {
    height: 93px;
    margin-top: 8px;
  }

  @media (max-width: 1600px) {
    height: 79px;
    margin-top: 7px;
  }

  @media (max-width: 1366px) {
    height: 68px;
    margin-top: 6px;
  }

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
`;

export const RulesButtonImage = styled.img`
  height: auto;
  width: auto;
  object-fit: contain;
  cursor: pointer;
  transition: transform 0.3s ease, filter 0.3s ease;

  @media (max-width: 1920px) {
    max-height: 80px;
  }

  @media (max-width: 1600px) {
    max-height: 68px;
  }

  @media (max-width: 1366px) {
    max-height: 58px;
  }

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
`;

export const TopCard = styled.div<{ $position: number }>`
  background-image: url(${props => {
    // TOP 1 uses top1_bg, TOP 2 uses top2_bg, TOP 3 uses top3_bg
    if (props.$position === 1) return top1Bg;
    if (props.$position === 2) return top2Bg;
    return top3Bg;
  }});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  padding: ${props => props.$position !== 1 ? '30px 20px' : '30px 20px 100px 42px'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  width: ${props => props.$position !== 1 ? '245px' : '270px'};
  height: ${props => props.$position !== 1 ? '680px' : '750px'};
  min-height: ${props => props.$position === 1 ? '350px' : 'auto'};
  flex: 1;
  color: #fff;
  transition: filter 0.3s ease;
  margin: ${props => props.$position === 1 ? '-59px 0 -10px -25px' : '0'};
  // padding-left: ${props => props.$position === 1 ? '42px' : '0'};
`;

export const TopCardLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  text-align: center;
`;

export const TopPosition = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const TopAvatar = styled.img`
  width: 212px;
  height: 212px;
  border: 2px solid #93815e;
  object-fit: cover;
`;

export const TopNameDisplay = styled.div`
  width: calc(212px - 6px);
  height: 48px;
  padding: 8px 16px;
  border: 1px solid #555042;
  outline: 3px solid #37332d;
  background: #403d2b;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TopName = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

export const TopScoreLabel = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #5b4933;
  margin-top: 12px;
  text-transform: uppercase;
`;

export const TopScore = styled.div`
  font-size: 2rem;
  line-height: 1;
  font-weight: 700;
  color: #000;
  margin-top: 8px;
`;

export const RankingTableWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const RankingTableContainer = styled.div`
  width: 100%;
  background-image: url(${tableBg});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  box-shadow: 0px 0px 21px 3px #8c9ce4;
  overflow: visible;
  display: flex;
  flex-direction: column;
  padding: 20px 20px;
  position: relative;

  @media (max-width: 1920px) {
    padding: 15px 15px;
  }

  @media (max-width: 1600px) {
    padding: 12px 12px;
  }

  @media (max-width: 1366px) {
    padding: 10px 10px;
  }
`;

export const TableTitleImage = styled.img`
  width: auto;
  height: 140px;
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;

  @media (max-width: 1920px) {
    height: 105px;
    top: -60px;
  }

  @media (max-width: 1600px) {
    height: 90px;
    top: -50px;
  }

  @media (max-width: 1366px) {
    height: 78px;
    top: -45px;
  }
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 150px;
  gap: 20px;
  padding: 10px 20px 10px 20px;
  font-weight: 700;
  font-size: 20px;
  color: #0b1054;
  text-transform: uppercase;
  position: relative;
  background-image: url(${tableHeaderBg});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  margin-top: 40px;
  font-family: 'GS3 ITC Giovanni', sans-serif;

  @media (max-width: 1920px) {
    font-size: 18px;
    padding: 8px 15px;
    gap: 15px;
    margin-top: 30px;
    grid-template-columns: 70px 1fr 130px;
  }

  @media (max-width: 1600px) {
    font-size: 16px;
    padding: 7px 12px;
    gap: 12px;
    margin-top: 25px;
    grid-template-columns: 60px 1fr 110px;
  }

  @media (max-width: 1366px) {
    font-size: 14px;
    padding: 6px 10px;
    gap: 10px;
    margin-top: 22px;
    grid-template-columns: 55px 1fr 100px;
  }
`;

export const TableContent = styled.div`
  overflow-y: auto;
  max-height: 585px;
  min-height: 400px;

  @media (max-width: 1920px) {
    max-height: 450px;
    min-height: 320px;
  }

  @media (max-width: 1600px) {
    max-height: 380px;
    min-height: 280px;
  }

  @media (max-width: 1366px) {
    max-height: 330px;
    min-height: 240px;
  }
  
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

export const TableRow = styled.div<{ $isEven?: boolean }>`
  display: grid;
  grid-template-columns: 80px 1fr 150px;
  gap: 20px;
  padding: 15px 20px;
  background: ${props => props.$isEven ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};
  color: #ffffff;
  font-size: 1.25rem;
  transition: background 0.2s ease;

  @media (max-width: 1920px) {
    font-size: 1.1rem;
    padding: 12px 15px;
    gap: 15px;
    grid-template-columns: 70px 1fr 130px;
  }

  @media (max-width: 1600px) {
    font-size: 1rem;
    padding: 10px 12px;
    gap: 12px;
    grid-template-columns: 60px 1fr 110px;
  }

  @media (max-width: 1366px) {
    font-size: 0.9rem;
    padding: 8px 10px;
    gap: 10px;
    grid-template-columns: 55px 1fr 100px;
  }

  &:hover {
    background: rgba(255, 215, 0, 0.1);
  }
`;

export const TableCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 44px;
  min-width: 0;
  text-overflow: ellipsis;

  @media (max-width: 1920px) {
    min-height: 38px;
  }

  @media (max-width: 1600px) {
    min-height: 32px;
  }

  @media (max-width: 1366px) {
    min-height: 28px;
  }
`;

export const MobileOnly = styled.div`
  display: none;
`;

export const MobileRankingButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 700;
  color: #000;
  background-image: url(${tabBg});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  min-width: 250px;
  height: 36px;
  display: none;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &:hover {
    filter: brightness(1.05);
  }
`;

// Participants styles
export const ParticipantsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 15px 50px 15px 20px;
  font-size: 18px;
  color: #000;
  background: #fff;
  // border: 2px solid #93815e;
  border: none;
  border-radius: 50px;
  outline: none;
  height: 45px;
  
  &::placeholder {
    color: #999;
  }
  
  &:focus {
    border-color: #5b4933;
  }
`;

export const SearchIcon = styled.img`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  pointer-events: none;
`;

export const ParticipantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 30px 20px;
  justify-items: center;
  max-height: 800px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0px 10px;
  min-height: 600px;
  
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

export const ParticipantItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  transition: all 0.3s ease;
  justify-self: center;
  width: fit-content;
  
  &:hover {
    // background: rgba(255, 255, 255, 0.1);
    transform: translateY(-5px);
  }
`;

export const ParticipantAvatar = styled.img`
  width: 250px;
  height: 250px;
  border: 2px solid #e5e3cb;
  object-fit: cover;
`;

export const ParticipantTextWrapper = styled.div`
  width: 244px;
  padding: 8px 12px;
  border: 1px solid #625c51;
  outline: 4px solid #37332d;
  background: #383530;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 4px;
  box-sizing: border-box;
`;

export const ParticipantLabel = styled.div`
  font-weight: 700;
  color: #bda982;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const ParticipantNameText = styled.span`
  font-weight: 600;
  color: #fff;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

export const MainArtImage = styled.img`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: auto;
  width: auto;
  max-height: 80vh;
  max-width: 40vw;
  z-index: 1;
  pointer-events: none;

  @media (max-width: 1920px) {
    max-height: 75vh;
    max-width: 35vw;
  }

  @media (max-width: 1600px) {
    max-height: 70vh;
    max-width: 32vw;
  }

  @media (max-width: 1366px) {
    max-height: 65vh;
    max-width: 30vw;
  }
`;

export const CTAButton = styled.img`
  width: auto;
  height: auto;
  max-width: 100%;
  cursor: pointer;
  transition: transform 0.3s ease, filter 0.3s ease;
  margin-top: 30px;
  align-self: center;

  @media (max-width: 1920px) {
    margin-top: 20px;
    max-height: 60px;
  }

  @media (max-width: 1600px) {
    margin-top: 18px;
    max-height: 52px;
  }

  @media (max-width: 1366px) {
    margin-top: 15px;
    max-height: 45px;
  }

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
`;

