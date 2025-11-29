import { LoadingOutlined } from "@ant-design/icons";
import { notification } from "@store/useNotification";
import { Form, Input } from "antd";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "../../../api/endpoints";
import { fetcher } from "../../../api/useAxiosSWR";
import BaseModal from "../../../common/BaseModal";
import { FormLabel, StyledForm, StyledFormItem } from "../../../common/BaseModal/form.styles";
import PopupTitle from "../PopupTitle";
import PrimaryPopupButton from "../PrimaryPopupButton";
import { ForgetPasswordModalGlobalStyle, FormContainer } from "./styles";

interface ForgetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ForgetPasswordFormValues {
  email: string;
  username: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function ForgetPasswordModal({ isOpen, onClose }: ForgetPasswordModalProps) {
  const [form] = Form.useForm<ForgetPasswordFormValues>();
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async (values: ForgetPasswordFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        email: values.email,
        username: values.username,
        newPassword: values.newPassword,
      };
      const response: { success: boolean } = await fetcher.post(
        ENDPOINTS.forgotPassword,
        payload
      );
      if (response?.success) {
        notification.show({
          message: "Yêu cầu đặt lại mật khẩu đã được gửi đến địa chỉ email của bạn. Vui lòng kiểm tra và xác nhận.",
        });
        handleClose();
      }
    } catch (error) {
      notification.show({
        message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      form.resetFields();
    }
  }, [isOpen, form]);

  return (
    <>
    <ForgetPasswordModalGlobalStyle />
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      width={{
        xs: '100%',
        sm: '90%',
        md: 550,
        lg: 600,
        xl: 650
      }}
      rootClassName="forget-password-modal"
      title={<PopupTitle>QUÊN MẬT KHẨU</PopupTitle>}
    >
      <StyledForm
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        autoComplete="off"
      >
        <FormContainer>
          <StyledFormItem
            label={<FormLabel>Email đã đăng ký</FormLabel>}
            name="email"
            rules={[
              { required: true, message: 'Email không được để trống' },
              { type: 'email' as const, message: 'Email không hợp lệ' },
            ]}
          >
            <Input placeholder="Nhập email đã đăng ký" />
          </StyledFormItem>

          <StyledFormItem
            label={<FormLabel>Tên đăng nhập</FormLabel>}
            name="username"
            rules={[
              { required: true, message: 'Tên đăng nhập không được để trống' },
              { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' },
              { max: 20, message: 'Tên đăng nhập không được quá 20 ký tự' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: 'Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới' }
            ]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </StyledFormItem>

          <StyledFormItem
            label={<FormLabel>Mật khẩu mới</FormLabel>}
            name="newPassword"
            rules={[
              { required: true, message: 'Mật khẩu mới không được để trống' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
              { max: 50, message: 'Mật khẩu không được quá 50 ký tự' }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </StyledFormItem>

          <StyledFormItem
            label={<FormLabel>Xác nhận mật khẩu mới</FormLabel>}
            name="confirmNewPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu mới" />
          </StyledFormItem>
        </FormContainer>

        <PrimaryPopupButton type="submit" disabled={isLoading} style={{ marginTop: '1rem' }}>
          {isLoading && <LoadingOutlined style={{ marginRight: '8px' }} spin />}
          XÁC NHẬN
        </PrimaryPopupButton>
      </StyledForm>
    </BaseModal>
    </>
  );
}


