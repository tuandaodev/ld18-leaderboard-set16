import "../../../styles/landing.css";
import Footer from "../LandingPage/Footer";
import TopNavigation from "../LandingPage/TopNavigation";
import EventList from "./EventList";
import { EventListPageContainer } from "./EventListPage.styles";

export default function EventListPage() {
  return (
    <EventListPageContainer>
      <TopNavigation />
      <EventList />
      <Footer />
    </EventListPageContainer>
  );
}

