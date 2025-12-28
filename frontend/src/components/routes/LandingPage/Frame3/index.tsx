import { ENDPOINTS } from "@components/api/endpoints";
import useAxiosSWR from "@components/api/useAxiosSWR";
import { useState } from "react";
import { useRef, useEffect } from "react";
import mainArtImg from '../../../../img/f3/MAIN ART.png';
import btnRulesImg from '../../../../img/f3/btn_rules.png';
import ctaImg from '../../../../img/f3/cta.png';
import phanThuongTextImg from '../../../../img/f3/phan thuong text.png';
import tableTitleImg from '../../../../img/f3/table_title.png';
import titleImg from '../../../../img/f3/title.png';
import top1Img from '../../../../img/f3/top1.png';
import top2Img from '../../../../img/f3/top2.png';
import top3Img from '../../../../img/f3/top3.png';
import {
  ContentContainer,
  ContentWrapper,
  CTAButton,
  Frame3Wrapper,
  MainArtImage,
  PhanThuongTextImage,
  RankingsLayout,
  RankingTableContainer,
  RankingTableWrapper,
  RulesButtonImage,
  TableCell,
  TableContent,
  TableHeader,
  TableRow,
  TableTitleImage,
  TitleImage,
  Top1Image,
  Top2Image,
  Top3Image,
  TopThreeContainer,
  SearchBoxInput
} from "./Frame3.styles";
import RuleDetailPopup from "./RuleDetailPopup";
import { ReactTagManager } from "react-gtm-ts";

interface Frame3Props {
  f3Rule: string;
}

interface LeaderboardItem {
  gameName: string;
  tagLine: string;
  totalPoints: number;
}

interface GetLeaderboardResponse {
  success: boolean;
  data: LeaderboardItem[];
}

export default function Frame3({ f3Rule }: Frame3Props) {
  const [isRuleDetailOpen, setIsRuleDetailOpen] = useState(false);
  const [searchContent, setSearchContent] = useState(""); // for API param
  const [searchInput, setSearchInput] = useState(""); // for input box
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchContent]);
  
  // Fetch leaderboard from API
  const { data: leaderboardData, error: leaderboardError, isLoading: isLoadingLeaderboard } = useAxiosSWR<GetLeaderboardResponse>(
    ENDPOINTS.getLeaderboardList,
    {
      params: searchContent ? { searchContent: searchContent } : undefined,
      forSWR: {
        revalidateOnMount: true,
      }
    }
  );
  
  const handleOpenRuleDetail = () => {
    setIsRuleDetailOpen(true);
  };

  const handleCloseRuleDetail = () => {
    setIsRuleDetailOpen(false);
  };

  return (
    <Frame3Wrapper id="ranking">
      <ContentContainer>
        <RuleDetailPopup
          isOpen={isRuleDetailOpen}
          onClose={handleCloseRuleDetail}
          f3Rule={f3Rule}
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
                <RulesButtonImage 
                  src={btnRulesImg} 
                  alt="Thể lệ sự kiện" 
                  onClick={handleOpenRuleDetail}
                />
              </TopThreeContainer>

              {/* Right: Ranking Table */}
              <RankingTableWrapper>
                <RankingTableContainer>
                  <TableTitleImage src={tableTitleImg} alt="Bảng xếp hạng" />

                  {/* Search Box */}
                  <div style={{ width: '100%', display: 'flex' }}>
                    <SearchBoxInput
                      ref={searchInputRef}
                      type="text"
                      placeholder="Tìm kiếm RIOT ID..."
                      value={searchInput}
                      onChange={e => setSearchInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          setSearchContent(searchInput.trim());
                        }
                      }}
                    />
                  </div>

                  <TableHeader>
                    <TableCell style={{ whiteSpace: 'nowrap' }}>STT</TableCell>
                    <TableCell style={{ whiteSpace: 'nowrap' }}>RIOT ID</TableCell>
                    <TableCell style={{ whiteSpace: 'nowrap' }}>ĐIỂM</TableCell>
                  </TableHeader>
                  <TableContent>
                    {leaderboardData.data
                      .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
                      .map((leader, index) => {
                        const rank = index + 1; // Starting from rank 1
                        
                        return (
                          <TableRow 
                            key={leader.gameName} 
                            $isEven={index % 2 === 0}
                            style={{ cursor: 'pointer' }}
                          >
                            <TableCell>{rank}</TableCell>
                            <TableCell>{leader?.gameName ?? ''}</TableCell>
                            <TableCell>{leader?.totalPoints?.toLocaleString('vi-VN') || '0'}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableContent>
                </RankingTableContainer>
                <CTAButton 
                  src={ctaImg} 
                  alt="Tham Gia Ngay" 
                  onClick={() => {
                    ReactTagManager.action({
                      event: 'click_thamgiangay',
                    });
                    window.open('https://forms.gle/zAvraST9pEtNEkM17', '_blank');
                  }}
                />
              </RankingTableWrapper>
            </RankingsLayout>
          ) : null}
       
        </ContentWrapper>
        <MainArtImage src={mainArtImg} alt="Main Art" />
      </ContentContainer>
    </Frame3Wrapper>
  );
}

