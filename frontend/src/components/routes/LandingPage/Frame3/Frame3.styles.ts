import styled from 'styled-components';
import bg3 from '../../../../img/f3/bg.png';
import bgMobile from '@images/mobile/f3/bg.png';
import tabBg from '@images/f3/tab.png';
import tabHoverBg from '@images/f3/tab_hover.png';
import top1Bg from '@images/f3/top1_bg.png';
import top2Bg from '@images/f3/top2_bg.png';
import top3Bg from '@images/f3/top3_bg.png';
import tableBg from '../../../../img/f3/table_bg.png';
import tableHeaderBg from '../../../../img/f3/table_header_bg.png';
import borderLine from '@images/f3/border_line.png';

export const Frame3Wrapper = styled.section`
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  background-image: url(${bg3});
  background-size: cover;
  background-position: top;
  // background-position-y: 60px;
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

  @media (max-width: 1366px) {
    padding-top: 20px;
    min-height: 100vh;
    height: auto;
  }

  @media (max-width: 768px) {
    // height: 800px;
    min-height: 600px;
    background-image: url(${bgMobile});
    background-size: 100% 100%;
    padding-top: 30px;
    justify-content: unset;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 20px;
  // margin-bottom: 40px;
  z-index: 10;

  @media (max-width: 1920px) {
    gap: 15px;
  }

  @media (max-width: 1600px) {
    gap: 12px;
  }

  @media (max-width: 1366px) {
    gap: 10px;
  }

  @media (max-width: 768px) {
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
  }
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

  @media (max-width: 1920px) {
    padding: 12px 35px;
    font-size: 16px;
    min-width: 320px;
  }

  @media (max-width: 1600px) {
    padding: 12px 32px;
    font-size: 16px;
    min-width: 300px;
  }

  @media (max-width: 1366px) {
    padding: 10px 25px;
    font-size: 14px;
    min-width: 220px;
  }

  @media (max-width: 768px) {
    padding: 12px 25px;
    font-size: 14px;
    min-width: 150px;
    height: 36px;
  }
`;

export const ContentContainer = styled.div`
  width: 100%;
  // flex: 1;
  background: transparent;
  border: none;
  padding: 20px 30px;
  // overflow-y: auto;
  position: relative;

  @media (max-width: 1920px) {
    padding: 18px 25px;
  }

  @media (max-width: 1600px) {
    padding: 15px 20px;
  }

  @media (max-width: 1366px) {
    padding: 10px 15px;
  }

  @media (max-width: 768px) {
    padding: 10px 5px;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

export const TitleImage = styled.img`
  height: 288px;
  width: auto;
  display: block;
  margin: 0 0 100px 100px;
 
