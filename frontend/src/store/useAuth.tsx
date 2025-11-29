import CryptoJS from "crypto-js";
import jwtDecode from "jwt-decode"; // Add this line
import { create } from "zustand";

import { ENDPOINTS } from "@components/api/endpoints";
import { fetcher } from "@components/api/useAxiosSWR";
import { message } from "antd";
import { SignUpResponse } from "types/endpoints/auth-register";
import { SignInResponse } from "types/endpoints/auth-sign-in";

// types
type User = {
  username: string;
  isAuthenticated: boolean;
  "1NSaWe3BxrnRqiK5DQ+Kp8d0dxLVH1hYm9p174VWT3UU/i7Wf3JSSUWiE/dd+IurV9c49doUUm0AC96+7elQXeXVw03ar15OTUZUTBlAJqd7p5wz5HLApAWOqpC070an"?: string;
  "Qn/vDAYpH487rfKmQ4wMWuVkp7LxndcFAPoJ212hlFgnsjHt1Mhk9lvyHF8s37Zl4Yv4dk22DMlEllWTGQAxSNPJVxBzdxmIvNe/J4wrfsb0bgYqU/xVvbYBRhE38ncs"?: string;
};
type Data = User & Partial<SignInResponse>;
interface useAuth {
  data: Data;
  saveLogin: (newData: User) => void;
  saveLogout: () => void;
}

// const
const INIT_DATA: Data = {
  username: "",
  isAuthenticated: false,
  "1NSaWe3BxrnRqiK5DQ+Kp8d0dxLVH1hYm9p174VWT3UU/i7Wf3JSSUWiE/dd+IurV9c49doUUm0AC96+7elQXeXVw03ar15OTUZUTBlAJqd7p5wz5HLApAWOqpC070an":
    "",
  "Qn/vDAYpH487rfKmQ4wMWuVkp7LxndcFAPoJ212hlFgnsjHt1Mhk9lvyHF8s37Zl4Yv4dk22DMlEllWTGQAxSNPJVxBzdxmIvNe/J4wrfsb0bgYqU/xVvbYBRhE38ncs":
    "",
};
const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
const signatureKey = import.meta.env.VITE_SIGNATURES_KEY;

