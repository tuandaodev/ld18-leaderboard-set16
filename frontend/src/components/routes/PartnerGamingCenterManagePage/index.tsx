import { getAccessToken, getLoginInfos } from "@store/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/landing.css";
import Footer from "../LandingPage/Footer";
import TopNavigation from "../LandingPage/TopNavigation";
import { PartnerGamingCenterManageContainer } from "./PartnerGamingCenterManagePage.styles";
import GamingCenterTable from "./GamingCenterTable";

export default function PartnerGamingCenterManagePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const accessToken = getAccessToken();
    const loginInfos = getLoginInfos();
    
    // If not authenticated, redirect to home page
    if (!accessToken || !loginInfos || !loginInfos.isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <PartnerGamingCenterManageContainer>
      <TopNavigation />
      <GamingCenterTable />
      <Footer />
    </PartnerGamingCenterManageContainer>
  );
}

