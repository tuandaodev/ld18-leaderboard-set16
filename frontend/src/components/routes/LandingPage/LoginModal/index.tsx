import { LoadingOutlined } from "@ant-design/icons";
import { notification } from "@store/useNotification";
import { Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { login, useAuth } from "../../../../store/useAuth";
import BaseModal from "../../../common/BaseModal";
import { FormLabel, StyledForm, StyledFormItem } from "../../../common/BaseModal/form.styles";
import PopupTitle from "../PopupTitle";
import PrimaryPopupButton from "../PrimaryPopupButton";
import { FormContainer, LoginModalGlobalStyle, LoginRegisterText } from "./LoginModal.styles";
import ForgetPasswordModal from "../ForgetPasswordModal";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
}

interface LoginFormValues {
  username: string;
  password: string;
}

export default function LoginModal({ isOpen, onClose, onOpenRegister }: LoginModalProps) {
  const [form] = Form.useForm<LoginFormValues>();
  const [isLoading, setIsLoading] = useState(false);
  const { saveLogin } = useAuth();
  const [isForgetOpen, setForgetOpen] = useState(false);

  const handleFinish = async (values: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const result = await login(
        values.username, // Using username as email
        values.password,
        false,
        {
          onSuccess: (response) => {
            message.success("Đăng nhập thành công!");
            
            // Save login information to store
            saveLogin({
              username: values.username,
              isAuthenticated: true,
            });
            
            handleClose();
          },
          onError: (error) => {
            console.error('error', error);
            // message.error(error || "Đăng nhập thất bại. Vui lòng thử lại.");
            notification.show({
              message: error || "Đăng nhập thất bại. Vui lòng thử lại.",
            });
          },
        }
      );
    } catch (error) {
      console.error('error', error);
      // message.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
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

  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenRegister();
  };

  const handleForgetPasswordClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Close current modal first, then open ForgetPasswordModal
    onClose();
    setTimeout(() => setForgetOpen(true), 0);
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      form.resetFields();
    }
  }, [isOpen, form]);

  return (
    <>
    <LoginModalGlobalStyle />
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
      rootClassName="login-modal"
      title={<PopupTitle>ĐĂNG NHẬP</PopupTitle>}
    >
      <StyledForm
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        autoComplete="off"
        requiredMark={false}  // Only apply for this form
      >
        <FormContainer>
          <StyledFormItem
            label={<FormLabel>Tên đăng nhập</FormLabel>}
            name="username"
            rules={[
              { required: true, message: 'Tên đăng nhập không được để trống' },
              { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' },
              { max: 20, message: 'Tên đăng nhập không được quá 20 ký tự' },
              { 
                pattern: /^[a-zA-Z0-9_]+$/, 
                message: 'Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới' 
              }
            ]}
          >
            <Input
              placeholder="Nhập tên đăng nhập"
            />
          </StyledFormItem>

          <StyledFormItem
            label={<FormLabel>Mật khẩu</FormLabel>}
            name="password"
            rules={[
              { required: true, message: 'Mật khẩu không được để trống' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
              { max: 50, message: 'Mật khẩu không được quá 50 ký tự' }
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu"
            />
          </StyledFormItem>
        </FormContainer>

        <PrimaryPopupButton type="submit" disabled={isLoading} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          {isLoading && <LoadingOutlined style={{ marginRight: '8px' }} spin />}
          ĐĂNG NHẬP
        </PrimaryPopupButton>

        <LoginRegisterText>
          Chưa có tài khoản? <a href="#register" onClick={handleRegisterClick}>Đăng ký ngay</a>
        </LoginRegisterText>
        <LoginRegisterText>
          <a href="#forget" onClick={handleForgetPasswordClick}>Quên mật khẩu</a>
        </LoginRegisterText>
      </StyledForm>
    </BaseModal>
    <ForgetPasswordModal
      isOpen={isForgetOpen}
      onClose={() => setForgetOpen(false)}
    />
    </>
  );
}

