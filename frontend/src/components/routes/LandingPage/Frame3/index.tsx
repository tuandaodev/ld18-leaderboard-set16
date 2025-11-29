import titleImg from '../../../../img/f3/title.png';
import phanThuongTextImg from '../../../../img/f3/phan thuong text.png';
import top1Img from '../../../../img/f3/top1.png';
import top2Img from '../../../../img/f3/top2.png';
import top3Img from '../../../../img/f3/top3.png';
import btnRulesImg from '../../../../img/f3/btn_rules.png';
import tableTitleImg from '../../../../img/f3/table_title.png';
import mainArtImg from '../../../../img/f3/MAIN ART.png';
import ctaImg from '../../../../img/f3/cta.png';
import { useState } from "react";
import useAxiosSWR from "@components/api/useAxiosSWR";
import { ENDPOINTS } from "@components/api/endpoints";
import LeaderDetailPopup from "./LeaderDetailPopup";
import {
  ContentContainer,
  ContentWrapper,
  Frame3Wrapper,
  RankingsLayout,
  RankingTableContainer,
  TableTitleImage,
  MobileOnly,
  TableCell,
  TableContent,
  TableHeader,
  TableRow,
  TitleImage,
  TopThreeContainer,
  PhanThuongTextImage,
  Top1Image,
  Top2Image,
  Top3Image,
  RulesButtonImage,
  MainArtImage,
  CTAButton,
  RankingTableWrapper
} from "./Frame3.styles";
import PrimaryButton from "../PrimaryButton";
import RankingTableModal from "./RankingTableModal";

interface LeaderboardItem {
  id: number;
  fullName: string;
  avatar: string | null;
  totalPoint: number;
}

interface GetLeaderboardResponse {
  success: boolean;
  data: LeaderboardItem[];
}

export default function Frame3() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [selectedLeaderId, setSelectedLeaderId] = useState<number | null>(null);
  
  // Fetch leaderboard from API
  const { data: leaderboardData, error: leaderboardError, isLoading: isLoadingLeaderboard } = useAxiosSWR<GetLeaderboardResponse>(
    ENDPOINTS.getLeaderboard,
    {
      forSWR: {
        revalidateOnMount: true,
      }
    }
  );
  
  const handleCardClick = (leaderId: number) => {
    setSelectedLeaderId(leaderId);
    setIsPopupOpen(true);
  };
  
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedLeaderId(null);
  };

  return (
    <Frame3Wrapper id="ranking">
      <ContentContainer>
        <LeaderDetailPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          leaderId={selectedLeaderId}
        />
        <ContentWrapper>
          <TitleImage src={titleImg} alt="Bảng xếp hạng nổi bật" />
          {isLoadingLeaderboard ? (
            <div style={{ textAlign: "center", padding: "20px", fontSize: '1.5rem', fontWeight: 'bold' }}>
              Đang tải...
            </div>
          ) : leaderboardError ? (
            <div style={{ textAlign: "center", padding: "20px", fontSize: '1.5rem', fontWeight: 'bold', color: 'red' }}>
              Lỗi khi tải dữ liệu
            </div>
          ) : leaderboardData?.data ? (
            <RankingsLayout>
              {/* Left: Top 3 Images */}
              <TopThreeContainer>
                <PhanThuongTextImage src={phanThuongTextImg} alt="Phần thưởng" />
                <Top1Image src={top1Img} alt="Top 1" />
                <Top2Image src={top2Img} alt="Top 2" />
                <Top3Image src={top3Img} alt="Top 3" />
                <RulesButtonImage src={btnRulesImg} alt="Thể lệ sự kiện" />
              </TopThreeContainer>

              {/* Right: Ranking Table */}
              <RankingTableWrapper>
                <RankingTableContainer>
                  <TableTitleImage src={tableTitleImg} alt="Bảng xếp hạng" />
                  <TableHeader>
                    <TableCell style={{ whiteSpace: 'nowrap' }}>STT</TableCell>
                    <TableCell style={{ whiteSpace: 'nowrap' }}>RIOT ID</TableCell>
                    <TableCell style={{ whiteSpace: 'nowrap' }}>ĐIỂM</TableCell>
                  </TableHeader>
                  <TableContent>
                    {leaderboardData.data.map((leader, index) => {
                      const rank = index + 1; // Starting from rank 4
                      
                      return (
                        <TableRow 
                          key={leader.id} 
                          $isEven={index % 2 === 0}
                          onClick={() => handleCardClick(leader.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <TableCell>{rank}</TableCell>
                          <TableCell>{leader.fullName}</TableCell>
                          <TableCell>{leader.totalPoint?.toLocaleString('vi-VN') || '0'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableContent>
                </RankingTableContainer>
                <CTAButton src={ctaImg} alt="Tham Gia Ngay" />
              </RankingTableWrapper>
            </RankingsLayout>
          ) : null}

          
          {/* <MobileOnly>
            <PrimaryButton onClick={() => setIsRankingModalOpen(true)}>
              CHI TIẾT BẢNG XẾP HẠNG
            </PrimaryButton>
          </MobileOnly> */}

          <RankingTableModal
            isOpen={isRankingModalOpen}
            onClose={() => setIsRankingModalOpen(false)}
            data={leaderboardData?.data}
          />
        </ContentWrapper>
        <MainArtImage src={mainArtImg} alt="Main Art" />
      </ContentContainer>
    </Frame3Wrapper>
  );
}