// storage methods
type Tokens = { access_token: string; refresh_token: string };
// Encrypt and sign the tokens before storing
export const saveTokens = (tokens: Tokens) => {
  const signatureKey = import.meta.env.VITE_SIGNATURES_KEY;

  const encryptedAccessToken = CryptoJS.AES.encrypt(
    tokens.access_token,
    encryptionKey
  ).toString();
  const encryptedRefreshToken = CryptoJS.AES.encrypt(
    tokens.refresh_token,
    encryptionKey
  ).toString();
  const signature = CryptoJS.HmacSHA256(
    encryptedAccessToken + encryptedRefreshToken,
    signatureKey
  ).toString();

  localStorage.setItem(import.meta.env.VITE_ACCESS_TITLE, encryptedAccessToken);
  localStorage.setItem(
    import.meta.env.VITE_REFRESH_TITLE,
    encryptedRefreshToken
  );
  localStorage.setItem("token_signature", signature);
};
export const getAccessToken = () => {
  const encryptedToken = localStorage.getItem(
    import.meta.env.VITE_ACCESS_TITLE
  );
  const signature = localStorage.getItem("token_signature");

  // Verify the token signature before decrypting
  const expectedSignature = CryptoJS.HmacSHA256(
    encryptedToken! + localStorage!.getItem(import.meta.env.VITE_REFRESH_TITLE),
    signatureKey
  ).toString();

  if (signature !== expectedSignature) {
    // Invalid signature, clear tokens and handle accordingly
    clearTokens();
    return null;
  }

  // Decrypt the token
  const decryptedToken = CryptoJS.AES.decrypt(
    encryptedToken!,
    encryptionKey
  ).toString(CryptoJS.enc.Utf8);
  // console.log({ decryptedToken }); // DEV
  return decryptedToken;
};
export const setAccessToken = (accessToken: string) => {
  // Encrypt the access token
  const encryptedToken = CryptoJS.AES.encrypt(
    accessToken,
    encryptionKey
  ).toString();

  // Generate a signature for the token
  const signature = CryptoJS.HmacSHA256(
    encryptedToken + localStorage.getItem(import.meta.env.VITE_REFRESH_TITLE),
    signatureKey
  ).toString();

  // Store the encrypted token and signature in local storage
  localStorage.setItem(import.meta.env.VITE_ACCESS_TITLE, encryptedToken);
  localStorage.setItem("token_signature", signature);
};
export const getRefreshToken = () => {
  const encryptedToken = localStorage.getItem(
    import.meta.env.VITE_REFRESH_TITLE
  );
  const decryptedToken = CryptoJS.AES.decrypt(
    encryptedToken!,
    encryptionKey
  ).toString(CryptoJS.enc.Utf8);
  return decryptedToken;
};
export const setRefreshToken = (refreshToken: string) => {
  const encryptedToken = CryptoJS.AES.encrypt(
    refreshToken,
    encryptionKey
  ).toString();
  localStorage.setItem(import.meta.env.VITE_REFRESH_TITLE, encryptedToken);
};
export const clearTokens = () => {
  localStorage.removeItem(import.meta.env.VITE_ACCESS_TITLE);
  localStorage.removeItem(import.meta.env.VITE_REFRESH_TITLE);
  localStorage.removeItem("token_signature");
};
export const getLoginInfos = () => {
  // get last login infos string from session storage
  const lastLoginInfos = localStorage.getItem(
    import.meta.env.VITE_LOGIN_INFO_TITLE
  );

  // parse to reusable object data
  try {
    // decrypt the string data
    const decryptedLoginInfos = CryptoJS.AES.decrypt(
      lastLoginInfos!,
      encryptionKey
    ).toString(CryptoJS.enc.Utf8);
    const lastLoginData = JSON.parse(decryptedLoginInfos);
    return lastLoginData;
  } catch (error) {
    console.log("[Warning][Minor] Cannot decrypt due to missing login infos.");
    return { isAuthenticated: false };
  }
};