`;

export const RankingsLayout = styled.div`
  display: flex;
  gap: 20px;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 1920px) {
    max-width: 1400px;
    gap: 18px;
    padding: 0 18px;
  }

  @media (max-width: 1600px) {
    gap: 15px;
    padding: 0 15px;
  }

  @media (max-width: 1366px) {
    gap: 12px;
    padding: 0 10px;
    max-width: 100%;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 30px;
  }

  @media (max-width: 768px) {
    gap: 20px;
    padding: 0;
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

  @media (max-width: 1920px) {
    gap: 18px;
  }

  @media (max-width: 1600px) {
    gap: 15px;
  }

  @media (max-width: 1366px) {
    gap: 12px;
  }

  @media (max-width: 1024px) {
    gap: 10px;
  }

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

export const PhanThuongTextImage = styled.img`
  height: 72px;
  width: auto;
  object-fit: contain;
`;

export const Top1Image = styled.img`
  height: 163px;
  width: auto;
  object-fit: contain;
  cursor: pointer;
  transition: transform 0.3s ease, filter 0.3s ease;

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

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
  }

  @media (max-width: 1920px) {
    max-height: 80px;
  }

  @media (max-width: 1600px) {
    max-height: 70px;
  }

  @media (max-width: 1366px) {
    max-height: 60px;
  }

  @media (max-width: 768px) {
    max-height: 50px;
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

  @media (max-width: 1920px) {
    width: ${props => props.$position !== 1 ? '220px' : '240px'};
    height: ${props => props.$position !== 1 ? '610px' : '670px'};
    padding: ${props => props.$position !== 1 ? '28px 18px' : '28px 18px 90px 38px'};
    margin: ${props => props.$position === 1 ? '-52px 0 -9px -22px' : '0'};
  }

  @media (max-width: 1600px) {
    width: ${props => props.$position !== 1 ? '200px' : '220px'};
    height: ${props => props.$position !== 1 ? '550px' : '610px'};
    padding: ${props => props.$position !== 1 ? '25px 15px' : '25px 15px 80px 35px'};
    margin: ${props => props.$position === 1 ? '-48px 0 -8px -20px' : '0'};
  }

  @media (max-width: 1366px) {
    width: ${props => props.$position !== 1 ? '170px' : '185px'};
    height: ${props => props.$position !== 1 ? '470px' : '520px'};
    padding: ${props => props.$position !== 1 ? '20px 12px' : '20px 12px 70px 28px'};
    margin: ${props => props.$position === 1 ? '-40px 0 -6px -15px' : '0'};
  }

  @media (max-width: 1024px) {
    width: ${props => props.$position !== 1 ? '150px' : '165px'};
    height: ${props => props.$position !== 1 ? '420px' : '470px'};
    padding: ${props => props.$position !== 1 ? '18px 10px' : '18px 10px 65px 25px'};
    margin: ${props => props.$position === 1 ? '-35px 0 -5px -12px' : '0'};
    flex: 0 1 auto;
  }

  @media (max-width: 768px) {
    width: ${props => props.$position !== 1 ? '140px' : '160px'};
    height: ${props => props.$position !== 1 ? '370px' : '420px'};
    padding: ${props => props.$position !== 1 ? '15px 10px' : '15px 10px 60px 20px'};
    margin: ${props => props.$position === 1 ? '-30px 0 -8px -10px' : '0'};
  }
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

  @media (max-width: 1920px) {
    width: 190px;
    height: 190px;
  }

  @media (max-width: 1600px) {
    width: 170px;
    height: 170px;
  }

  @media (max-width: 1366px) {
    width: 140px;
    height: 140px;
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
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
  
  @media (max-width: 1920px) {
    width: calc(190px - 6px);
    height: 44px;
    padding: 7px 14px;
    font-size: 15px;
  }

  @media (max-width: 1600px) {
    width: calc(170px - 6px);
    height: 40px;
    padding: 6px 12px;
    font-size: 14px;
  }

  @media (max-width: 1366px) {
    width: calc(140px - 6px);
    height: 36px;
    padding: 5px 10px;
    font-size: 12px;
  }

  @media (max-width: 768px) {
    width: calc(100px - 6px);
    height: 32px;
    padding: 4px 8px;
    font-size: 10px;
  }
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

  @media (max-width: 1920px) {
    font-size: 1.15rem;
    margin-top: 11px;
  }

  @media (max-width: 1600px) {
    font-size: 1.1rem;
    margin-top: 10px;
  }

  @media (max-width: 1366px) {
    font-size: 0.9rem;
    margin-top: 8px;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
    margin-top: 6px;
  }
`;

export const TopScore = styled.div`
  font-size: 2rem;
  line-height: 1;
  font-weight: 700;
  color: #000;
  margin-top: 8px;

  @media (max-width: 1920px) {
    font-size: 1.85rem;
    margin-top: 7px;
  }

  @media (max-width: 1600px) {
    font-size: 1.7rem;
    margin-top: 6px;
  }

  @media (max-width: 1366px) {
    font-size: 1.4rem;
    margin-top: 5px;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-top: 4px;
  }
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
    padding: 18px 18px;
  }

  @media (max-width: 1366px) {
    padding: 12px 12px;
  }

  @media (max-width: 768px) {
    padding: 10px 10px;
    display: none;
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
    grid-template-columns: 70px 1fr 135px;
    gap: 18px;
    font-size: 19px;
  }

  @media (max-width: 1600px) {
    grid-template-columns: 60px 1fr 120px;
    gap: 15px;
    padding: 10px 30px 20px 20px;
    font-size: 18px;
  }

  @media (max-width: 1366px) {
    grid-template-columns: 50px 1fr 100px;
    gap: 12px;
    padding: 8px 15px 15px 15px;
    font-size: 16px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 40px 1fr 80px;
    gap: 8px;
    padding: 6px 10px 12px 10px;
    font-size: 13px;
  }
`;

export const TableContent = styled.div`
  overflow-y: auto;
  max-height: 585px;
  min-height: 400px;
  
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

  @media (max-width: 1920px) {
    max-height: 515px;
  }

  @media (max-width: 1600px) {
    max-height: 470px;
  }

  @media (max-width: 1366px) {
    max-height: 400px;
  }

  @media (max-width: 768px) {
    max-height: 300px;
  }
`;

export const TableRow = styled.div<{ $isEven?: boolean }>`
  display: grid;
  grid-template-columns: 80px 1fr 150px;
  gap: 20px;
  padding: 15px 20px;
  background: ${props => props.$isEven ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};
  color: #00000;
  font-size: 1.25rem;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 215, 0, 0.1);
  }

  @media (max-width: 1920px) {
    grid-template-columns: 70px 1fr 135px;
    gap: 18px;
    font-size: 1.2rem;
  }

  @media (max-width: 1600px) {
    grid-template-columns: 60px 1fr 120px;
    gap: 15px;
    padding: 12px 30px;
    font-size: 1.1rem;
  }

  @media (max-width: 1366px) {
    grid-template-columns: 50px 1fr 100px;
    gap: 12px;
    padding: 10px 15px;
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 40px 1fr 80px;
    gap: 8px;
    padding: 8px 10px;
    font-size: 0.85rem;
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
`;

export const MobileOnly = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    margin: 20px 0 20px 0;
  }
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

  @media (max-width: 768px) {
    display: flex;
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

  @media (max-width: 1920px) {
    max-width: 1400px;
    gap: 28px;
    padding: 0 18px;
  }

  @media (max-width: 1600px) {
    gap: 25px;
    padding: 0 15px;
    max-width: 1200px;
  }

  @media (max-width: 1366px) {
    gap: 20px;
    padding: 0 10px;
    max-width: 900px;
  }

  @media (max-width: 768px) {
    gap: 15px;
    padding: 0px;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 860px;
  margin: 0 auto;

  @media (max-width: 1920px) {
    max-width: 790px;
  }

  @media (max-width: 1600px) {
    max-width: 720px;
  }

  @media (max-width: 1366px) {
    max-width: 600px;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 10px;
  }
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

  @media (max-width: 1920px) {
    padding: 13px 48px 13px 19px;
    font-size: 17px;
    height: 42px;
  }

  @media (max-width: 1600px) {
    padding: 12px 45px 12px 18px;
    font-size: 16px;
    height: 40px;
  }

  @media (max-width: 1366px) {
    padding: 10px 40px 10px 15px;
    font-size: 14px;
    height: 36px;
  }

  @media (max-width: 768px) {
    padding: 8px 35px 8px 12px;
    font-size: 14px;
    height: 32px;
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

  @media (max-width: 1366px) {
    width: 20px;
    height: 20px;
    right: 12px;
  }

  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
    right: 20px;
  }
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
  
  @media (max-width: 1920px) {
    gap: 28px 18px;
    max-height: 750px;
    padding: 0px 9px;
  }
  
  @media (max-width: 1600px) {
    gap: 25px 15px;
    max-height: 700px;
    padding: 0px 8px;
    min-height: 600px;
  }
  
  @media (max-width: 1400px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (max-width: 1366px) {
    gap: 20px 12px;
    max-height: 500px;
    padding: 0px 6px;
    min-height: 400px;
  }
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px 15px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 15px 10px;
    max-height: 600px;
    padding: 0px 5px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px 5px;
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

  @media (max-width: 1366px) {
    padding: 5px;
  }

  @media (max-width: 768px) {
    padding: 0;
  }
`;

export const ParticipantAvatar = styled.img`
  width: 250px;
  height: 250px;
  border: 2px solid #e5e3cb;
  object-fit: cover;

  @media (max-width: 1920px) {
    width: 225px;
    height: 225px;
  }

  @media (max-width: 1600px) {
    width: 200px;
    height: 200px;
  }

  @media (max-width: 1366px) {
    width: 160px;
    height: 160px;
  }

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }
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

  @media (max-width: 1920px) {
    padding: 7px 11px;
    font-size: 0.95rem;
    gap: 3.5px;
    width: 219px;
  }

  @media (max-width: 1600px) {
    padding: 6px 10px;
    font-size: 0.9rem;
    gap: 3px;
    width: 194px;
  }

  @media (max-width: 1366px) {
    padding: 5px 8px;
    font-size: 0.8rem;
    gap: 2px;
    outline: 3px solid #37332d;
    width: 156px;
  }

  @media (max-width: 768px) {
    padding: 4px 6px;
    font-size: 0.7rem;
    gap: 2px;
    outline: 2px solid #37332d;
    width: 116px;
  }
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
    max-width: 30vw;
  }

  @media (max-width: 1366px) {
    max-height: 65vh;
    max-width: 25vw;
  }

  @media (max-width: 1024px) {
    display: none;
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

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
  }

  @media (max-width: 1920px) {
    margin-top: 25px;
  }

  @media (max-width: 1600px) {
    margin-top: 20px;
  }

  @media (max-width: 1366px) {
    margin-top: 15px;
  }

  @media (max-width: 1024px) {
    margin-top: 20px;
  }

  @media (max-width: 768px) {
    margin-top: 15px;
    max-width: 90%;
  }
`;

