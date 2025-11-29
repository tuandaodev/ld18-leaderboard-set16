// libraries
import {
    Button,
    Input,
    InputNumber,
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
import { useAuth, getAccessToken } from "@store/useAuth";
import axios from "axios";

import { format, parseISO } from "date-fns";
import { t } from "i18next";
import {
    AccountSearchRow,
    AccountTableRow,
    AccountsWrapper,
    SearchCol,
} from "./style";
import LeaderDetailModal from "./LeaderDetailModal";
import UserDetailModal from "./UserDetailModal";

const domain = import.meta.env.DEV
    ? import.meta.env.VITE_DEV_DOMAIN! || ""
    : import.meta.env.VITE_PRO_DOMAIN! || "";

interface LeaderResult {
    id: number;
    userId: number;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    city: string;
    district: string;
    facebookLink: string;
    gameCharacterName: string | null;
    gameUID: string | null;
    communityGroups: string | null;
    isGuildMaster: boolean;
    guildName: string | null;
    managementExperience: string | null;
    eventExperience: string | null;
    avatar: string | null;
    status: number;
    totalPoint: number | null;
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
        result: LeaderResult[];
        hasNext: boolean;
    };
}

export default function Leaders() {
    // hooks
    const [currPage, setCurrPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
    const searchInputRef = useRef<any>(null);
    const shouldMaintainFocusRef = useRef<boolean>(false);
    const [selectedLeader, setSelectedLeader] = useState<LeaderResult | null>(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [isBtnLoading, setIsBtnLoading] = useState(false);
    const [actionLeaderId, setActionLeaderId] = useState<number | null>(null);
    const [isUpdatePointModalVisible, setIsUpdatePointModalVisible] = useState(false);
    const [selectedLeaderForUpdate, setSelectedLeaderForUpdate] = useState<LeaderResult | null>(null);
    const [updatePointForm] = Form.useForm();
    const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
    const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
    const [selectedLeaderForAction, setSelectedLeaderForAction] = useState<LeaderResult | null>(null);
    const [rejectForm] = Form.useForm();
    const [isUserDetailModalVisible, setIsUserDetailModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);

    const { data, error, isLoading, mutate } = useAxiosSWR<FindAllResponse>(
        ENDPOINTS.searchLeaders,
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
    const [sortedInfo, setSortedInfo] = useState<SorterResult<LeaderResult>>({});
    const [filteredInfo, setFilteredInfo] = useState<
        Record<string, FilterValue | null>
    >({});
    const [renderData, setRenderData] = useState<LeaderResult[]>([]);

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

    const handleTableChange: TableProps<LeaderResult>["onChange"] = (
        _,
        filters,
        sorter
    ) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter as SorterResult<LeaderResult>);
    };

    const onSearchLeaders = (value: string) => {
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

    const handleExportLeaderboard = async () => {
        try {
            setIsBtnLoading(true);
            const token = getAccessToken();
            
            const response = await axios.get(
                `${domain}${ENDPOINTS.exportLeaderboardCSV}`,
                {
                    responseType: 'blob',
                    headers: {
                        Authorization: token ? `Bearer ${token}` : '',
                        "ngrok-skip-browser-warning": "69420",
                    },
                }
            );
            
            // Create blob from response data
            const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Get filename from Content-Disposition header or use default
            const contentDisposition = response.headers['content-disposition'];
            let filename = `leaderboard_top_16_${new Date().toISOString().split('T')[0]}.csv`;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            message.success(t("Đã xuất bảng xếp hạng thành công") || "Export leaderboard successfully");
        } catch (error: any) {
            message.error(error?.response?.data?.error || t("Đã xảy lỗi") || "An error occurred");
        } finally {
            setIsBtnLoading(false);
        }
    };

    const handleViewDetail = async (leader: LeaderResult) => {
        try {
            const response: { success: boolean, data: LeaderResult } = await fetcher.get(
                `${ENDPOINTS.getLeaderDetailForAdmin}/${leader.id}/detail`,
            );
            if (response.success) {
                setSelectedLeader(response.data);
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

    const handleOpenApproveModal = (leader: LeaderResult) => {
        setSelectedLeaderForAction(leader);
        setIsApproveModalVisible(true);
    };

    const handleApprove = async () => {
        if (!selectedLeaderForAction) return;

        try {
            setIsBtnLoading(true);
            setActionLeaderId(selectedLeaderForAction.id);
            const response: { success: boolean } = await fetcher.post(
                `${ENDPOINTS.approveLeader}`,
                { leaderId: selectedLeaderForAction.id }
            );
            setIsBtnLoading(false);
            if (response.success) {
                message.success(`${t("Đã duyệt Thủ lĩnh ID")} = ${selectedLeaderForAction.id}`);
                mutate();
                setIsApproveModalVisible(false);
                setSelectedLeaderForAction(null);
            }
        } catch (error: any) {
            setIsBtnLoading(false);
            message.error(error?.response?.data?.error || t("Không thể duyệt thủ lĩnh. Vui lòng thử lại"));
        } finally {
            setActionLeaderId(null);
        }
    };

    const handleOpenRejectModal = (leader: LeaderResult) => {
        setSelectedLeaderForAction(leader);
        rejectForm.resetFields();
        setIsRejectModalVisible(true);
    };

    const handleReject = async (values: { rejectionReason: string }) => {
        if (!selectedLeaderForAction) return;

        try {
            setIsBtnLoading(true);
            setActionLeaderId(selectedLeaderForAction.id);
            const response: { success: boolean } = await fetcher.post(
                `${ENDPOINTS.rejectLeader}`,
                { 
                    leaderId: selectedLeaderForAction.id,
                    rejectionReason: values.rejectionReason
                }
            );
            setIsBtnLoading(false);
            if (response.success) {
                message.success(`${t("Đã từ chối Thủ lĩnh ID")} = ${selectedLeaderForAction.id}`);
                mutate();
                setIsRejectModalVisible(false);
                setSelectedLeaderForAction(null);
                rejectForm.resetFields();
            }
        } catch (error: any) {
            setIsBtnLoading(false);
            message.error(error?.response?.data?.error || t("Không thể từ chối thủ lĩnh. Vui lòng thử lại"));
        } finally {
            setActionLeaderId(null);
        }
    };

    const handleOpenUpdatePointModal = (leader: LeaderResult) => {
        setSelectedLeaderForUpdate(leader);
        updatePointForm.setFieldsValue({ totalPoint: leader.totalPoint ?? 0 });
        setIsUpdatePointModalVisible(true);
    };

    const handleUpdateTotalPoint = async (values: { totalPoint: number }) => {
        if (!selectedLeaderForUpdate) return;

        try {
            setIsBtnLoading(true);
            setActionLeaderId(selectedLeaderForUpdate.id);
            const response: { success: boolean } = await fetcher.post(
                `${ENDPOINTS.updateLeaderTotalPoint}`,
                { 
                    leaderId: selectedLeaderForUpdate.id,
                    totalPoint: values.totalPoint
                }
            );
            setIsBtnLoading(false);
            if (response.success) {
                message.success(`${t("Đã cập nhật Total Point cho Thủ lĩnh ID")} = ${selectedLeaderForUpdate.id}`);
                mutate();
                setIsUpdatePointModalVisible(false);
                setSelectedLeaderForUpdate(null);
                updatePointForm.resetFields();
            }
        } catch (error: any) {
            setIsBtnLoading(false);
            message.error(error?.response?.data?.error || t("Không thể cập nhật Total Point. Vui lòng thử lại"));
        } finally {
            setActionLeaderId(null);
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

    // columns
    const columns: ColumnsType<LeaderResult> = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
            className: "expand-row",
        },
        {
            title: t("Avatar"),
            key: "avatar",
            width: 120,
            render: ({ avatar }) => (
                avatar ? (
                    <img
                        src={`${domain}${avatar}`}
                        alt="Leader Avatar"
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                ) : (
                    <span>-</span>
                )
            ),
        },
        {
            title: t("Full Name"),
            key: "fullName",
            render: ({ fullName }) => (
                <p>{fullName}</p>
            ),
        },
        {
            title: t("Email"),
            key: "email",
            render: ({ email }) => (
                <p>{email}</p>
            ),
        },
        {
            title: t("Phone"),
            key: "phone",
            render: ({ phone }) => (
                <p>{phone}</p>
            ),
        },
        {
            title: t("City"),
            key: "city",
            render: ({ city }) => (
                <p>{city}</p>
            ),
        },
        // {
        //     title: t("District"),
        //     key: "district",
        //     render: ({ district }) => (
        //         <p>{district}</p>
        //     ),
        // },
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
            title: t("Total Point"),
            key: "totalPoint",
            render: ({ totalPoint }) => (
                <p>{totalPoint ?? 0}</p>
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
                    {record.status === 1 && (
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            <Button 
                                type="default"
                                size="small"
                                onClick={() => handleOpenUpdatePointModal(record)}
                                disabled={userRoleNum === 1}
                            >
                                Update Point
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
                                placeholder={t("Search by Leader Name or Username")}
                                onSearch={onSearchLeaders}
                                defaultValue={searchQuery}
                                enterButton
                            />
                        </div>
                        <Button
                            type="default"
                            onClick={handleExportLeaderboard}
                            loading={isBtnLoading}
                            style={{ marginLeft: 10 }}
                        >
                            {t("Export Leaderboard") || "Export Leaderboard"}
                        </Button>
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

            <LeaderDetailModal
                visible={isDetailModalVisible}
                leader={selectedLeader}
                onClose={() => {
                    setIsDetailModalVisible(false);
                    setSelectedLeader(null);
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

            <Modal
                title={t("Update Total Point")}
                open={isUpdatePointModalVisible}
                onCancel={() => {
                    setIsUpdatePointModalVisible(false);
                    setSelectedLeaderForUpdate(null);
                    updatePointForm.resetFields();
                }}
                footer={null}
                width={500}
            >
                <Form
                    form={updatePointForm}
                    layout="vertical"
                    onFinish={handleUpdateTotalPoint}
                    autoComplete="off"
                >
                    <Form.Item
                        label={t("Leader")}
                    >
                        <Input 
                            value={selectedLeaderForUpdate?.fullName || ""} 
                            disabled 
                        />
                    </Form.Item>
                    <Form.Item
                        label={t("Current Total Point")}
                    >
                        <Input 
                            value={selectedLeaderForUpdate?.totalPoint ?? 0} 
                            disabled 
                        />
                    </Form.Item>
                    <Form.Item
                        label={t("New Total Point")}
                        name="totalPoint"
                        rules={[
                            { required: true, message: t("Total Point is required") || "Total Point is required" },
                            { 
                                validator: (_, value) => {
                                    if (value === undefined || value === null) {
                                        return Promise.resolve();
                                    }
                                    if (typeof value !== 'number' || value < 0) {
                                        return Promise.reject(new Error(t("Total Point must be a non-negative number") || "Total Point must be a non-negative number"));
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            min={0}
                            placeholder={t("Enter new total point") || "Enter new total point"}
                        />
                    </Form.Item>
                    <Form.Item>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <Button onClick={() => {
                                setIsUpdatePointModalVisible(false);
                                setSelectedLeaderForUpdate(null);
                                updatePointForm.resetFields();
                            }}>
                                {t("Cancel") || "Cancel"}
                            </Button>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={isBtnLoading && actionLeaderId === selectedLeaderForUpdate?.id}
                                disabled={userRoleNum === 1}
                            >
                                {t("Update") || "Update"}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Approve Confirmation Modal */}
            <Modal
                title="Xác nhận duyệt"
                open={isApproveModalVisible}
                onOk={handleApprove}
                onCancel={() => {
                    setIsApproveModalVisible(false);
                    setSelectedLeaderForAction(null);
                }}
                okText="Duyệt"
                cancelText="Hủy"
                okButtonProps={{
                    loading: isBtnLoading && actionLeaderId === selectedLeaderForAction?.id,
                    disabled: userRoleNum === 1
                }}
            >
                <p>Bạn có chắc chắn muốn duyệt thủ lĩnh này?</p>
                {selectedLeaderForAction && (
                    <p><strong>Thủ lĩnh:</strong> {selectedLeaderForAction.fullName} (ID: {selectedLeaderForAction.id})</p>
                )}
            </Modal>

            {/* Reject Confirmation Modal with Reason */}
            <Modal
                title="Xác nhận từ chối"
                open={isRejectModalVisible}
                onCancel={() => {
                    setIsRejectModalVisible(false);
                    setSelectedLeaderForAction(null);
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
                        <p>Bạn có chắc chắn muốn từ chối thủ lĩnh này?</p>
                        {selectedLeaderForAction && (
                            <p><strong>Thủ lĩnh:</strong> {selectedLeaderForAction.fullName} (ID: {selectedLeaderForAction.id})</p>
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
                                setSelectedLeaderForAction(null);
                                rejectForm.resetFields();
                            }}>
                                Hủy
                            </Button>
                            <Button 
                                danger
                                type="primary"
                                htmlType="submit"
                                loading={isBtnLoading && actionLeaderId === selectedLeaderForAction?.id}
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

