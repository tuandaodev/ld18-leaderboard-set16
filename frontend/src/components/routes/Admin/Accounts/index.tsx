// libraries
import {
  Button,
  Input,
  Modal,
  Skeleton,
  Spin,
  Table,
  TableProps,
  message,
} from "antd";
import { ChangeEvent, Suspense, lazy, useEffect, useState } from "react";
import HighlighterBase from "react-highlight-words";
import { useMediaQuery } from "usehooks-ts";
import type { ComponentType } from "react";
import type { HighlighterProps } from "react-highlight-words";

const Highlighter = HighlighterBase as ComponentType<HighlighterProps>;

// types
import {
  ColumnsType,
  FilterValue,
  SorterResult,
} from "antd/es/table/interface";
import { FindAllResponse, Result } from "types/endpoints/account-find-all";

// manual
import useAxiosSWR, { fetcher } from "@components/api/useAxiosSWR";
import { ENDPOINTS } from "@components/api/endpoints";
import Layout from "@components/common/Admin/Layout";
import PageLoader from "@components/common/PageLoader";
import { cn, debounce, throttle } from "@lib/utils";
import { useRoute } from "@store/useRoute";

// styles
import { ExclamationCircleFilled } from "@ant-design/icons";
import { COLORS } from "@lib/constants";
import { useAuth } from "@store/useAuth";
import { useTranslation } from "react-i18next";
import {
  AccountSearchRow,
  AccountTableRow,
  AccountsWrapper,
  SearchCol,
} from "./style";

const ExpandRow = lazy(() => import("./ExpandRow"));

