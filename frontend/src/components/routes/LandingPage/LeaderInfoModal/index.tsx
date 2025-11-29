import BaseModal from "../../../common/BaseModal";
import PopupTitle from "../PopupTitle";
import { MainContainer, LeftSection, RightSection, InfoContainer, InfoRow, InfoLabel, InfoValue, AvatarImage } from "./LeaderInfoModal.styles";
import { API_DOMAIN } from "@components/api/AxiosFetcher";

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

interface LeaderInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaderData: LeaderStatusData | null;
}

export default function LeaderInfoModal({ isOpen, onClose, leaderData }: LeaderInfoModalProps) {
  if (!leaderData) {
    return null;
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const avatarUrl = leaderData.avatar ? `${API_DOMAIN}${leaderData.avatar}` : '';

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      width={{
        xs: '95%',
        sm: '90%',
        md: '90%',
        lg: '80%',
        xl: '70%',
        xxl: '60%',
      }}
      size="large"
      title={<PopupTitle size="large">THÔNG TIN THIẾU HIỆP</PopupTitle>}
    >
      <MainContainer>
        <LeftSection>
          {avatarUrl && (
            <AvatarImage src={avatarUrl} alt={leaderData.fullName} />
          )}
        </LeftSection>

        <RightSection>
          <InfoContainer>
            <InfoRow>
              <InfoLabel>Họ và tên:</InfoLabel>
              <InfoValue>{leaderData.fullName || 'N/A'}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>Ngày tháng năm sinh:</InfoLabel>
              <InfoValue>{formatDate(leaderData.dateOfBirth)}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>SĐT:</InfoLabel>
              <InfoValue>{leaderData.phone || 'N/A'}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>Email:</InfoLabel>
              <InfoValue>{leaderData.email || 'N/A'}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>Tỉnh/Thành phố bạn muốn hoạt động:</InfoLabel>
              <InfoValue>{leaderData.city || 'N/A'}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>Phường Xã:</InfoLabel>
              <InfoValue>{leaderData.district || 'N/A'}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>Link Facebook:</InfoLabel>
              <InfoValue>
                {leaderData.facebookLink ? (
                  <a href={leaderData.facebookLink} target="_blank" rel="noopener noreferrer">
                    {leaderData.facebookLink}
                  </a>
                ) : (
                  'N/A'
                )}
              </InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>Tên Nhân Vật Ingame:</InfoLabel>
              <InfoValue>{leaderData.gameCharacterName || 'N/A'}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>UID Ingame:</InfoLabel>
              <InfoValue>{leaderData.gameUID || 'N/A'}</InfoValue>
            </InfoRow>
          </InfoContainer>
        </RightSection>
      </MainContainer>
    </BaseModal>
  );
}

