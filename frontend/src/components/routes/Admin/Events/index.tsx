// libraries
import {
    Button,
    Input,
    Select,
    Table,
    TableProps,
    message
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useNavigate } from "react-router-dom";

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

import { t } from "i18next";
import {
    AccountSearchRow,
    AccountTableRow,
    AccountsWrapper,
    SearchCol,
} from "./style";

const domain = import.meta.env.DEV
    ? import.meta.env.VITE_DEV_DOMAIN! || ""
    : import.meta.env.VITE_PRO_DOMAIN! || "";

interface EventResult {
    id: number;
    eventName: string;
    bannerFile: string;
    eventUrl: string;
    isPublic: boolean;
    priority: number;
    createdAt: string;
    updatedAt: string;
}

interface FindAllResponse {
    success: boolean;
    data: {
        total: number;
        page: number;
        pageSize: number;
        result: EventResult[];
        hasNext: boolean;
    };
}

export default function Events() {
    // hooks
    const [currPage, setCurrPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const searchInputRef = useRef<any>(null);
    const shouldMaintainFocusRef = useRef<boolean>(false);

    const { data, error, isLoading, mutate } = useAxiosSWR<FindAllResponse>(
        ENDPOINTS.searchEvents,
        {
            params: {
                page: currPage,
                pageSize: 10,
                sortField: "id",
                sortDesc: true,
                searchContent: searchQuery,
            },
        }
    );

    const isMedium = useMediaQuery("(max-width: 1194px)");
    const userRoleNum = useAuth(({ data }) => data.role);
    const userData = useAuth(({ data }) => data);

    const navigate = useNavigate();

    // states
    const [isScroll, setIsScroll] = useState(false);
    const [showPagTop, setShowPagTop] = useState(true);
    const [sortedInfo, setSortedInfo] = useState<SorterResult<EventResult>>({});
    const [filteredInfo, setFilteredInfo] = useState<
        Record<string, FilterValue | null>
    >({});
    const [renderData, setRenderData] = useState<EventResult[]>([]);

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
    const onAddEvent = () => {
        navigate("/cp/events/add");
    };

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

    const handleTableChange: TableProps<EventResult>["onChange"] = (
        _,
        filters,
        sorter
    ) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter as SorterResult<EventResult>);
    };

    const onSearchEvents = (value: string) => {
        setSearchQuery(value.trim());
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


    // columns
    const columns: ColumnsType<EventResult> = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
            className: "expand-row",
        },
        {
            title: t("Image"),
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
            title: t("Event URL"),
            key: "eventUrl",
            render: ({ eventUrl }) => (
                <p>{eventUrl || "-"}</p>
            ),
        },
        {
            title: t("Is Public"),
            key: "isPublic",
            render: ({ isPublic }) => {
                return isPublic ? "Yes" : "No";
            },
        },
        {
            title: t("Priority"),
            key: "priority",
            render: ({ priority }) => (
                <p>{priority ?? 0}</p>
            ),
        },
        {
            title: <p className="text-center">Action</p>,
            key: "action",
            width: 100,
            render: ({ id }) => ((
                <Button onClick={() => navigate(`/cp/events/edit/${id}`)}>
                    Edit
                </Button>
            )
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
                        <Button
                            onClick={onAddEvent}
                            type="primary"
                            disabled={userRoleNum === 1}
                            style={{ marginLeft: 10 }}
                        >
                            Add Event
                        </Button>
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

        </Layout>
    );
}