export default function Accounts() {
  // hooks
  const { data, error, isLoading, mutate } = useAxiosSWR<FindAllResponse>(
    ENDPOINTS.allAccounts
  );
  const isMedium = useMediaQuery("(max-width: 1194px)");
  const userRoleNum = useAuth(({ data }) => data.role);
  const userData = useAuth(({ data }) => data);
  const saveIsCreateAdminClicked = useRoute(
    ({ saveIsCreateAdminClicked }) => saveIsCreateAdminClicked
  );
  const { t } = useTranslation();

  // states
  const [isScroll, setIsScroll] = useState(false);
  const [showPagTop, setShowPagTop] = useState(true);
  const [sortedInfo, setSortedInfo] = useState<SorterResult<Result>>({});
  const [filteredInfo, setFilteredInfo] = useState<
    Record<string, FilterValue | null>
  >({});
  const [renderData, setRenderData] = useState<Result[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [disableExpandRows, setDisableExpandRows] = useState<number[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState(0);
  const [showToggle2FAModal, setShowToggle2FAModal] = useState(false);
  const [targetToggle2FAId, setTargetToggle2FAId] = useState(0);
  const [targetToggle2FAStatus, setTargetToggle2FAStatus] = useState(false);
  const [targetToggle2FAEmail, setTargetToggle2FAEmail] = useState<string>("");
  const [isToggling2FA, setIsToggling2FA] = useState(false);

  // effects
  useEffect(() => {
    if (!isLoading && !error && data) {
      setRenderData(data?.data?.result);
    }
  }, [data, error, isLoading, userData]);

  // methods
  const onAddAdmin = () => {
    // console.log("Add admin"); // DEV
    saveIsCreateAdminClicked(true);
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
  const handleTableChange: TableProps<Result>["onChange"] = (
    _,
    filters,
    sorter
  ) => {
    // console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<Result>);
  };
  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    // console.log({ q: event.target.value });
    const currVal = event.target.value;
    setSearchQuery(event.target.value.trim());
    if (!currVal && data) {
      setRenderData(data?.data?.result);
    }
  };
  const dbOnSearchChange = debounce(onSearchChange, 100);
  const onSearchAccount = (value: string) => {
    if (!isLoading && !error && data) {
      const reg = new RegExp(value, "gi");
      const filteredData = data?.data?.result.filter(
        (item) =>
          item.username.match(reg) ||
          item.email.match(reg) ||
          (item.role === 2 ? "ADMIN" : "USER").match(reg)
      );
      if (filteredData?.length) setRenderData(filteredData);
      else setRenderData(data?.data?.result);
    }
  };
  const handleDelete = async () => {
    try {
      const response: { success: boolean } = await fetcher.delete(
        `${ENDPOINTS.deleteAccount}/${targetDeleteId}`
      );
      if (response.success) {
        message.success(`Xoá admin với ID = ${targetDeleteId}`);
        mutate();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error("Không thể xoá admin được chỉ định");
    }
    setShowDeleteModal(false);
  };

  const handleToggle2FA = async () => {
    setIsToggling2FA(true);
    try {
      const response: { success: boolean; data?: { isTwoFactorEnabled: boolean } } = await fetcher.patch(
        `${ENDPOINTS.toggleTwoFactorAuth}/${targetToggle2FAId}`
      );
      if (response.success) {
        const newStatus = response.data?.isTwoFactorEnabled;
        message.success(
          newStatus ? t("2fa_enabled") : t("2fa_disabled")
        );
        mutate();
        setShowToggle2FAModal(false);
        setTargetToggle2FAEmail("");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(t("2fa_toggle_error"));
    } finally {
      setIsToggling2FA(false);
    }
  };

  // columns
  const columns: ColumnsType<Result> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      className: "expand-row",
    },
    {
      title: t("Tên"),
      dataIndex: "username",
      key: "username",
      className: "expand-row",
      sorter: (a: Result, b: Result) => a.username.localeCompare(b.username),
      sortOrder: sortedInfo.columnKey === "username" ? sortedInfo.order : null,
      render: (username) =>
        searchQuery ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#30fccc", padding: 0 }}
            searchWords={[searchQuery]}
            autoEscape
            textToHighlight={username ? username.toString() : ""}
          />
        ) : (
          username
        ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      className: "expand-row",
      sorter: (a: Result, b: Result) => a.email.localeCompare(b.email),
      sortOrder: sortedInfo.columnKey === "email" ? sortedInfo.order : null,
      render: (email) =>
        searchQuery ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#30fccc", padding: 0 }}
            searchWords={[searchQuery]}
            autoEscape
            textToHighlight={email ? email.toString() : ""}
          />
        ) : (
          email
        ),
    },
    {
      title: t("Vai Trò"),
      dataIndex: "role",
      key: "role",
      className: "expand-row",
      sorter: (a: Result, b: Result) => a.role - b.role,
      sortOrder: sortedInfo.columnKey === "role" ? sortedInfo.order : null,
      // filters
      filters: [
        { text: "USER", value: 1 },
        { text: "ADMIN", value: 2 },
      ],
      filteredValue: filteredInfo.role || null,
      onFilter: (value, record: Result) => record.role === Number(value),
      render: (role) =>
        searchQuery ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#30fccc", padding: 0 }}
            searchWords={[searchQuery]}
            autoEscape
            textToHighlight={role === 2 ? "ADMIN" : "USER"}
          />
        ) : role === 2 ? (
          "ADMIN"
        ) : (
          "USER"
        ),
    },
    {
      title: <p className="text-center">Action</p>,
      key: "action",
      width: 200,
      render: ({ id, role, isTwoFactorEnabled, email }) => (
        role == 2 && (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <Button
              disabled={userRoleNum === 1 || isToggling2FA}
              loading={isToggling2FA && targetToggle2FAId === id}
              onClick={(e) => {
                e.stopPropagation();
                setTargetToggle2FAId(id);
                setTargetToggle2FAStatus(isTwoFactorEnabled || false);
                setTargetToggle2FAEmail(email || "");
                setShowToggle2FAModal(true);
              }}
            >
              {isTwoFactorEnabled ? t("disable_2fa") : t("enable_2fa")}
            </Button>
            <Button
              disabled={userRoleNum === 1}
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
                setTargetDeleteId(id);
              }}
            >
              {t("delete_admin")}
            </Button>
          </div>
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
                placeholder={t('search_by_name_and_email')}
                onChange={dbOnSearchChange}
                onSearch={onSearchAccount}
                enterButton
              />
            </div>
            <Button
              onClick={onAddAdmin}
              type="primary"
              disabled={userRoleNum === 1}
            >
              {t('create_admin')}
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
            expandable={{
              expandedRowKeys:
                disableExpandRows.length > 0
                  ? [...disableExpandRows]
                  : undefined,
              onExpand: () => {
                // console.log({ disableExpandRows });
                setHasUnsavedChanges(disableExpandRows.length > 0);
              },
              expandRowByClick: true,
              expandedRowRender: (record) => (
                <Suspense fallback={<Skeleton active />}>
                  <ExpandRow
                    mutate={mutate}
                    adminId={record.id}
                    record={record}
                    onRowEdit={(rowId, changed) => {
                      setDisableExpandRows((prev) =>
                        changed
                          ? prev.filter((id) => id !== rowId)
                          : hasUnsavedChanges
                          ? []
                          : [...prev, rowId]
                      );
                    }}
                    setHasUnsavedChanges={setHasUnsavedChanges}
                    setDisableExpandRows={setDisableExpandRows}
                    hasUnsavedChanges={hasUnsavedChanges}
                  />
                </Suspense>
              ),
            }}
            pagination={{
              defaultPageSize: 10,
              pageSizeOptions: [10],
              position: [
                showPagTop
                  ? data!.data?.result.length <= 10
                    ? "none"
                    : "topCenter"
                  : "none",
                showPagTop ? "none" : "bottomCenter",
              ],
              onShowSizeChange: (_, size) => {
                if (size < 20) setShowPagTop(true);
                else setShowPagTop(false);
              },
            }}
          />
        </AccountTableRow>
      </AccountsWrapper>
      <Modal
        centered
        width={350}
        onOk={() => handleDelete()}
        onCancel={() => setShowDeleteModal(false)}
        okText={t("Có")}
        cancelText={t("Huỷ")}
        title={
          <span>
            <ExclamationCircleFilled
              style={{
                fontSize: "20px",
                color: COLORS.SPRING.YELLOW,
                marginRight: "0.5rem",
              }}
            />{" "}
            { t("Bạn có chắc không?") }
          </span>
        }
        closeIcon={null}
        maskClosable={false}
        open={showDeleteModal}
      >
        <p style={{ textAlign: "justify" }}>
          { t("Bạn có muốn xoá admin với ID") } = {targetDeleteId}?
        </p>
      </Modal>
      <Modal
        centered
        width={400}
        onOk={() => handleToggle2FA()}
        onCancel={() => {
          if (!isToggling2FA) {
            setShowToggle2FAModal(false);
            setTargetToggle2FAEmail("");
          }
        }}
        okText={t("Có")}
        cancelText={t("Huỷ")}
        confirmLoading={isToggling2FA}
        title={
          <span>
            <ExclamationCircleFilled
              style={{
                fontSize: "20px",
                color: COLORS.SPRING.YELLOW,
                marginRight: "0.5rem",
              }}
            />{" "}
            { t("Bạn có chắc không?") }
          </span>
        }
        closeIcon={null}
        maskClosable={false}
        open={showToggle2FAModal}
      >
        <div style={{ textAlign: "justify" }}>
          <p>
            { t("2fa_toggle_confirm") } (ID: {targetToggle2FAId})?
            <br />
            {targetToggle2FAStatus 
              ? t("2fa_will_be_disabled")
              : t("2fa_will_be_enabled")}
          </p>
          {!targetToggle2FAStatus && targetToggle2FAEmail && (
            <div style={{ 
              marginTop: "16px", 
              padding: "12px", 
              backgroundColor: "#fff7e6", 
              border: "1px solid #ffd591",
              borderRadius: "4px"
            }}>
              <p style={{ margin: 0, fontWeight: 500, color: "#d46b08" }}>
                {t("verify_email_for_otp")}
              </p>
              <p style={{ margin: "8px 0 0 0", color: "#595959" }}>
                <strong>Email:</strong> {targetToggle2FAEmail}
              </p>
              <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "#8c8c8c" }}>
                {t("verify_email_otp_note")}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </Layout>
  );
}