// main auth methods
// [login]
type LoginOptions = {
  onSuccess: (arg0: SignInResponse) => void;
  onError: (arg0: string) => void;
};
export const login = async (
  username: string,
  password: string,
  isFromAdminCP: boolean = false,
  options?: LoginOptions
) => {
  try {
    const response: SignInResponse = await fetcher.post(ENDPOINTS.signIn, {
      username,
      password,
      isFromAdminCP,
    });
    if (response.success) {
      // Check if OTP is required
      if (response.requiresOTP) {
        message.info(response.message);
        return { 
          status: "requiresOTP", 
          response,
          message: response.message 
        };
      }
      // Normal login flow
      const { access_token, refresh_token } = response;
      if (access_token && refresh_token) {
        saveTokens({ access_token, refresh_token });
        options?.onSuccess && options?.onSuccess(response);
        return { status: "success", response };
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (!error.name) {
      options?.onError && options?.onError(error.message);
      return {
        status: "error",
        error: error.message || "Internal Errors",
      };
    }
    options?.onError &&
      options?.onError(error?.response?.data?.error);
    return {
      status: "error",
      error: error?.response?.data?.error,
    };
  }
};

// [verify OTP]
type VerifyOTPOptions = {
  onSuccess: (arg0: SignInResponse) => void;
  onError: (arg0: string) => void;
};
export const verifyOTP = async (
  username: string,
  otpCode: string,
  options?: VerifyOTPOptions
) => {
  try {
    const response: SignInResponse = await fetcher.post(ENDPOINTS.verifyOTP, {
      username,
      otpCode,
    });
    if (response.success) {
      const { access_token, refresh_token } = response;
      if (access_token && refresh_token) {
        saveTokens({ access_token, refresh_token });
        options?.onSuccess && options?.onSuccess(response);
        return { status: "success", response };
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (!error.name) {
      options?.onError && options?.onError(error.message);
      return {
        status: "error",
        error: error.message || "Internal Errors",
      };
    }
    options?.onError &&
      options?.onError(error?.response?.data?.error);
    return {
      status: "error",
      error: error?.response?.data?.error,
    };
  }
};
// [sign up - user registration]
type SignUpOptions = {
  onSuccess: (arg0: SignUpResponse) => void;
  onError: (arg0: string) => void;
};
export const register = async (
  data: {
    username: string;
    email: string;
    password: string;
    roleId?: string;
    uid?: string;
    socialUrl?: string;
    termsAgreedAt?: string;
  },
  options?: SignUpOptions
) => {
  try {
    const response: SignUpResponse = await fetcher.post(ENDPOINTS.signUp, {
      ...data,
    });
    if (response.success) {
      // Save tokens after successful registration
      const { access_token, refresh_token } = response;
      saveTokens({ access_token, refresh_token });
      options?.onSuccess && options?.onSuccess(response);
      return { status: "success", response };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (!error.name) {
      options?.onError && options?.onError(error.message);
      return {
        status: "error",
        error: error.message || "Internal Errors",
      };
    }
    const errorMessage = error?.response?.data?.message || error?.response?.data?.error;
    options?.onError && options?.onError(errorMessage);
    return {
      status: "error",
      error: errorMessage,
    };
  }
};

// [sign up - admin registration]
export const registerAdmin = async (
  data: Record<string, string>,
  options?: SignUpOptions
) => {
  try {
    const response: SignUpResponse = await fetcher.post(ENDPOINTS.registerAdmin, {
      ...data,
    });
    if (response.success) {
      options?.onSuccess && options?.onSuccess(response);
      return { status: "success", response };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (!error.name) {
      options?.onError && options?.onError(error.message);
      return {
        status: "error",
        error: error.message || "Internal Errors",
      };
    }
    options?.onError &&
      options?.onError(error?.response?.data?.error);
    return {
      status: "error",
      error: error?.response?.data?.error,
    };
  }
};

// main hook
export const useAuth = create<useAuth>((set) => ({
  data: INIT_DATA,
  saveLogin: (newData) => {
    // save global login status
    localStorage.setItem(
      import.meta.env.VITE_AUTH_STAT_TITLE,
      String(newData.isAuthenticated)
    );
    // handle login infos encryption
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let targetSaveData: any = {
      ...newData,
    };

    const acToken = getAccessToken();
    if (acToken) {
      const acTokenDecoded = jwtDecode<{ id: number; role: number }>(acToken!);
      targetSaveData = {
        ...newData,
        id: acTokenDecoded.id,
        role: acTokenDecoded.role,
      };
      const encryptedLoginInfos = CryptoJS.AES.encrypt(
        JSON.stringify(targetSaveData),
        encryptionKey
      ).toString();
      localStorage.setItem(
        import.meta.env.VITE_LOGIN_INFO_TITLE,
        encryptedLoginInfos
      );
    }

    const encryptedLoginInfos = CryptoJS.AES.encrypt(
      JSON.stringify(targetSaveData),
      encryptionKey
    ).toString();
    localStorage.setItem(
      import.meta.env.VITE_LOGIN_INFO_TITLE,
      encryptedLoginInfos
    );

    // save global data
    return set((state) => ({ data: { ...state.data, ...newData } }));
  },
  saveLogout: () => {
    localStorage.setItem(import.meta.env.VITE_AUTH_STAT_TITLE, String(false));
    localStorage.removeItem(import.meta.env.VITE_LOGIN_INFO_TITLE);
    clearTokens();
    return set(() => ({ data: INIT_DATA }));
  },
}));
