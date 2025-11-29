import { getAccessToken, getLoginInfos } from "@store/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/landing.css";
import Footer from "../LandingPage/Footer";
import TopNavigation from "../LandingPage/TopNavigation";
import { NotificationListPageContainer } from "./NotificationListPage.styles";
import NotificationList from "./NotificationList";

export default function NotificationListPage() {
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
    <NotificationListPageContainer>
      <TopNavigation />
      <NotificationList />
      <Footer />
    </NotificationListPageContainer>
  );
}

