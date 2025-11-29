import searchIcon from '@images/f3/search_icon.png';
import titleImg from '@images/f3/title.png';
import { useState, useEffect } from "react";
import useAxiosSWR from "@components/api/useAxiosSWR";
import { ENDPOINTS } from "@components/api/endpoints";
import { API_DOMAIN } from "@components/api/AxiosFetcher";
import LeaderDetailPopup from "./LeaderDetailPopup";
import {
  ContentContainer,
  Frame3Wrapper,
  ParticipantAvatar,
  ParticipantItem,
  ParticipantLabel,
  ParticipantNameText,
  ParticipantsContainer,
  ParticipantsGrid,
  ParticipantTextWrapper,
  RankingsLayout,
  RankingTableContainer,
  SearchContainer,
  SearchIcon,
  SearchInput,
  MobileOnly,
  TabButton,
  TabContainer,
  TableCell,
  TableContent,
  TableHeader,
  TableRow,
  TitleImage,
  TopAvatar,
  TopCard,
  TopNameDisplay,
  TopPosition,
  TopScore,
  TopScoreLabel,
  TopThreeContainer
} from "./Frame3.styles";
import PrimaryButton from "../PrimaryButton";
import RankingTableModal from "./RankingTableModal";

type TabType = "participants" | "rankings";

interface Participant {
  id: number;
  name: string;
  avatar: string;
}

interface LeaderResponse {
  id: number;
  fullName: string;
  avatar: string | null;
}

interface GetAllLeadersResponse {
  success: boolean;
  data: LeaderResponse[];
}

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

