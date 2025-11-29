/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Select,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { COLORS } from "@lib/constants";
import { login, registerAdmin, useAuth, verifyOTP } from "@store/useAuth";
import { useRoute } from "@store/useRoute";
import { useState } from "react";
import { ButtonWrapper, FormBox, Title, Wrapper } from "./style";
import "../../../../styles/admin.css";

export default function Auth() {
  // hooks
  // [router]
  const navigate = useNavigate();
  // [antd form]
  const [loginForm] = Form.useForm();
  const [signupForm] = Form.useForm();

  // global
  const userStoreData = useAuth(({ data }) => data);
  const saveLogin = useAuth(({ saveLogin }) => saveLogin);
  const isCreateAdminClicked = useRoute(
    ({ data }) => data.isCreateAdminClicked
  );
  const saveIsCreateAdminClicked = useRoute(
    ({ saveIsCreateAdminClicked }) => saveIsCreateAdminClicked
  );

  // OTP state
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [otpUsername, setOtpUsername] = useState("");

  // methods
  const onLoginFinish = async (values: Record<string, string>) => {
    // If OTP is required, verify OTP instead
    if (requiresOTP) {
      const verifyStatus = await verifyOTP(otpUsername, values.otpCode, {
        onSuccess: (response) => {
          const loginInfos = {
            ...userStoreData,
            email: otpUsername,
            isAuthenticated: true,
            ...response,
          };
          delete loginInfos[
            "1NSaWe3BxrnRqiK5DQ+Kp8d0dxLVH1hYm9p174VWT3UU/i7Wf3JSSUWiE/dd+IurV9c49doUUm0AC96+7elQXeXVw03ar15OTUZUTBlAJqd7p5wz5HLApAWOqpC070an"
          ];
          delete loginInfos[
            "Qn/vDAYpH487rfKmQ4wMWuVkp7LxndcFAPoJ212hlFgnsjHt1Mhk9lvyHF8s37Zl4Yv4dk22DMlEllWTGQAxSNPJVxBzdxmIvNe/J4wrfsb0bgYqU/xVvbYBRhE38ncs"
          ];
          saveLogin(loginInfos);
          navigate(loginInfos.role === 1 ? "/cp/leaders" : "/cp");
          setTimeout(() => message.success(`Xin chào, ${otpUsername}`), 500);
        },
        onError: (error) => {
          message.error(error || "Mã OTP không đúng hoặc đã hết hạn");
        },
      });

      if (verifyStatus?.status === "error") {
        message.error(verifyStatus?.error || "Mã OTP không đúng hoặc đã hết hạn");
      } else if (verifyStatus?.status === "success") {
        setRequiresOTP(false);
        setOtpUsername("");
        loginForm.resetFields();
      }
      return;
    }

    // Normal login flow
    const loginStatus = await login(values.email, values.password, true);
    if (loginStatus?.status === "error") {
      message.error(
        loginStatus?.error.includes("account")
          ? "Tài khoản không tồn tại"
          : "Mật khẩu của bạn không đúng"
      );
    } else if (loginStatus?.status === "requiresOTP") {
      // OTP is required
      setRequiresOTP(true);
      setOtpUsername(values.email);
      message.info(loginStatus?.message || "Vui lòng nhập mã OTP đã được gửi đến email của bạn.");
      loginForm.resetFields(["password"]);
    } else if (loginStatus?.status === "success") {
      // Normal login success
      const loginInfos = {
        ...userStoreData,
        email: values?.email,
        isAuthenticated: true,
        ...loginStatus?.response,
      };
      delete loginInfos[
        "1NSaWe3BxrnRqiK5DQ+Kp8d0dxLVH1hYm9p174VWT3UU/i7Wf3JSSUWiE/dd+IurV9c49doUUm0AC96+7elQXeXVw03ar15OTUZUTBlAJqd7p5wz5HLApAWOqpC070an"
      ];
      delete loginInfos[
        "Qn/vDAYpH487rfKmQ4wMWuVkp7LxndcFAPoJ212hlFgnsjHt1Mhk9lvyHF8s37Zl4Yv4dk22DMlEllWTGQAxSNPJVxBzdxmIvNe/J4wrfsb0bgYqU/xVvbYBRhE38ncs"
      ];

      saveLogin(loginInfos);
      navigate(loginInfos.role === 1 ? "/cp/leaders" : "/cp");
      setTimeout(() => message.success(`Xin chào, ${values.email}`), 500);
    }
  };
  const onLoginFailed = (errorInfo: any) => {
    console.log("Login Form Failed:", errorInfo); // DEV
    const errorMsg =
      errorInfo?.errorFields[0]?.errors?.[0] ||
      "Vui lòng xem lại thông tin đăng nhập";
    message.error(errorMsg);
  };
  const onSignupFinish = async (values: Record<string, string>) => {
    delete values["confirmPassword"];
    const registerStatus = await registerAdmin({ ...values });
    if (registerStatus?.status === "error") {
      message.error(registerStatus?.error || "Tạo admin mới thất bại");
    } else {
      // console.log("SignUp Form Success:", values);
      message.success(`Tài khoản mới đã được tạo, ${values.email}`);
      setTimeout(() => {
        saveIsCreateAdminClicked(false);
        signupForm.resetFields();
      }, 500);
    }
  };
  const onSignupFailed = (errorInfo: any) => {
    console.log("SignUp Form Failed:", errorInfo); // DEV
    const errorMsg =
      errorInfo?.errorFields[0]?.errors?.[0] ||
      "Vui lòng xem lại thông tin admin mới";
    message.error(errorMsg);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: COLORS.VALORANT.BLACK,
        },
      }}
    >
      <Wrapper>
        <div className="" />
        <FormBox>
          {!isCreateAdminClicked && (
            <>
              <Title>ADMIN AREA</Title>
              <Form
                form={loginForm}
                style={{ width: "100%" }}
                onFinish={onLoginFinish}
                onFinishFailed={onLoginFailed}
                autoComplete="off"
                colon={false}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 18 }}
              >
                {!requiresOTP ? (
                  <>
                    <Form.Item
                      label="Username"
                      name="email"
                      rules={[
                        { required: true, message: "Username là trường bắt buộc" },
                      ]}
                    >
                      <Input placeholder="Nhập username của bạn" />
                    </Form.Item>

                    <Form.Item
                      required
                      style={{ marginTop: "1.5rem" }}
                      label="Mật khẩu"
                      name="password"
                      rules={[
                        {
                          validator: (_, value) => {
                            if (!value || value === null)
                              return Promise.reject(
                                new Error("Mật khẩu là trường bắt buộc")
                              );
                            if (value.trim().length < 8)
                              return Promise.reject(
                                new Error("Mật khẩu phải có 8 kí tự")
                              );
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>
                  </>
                ) : (
                  <>
                    <Form.Item
                      label="Mã OTP"
                      name="otpCode"
                      rules={[
                        { required: true, message: "Mã OTP là trường bắt buộc" },
                        {
                          pattern: /^\d{6}$/,
                          message: "Mã OTP phải có 6 chữ số",
                        },
                      ]}
                    >
                      <Input 
                        placeholder="Nhập mã OTP 6 chữ số" 
                        maxLength={6}
                        style={{ letterSpacing: "unset", fontSize: "20px", textAlign: "center" }}
                      />
                    </Form.Item>
                    <div style={{ marginBottom: "16px", fontSize: "12px", color: "#666" }}>
                      Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.
                    </div>
                  </>
                )}
                <ButtonWrapper>
                  {requiresOTP && (
                    <Button
                      onClick={() => {
                        setRequiresOTP(false);
                        setOtpUsername("");
                        loginForm.resetFields();
                      }}
                    >
                      Quay lại
                    </Button>
                  )}
                  <Button htmlType="submit" type="primary">
                    {requiresOTP ? "Xác nhận OTP" : "Đăng nhập"}
                  </Button>
                </ButtonWrapper>
              </Form>
            </>
          )}
          {isCreateAdminClicked && (
            <>
              <Title>Tạo Tài Khoản Mới</Title>
              <Form
                form={signupForm}
                style={{ width: "100%" }}
                onFinish={onSignupFinish}
                onFinishFailed={onSignupFailed}
                autoComplete="off"
                colon={false}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 19 }}
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    { required: true, message: "Username là trường bắt buộc" },
                  ]}
                >
                  <Input placeholder="Nhập tên người dùng" />
                </Form.Item>
                {/* <Form.Item
                  label="Riot ID"
                  name="riotId"
                  rules={[{ required: true, message: "Riot ID is required" }]}
                >
                  <Input placeholder="Enter your riot ID" />
                </Form.Item> */}
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Email là trường bắt buộc" },
                    {
                      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email is invalid",
                    },
                  ]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>
                <Form.Item
                  label="Role"
                  name="role"
                  rules={[
                    { required: true, message: "Role là trường bắt buộc" },
                  ]}
                >
                  <Select placeholder="Chọn admin role">
                    <Select.Option value={2}>ADMIN</Select.Option>
                    {/* <Select.Option value={1}>USER</Select.Option> */}
                  </Select>
                </Form.Item>
                <Divider />
                <Form.Item
                  required
                  style={{ marginTop: "1.5rem" }}
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value || value === null)
                          return Promise.reject(
                            new Error("Mật khẩu là trường bắt buộc")
                          );
                        if (value.trim().length < 8)
                          return Promise.reject(
                            new Error("Mật khẩu phải có 8 chữ cái")
                          );
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
                <Form.Item
                  required
                  style={{ marginTop: "1.5rem" }}
                  label="Re-type"
                  name="confirmPassword"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value || value === null)
                          return Promise.reject(
                            new Error("Xác nhận mật khẩu là trường bắt buộc")
                          );
                        if (
                          value.trim() !==
                          signupForm.getFieldValue("password").trim()
                        )
                          return Promise.reject(
                            new Error("Xác nhận mật khẩu không khớp")
                          );
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input.Password placeholder="Nhập lại mật khẩu" />
                </Form.Item>
                <ButtonWrapper>
                  <Button
                    onClick={() => {
                      navigate("/cp/accounts");
                      saveIsCreateAdminClicked(false);
                      signupForm.resetFields();
                    }}
                    type="primary"
                  >
                    Quay lại
                  </Button>
                  <Button htmlType="submit">Tạo Mới</Button>
                </ButtonWrapper>
              </Form>
            </>
          )}
        </FormBox>
      </Wrapper>
    </ConfigProvider>
  );
}
