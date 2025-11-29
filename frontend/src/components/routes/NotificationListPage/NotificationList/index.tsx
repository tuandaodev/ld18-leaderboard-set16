import { useState, useEffect } from "react";
import { Pagination, Select, Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { mutate as globalMutate } from "swr";
import iconBin from "../../../../images/page/icon_bin.png";
import PageTitle from "../../CommunityLeaderRegisterPage/PageTitle";
import useAxiosSWR, { fetcher } from "@components/api/useAxiosSWR";
import { ENDPOINTS } from "@components/api/endpoints";
import {
  NotificationListWrapper,
  NotificationListContentContainer,
  ControlPanel,
  LeftControls,
  SearchContainer,
  SearchInput,
  SearchIcon,
  FilterSelect,
  TrashButton,
  NotificationListContainer,
  NotificationItem,
  NotificationCheckbox,
  NotificationContent,
  NotificationTitle,
  NotificationMessage,
  NotificationTimestamp,
  PaginationWrapper,
} from "./NotificationList.styles";

interface Notification {
  id: number;
  createdAt: string;
  updatedAt: string;
  deleteAt: string | null;
  userId: number;
  type: string;
  title: string;
  message: string;
  relatedEntityId: number | null;
  relatedEntityType: string | null;
  isRead: boolean;
}

interface NotificationResponse {
  success: boolean;
  data: {
    total: number;
    page: number;
    pageSize: number;
    result: Notification[];
    hasNext: boolean;
  };
}

// Helper function to format timestamp from ISO string to "HH:mm | DD.MM.YYYY"
const formatTimestamp = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    const time = format(date, "HH:mm");
    const dateStr = format(date, "dd.MM.yyyy");
    return `${time} | ${dateStr}`;
  } catch (error) {
    return "";
  }
};

export default function NotificationList() {
  const pageSize = 5;
  const [currPage, setCurrPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"oldest" | "newest">("newest");
  const [filterByRead, setFilterByRead] = useState<"all" | "read" | "unread">("all");
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);

  // Fetch notifications from API
  const {
    data,
    error,
    isLoading,
    mutate,
  } = useAxiosSWR<NotificationResponse>(
    ENDPOINTS.getNotifications,
    {
      params: {
        page: currPage,
        limit: pageSize,
        sortField: "createdAt",
        sortDesc: sortBy === "newest",
        searchContent: searchQuery || undefined,
        isRead: filterByRead === "all" ? undefined : filterByRead === "read",
      },
    }
  );

  const notifications = data?.data?.result || [];
  const totalNotifications = data?.data?.total || 0;

  // Reset to page 1 when filters change
  const handleSortChange = (value: "oldest" | "newest") => {
    setSortBy(value);
    setCurrPage(1);
  };

  const handleFilterChange = (value: "all" | "read" | "unread") => {
    setFilterByRead(value);
    setCurrPage(1);
  };

  // Reset selected notifications when page changes
  useEffect(() => {
    setSelectedNotifications([]);
  }, [currPage]);

  const handleCheckboxChange = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedNotifications([...selectedNotifications, id]);
    } else {
      setSelectedNotifications(selectedNotifications.filter((nId) => nId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNotifications(notifications.map((n) => n.id));
    } else {
      setSelectedNotifications([]);
    }
  };

  const handleMarkAsRead = async () => {
    if (selectedNotifications.length === 0) return;
    
    try {
      const response: { success: boolean } = await fetcher.post(
        ENDPOINTS.markNotificationsAsRead,
        { notificationIds: selectedNotifications }
      );
      
      if (response.success) {
        message.success("Đã đánh dấu thông báo là đã đọc");
        setSelectedNotifications([]);
        mutate(); // Refresh the list
        // Revalidate unread count cache
        globalMutate(
          (key) => Array.isArray(key) && key[0] === ENDPOINTS.getUnreadNotificationCount,
          undefined,
          { revalidate: true }
        );
      }
    } catch (error: any) {
      message.error(error?.response?.data?.error || "Không thể đánh dấu thông báo. Vui lòng thử lại");
    }
  };

  return (
    <NotificationListWrapper>
      <NotificationListContentContainer>
        <PageTitle>THÔNG BÁO</PageTitle>

        <ControlPanel>
          <LeftControls>
            <SearchContainer>
              <SearchInput
                type="text"
                placeholder="Tìm theo tên"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchIcon>
                <SearchOutlined />
              </SearchIcon>
            </SearchContainer>

            <FilterSelect
              value={sortBy}
              onChange={(value) => handleSortChange(value as "oldest" | "newest")}
              options={[
                { label: "CŨ NHẤT", value: "oldest" },
                { label: "MỚI NHẤT", value: "newest" },
              ]}
            />

            <FilterSelect
              value={filterByRead}
              onChange={(value) => handleFilterChange(value as "all" | "read" | "unread")}
              options={[
                { label: "TẤT CẢ", value: "all" },
                { label: "ĐÃ ĐỌC", value: "read" },
                { label: "CHƯA ĐỌC", value: "unread" },
              ]}
            />
          </LeftControls>

          <TrashButton onClick={handleMarkAsRead} disabled={selectedNotifications.length === 0}>
            <img src={iconBin} alt="Mark as read" />
          </TrashButton>
        </ControlPanel>

        <NotificationListContainer>
          {isLoading ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#50483d", fontSize: 'clamp(1rem, 4.5vw, 1.5rem)' }}>
              Đang tải...
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#50483d", fontSize: 'clamp(1rem, 4.5vw, 1.5rem)' }}>
              Không có thông báo nào
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem key={notification.id} $isRead={notification.isRead}>
                <NotificationCheckbox>
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={(e) => handleCheckboxChange(notification.id, e.target.checked)}
                  />
                </NotificationCheckbox>
                <NotificationContent>
                  <NotificationTitle $isRead={notification.isRead}>{notification.title}</NotificationTitle>
                  <NotificationMessage>{notification.message}</NotificationMessage>
                </NotificationContent>
                <NotificationTimestamp>{formatTimestamp(notification.createdAt)}</NotificationTimestamp>
              </NotificationItem>
            ))
          )}
        </NotificationListContainer>

        {totalNotifications > 0 && (
          <PaginationWrapper>
            <Pagination
              current={currPage}
              total={totalNotifications}
              pageSize={pageSize}
              showSizeChanger={false}
              showQuickJumper={false}
              onChange={(page) => setCurrPage(page)}
            />
          </PaginationWrapper>
        )}
      </NotificationListContentContainer>
    </NotificationListWrapper>
  );
}

