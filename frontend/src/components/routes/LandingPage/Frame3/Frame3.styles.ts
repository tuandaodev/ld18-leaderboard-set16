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
  scroll-snap-align: start;
  scroll-snap-stop: always;

  @media (max-width: 1920px) {
    padding-top: 30px;
  }

  @media (max-width: 1600px) {
    padding-top: 25px;
  }

  @media (max-width: 1366px) {
    padding-top: 20px;
  }

  @media (max-width: 1024px) and (orientation: landscape) {
    height: 480px;
    padding-top: 16px;
    background-size: 100% 100%;
    scroll-snap-align: none;
    scroll-snap-stop: normal;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 20px;
  z-index: 10;
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

  @media (max-width: 1024px) and (orientation: landscape) {
    padding: 8px 12px;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  margin-left: min(10%, 300px);

  @media (max-width: 2560px) {
    margin-left: 200px;
  }

  @media (max-width: 1920px) {
    max-width: 1400px;
    margin-left: 50px;
  }

  @media (max-width: 1600px) {
    max-width: 1200px;
    margin-left: 30px;
  }

  @media (max-width: 1366px) {
    max-width: 1050px;
    margin-left: 20px;
  }

  @media (max-width: 1024px) and (orientation: landscape) {
    margin-left: 0px;
    max-width: 840px;
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

  @media (max-width: 1024px) and (orientation: landscape) {
    height: 80px;
    margin: 0 0 24px 32px;
  }
`;

export const RankingsLayout = styled.div`
  display: flex;
  gap: 20px;
  max-width: 1500px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 1920px) {
    max-width: 1300px;
    gap: 15px;
    padding: 0 15px;
  }

  @media (max-width: 1600px) {
    max-width: 1100px;
    gap: 12px;
    padding: 0 12px;
  }

  @media (max-width: 1366px) {
    max-width: 900px;
    gap: 10px;
    padding: 0 10px;
  }

  @media (max-width: 1024px) and (orientation: landscape) {
    max-width: 650px;
    gap: 8px;
    padding: 0 8px;
    margin: 0 0 0 25px;
  }
`;

export const TopThreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 0 0 auto;
  width: fit-content;
  align-items: center;

  @media (max-width: 1024px) and (orientation: landscape) {
    gap: 8px;
  }
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

  @media (max-width: 1024px) and (orientation: landscape) {
    height: 33.6px;
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

  @media (max-width: 1024px) and (orientation: landscape) {
    height: 64px;
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

  @media (max-width: 1024px) and (orientation: landscape) {
    height: 52px;
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

  @media (max-width: 1024px) and (orientation: landscape) {
    height: 48px;
    margin-top: 4px;
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

  @media (max-width: 1024px) and (orientation: landscape) {
    max-height: 24px;
  }

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
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
  max-width: 800px;

  @media (max-width: 1920px) {
    padding: 15px 15px;
    max-width: 700px;
  }

  @media (max-width: 1600px) {
    padding: 12px 12px;
    max-width: 600px;
  }

  @media (max-width: 1366px) {
    padding: 10px 10px;
    max-width: 500px;
  }

  @media (max-width: 1024px) and (orientation: landscape) {
    padding: 8px 8px;
    max-width: 400px;
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

  @media (max-width: 1024px) and (orientation: landscape) {
    height: 48px;
    top: -24px;
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

  @media (max-width: 1024px) and (orientation: landscape) {
    font-size: 11.2px;
    padding: 4.8px 8px;
    gap: 8px;
    margin-top: 17.6px;
    grid-template-columns: 44px 1fr 80px;
  }
`;

export const TableContent = styled.div`
  overflow-y: auto;
  max-height: 450px;
  min-height: 400px;

  @media (max-width: 1920px) {
    max-height: 400px;
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

  @media (max-width: 1024px) and (orientation: landscape) {
    max-height: 200px;
    min-height: 160px;
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

  @media (max-width: 1024px) and (orientation: landscape) {
    font-size: 0.72rem;
    padding: 6.4px 8px;
    gap: 8px;
    grid-template-columns: 44px 1fr 80px;
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

  @media (max-width: 1024px) and (orientation: landscape) {
    min-height: 22.4px;
  }
`;

export const MobileOnly = styled.div`
  display: none;
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

  @media (max-width: 1024px) and (orientation: landscape) {
    max-height: 300px;
    max-width: 24vw;
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

  @media (max-width: 1024px) and (orientation: landscape) {
    margin-top: 12px;
    max-height: 36px;
  }

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
`;

