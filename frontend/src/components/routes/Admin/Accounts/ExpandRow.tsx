import { ExclamationCircleFilled } from "@ant-design/icons";
import Edit from "@icons/edit.svg?react";
import {
  Button,
  Descriptions,
  Form,
  Input,
  Modal,
  Select,
  Skeleton,
  Table,
  message,
} from "antd";
import format from "date-fns/format";
import isEqual from "lodash.isequal";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";

import useAxiosSWR, { fetcher } from "@components/api/useAxiosSWR";
import { ENDPOINTS } from "@components/api/endpoints";
import { COLORS } from "@lib/constants";
import { debounce } from "@lib/utils";
import { useAuth } from "@store/useAuth";

import type { FindAllLogsResponse } from "types/endpoints/account-find-all-logs";
import type { Result } from "types/endpoints/account-find-all";

import { ExpandRowWrapper } from "./style";
import { t } from "i18next";

type Props = {
  mutate: () => void;
  adminId: number;
  record: Result;
  onRowEdit: (arg0: number, arg1: boolean) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: React.SetStateAction<boolean>) => void;
  setDisableExpandRows: (value: React.SetStateAction<number[]>) => void;
};

export default function ExpandRow({
  mutate,
  adminId,
  record,
  onRowEdit,
  hasUnsavedChanges,
  setHasUnsavedChanges,
  setDisableExpandRows,
}: Props) {
  // hooks
  const [editUserForm] = Form.useForm();
  const [editUserPwdForm] = Form.useForm();
  const isMedium = useMediaQuery("(max-width: 1194px)");
  // const isXLarge = useMediaQuery("(max-width: 1280px)");
  // [data fetching]
  // all action logs by admin id
  const [currPage, setCurrPage] = useState<number>(1);
  const {
    data: allLogsData,
    error: allLogsError,
    isLoading: allLogsIsLoading,
  } = useAxiosSWR<FindAllLogsResponse>(ENDPOINTS.allLogs, {
    params: { adminId, page: currPage, pageSize: 10 },
  });
  const userRoleNum = useAuth(({ data }) => data.role);

  // consts
  const descSlotStyles = {
    labelStyle: { width: isMedium ? "90px" : "110px", fontWeight: "600" },
    contentStyle: { backgroundColor: "#fff" },
  };

  // states
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currEditData, setCurrEditData] = useState<Partial<Result>>(record);
  const [isSaveDisabled, setIsSaveDsiabled] = useState(true);
  const [isChangePwd, setIsChangePwd] = useState(false);
  const [disableChangePwd, setDisableChangePwd] = useState(true);
  const [editInfosTracker, setEditInfosTracker] = useState({});

  // private components
  const Content = ({ text }: { text: string }) => (
    <div className="content">
      <p>{text}</p>
      <Button
        type="dashed"
        className="btn-icon"
        shape="circle"
        disabled={userRoleNum === 1}
        onClick={() => setOpenEditModal(true)}
      >
        <Edit />
      </Button>
    </div>
  );

  // methods
  const handleOk = async () => {
    try {
      const values = await editUserForm.validateFields();
      setOpenEditModal(false);
      // console.log({ values });
      setEditInfosTracker(values);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(error.errorFields[0].errors[0]);
    }
  };
  const handleCancel = () => {
    editUserForm.resetFields();
    editUserForm.setFieldValue("username", record.username);
    editUserForm.setFieldValue("email", record.email);
    editUserForm.setFieldValue("role", record.role);

    onRowEdit(-1, false);
    setDisableExpandRows([]);
    setCurrEditData(record);
    setOpenEditModal(false);
    setIsSaveDsiabled(true);
    setHasUnsavedChanges(false);
  };
  const handleValuesChange = debounce(
    (values: Record<string, string | number>) => {
      const newValues = { ...currEditData, ...values };
      const disabled = isEqual(record, newValues);
      //   if (values.role) editUserForm.setFieldValue("role", values.role);
      setIsSaveDsiabled(disabled);
      setCurrEditData(newValues);
      onRowEdit(record.id, disabled);
      //   console.log({ id: record.id, disabled });
      //   console.log({
      //     disabled,
      //     values,
      //   });
    },
    100
  );
  const handleChangePwdFinish = async (values: Record<string, string>) => {
    try {
      // console.log({ values }); // DEV
      const response: { success: boolean } = await fetcher.patch(
        ENDPOINTS.changePassword,
        { id: record.id, newPassword: values.newPassword }
      );
      if (response.success) {
        message.success(`Thay đổi password cho admin có ID = ${record.id}`);
        setIsChangePwd(false);
        setDisableChangePwd(true);
        editUserPwdForm.resetFields();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(error?.response?.data?.error || "Đã xảy lỗi ở nội bộ");
    }
  };
  const handleSaveClicked = async () => {
    try {
      // console.log({ editInfosTracker }); // DEV
      const response: { success: boolean } = await fetcher.patch(
        ENDPOINTS.updateInfo,
        { ...editInfosTracker, id: record.id }
      );
      if (response.success) {
        message.success(`Thay đổi thông tin admin có ID = ${record.id}`);
        mutate();
        setTimeout(() => {
          setHasUnsavedChanges(false);
          onRowEdit(record.id!, false);
          setIsSaveDsiabled(true);
          setCurrEditData(editInfosTracker);
          setDisableExpandRows([]);
        }, 300);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(error?.response?.data?.error || "Đã xảy lỗi ở nội bộ");
    }
  };

  // user info descriptions
  const userItems = [
    {
      key: "username",
      label: t("Tên"),
      ...descSlotStyles,
      children: <Content text={currEditData.username!} />,
    },
    {
      key: "email",
      label: "Email",
      ...descSlotStyles,
      children: <Content text={currEditData.email!} />,
    },
    {
      key: "role",
      label: t("Vai Trò"),
      ...descSlotStyles,
      children: <Content text={currEditData.role === 2 ? "ADMIN" : "USER"} />,
    },
  ];

  const logColumns = [
    {
      title: <p className="text-center">No.</p>,
      key: "no.",
      width: 50,
      className: "text-center",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, __: any, order: number) => <p>{order + 1}</p>,
    },
    {
      title: <p className="text-center">Id</p>,
      dataIndex: "id",
      key: "id",
      width: 50,
      className: "text-center",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: isMedium ? 300 : "auto",
      render: (actionStr: string) => (
        <p style={{ wordBreak: "break-word" }}>{actionStr}</p>
      ),
    },
    {
      title: t("Thời gian"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (stamp: string) =>
        format(new Date(stamp), "dd/MM/yyyy hh:mm:ss a"),
    },
  ];

  // before data states
  if (allLogsIsLoading) return <Skeleton active />;
  if (allLogsError) return <div>{allLogsError.message}</div>;

  return (
    <>
      <ExpandRowWrapper>
        {/* USER INFO */}
        <div className="col">
          <Descriptions
            column={1}
            bordered
            size="small"
            items={userItems}
            style={{ width: "100%" }}
          />
          <div className="btns">
            <Button
              block
              disabled={userRoleNum === 1}
              type="primary"
              onClick={() => setIsChangePwd(true)}
            >
              {t("Đổi mật khẩu")}
            </Button>
            <Button block disabled={isSaveDisabled} onClick={handleSaveClicked}>
            { t("Lưu") }
            </Button>
          </div>
        </div>
        <div className="col">
          {/* ACTION LOGS */}
          <Table
            style={{
              backgroundColor: "#fff",
              border: "1px solid #292b2d32",
              borderRadius: "0.5rem",
              paddingTop: isMedium ? "0.75rem" : "0",
              overflow: "hidden",
            }}
            rowKey="id"
            size={isMedium ? "small" : "middle"}
            dataSource={allLogsData?.data?.result}
            columns={logColumns}
            pagination={{
              current: currPage,
              total: allLogsData?.data?.total,
              defaultPageSize: 10,
              pageSizeOptions: [10],
              position: ["bottomLeft"],
              onChange: (currPage) => {
                setCurrPage(currPage);
              },
            }}
          />
        </div>
      </ExpandRowWrapper>
      {/* EDIT MODAL */}
      <Modal
        centered
        okButtonProps={{ disabled: isSaveDisabled }}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xác Nhận"
        cancelText={t("Huỷ")}
        title="Thay Đổi Thông Tin"
        open={openEditModal}
        maskClosable
      >
        <Form
          form={editUserForm}
          style={{ width: "100%", marginBlock: "1rem" }}
          autoComplete="off"
          colon={false}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          onValuesChange={handleValuesChange}
        >
          <Form.Item
            label={t("Tên")}
            name="username"
            rules={[{ required: true, message: "Tên không thể để trống" }]}
            initialValue={currEditData.username}
          >
            <Input placeholder={t("Nhập tên")} />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email không thể để trống" },
              {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email có định dạng không đúng",
              },
            ]}
            initialValue={currEditData.email}
          >
            <Input placeholder="Nhập email mới" />
          </Form.Item>
          <Form.Item
            label={t("Vai Trò")}
            name="role"
            initialValue={currEditData.role}
            rules={[{ required: true, message: "Vai trò là bắt buộc" }]}
          >
            <Select placeholder="Hãy chọn vai trò">
              <Select.Option value={1}>USER</Select.Option>
              <Select.Option value={2}>ADMIN</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* DISACRD CONFIRM MODAL */}
      <Modal
        centered
        width={350}
        onOk={() => {
          setHasUnsavedChanges(false);
          onRowEdit(currEditData.id!, false);
          setIsSaveDsiabled(true);
          setTimeout(() => {
            editUserForm.setFieldValue("username", record.username);
            editUserForm.setFieldValue("email", record.email);
            editUserForm.setFieldValue("role", record.role);
            setCurrEditData(record);
          }, 300);
        }}
        onCancel={() => setHasUnsavedChanges(false)}
        okText="Chắc chắn"
        cancelText="Không chắc"
        title={
          <span>
            <ExclamationCircleFilled
              style={{
                fontSize: "20px",
                color: COLORS.SPRING.YELLOW,
                marginRight: "0.5rem",
              }}
            />{" "}
            Bạn chắc không?
          </span>
        }
        closeIcon={null}
        maskClosable={false}
        open={hasUnsavedChanges}
      >
        <p style={{ textAlign: "justify" }}>
          Bạn có thay đổi chưa lưu ở dòng có ID <strong>No. {record.id}</strong>
          . Bạn có muốn tiếp tục mà không lưu?
        </p>
      </Modal>

      {/* CHANGE PWD MODAL */}
      <Modal
        centered
        width={400}
        onOk={() => {}}
        onCancel={() => {
          setIsChangePwd(false);
          setDisableChangePwd(true);
          editUserPwdForm.resetFields();
        }}
        footer={null}
        title={t("Thay đổi mật khẩu")}
        open={isChangePwd}
      >
        <Form
          form={editUserPwdForm}
          style={{ width: "100%", marginBlock: "1rem" }}
          autoComplete="off"
          colon={false}
          layout="vertical"
          onValuesChange={(_, allValues) => {
            const hasBlank = Object.values(allValues).some((val) => !val);
            const pwdLessThan8Chars = allValues.newPassword.length < 8;
            const pwdsNotMatch =
              allValues.newPassword !== allValues.confirmPassword;
            setDisableChangePwd(hasBlank || pwdLessThan8Chars || pwdsNotMatch);
          }}
          onFinish={handleChangePwdFinish}
        >
          <Form.Item
            required
            label={t("Mật khẩu Mới")}
            name="newPassword"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value === null)
                    return Promise.reject(
                      new Error("Mật khẩu là trường bắt buộc")
                    );
                  if (value.trim().length < 8)
                    return Promise.reject(
                      new Error("Mật khẩu phải dài 8 chữ cái")
                    );
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password
              type="password"
              placeholder={t("Nhập mật khẩu của bạn")}
            />
          </Form.Item>
          <Form.Item
            required
            label={t("Nhập lại Password")}
            name="confirmPassword"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value === null)
                    return Promise.reject(
                      new Error("Nhập lại mật khẩu là bắt buộc")
                    );
                  if (
                    value.trim() !==
                    editUserPwdForm.getFieldValue("newPassword").trim()
                  )
                    return Promise.reject(
                      new Error("Nhập lại mặt khẩu không khớp")
                    );
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password placeholder={t("Nhập lại mật khẩu mới")} />
          </Form.Item>
        </Form>
        <div style={{ width: "100%", textAlign: "center", marginTop: "2rem" }}>
          <Button
            type="primary"
            onClick={() => editUserPwdForm.submit()}
            disabled={disableChangePwd}
          >
            {t("Đồng ý")}
          </Button>
        </div>
      </Modal>
    </>
  );
}
