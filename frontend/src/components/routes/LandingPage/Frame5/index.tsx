import dangKyImg from "@images/f5/dang ky.png";
import dangKyHoverImg from "@images/f5/dang ky_hover.png";
import danhSachImg from "@images/f5/danh sach.png";
import danhSachHoverImg from "@images/f5/danh sach_hover.png";
import manageImg from "@images/f5/manage.png";
import manageHoverImg from "@images/f5/manage_hover.png";
import titleImg from "@images/f5/title.png";
import titleMbImg from "@images/mobile/f5/title_mb.png";
import mainTextMobileImg from "@images/mobile/f5/main_text_mobile.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../store/useAuth";
import { authModal } from "../../../../store/useAuthModal";
import useAxiosSWR from "@components/api/useAxiosSWR";
import { ENDPOINTS } from "@components/api/endpoints";
import { Column, ContentContainer, Frame5Wrapper, TitleDecorator, MobileTitle, MobileMainText } from "./Frame5.styles";

interface PartnerGamingCenterStatusData {
  id: number;
  gamingCenterName: string;
}

interface PartnerGamingCenterStatusResponse {
  success: boolean;
  data: PartnerGamingCenterStatusData | null;
}

export default function Frame5() {
  const { data } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = data.isAuthenticated;
  const [isDangKyHovered, setIsDangKyHovered] = useState(false);
  const [isDanhSachHovered, setIsDanhSachHovered] = useState(false);
  const [isManageHovered, setIsManageHovered] = useState(false);

  // Fetch partner gaming center status when user is logged in
  const shouldFetchPartnerGamingCenterStatus = isLoggedIn;
  const { data: partnerGamingCenterStatusRes, isLoading: isLoadingPartnerGamingCenterStatus, error: partnerGamingCenterStatusError } = useAxiosSWR<PartnerGamingCenterStatusResponse>(
    shouldFetchPartnerGamingCenterStatus ? ENDPOINTS.getPartnerGamingCenterStatus : '',
    {
      forSWR: {
        revalidateOnMount: shouldFetchPartnerGamingCenterStatus,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
      }
    }
  );

  const hasPartnerGamingCenterRegistered = partnerGamingCenterStatusRes?.success && partnerGamingCenterStatusRes?.data != null;

  return (
    <Frame5Wrapper id="partners">
      <TitleDecorator src={titleImg} alt="Phòng Máy Đối Tác" />
      <MobileTitle src={titleMbImg} alt="Phòng Máy Đối Tác" />
      <MobileMainText src={mainTextMobileImg} alt="Phòng Máy Đối Tác" />
      <ContentContainer>
        <Column>
          {!hasPartnerGamingCenterRegistered && (
            <img
              src={isDangKyHovered ? dangKyHoverImg : dangKyImg}
              alt="Đăng ký trở thành phòng máy đối tác"
              onMouseEnter={() => setIsDangKyHovered(true)}
              onMouseLeave={() => setIsDangKyHovered(false)}
              onClick={() => {
                if (!isLoggedIn) {
                  authModal.openLogin();
                } else {
                  navigate("/register-partner-gaming-center");
                }
              }}
            />
          )}
          {hasPartnerGamingCenterRegistered && (
            <img
              src={isManageHovered ? manageHoverImg : manageImg}
              alt="Quản lý thông tin phòng máy đối tác"
              onMouseEnter={() => setIsManageHovered(true)}
              onMouseLeave={() => setIsManageHovered(false)}
              onClick={() => navigate("/manage-partner-gaming-center")}
            />
          )}
        </Column>
        <Column>
          <img
            src={isDanhSachHovered ? danhSachHoverImg : danhSachImg}
            alt="Danh sách phòng máy đối tác"
            onMouseEnter={() => setIsDanhSachHovered(true)}
            onMouseLeave={() => setIsDanhSachHovered(false)}
            onClick={() => navigate("/list-partner-gaming-centers")}
          />
        </Column>
      </ContentContainer>
    </Frame5Wrapper>
  );
}

