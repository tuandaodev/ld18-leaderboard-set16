import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosSWR from "@components/api/useAxiosSWR";
import { ENDPOINTS } from "@components/api/endpoints";
import { API_DOMAIN } from "@components/api/AxiosFetcher";
import DOMPurify from "dompurify";
import {
  EventDetailWrapper,
  EventDetailContentContainer,
  EventHeaderSection,
  EventImageSection,
  EventInfoSection,
  EventTitle,
  EventInfoBottomRow,
  EventInfoTable,
  InfoRow,
  InfoLabel,
  InfoValue,
  InfoDivider,
  JoinButton,
  EventBodySection,
  SectionTitle,
  EventDescription,
} from "./EventDetail.styles";

interface EventResult {
  id: number;
  eventName: string;
  city: string;
  eventStartTime: string;
  eventEndTime: string;
  eventType: string;
  eventDescription: string;
  bannerFile: string;
  eventUrl: string;
  totalPrize: string | null;
  isPublic: boolean;
  status: number;
  createdAt: string;
  updatedAt: string;
}

interface EventDetailResponse {
  success: boolean;
  data: EventResult;
}

// Helper function to format date from ISO string to DD/MM/YYYY
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to determine status
const getStatus = (eventResult: EventResult): "notstarted" | "ongoing" | "finished" => {
  const now = new Date();
  const startTime = new Date(eventResult.eventStartTime);
  const endTime = new Date(eventResult.eventEndTime);

  if (now < startTime) {
    return "notstarted";
  } else if (now >= startTime && now <= endTime) {
    return "ongoing";
  } else {
    return "finished";
  }
};

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch event detail from API
  const { data: eventData, error: eventError, isLoading: isLoadingEvent } = useAxiosSWR<EventDetailResponse>(
    id ? `${ENDPOINTS.getPublicEventDetail}/${id}` : ""
  );

  if (isLoadingEvent) {
    return (
      <EventDetailWrapper>
        <EventDetailContentContainer>
          <div style={{ textAlign: "center", padding: "40px", fontSize: 'clamp(1rem, 4.5vw, 1.5rem)', fontWeight: "bold" }}>
            Đang tải...
          </div>
        </EventDetailContentContainer>
      </EventDetailWrapper>
    );
  }

  if (eventError || !eventData?.data) {
    return (
      <EventDetailWrapper>
        <EventDetailContentContainer>
          <div style={{ textAlign: "center", padding: "40px", fontSize: 'clamp(1rem, 4.5vw, 1.5rem)', fontWeight: "bold" }}>
            Không tìm thấy sự kiện hoặc đã xảy ra lỗi.
          </div>
        </EventDetailContentContainer>
      </EventDetailWrapper>
    );
  }

  const event = eventData.data;
  const sanitizedDescription = useMemo(
    () => DOMPurify.sanitize(event.eventDescription || ""),
    [event.eventDescription]
  );
  const status = getStatus(event);
  let eventType = event.eventType.toLowerCase() === "online" ? "online" : "offline";
  if (event.eventType.toLowerCase() === "tournament") {
    eventType = "Giải Đấu";
  }

  const handleJoinClick = () => {
    if (event.eventUrl) {
      window.open(event.eventUrl, "_blank");
    }
  };

  return (
    <EventDetailWrapper>
      <EventDetailContentContainer>
        <EventHeaderSection>
          <EventImageSection>
            <img
              src={event.bannerFile.startsWith("http") ? event.bannerFile : `${API_DOMAIN}${event.bannerFile}`}
              alt={event.eventName}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Event+Image";
              }}
            />
          </EventImageSection>
          <EventInfoSection>
            <EventTitle>{event.eventName}</EventTitle>
            <EventInfoBottomRow>
              <EventInfoTable>
                <InfoRow>
                  <InfoLabel>THỜI GIAN:</InfoLabel>
                  <InfoValue>
                    {formatDate(event.eventStartTime)} <br/> {formatDate(event.eventEndTime)}
                  </InfoValue>
                </InfoRow>
                <InfoDivider />
                <InfoRow>
                  <InfoLabel>TRẠNG THÁI:</InfoLabel>
                  <InfoValue>{status === "notstarted" ? "SẮP DIỄN RA" : status === "ongoing" ? "ĐANG DIỄN RA" : "ĐÃ KẾT THÚC"}</InfoValue>
                </InfoRow>
                <InfoDivider />
                <InfoRow>
                  <InfoLabel>THỂ LOẠI:</InfoLabel>
                  <InfoValue>{eventType.toUpperCase()}</InfoValue>
                </InfoRow>
                <InfoDivider />
                <InfoRow>
                  <InfoLabel>TỈNH THÀNH:</InfoLabel>
                  <InfoValue>{event.city}</InfoValue>
                </InfoRow>
                <InfoDivider />
                <InfoRow>
                  <InfoLabel>TỔNG GIẢI THƯỞNG:</InfoLabel>
                  <InfoValue>{event.totalPrize || "-"}</InfoValue>
                </InfoRow>
              </EventInfoTable>
              <JoinButton onClick={handleJoinClick}>THAM GIA NGAY</JoinButton>
            </EventInfoBottomRow>
          </EventInfoSection>
        </EventHeaderSection>

        <EventBodySection>
          {/* <SectionTitle>1. THÔNG TIN CHI TIẾT</SectionTitle> */}
          <EventDescription dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
        </EventBodySection>
      </EventDetailContentContainer>
    </EventDetailWrapper>
  );
}

