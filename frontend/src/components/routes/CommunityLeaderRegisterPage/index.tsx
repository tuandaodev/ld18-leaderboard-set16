import { getAccessToken, getLoginInfos } from "@store/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/landing.css";
import Footer from "../LandingPage/Footer";
import TopNavigation from "../LandingPage/TopNavigation";
import { CommunityLeaderRegisterContainer } from "./CommunityLeaderRegisterPage.styles";
import RegistrationFormSection from "./RegistrationFormSection";

export default function CommunityLeaderRegisterPage() {
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
    <CommunityLeaderRegisterContainer>
      <TopNavigation />
      <RegistrationFormSection />
      <Footer />
    </CommunityLeaderRegisterContainer>
  );
}

