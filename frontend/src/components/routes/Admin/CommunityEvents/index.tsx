// libraries
import {
    Button,
    Input,
    Select,
    Table,
    TableProps,
    Modal,
    message,
    Form
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

// types
import {
    ColumnsType,
    FilterValue,
    SorterResult,
} from "antd/es/table/interface";
// manual
import useAxiosSWR, { fetcher } from "@components/api/useAxiosSWR";
import { ENDPOINTS } from "@components/api/endpoints";
import Layout from "@components/common/Admin/Layout";
import PageLoader from "@components/common/PageLoader";
import { cn, throttle } from "@lib/utils";

// styles
import { useAuth } from "@store/useAuth";

import { format, parseISO } from "date-fns";
import { t } from "i18next";
import {
    AccountSearchRow,
    AccountTableRow,
    AccountsWrapper,
    SearchCol,
} from "./style";
import EventDetailModal from "./EventDetailModal";
import UserDetailModal from "../Leaders/UserDetailModal";

const domain = import.meta.env.DEV
    ? import.meta.env.VITE_DEV_DOMAIN! || ""
    : import.meta.env.VITE_PRO_DOMAIN! || "";

interface CommunityEventResult {
    id: number;
    userId: number;
    eventName: string;
    city: string;
    district: string;
    registrationDeadline: string;
    eventStartTime: string;
    eventEndTime: string;
    venueAddress: string;
    venueName: string;
    eventType: string;
    deviceType: string;
    eventDescription: string;
    eventScale: string;
    supportLevel: string;
    bannerFile: string;
    status: number;
    rejectionReason: string | null;
    createdAt: string;
    updatedAt: string;
}

interface FindAllResponse {
    success: boolean;
    data: {
        total: number;
        page: number;
        pageSize: number;
        result: CommunityEventResult[];
        hasNext: boolean;
    };
}

export default function CommunityEvents() {
    // hooks
    const [currPage, setCurrPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
    const searchInputRef = useRef<any>(null);
    const shouldMaintainFocusRef = useRef<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<CommunityEventResult | null>(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [isBtnLoading, setIsBtnLoading] = useState(false);
    const [actionEventId, setActionEventId] = useState<number | null>(null);
    const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
    const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
    const [selectedEventForAction, setSelectedEventForAction] = useState<CommunityEventResult | null>(null);
    const [rejectForm] = Form.useForm();
    const [isUserDetailModalVisible, setIsUserDetailModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);

    const { data, error, isLoading, mutate } = useAxiosSWR<FindAllResponse>(
        ENDPOINTS.searchCommunityEvents,
        {
            params: {
                page: currPage,
                pageSize: 10,
                sortField: "id",
                sortDesc: true,
                searchContent: searchQuery,
                status: statusFilter,
            },
        }
    );

    const isMedium = useMediaQuery("(max-width: 1194px)");
    const userRoleNum = useAuth(({ data }) => data.role);
    const userData = useAuth(({ data }) => data);

    // states
    const [isScroll, setIsScroll] = useState(false);
    const [showPagTop, setShowPagTop] = useState(true);
    const [sortedInfo, setSortedInfo] = useState<SorterResult<CommunityEventResult>>({});
    const [filteredInfo, setFilteredInfo] = useState<
        Record<string, FilterValue | null>
    >({});
    const [renderData, setRenderData] = useState<CommunityEventResult[]>([]);

    // effects
    useEffect(() => {
        if (!isLoading && !error && data) {
            setRenderData(data?.data?.result);
        }
        // Maintain focus on search input after data updates (only if search was just performed)
        if (shouldMaintainFocusRef.current && searchInputRef.current && !isLoading) {
            setTimeout(() => {
                const input = searchInputRef.current?.input;
                if (input) {
                    input.focus();
                }
                shouldMaintainFocusRef.current = false;
            }, 100);
        }
    }, [data, error, isLoading, userData]);

    // methods
    const onTableRowScroll = throttle(() => {
        if (!isLoading) {
            const tableRowElement = document.getElementById("table-row");
            if (tableRowElement && tableRowElement?.scrollTop >= 90) {
                if (!isScroll) setIsScroll(true);
            } else {
                if (isScroll) setIsScroll(false);
            }
        }
    }, 20);

    const handleTableChange: TableProps<CommunityEventResult>["onChange"] = (
        _,
        filters,
        sorter
    ) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter as SorterResult<CommunityEventResult>);
    };

    const onSearchEvents = (value: string) => {
        setSearchQuery(value.trim());
        setCurrPage(1);
        // Set flag to maintain focus after data loads
        shouldMaintainFocusRef.current = true;
        // Also try to focus immediately (in case data loads quickly)
        setTimeout(() => {
            if (searchInputRef.current) {
                const input = searchInputRef.current.input;
                if (input) {
                    input.focus();
                }
            }
        }, 0);
    };

    const onStatusFilterChange = (value: number | undefined) => {
        setStatusFilter(value);
        setCurrPage(1);
    };

    const handleViewDetail = async (event: CommunityEventResult) => {
        try {
            const response: { success: boolean, data: CommunityEventResult } = await fetcher.get(
                `${ENDPOINTS.getCommunityEventDetail}/${event.id}/detail`,
            );
            if (response.success) {
                setSelectedEvent(response.data);
                setIsDetailModalVisible(true);
            }
        } catch (error: any) {
            message.error(error?.response?.data?.error || t("Đã xảy lỗi"));
        }
    };

    const handleViewUserDetail = async (userId: number) => {
        try {
            const response: { success: boolean, data: any } = await fetcher.get(
                `${ENDPOINTS.findAccount}/${userId}`,
            );
            if (response.success) {
                setSelectedUser(response.data);
                setIsUserDetailModalVisible(true);
            }
        } catch (error: any) {
            message.error(error?.response?.data?.error || t("Đã xảy lỗi"));
        }
    };

    const handleOpenApproveModal = (event: CommunityEventResult) => {
        setSelectedEventForAction(event);
        setIsApproveModalVisible(true);
    };

    const handleApprove = async () => {
        if (!selectedEventForAction) return;

        try {
            setIsBtnLoading(true);
            setActionEventId(selectedEventForAction.id);
            const response: { success: boolean } = await fetcher.post(
                `${ENDPOINTS.approveCommunityEvent}`,
                { eventId: selectedEventForAction.id }
            );
            setIsBtnLoading(false);
            if (response.success) {
                message.success(`${t("Đã duyệt Sự kiện ID")} = ${selectedEventForAction.id}`);
                mutate();
                setIsApproveModalVisible(false);
                setSelectedEventForAction(null);
            }
        } catch (error: any) {
            setIsBtnLoading(false);
            message.error(error?.response?.data?.error || t("Không thể duyệt sự kiện. Vui lòng thử lại"));
        } finally {
            setActionEventId(null);
        }
    };

    const handleOpenRejectModal = (event: CommunityEventResult) => {
        setSelectedEventForAction(event);
        rejectForm.resetFields();
        setIsRejectModalVisible(true);
    };

    const handleReject = async (values: { rejectionReason: string }) => {
        if (!selectedEventForAction) return;

        try {
            setIsBtnLoading(true);
            setActionEventId(selectedEventForAction.id);
            const response: { success: boolean } = await fetcher.post(
                `${ENDPOINTS.rejectCommunityEvent}`,
                { 
                    eventId: selectedEventForAction.id,
                    rejectionReason: values.rejectionReason
                }
            );
            setIsBtnLoading(false);
            if (response.success) {
                message.success(`${t("Đã từ chối Sự kiện ID")} = ${selectedEventForAction.id}`);
                mutate();
                setIsRejectModalVisible(false);
                setSelectedEventForAction(null);
                rejectForm.resetFields();
            }
        } catch (error: any) {
            setIsBtnLoading(false);
            message.error(error?.response?.data?.error || t("Không thể từ chối sự kiện. Vui lòng thử lại"));
        } finally {
            setActionEventId(null);
        }
    };

    const getStatusText = (status: number) => {
        switch (status) {
            case -1:
                return "Rejected";
            case 0:
                return "New";
            case 1:
                return "Approved";
            default:
                return "Unknown";
        }
    };

    const getStatusColor = (status: number) => {
        switch (status) {
            case -1:
                return "#ff4d4f";
            case 0:
                return "#faad14";
            case 1:
                return "#52c41a";
            default:
                return "#000";
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = parseISO(dateString);
            return format(date, 'dd/MM/yyyy HH:mm');
        } catch {
            return dateString;
        }
    };

    // columns
    const columns: ColumnsType<CommunityEventResult> = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
            className: "expand-row",
        },
        {
            title: t("Banner"),
            key: "bannerFile",
            width: 120,
            render: ({ bannerFile }) => (
                bannerFile ? (
                    <img
                        src={`${domain}${bannerFile}`}
                        alt="Event Banner"
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                ) : (
                    <span>-</span>
                )
            ),
        },
        {
            title: t("Event Name"),
            key: "eventName",
            render: ({ eventName }) => (
                <p>{eventName}</p>
            ),
        },
        {
            title: t("City"),
            key: "city",
            render: ({ city }) => (
                <p>{city}</p>
            ),
        },
        {
            title: t("District"),
            key: "district",
            render: ({ district }) => (
                <p>{district}</p>
            ),
        },
        {
            title: t("Venue Name"),
            key: "venueName",
            render: ({ venueName }) => (
                <p>{venueName}</p>
            ),
        },
        {
            title: t("Event Type"),
            key: "eventType",
            render: ({ eventType }) => (
                <p>{eventType}</p>
            ),
        },
        {
            title: t("Event Start Time"),
            key: "eventStartTime",
            render: ({ eventStartTime }) => (
                <p>{formatDate(eventStartTime)}</p>
            ),
        },
        {
            title: t("Status"),
            key: "status",
            render: ({ status }) => (
                <span style={{ color: getStatusColor(status) }}>
                    {getStatusText(status)}
                </span>
            ),
        },
        {
            title: <p className="text-center">Action</p>,
            key: "action",
            width: 360,
            render: (record) => (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <Button 
                            size="small"
                            onClick={() => handleViewDetail(record)}
                        >
                            View
                        </Button>
                        <Button 
                            size="small"
                            onClick={() => handleViewUserDetail(record.userId)}
                        >
                            View User
                        </Button>
                    </div>
                    {record.status === 0 && (
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            <Button 
                                type="primary"
                                size="small"
                                onClick={() => handleOpenApproveModal(record)}
                                disabled={userRoleNum === 1}
                            >
                                Approve
                            </Button>
                            <Button 
                                danger
                                size="small"
                                onClick={() => handleOpenRejectModal(record)}
                                disabled={userRoleNum === 1}
                            >
                                Reject
                            </Button>
                        </div>
                    )}
                </div>
            ),
        },
    ];

    if (isLoading) return <PageLoader />;
    if (error) return <div>{error.message}</div>;

    return (
        <Layout>
            <AccountsWrapper>
                <AccountSearchRow>
                    <SearchCol>
                        <div className="search-wrapper">
                            <Input.Search
                                ref={searchInputRef}
                                placeholder={t("Search by Event Name")}
                                onSearch={onSearchEvents}
                                defaultValue={searchQuery}
                                enterButton
                            />
                        </div>
                        <Select
                            placeholder={t("Filter by Status")}
                            allowClear
                            style={{ width: 200, marginLeft: 10 }}
                            onChange={onStatusFilterChange}
                            value={statusFilter}
                        >
                            <Select.Option value={0}>New</Select.Option>
                            <Select.Option value={1}>Approved</Select.Option>
                            <Select.Option value={-1}>Rejected</Select.Option>
                        </Select>
                    </SearchCol>
                </AccountSearchRow>
                <AccountTableRow
                    id="table-row"
                    onScroll={onTableRowScroll}
                    className={cn(isScroll && "is-scroll")}
                >
                    <Table
                        loading={isLoading}
                        onChange={handleTableChange}
                        size={isMedium ? "middle" : "large"}
                        rowKey="id"
                        dataSource={renderData}
                        columns={columns}
                        scroll={{ x: "max-content" }}
                        pagination={{
                            current: currPage,
                            total: data?.data?.total,
                            defaultPageSize: 10,
                            pageSizeOptions: [10],
                            position: ["bottomCenter"],
                            onShowSizeChange: (_, size) => {
                                if (size < 20) setShowPagTop(true);
                                else setShowPagTop(false);
                            },
                            onChange: (currPage) => {
                                setCurrPage(currPage);
                            },
                        }}
                    />
                </AccountTableRow>
            </AccountsWrapper>

            <EventDetailModal
                visible={isDetailModalVisible}
                event={selectedEvent}
                onClose={() => {
                    setIsDetailModalVisible(false);
                    setSelectedEvent(null);
                }}
            />

            <UserDetailModal
                visible={isUserDetailModalVisible}
                user={selectedUser}
                onClose={() => {
                    setIsUserDetailModalVisible(false);
                    setSelectedUser(null);
                }}
            />

            {/* Approve Confirmation Modal */}
            <Modal
                title="Xác nhận duyệt"
                open={isApproveModalVisible}
                onOk={handleApprove}
                onCancel={() => {
                    setIsApproveModalVisible(false);
                    setSelectedEventForAction(null);
                }}
                okText="Duyệt"
                cancelText="Hủy"
                okButtonProps={{
                    loading: isBtnLoading && actionEventId === selectedEventForAction?.id,
                    disabled: userRoleNum === 1
                }}
            >
                <p>Bạn có chắc chắn muốn duyệt sự kiện này?</p>
                {selectedEventForAction && (
                    <p><strong>Sự kiện:</strong> {selectedEventForAction.eventName} (ID: {selectedEventForAction.id})</p>
                )}
            </Modal>

            {/* Reject Confirmation Modal with Reason */}
            <Modal
                title="Xác nhận từ chối"
                open={isRejectModalVisible}
                onCancel={() => {
                    setIsRejectModalVisible(false);
                    setSelectedEventForAction(null);
                    rejectForm.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={rejectForm}
                    layout="vertical"
                    onFinish={handleReject}
                    autoComplete="off"
                >
                    <Form.Item>
                        <p>Bạn có chắc chắn muốn từ chối sự kiện này?</p>
                        {selectedEventForAction && (
                            <p><strong>Sự kiện:</strong> {selectedEventForAction.eventName} (ID: {selectedEventForAction.id})</p>
                        )}
                    </Form.Item>
                    <Form.Item
                        label="Lý do từ chối"
                        name="rejectionReason"
                        rules={[
                            { required: true, message: "Lý do từ chối là bắt buộc" },
                            { min: 10, message: "Lý do từ chối phải có ít nhất 10 ký tự" }
                        ]}
                        extra={"Lý do sẽ được gửi đến user qua thông báo."}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Vui lòng cung cấp lý do từ chối"
                            maxLength={500}
                            showCount
                        />
                    </Form.Item>
                    <Form.Item>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <Button onClick={() => {
                                setIsRejectModalVisible(false);
                                setSelectedEventForAction(null);
                                rejectForm.resetFields();
                            }}>
                                Hủy
                            </Button>
                            <Button 
                                danger
                                type="primary"
                                htmlType="submit"
                                loading={isBtnLoading && actionEventId === selectedEventForAction?.id}
                                disabled={userRoleNum === 1}
                            >
                                Từ chối
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
}