// Component for each participant card
function ParticipantCard({ 
  participant, 
  onClick 
}: { 
  participant: Participant;
  onClick: () => void;
}) {
  const getImageUrl = (avatar: string | null) => {
    if (!avatar) return null;
    if (avatar.startsWith('http')) return avatar;
    return `${API_DOMAIN}${avatar}`;
  };

  const imageUrl = getImageUrl(participant.avatar);

  return (
    <ParticipantItem onClick={onClick} style={{ cursor: 'pointer' }}>
      <TopPosition>
        {imageUrl && (
          <ParticipantAvatar 
            src={imageUrl} 
            alt={participant.name}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <ParticipantTextWrapper>
          <ParticipantNameText>{participant.name}</ParticipantNameText>
          <ParticipantLabel>THỦ LĨNH CỘNG ĐỒNG</ParticipantLabel>
        </ParticipantTextWrapper>
      </TopPosition>
    </ParticipantItem>
  );
}

export default function Frame3() {
  const [activeTab, setActiveTab] = useState<TabType>("rankings");
  const [searchQuery, setSearchQuery] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [selectedLeaderId, setSelectedLeaderId] = useState<number | null>(null);
  
  // Fetch leaders from API
  const { data: leadersData, error: leadersError, isLoading: isLoadingLeaders } = useAxiosSWR<GetAllLeadersResponse>(
    activeTab === "participants" ? ENDPOINTS.getAllLeaders : null,
    {
      forSWR: {
        revalidateOnMount: activeTab === "participants",
      }
    }
  );
  
  // Fetch leaderboard from API
  const { data: leaderboardData, error: leaderboardError, isLoading: isLoadingLeaderboard } = useAxiosSWR<GetLeaderboardResponse>(
    activeTab === "rankings" ? ENDPOINTS.getLeaderboard : null,
    {
      forSWR: {
        revalidateOnMount: activeTab === "rankings",
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

  // Map API response to participants
  useEffect(() => {
    if (leadersData?.data) {
      const mappedParticipants: Participant[] = leadersData.data.map(leader => ({
        id: leader.id,
        name: leader.fullName,
        avatar: leader.avatar || ''
      }));
      setParticipants(mappedParticipants);
    } else if (leadersError) {
      console.error("Error fetching leaders:", leadersError);
      setParticipants([]);
    }
  }, [leadersData, leadersError]);
  
  // Filter participants based on search query
  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Frame3Wrapper id="ranking">
      <TabContainer>
        <TabButton 
          $active={activeTab === "participants"}
          onClick={() => setActiveTab("participants")}
        >
          Danh sách tham gia
        </TabButton>
        <TabButton 
          $active={activeTab === "rankings"}
          onClick={() => setActiveTab("rankings")}
        >
          Bảng xếp hạng
        </TabButton>
      </TabContainer>
      
      <ContentContainer>
        {activeTab === "participants" && (
          <ParticipantsContainer>
            {/* Search Box */}
            <SearchContainer>
              <SearchInput 
                type="text"
                placeholder="Tìm kiếm theo tên"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchIcon src={searchIcon} alt="Search" />
            </SearchContainer>
            
            {/* Participants Grid */}
            <ParticipantsGrid>
              {isLoadingLeaders ? (
                <div style={{ textAlign: "center", padding: "20px", width: "100%", gridColumn: '1 / -1', fontSize: 'clamp(1rem, 4.5vw, 1.5rem)', fontWeight: 'bold' }}>
                  Đang tải...
                </div>
              ) : filteredParticipants.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px", width: "100%", gridColumn: '1 / -1', fontSize: 'clamp(1rem, 4.5vw, 1.5rem)', fontWeight: 'bold' }}>
                  Không có thủ lĩnh nào
                </div>
              ) : (
                filteredParticipants.map(participant => (
                  <ParticipantCard 
                    key={participant.id} 
                    participant={participant}
                    onClick={() => handleCardClick(participant.id)}
                  />
                ))
              )}
            </ParticipantsGrid>
          </ParticipantsContainer>
        )}
        <LeaderDetailPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          leaderId={selectedLeaderId}
        />
        {activeTab === "rankings" && (
          <div>
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
                {/* Left: Top 3 */}
                <TopThreeContainer>
                  {(() => {
                    const getImageUrl = (avatar: string | null) => {
                      if (!avatar) return null;
                      if (avatar.startsWith('http')) return avatar;
                      return `${API_DOMAIN}${avatar}`;
                    };
                    
                    const top1 = leaderboardData?.data[0];
                    const top2 = leaderboardData?.data[1];
                    const top3 = leaderboardData?.data[2];
                    
                    const top1ImageUrl = top1 ? getImageUrl(top1.avatar) : null;
                    const top2ImageUrl = top2 ? getImageUrl(top2.avatar) : null;
                    const top3ImageUrl = top3 ? getImageUrl(top3.avatar) : null;
                    
                    return (
                      <>
                        {/* Position 2: Rank 2 (left) */}
                        <TopCard 
                          $position={2}
                          onClick={top2 ? () => handleCardClick(top2.id) : undefined}
                          style={{ cursor: top2 ? 'pointer' : 'default' }}
                        >
                          <TopPosition>
                            {top2ImageUrl && (
                              <TopAvatar 
                                src={top2ImageUrl}
                                alt="TOP 2"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            )}
                            <TopNameDisplay>{top2?.fullName || '-'}</TopNameDisplay>
                          </TopPosition>
                          <TopScoreLabel>ĐIỂM HOẠT ĐỘNG</TopScoreLabel>
                          <TopScore>{top2?.totalPoint?.toLocaleString('vi-VN') || '-'}</TopScore>
                        </TopCard>
                        
                        {/* Position 1: Rank 1 (center, top) */}
                        <TopCard 
                          $position={1}
                          onClick={top1 ? () => handleCardClick(top1.id) : undefined}
                          style={{ cursor: top1 ? 'pointer' : 'default' }}
                        >
                          <TopPosition>
                            {top1ImageUrl && (
                              <TopAvatar 
                                src={top1ImageUrl}
                                alt="TOP 1"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            )}
                            <TopNameDisplay>{top1?.fullName || '-'}</TopNameDisplay>
                          </TopPosition>
                          <TopScoreLabel>ĐIỂM HOẠT ĐỘNG</TopScoreLabel>
                          <TopScore>{top1?.totalPoint?.toLocaleString('vi-VN') || '-'}</TopScore>
                        </TopCard>
                        
                        {/* Position 3: Rank 3 (right) */}
                        <TopCard 
                          $position={3}
                          onClick={top3 ? () => handleCardClick(top3.id) : undefined}
                          style={{ cursor: top3 ? 'pointer' : 'default' }}
                        >
                          <TopPosition>
                            {top3ImageUrl && (
                              <TopAvatar 
                                src={top3ImageUrl}
                                alt="TOP 3"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            )}
                            <TopNameDisplay>{top3?.fullName || '-'}</TopNameDisplay>
                          </TopPosition>
                          <TopScoreLabel>ĐIỂM HOẠT ĐỘNG</TopScoreLabel>
                          <TopScore>{top3?.totalPoint?.toLocaleString('vi-VN') || '-'}</TopScore>
                        </TopCard>
                      </>
                    );
                  })()}
                </TopThreeContainer>

                {/* Right: Ranking Table */}
                <RankingTableContainer>
                  <TableHeader>
                    <TableCell style={{ whiteSpace: 'nowrap' }}>STT</TableCell>
                    <TableCell style={{ whiteSpace: 'nowrap' }}>THỦ LĨNH CỘNG ĐỒNG</TableCell>
                    <TableCell style={{ whiteSpace: 'nowrap' }}>ĐIỂM HOẠT ĐỘNG</TableCell>
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
                
              </RankingsLayout>
            ) : null}

            
            <MobileOnly>
              <PrimaryButton onClick={() => setIsRankingModalOpen(true)}>
                CHI TIẾT BẢNG XẾP HẠNG
              </PrimaryButton>
            </MobileOnly>

            <RankingTableModal
              isOpen={isRankingModalOpen}
              onClose={() => setIsRankingModalOpen(false)}
              data={leaderboardData?.data}
            />
          </div>
        )}
      </ContentContainer>
    </Frame3Wrapper>
  );
}

