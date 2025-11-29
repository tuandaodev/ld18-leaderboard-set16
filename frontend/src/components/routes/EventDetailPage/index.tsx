import "../../../styles/landing.css";
import Footer from "../LandingPage/Footer";
import TopNavigation from "../LandingPage/TopNavigation";
import EventDetail from "./EventDetail";
import { EventDetailPageContainer } from "./EventDetailPage.styles";

export default function EventDetailPage() {
  return (
    <EventDetailPageContainer>
      <TopNavigation />
      <EventDetail />
      <Footer />
    </EventDetailPageContainer>
  );
}














