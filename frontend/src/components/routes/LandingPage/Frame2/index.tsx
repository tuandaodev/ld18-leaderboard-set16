import avatarDefault from '@images/f2/avatar_default.png';
import banner from '@images/f2/banner.png';
import trangTri from '@images/f2/trang tri.png';
import { useAuth } from '../../../../store/useAuth';
import { authModal } from '../../../../store/useAuthModal';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../PrimaryButton';
import useAxiosSWR from '@components/api/useAxiosSWR';
import { ENDPOINTS } from '@components/api/endpoints';
import LeaderInfoModal from '../LeaderInfoModal';
import { useMemo, useState } from 'react';
import { API_DOMAIN } from '@components/api/AxiosFetcher';
import DOMPurify from 'dompurify';
import {
  AvatarCaption,
  AvatarImage,
  AvatarWrapper,
  BannerImage,
  ButtonContainer,
  ContentContainer,
  ContentText,
  DecoratorImage,
  Frame2Wrapper,
  LeftColumn,
  RightColumn,
  ScrollableContent,
  ScrollableWrapper
} from "./Frame2.styles";

interface LeaderStatusData {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  city: string;
  district: string;
  facebookLink: string;
  gameCharacterName: string;
  gameUID: string;
  communityGroups: string;
  isGuildMaster: boolean;
  guildName: string;
  managementExperience: string;
  eventExperience: string;
  avatar: string;
  status: string;
}

interface LeaderStatusResponse {
  success: boolean;
  data: LeaderStatusData | null;
}

interface Frame2Props {
  programInfo?: string;
  avatarImage?: string;
}

export default function Frame2({ programInfo, avatarImage }: Frame2Props) {
  const { data } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = data.isAuthenticated;
  const [isLeaderInfoModalOpen, setIsLeaderInfoModalOpen] = useState(false);

  // Fetch leader status when user is logged in
  const shouldFetchLeaderStatus = isLoggedIn;
  const { data: leaderStatusRes, isLoading: isLoadingLeaderStatus, error: leaderStatusError } = useAxiosSWR<LeaderStatusResponse>(
    shouldFetchLeaderStatus ? ENDPOINTS.getLeaderStatus : '',
    {
      forSWR: {
        revalidateOnMount: shouldFetchLeaderStatus,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
      }
    }
  );

  const hasLeaderRegistered = leaderStatusRes?.success && leaderStatusRes?.data != null;
  const avatarImageSrc = avatarImage
    ? (avatarImage.startsWith("http") ? avatarImage : `${API_DOMAIN}${avatarImage}`)
    : avatarDefault;
  const sanitizedProgramInfo = useMemo(
    () => (programInfo ? DOMPurify.sanitize(programInfo) : null),
    [programInfo]
  );

  return (
    <Frame2Wrapper id="community">
      <ContentContainer>
        <LeftColumn>
          <AvatarWrapper>
            <AvatarImage src={avatarImageSrc} alt="Thủ Lĩnh" />
            <AvatarCaption>
              {leaderStatusRes?.data?.fullName
                ? leaderStatusRes.data.fullName
                : "Thủ Lĩnh Cộng Đồng"}
            </AvatarCaption>
          </AvatarWrapper>
        </LeftColumn>
        <RightColumn>
          <BannerImage src={banner} alt="Banner" />
          <ScrollableWrapper>
            <ScrollableContent>
              <ContentText>
                {sanitizedProgramInfo ? (
                  <div dangerouslySetInnerHTML={{ __html: sanitizedProgramInfo }} />
                ) : (
                  <p>Đang tải nội dung...</p>
                )}
              </ContentText>
            </ScrollableContent>
          </ScrollableWrapper>
        </RightColumn>
      </ContentContainer>
      <DecoratorImage src={trangTri} alt="Decorator" />
      <ButtonContainer>
        {!hasLeaderRegistered && (
          <PrimaryButton onClick={() => {
            if (isLoggedIn) {
              navigate('/register-community-leader');
            } else {
              authModal.openLogin();
            }
          }}>
            Đăng ký trở thành <br/> thủ lĩnh cộng đồng ngay
          </PrimaryButton>
        )}

        {isLoggedIn && hasLeaderRegistered && (
          <>
            <PrimaryButton onClick={() => setIsLeaderInfoModalOpen(true)}>
              Thông tin của bạn
            </PrimaryButton>
            <PrimaryButton onClick={() => navigate('/register-event')}>
              Đăng ký tổ chức sự kiện <br/> Offline hoặc giải đấu
            </PrimaryButton>
          </>
        )}

      </ButtonContainer>

      <LeaderInfoModal 
        isOpen={isLeaderInfoModalOpen}
        onClose={() => setIsLeaderInfoModalOpen(false)}
        leaderData={leaderStatusRes?.data || null}
      />
    
    </Frame2Wrapper>
  );
}

