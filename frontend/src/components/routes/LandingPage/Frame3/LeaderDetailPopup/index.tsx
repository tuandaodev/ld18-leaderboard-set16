import BaseModal from "@components/common/BaseModal";
import PopupTitle from "../../PopupTitle";
import useAxiosSWR from "@components/api/useAxiosSWR";
import { ENDPOINTS } from "@components/api/endpoints";
import { API_DOMAIN } from "@components/api/AxiosFetcher";
import avatarImg from '@images/f3/avatar_sample.jpg';
import fbIcon from '@images/popup/fb_icon.png';
import { useState, useEffect } from "react";
import {
  LeaderDetailContainer,
  LeaderAvatar,
  LeaderName,
  LeaderTitle,
  LeaderInfoRow,
  InfoLabel,
  InfoValue,
  FacebookLink,
  FacebookIcon,
  LoadingContainer,
  ErrorContainer
} from "./LeaderDetailPopup.styles";

interface LeaderDetailData {
  id: number;
  fullName: string;
  avatar: string | null;
  totalPoint: number | null;
  facebookLink: string;
}

interface LeaderDetailResponse {
  success: boolean;
  data: LeaderDetailData;
}

interface LeaderDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  leaderId: number | null;
}

export default function LeaderDetailPopup({ isOpen, onClose, leaderId }: LeaderDetailPopupProps) {
  const [modalWidth, setModalWidth] = useState(600);
  
  useEffect(() => {
    const updateWidth = () => {
      if (window.innerWidth <= 1366) {
        setModalWidth(500);
      } else if (window.innerWidth <= 1920) {
        setModalWidth(550);
      } else {
        setModalWidth(600);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const shouldFetch = isOpen && leaderId !== null;
  const { data, error, isLoading } = useAxiosSWR<LeaderDetailResponse>(
    shouldFetch ? `${ENDPOINTS.getLeaderDetail}/${leaderId}/detail` : "",
    {
      forSWR: {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }
    }
  );

  const getImageUrl = (avatar: string | null) => {
    if (!avatar) return avatarImg;
    if (avatar.startsWith('http')) return avatar;
    return `${API_DOMAIN}${avatar}`;
  };

  const formatPoints = (points: number | null) => {
    if (points === null || points === undefined) return '0';
    return points.toLocaleString('vi-VN');
  };

  const handleFacebookClick = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      width={modalWidth}
      size="small"
      title=""
    >
      <LeaderDetailContainer>
        {isLoading ? (
          <LoadingContainer>Đang tải...</LoadingContainer>
        ) : error || !data?.data ? (
          <ErrorContainer>Không thể tải thông tin thủ lĩnh</ErrorContainer>
        ) : (
          <>
            <LeaderAvatar
              src={getImageUrl(data.data.avatar)}
              alt={data.data.fullName}
              onError={(e) => {
                (e.target as HTMLImageElement).src = avatarImg;
              }}
            />
            <LeaderName>{data.data.fullName}</LeaderName>
            <LeaderTitle>THỦ LĨNH CỘNG ĐỒNG</LeaderTitle>
            
            <LeaderInfoRow>
              <div>
                <InfoLabel>Điểm hoạt động</InfoLabel>
                <InfoValue>{formatPoints(data.data.totalPoint)}</InfoValue>
              </div>
              <div>
                <InfoLabel>Trang cá nhân</InfoLabel>
                <FacebookLink onClick={() => handleFacebookClick(data.data.facebookLink)}>
                  <FacebookIcon>
                    <img src={fbIcon} alt="Facebook" />
                  </FacebookIcon>
                </FacebookLink>
              </div>
            </LeaderInfoRow>
          </>
        )}
      </LeaderDetailContainer>
    </BaseModal>
  );
}

