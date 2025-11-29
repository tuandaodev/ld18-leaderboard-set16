import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination, Select } from "antd";
import useAxiosSWR from "@components/api/useAxiosSWR";
import { ENDPOINTS } from "@components/api/endpoints";
import { ProvinceDistrictResponse } from "types/endpoints/location";
import { API_DOMAIN } from "@components/api/AxiosFetcher";
import titleEventImage from "@images/page/title_event.png";
import {
  EventListWrapper,
  EventListContentContainer,
  TitleImage,
  ControlPanel,
  FilterSelect,
  EventListContainer,
  EventCard,
  EventImage,
  EventDetails,
  EventName,
  EventTime,
  EventStatusButtons,
  StatusButton,
  PaginationWrapper,
  EventBottomSection,
} from "./EventList.styles";

interface Event {
  id: number;
  eventName: string;
  startDate: string;
  endDate: string;
  status: "notstarted" | "ongoing" | "finished";
  eventType: "online" | "offline" | "tournament";
  imageUrl: string;
  province?: string;
}

interface EventResult {
  id: number;
  eventName: string;
  city: string;
  eventStartTime: string;
  eventEndTime: string;
  eventType: string;
  bannerFile: string;
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

// Helper function to format date from ISO string to DD/MM/YYYY
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to map API event to component event
const mapEventResultToEvent = (eventResult: EventResult): Event | null => {
  const now = new Date();
  const startTime = new Date(eventResult.eventStartTime);
  const endTime = new Date(eventResult.eventEndTime);

  // Determine status based on dates: if current time is between start and end, it's ongoing
  // If current time is after end, it's finished. Otherwise, treat as ongoing if started or finished if past end
  let status: "notstarted" | "ongoing" | "finished";
  if (now < startTime) {
    // Not started yet - treat as ongoing for display purposes
    status = "notstarted";
  } else if (now >= startTime && now <= endTime) {
    status = "ongoing";
  } else {
    status = "finished";
  }

  const eventTypeMap: Record<string, "online" | "offline" | "tournament"> = {
    online: "online",
    offline: "offline",
    tournament: "tournament",
  };
  const eventType: "online" | "offline" | "tournament" = eventTypeMap[eventResult.eventType.toLowerCase()] ?? "online";

  return {
    id: eventResult.id,
    eventName: eventResult.eventName,
    startDate: formatDate(eventResult.eventStartTime),
    endDate: formatDate(eventResult.eventEndTime),
    status,
    eventType,
    imageUrl: eventResult.bannerFile,
    province: eventResult.city,
  };
};

export default function EventList() {
  const navigate = useNavigate();
  const pageSize = 6;
  const [currPage, setCurrPage] = useState<number>(1);
  const [filterByStatus, setFilterByStatus] = useState<"all" | "ongoing" | "finished">();
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>(undefined);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  // Map frontend filter states to API parameters
  const apiCity = selectedProvince;

  // Fetch public events from API
  const { data: eventsData, error: eventsError, isLoading: isLoadingEvents } = useAxiosSWR<FindAllResponse>(
    ENDPOINTS.getPublicEvents,
    {
      params: {
        page: currPage,
        limit: pageSize,
        sortField: "id",
        sortDesc: true,
        ...(filterByStatus && { status: filterByStatus }),
        ...(apiCity && { city: apiCity }),
      },
    }
  );

  // Fetch province and districts data
  const { data: provinceData, isLoading: isLoadingProvinces } = useAxiosSWR<ProvinceDistrictResponse>(
    ENDPOINTS.getProvinceDistricts
  );

  // Map API events to component events
  useEffect(() => {
    if (eventsError) {
      console.error("Error fetching events:", eventsError);
      setEvents([]);
      return;
    }
    
    if (eventsData?.data?.result) {
      const mappedEvents = eventsData.data.result
        .map(mapEventResultToEvent)
        .filter((event): event is Event => event !== null);
      setEvents(mappedEvents);
    } else {
      setEvents([]);
    }
  }, [eventsData, eventsError]);

  // Extract provinces from data
  useEffect(() => {
    if (provinceData?.data) {
      const provinceList = provinceData.data.map(item => item.province);
      const uniqueProvinces = Array.from(new Set(provinceList));
      setProvinces(uniqueProvinces);
    }
  }, [provinceData]);

  // Reset to page 1 when filters change
  const handleStatusChange = (value: "all" | "ongoing" | "finished") => {
    setFilterByStatus(value);
    setCurrPage(1);
  };

  const handleProvinceChange = (value: string | undefined) => {
    setSelectedProvince(value);
    setCurrPage(1);
  };

  // Events are already filtered by API, so use them directly
  const paginatedEvents = events;

  const totalEvents = eventsData?.data?.total || 0;

  return (
    <EventListWrapper>
      <EventListContentContainer>
        <TitleImage src={titleEventImage} alt="SỰ KIỆN" />

        <ControlPanel>
          <FilterSelect
            value={filterByStatus}
            placeholder="Trạng thái"
            onChange={(value) => handleStatusChange(value as "all" | "ongoing" | "finished")}
            options={[
              { label: "TẤT CẢ", value: "all" },
              { label: "ĐANG DIỄN RA", value: "ongoing" },
              { label: "ĐÃ KẾT THÚC", value: "finished" },
            ]}
          />

          <FilterSelect
            value={selectedProvince}
            onChange={(value) => handleProvinceChange(value as string | undefined)}
            placeholder="Tỉnh/Thành phố"
            allowClear
            loading={isLoadingProvinces}
            options={provinces.map((province) => ({
              label: province,
              value: province,
            }))}
          />
        </ControlPanel>

        <EventListContainer>
          {isLoadingEvents ? (
            <div style={{ textAlign: "center", padding: "20px", width: "100%", gridColumn: '1 / -1', fontSize: 'clamp(1rem, 4.5vw, 1.5rem)', fontWeight: 'bold' }}>
              Đang tải...
            </div>
          ) : paginatedEvents.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px", width: "100%", gridColumn: '1 / -1', fontSize: 'clamp(1rem, 4.5vw, 1.5rem)', fontWeight: 'bold' }}>
              Không có sự kiện nào
            </div>
          ) : (
            paginatedEvents.map((event) => (
              <EventCard 
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <EventImage>
                  <img
                    src={event.imageUrl.startsWith("http") ? event.imageUrl : `${API_DOMAIN}${event.imageUrl}`}
                    alt={event.eventName}
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      (e.target as HTMLImageElement).src = "https://placehold.co/300x200?text=Event+Image";
                    }}
                  />
                </EventImage>
                <EventDetails>
                  <EventName>{event.eventName}</EventName>
                  <EventBottomSection>
                    <EventTime>
                      <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#bda982", letterSpacing: "1px" }}>
                        THỜI GIAN:
                      </span>{" "}
                      <span>
                        {event.startDate} - {event.endDate}
                      </span>
                    </EventTime>
                    <EventStatusButtons>
                      <StatusButton $status={event.status}>
                        {event.status === "notstarted" ? "SẮP DIỄN RA" : event.status === "ongoing" ? "ĐANG DIỄN RA" : "ĐÃ KẾT THÚC"}
                      </StatusButton>
                      <StatusButton $eventType={event.eventType as "online" | "offline" | "tournament"}>
                        {event.eventType === "online" ? "ONLINE" : event.eventType === "offline" ? "OFFLINE" : "GIẢI ĐẤU"}
                      </StatusButton>
                    </EventStatusButtons>
                  </EventBottomSection>
                </EventDetails>
              </EventCard>
            ))
          )}
        </EventListContainer>

        {totalEvents > 0 && (
          <PaginationWrapper>
            <Pagination
              current={currPage}
              total={totalEvents}
              pageSize={pageSize}
              showSizeChanger={false}
              showQuickJumper={false}
              onChange={(page) => setCurrPage(page)}
            />
          </PaginationWrapper>
        )}
      </EventListContentContainer>
    </EventListWrapper>
  );
}

