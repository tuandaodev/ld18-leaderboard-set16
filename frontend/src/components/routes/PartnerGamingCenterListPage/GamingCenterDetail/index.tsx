import BaseModal from "../../../common/BaseModal";
import PopupTitle from "../../LandingPage/PopupTitle";
import { MainContainer, LeftSection, RightSection, InfoContainer, InfoRow, InfoLabel, InfoValue, CenterImage, FooterSection, FooterDivider, FooterAddress } from "./GamingCenterDetail.styles";
import { API_DOMAIN } from "@components/api/AxiosFetcher";
import { ENDPOINTS } from "@components/api/endpoints";
import useAxiosSWR from "@components/api/useAxiosSWR";
import { LoadingOutlined } from "@ant-design/icons";

interface GamingCenterDetailData {
  id: number;
  gamingCenterName: string;
  gamingCenterAddress: string;
  city: string;
  district: string;
  openingHour: string;
  closingHour: string;
  fanpage: string | null;
  machineConfiguration: string | null;
  averagePlayPrice: string | null;
  logoFile: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: GamingCenterDetailData;
}

interface GamingCenterDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  gamingCenterId: number | null;
}

export default function GamingCenterDetail({ isOpen, onClose, gamingCenterId }: GamingCenterDetailModalProps) {
  // Fetch gaming center detail
  const { data, isLoading, error } = useAxiosSWR<ApiResponse>(
    gamingCenterId ? `${ENDPOINTS.getPublicPartnerGamingCenterDetail}/${gamingCenterId}` : ""
  );

  const gamingCenterDetail = data?.data;

  if (!isOpen) {
    return null;
  }

  const getImageUrl = (logoFile: string) => {
    if (!logoFile) return '';
    if (logoFile.startsWith('http')) return logoFile;
    return `${API_DOMAIN}${logoFile}`;
  };

  const formatPrice = (price: string | null) => {
    if (!price) return 'N/A';
    return `${parseInt(price).toLocaleString('vi-VN')} VNĐ`;
  };

  const formatHours = (openingHour: string, closingHour: string) => {
    if (!openingHour || !closingHour) return 'N/A';
    // Format to HH:mm (remove seconds if present)
    const formatTime = (time: string) => {
      if (!time) return '';
      // If time is in HH:mm:ss format, extract HH:mm
      if (time.length >= 5) {
        return time.substring(0, 5);
      }
      return time;
    };
    return `${formatTime(openingHour)} - ${formatTime(closingHour)}`;
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      width={{ xs: "95%", sm: "90%", md: 800, lg: 1000, xl: 1200 }}
      size="large"
      title={
        <PopupTitle size="large">
          {gamingCenterDetail?.gamingCenterName?.toUpperCase() || 'CHI TIẾT PHÒNG MÁY'}
        </PopupTitle>
      }
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <LoadingOutlined spin style={{ fontSize: '2rem', color: '#8b7355' }} />
          <div style={{ marginTop: '1rem', color: '#50483d' }}>Đang tải thông tin...</div>
        </div>
      ) : error || !gamingCenterDetail ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#f5222d' }}>
          Đã xảy ra lỗi khi tải dữ liệu
        </div>
      ) : (
        <>
          <MainContainer>
            <LeftSection>
              {gamingCenterDetail.logoFile && (
                <CenterImage
                  src={getImageUrl(gamingCenterDetail.logoFile)}
                  alt={gamingCenterDetail.gamingCenterName}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
              )}
              <FooterAddress>
                {gamingCenterDetail.gamingCenterAddress || 'N/A'}
            </FooterAddress>
            </LeftSection>

            <RightSection>
              <InfoContainer>
                <InfoRow>
                  <InfoLabel>Khu vực:</InfoLabel>
                  <InfoValue>{gamingCenterDetail.city || 'N/A'}</InfoValue>
                </InfoRow>

                <InfoRow>
                  <InfoLabel>Phường xã:</InfoLabel>
                  <InfoValue>{gamingCenterDetail.district || 'N/A'}</InfoValue>
                </InfoRow>

                <InfoRow>
                  <InfoLabel>Giờ hoạt động:</InfoLabel>
                  <InfoValue>
                    {formatHours(gamingCenterDetail.openingHour, gamingCenterDetail.closingHour)}
                  </InfoValue>
                </InfoRow>

                <InfoRow>
                  <InfoLabel>Giá:</InfoLabel>
                  <InfoValue>
                    {gamingCenterDetail.averagePlayPrice 
                      ? formatPrice(gamingCenterDetail.averagePlayPrice)
                      : 'N/A'}
                  </InfoValue>
                </InfoRow>

                <InfoRow>
                  <InfoLabel>Fanpage:</InfoLabel>
                  <InfoValue>
                    {gamingCenterDetail.fanpage ? (
                      /^(https?:)?\/\//.test(gamingCenterDetail.fanpage.trim()) ? (
                        <a
                          href={gamingCenterDetail.fanpage}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {gamingCenterDetail.fanpage}
                        </a>
                      ) : (
                        gamingCenterDetail.fanpage
                      )
                    ) : (
                      'N/A'
                    )}
                  </InfoValue>
                </InfoRow>

                <InfoRow>
                  <InfoLabel>Cấu hình:</InfoLabel>
                  <InfoValue>
                    {gamingCenterDetail.machineConfiguration || 'N/A'}
                  </InfoValue>
                </InfoRow>
              </InfoContainer>
            </RightSection>
          </MainContainer>
        </>
      )}
    </BaseModal>
  );
}

