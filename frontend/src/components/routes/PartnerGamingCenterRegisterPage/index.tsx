import { getAccessToken, getLoginInfos } from "@store/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/landing.css";
import Footer from "../LandingPage/Footer";
import TopNavigation from "../LandingPage/TopNavigation";
import { PartnerGamingCenterRegisterContainer } from "./PartnerGamingCenterRegisterPage.styles";
import RegistrationFormSection from "./RegistrationFormSection";

export default function PartnerGamingCenterRegisterPage() {
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
    <PartnerGamingCenterRegisterContainer>
      <TopNavigation />
      <RegistrationFormSection />
      <Footer />
    </PartnerGamingCenterRegisterContainer>
  );
}

