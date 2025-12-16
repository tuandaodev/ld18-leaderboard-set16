import { useNavigate } from "react-router-dom";
import useAxiosSWR from "@components/api/useAxiosSWR";
import { ENDPOINTS } from "@components/api/endpoints";
import { API_DOMAIN } from "@components/api/AxiosFetcher";
import artImg from '../../../../img/f4/Art.png';
import titleImg from '../../../../img/f4/title.png';
import descImg from '../../../../img/f4/desc.png';
import {
  Frame4Wrapper,
  Container,
  Column1,
  ArtImage,
  Column2,
  TitleImage,
  DescImage,
  EventsGrid,
  EventBox,
  EventImage,
  EventName,
} from "./Frame4.styles";
import { ReactTagManager } from "react-gtm-ts";

interface EventResult {
  id: number;
  eventName: string;
  // city: string;
  // eventStartTime: string;
  // eventEndTime: string;
  // eventType: string;
  bannerFile: string;
  eventUrl: string;
}

interface FindAllResponse {
  success: boolean;
  data: {
    total: number;
    page: number;
    pageSize: number;
    result: EventResult[];
  };
}

export default function Frame4() {
  const navigate = useNavigate();

  // Fetch first 4 events from API
  const { data: eventsData, isLoading: isLoadingEvents } = useAxiosSWR<FindAllResponse>(
    ENDPOINTS.getPublicEvents,
    {
      params: {
        page: 1,
        limit: 4,
        sortField: "id",
        sortDesc: true,
      },
    }
  );

  const events = eventsData?.data?.result || [];

  const handleEventClick = (eventUrl: string, index: number) => {
    // map index to event id: 0->4 1->3 2->2 3->1
    const eventId = 4 - index;
    ReactTagManager.action({
      event: 'click_sukien' + eventId,
    });
    window.open(eventUrl, "_blank");
  };

  return (
    <Frame4Wrapper id="events">
      <Container>
        <Column1>
          <ArtImage src={artImg} alt="Art" />
        </Column1>
        <Column2>
          <TitleImage src={titleImg} alt="Title" />
          <DescImage src={descImg} alt="Description" />
          <EventsGrid>
            {isLoadingEvents ? (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '20px',
                color: '#ffffff',
                fontSize: '1rem'
              }}>
                Đang tải...
              </div>
            ) : events.length === 0 ? (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '20px',
                color: '#ffffff',
                fontSize: '1rem'
              }}>
                Không có sự kiện nào
              </div>
            ) : (
              events.map((event, index) => (
                <EventBox
                  key={event.id}
                  onClick={() => handleEventClick(event.eventUrl, index)}
                >
                  <EventImage
                    src={event.bannerFile.startsWith("http") ? event.bannerFile : `${API_DOMAIN}${event.bannerFile}`}
                    alt={event.eventName}
                    onError={(e: any) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/300x200?text=No+Image";
                    }}
                  />
                  <EventName>{event.eventName}</EventName>
                </EventBox>
              ))
            )}
          </EventsGrid>
        </Column2>
      </Container>
    </Frame4Wrapper>
  );
}
