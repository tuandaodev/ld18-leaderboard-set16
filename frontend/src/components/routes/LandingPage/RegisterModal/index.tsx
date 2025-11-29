import { LoadingOutlined } from "@ant-design/icons";
import { notification } from "@store/useNotification";
import { Form, Input } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useEffect, useState } from "react";
import { register, useAuth } from "../../../../store/useAuth";
import BaseModal from "../../../common/BaseModal";
import { FormLabel, StyledForm, StyledFormItem } from "../../../common/BaseModal/form.styles";
import PopupTitle from "../PopupTitle";
import PrimaryButton from "../PrimaryButton";
import { LoginRegisterText, TermsCheckbox, RegisterModalGlobalStyle } from "./RegisterModal.styles";
import PrimaryPopupButton from "../PrimaryPopupButton";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleId: string;
  uid: string;
  socialMediaUrl: string;
  agreeToTerms: boolean;
}

interface SignUpDto {
  username: string;
  email: string;
  password: string;
  roleId?: string;
  uid?: string;
  socialUrl?: string;
  termsAgreedAt?: string;
}

export default function RegisterModal({ isOpen, onClose, onOpenLogin }: RegisterModalProps) {
  const [form] = Form.useForm<RegisterFormValues>();
  const [isLoading, setIsLoading] = useState(false);
  const [termsAgreedAt, setTermsAgreedAt] = useState<Date | null>(null);
  const { saveLogin } = useAuth();

  const handleFinish = async (values: RegisterFormValues) => {
    setIsLoading(true);
    
    try {
      // Map form values to SignUpDto interface
      const signUpData: SignUpDto = {
        username: values.username,
        email: values.email,
        password: values.password,
        roleId: values.roleId,
        uid: values.uid,
        socialUrl: values.socialMediaUrl, // Map socialMediaUrl to socialUrl
        termsAgreedAt: termsAgreedAt ? termsAgreedAt.toISOString() : undefined,
      };

      // Call the register function with authentication
      const result = await register(signUpData, {
        onSuccess: (response) => {
          // Save login information to store
          saveLogin({
            username: values.username,
            isAuthenticated: true,
          });
          
          notification.show({
            message: "Chúc mừng bạn đã đăng ký thành công.",
            title: "HOÀN TẤT ĐĂNG KÝ"
          });
          
          handleClose();
        },
        onError: (error) => {
          console.error('Registration error:', error);
          notification.show({
            message: error || "Đăng ký thất bại. Vui lòng thử lại.",
          });
        },
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage = error?.response?.data?.error || "Đăng ký thất bại. Vui lòng thử lại.";
      notification.show({
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setTermsAgreedAt(null);
    onClose();
  };

  const handleTermsChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked && !termsAgreedAt) {
      // Capture timestamp when user checks the checkbox
      setTermsAgreedAt(new Date());
    } else if (!e.target.checked) {
      // Reset timestamp if user unchecks
      setTermsAgreedAt(null);
    }
  };

  const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenLogin();
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      form.resetFields();
      setTermsAgreedAt(null);
    }
  }, [isOpen, form]);

  return (
    <>
      <RegisterModalGlobalStyle />
      <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      width={1000}
      size="large"
      rootClassName="register-modal"
      title={<PopupTitle size="large">VUI LÒNG ĐIỀN THÔNG TIN</PopupTitle>}
    >
      <StyledForm
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        autoComplete="off"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
            <Input placeholder="Nhập tên đăng nhập" />
          </StyledFormItem>

          <StyledFormItem
            label={<FormLabel>Email</FormLabel>}
            name="email"
            rules={[
              { required: true, message: 'Email không được để trống' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </StyledFormItem>

          <StyledFormItem
            label={<FormLabel>Password</FormLabel>}
            name="password"
            rules={[
              { required: true, message: 'Mật khẩu không được để trống' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
              { max: 50, message: 'Mật khẩu không được quá 50 ký tự' }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </StyledFormItem>

          <StyledFormItem
            label={<FormLabel>Role ID</FormLabel>}
            name="roleId"
            rules={[
              { required: true, message: 'Role ID không được để trống' },
              { pattern: /^\d+$/, message: 'Role ID chỉ được là số' }
            ]}
          >
            <Input placeholder="Nhập Role ID" inputMode="numeric" />
          </StyledFormItem>

          <StyledFormItem
            label={<FormLabel>Nhập lại password</FormLabel>}
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng nhập lại mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
          </StyledFormItem>

          <StyledFormItem
            label={<FormLabel>Tên nhân vật trong game</FormLabel>}
            name="uid"
            rules={[
              { required: true, message: 'Tên nhân vật trong game không được để trống' }
            ]}
          >
            <Input placeholder="Nhập tên nhân vật trong game" />
          </StyledFormItem>
        </div>

        <StyledFormItem
          label={<FormLabel>Trang MXH cá nhân</FormLabel>}
          name="socialMediaUrl"
          rules={[
            { required: true, message: 'Trang MXH cá nhân không được để trống' },
            { type: 'url', message: 'Vui lòng nhập URL hợp lệ' }
          ]}
        >
          <Input placeholder="Nhập URL trang mạng xã hội" />
        </StyledFormItem>

        <StyledFormItem
          name="agreeToTerms"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('Bạn phải đồng ý với các điều khoản')),
            },
          ]}
        >
          <TermsCheckbox onChange={handleTermsChange}>
            Tôi đồng ý với các{' '}
            <a href="#community" target="_blank" rel="noopener noreferrer">
              điều khoản về chính sách và quy định
            </a>
            {' '}của chương trình.
          </TermsCheckbox>
        </StyledFormItem>

        <PrimaryPopupButton type="submit" disabled={isLoading}>
          {isLoading && <LoadingOutlined style={{ marginRight: '8px' }} spin />}
          XÁC NHẬN
        </PrimaryPopupButton>

        <LoginRegisterText>
          Đã có tài khoản? <a href="#login" onClick={handleLoginClick}>Đăng nhập ngay</a>
        </LoginRegisterText>
      </StyledForm>
    </BaseModal>
    </>
  );
}


