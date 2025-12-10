import { ConfigProvider, Empty, message } from "antd";
import { Suspense, lazy, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";

import AuthModalProvider from "@components/common/AuthModal/AuthModalProvider";
import NotificationProvider from "@components/common/NotificationModal/NotificationProvider";
import PageLoader from "@components/common/PageLoader";
import { COLORS } from "@lib/constants";
import { getLoginInfos, useAuth } from "@store/useAuth";
import { useRoute } from "@store/useRoute";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import translationEN from "./locales/en/translation.json";
import translationVI from "./locales/vi/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  vi: {
    translation: translationVI,
  }
};

const lang = localStorage.getItem('langCode') || 'vi';
i18n.use(initReactI18next).init({
  resources,
  lng: lang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// routes
const Account = lazy(() => import("@components/routes/Admin/Accounts"));
const Auth = lazy(() => import("@components/routes/Admin/Auth"));
const NotFound = lazy(() => import("@components/routes/NotFound"));
const Campaign = lazy(() => import("@components/routes/Admin/Campaign"));
const Events = lazy(() => import("@components/routes/Admin/Events"));
const EventForm = lazy(() => import("@components/routes/Admin/Events/EventForm"));
const Leaders = lazy(() => import("@components/routes/Admin/Leaders"));
const CommunityEvents = lazy(() => import("@components/routes/Admin/CommunityEvents"));
const PartnerGamingCenter = lazy(() => import("@components/routes/Admin/PartnerGamingCenter"));
const CMS = lazy(() => import("@components/routes/Admin/CMS"));
const LandingPage = lazy(() => import("@components/routes/LandingPage"));

function App() {
  // zustand
  const user = useAuth(({ data }) => data);
  const saveLogin = useAuth(({ saveLogin }) => saveLogin);
  const isCreateAdminClicked = useRoute(
    ({ data }) => data.isCreateAdminClicked
  );
  const { t } = useTranslation();
  // methods
  const isInvalidTicket = () => {
    const acToken = localStorage.getItem(import.meta.env.VITE_ACCESS_TITLE);
    const rfToken = localStorage.getItem(import.meta.env.VITE_REFRESH_TITLE);
    const loginIn = localStorage.getItem(import.meta.env.VITE_LOGIN_INFO_TITLE);
    const isAuth = localStorage.getItem(import.meta.env.VITE_AUTH_STAT_TITLE);
    const tokenSi = localStorage.getItem("token_signature");
    const isInvalid = !isAuth || !acToken || !rfToken || !tokenSi || !loginIn;
    return isInvalid ? "invalid" : acToken;
  };

  // effects
  // [custom] antd message
  useEffect(() => {
    message.config({
      duration: 5,
      maxCount: 3,
      rtl: false,
    });
  }, []);
  // [authentication redirects]
  useEffect(() => {
    const basePath = import.meta.env.VITE_BASE_PATH?.replace(/\/$/, '') || "/vi-vn/set16";
    
    // allow to go to Landing Page and Community Leader Registration (auth checked in component)
    if (location.pathname === basePath + "/" 
      || location.pathname === basePath + "/landing" 
      || location.pathname === basePath
      // || location.pathname === basePath + "/register-community-leader" 
      // || location.pathname === basePath + "/register-event"
      // || location.pathname === basePath + "/register-partner-gaming-center"
      // || location.pathname === basePath + "/manage-partner-gaming-center"
      // || location.pathname === basePath + "/list-partner-gaming-centers"
      // || location.pathname === basePath + "/notification"
      // || location.pathname === basePath + "/events"
      // || location.pathname.startsWith(basePath + "/events/")
    ) return;

    // is there is a critical key missing
    const isInvalidToProceed = isInvalidTicket();
    if (isInvalidToProceed === "invalid") {
      saveLogin({
        ...user,
        isAuthenticated: false,
      });
      if (location.pathname !== basePath + "/cp") location.pathname = basePath + "/cp";
      return;
    }

    // token is invalid
    const acToken = isInvalidToProceed;
    // if access token is invalid and try to access other paths
    if (acToken.length <= 0 && location.pathname !== basePath + "/cp") {
      location.pathname = basePath + "/cp";
      return;
    }

    // if there is a valid access token
    const lastLoginInfos = getLoginInfos();
    if (lastLoginInfos) {
      const updateInfos = {
        ...user,
        ...lastLoginInfos,
        isAuthenticated: true,
      };

      saveLogin(updateInfos);
      if (updateInfos.role === 1 && location.pathname !== basePath + "/cp/cms") {
        location.pathname = basePath + "/cp/cms";
        return;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AuthElement = ({ mainRoute: MainRoute }: { mainRoute: any }) =>
    user.isAuthenticated ? (
      isCreateAdminClicked ? (
        <Auth />
      ) : (
        <MainRoute />
      )
    ) : (
      <Auth />
    );

  // Admin protected element - checks if user is admin (role === 2)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AdminProtectedElement = ({ mainRoute: MainRoute }: { mainRoute: any }) => {
    const navigate = useNavigate();

    useEffect(() => {
      if (user.isAuthenticated) {
        // Check if user is admin (role === 2)
        // If role is undefined or not 2, user is not admin
        if (!user.role || user.role !== 2) {
          message.error("Bạn không có quyền truy cập trang này. Chỉ quản trị viên mới có thể truy cập.");
          navigate("/", { replace: true });
        }
      }
    }, [user.isAuthenticated, user.role, navigate]);

    // If not authenticated, show auth page
    if (!user.isAuthenticated) {
      return <Auth />;
    }

    // If not admin, return null (redirect will happen in useEffect)
    if (!user.role || user.role !== 2) {
      return null;
    }

    // If admin, show the protected route
    return isCreateAdminClicked ? <Auth /> : <MainRoute />;
  };

  return (
    <HelmetProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: COLORS.VALORANT.BROWNRED,
            colorTextLabel: "#50483d",
            fontSize: window.innerWidth <= 768 ? 14 : 16,
            fontSizeSM: window.innerWidth <= 768 ? 12 : 14,
            colorBgContainer: "#f5ede0",
            colorBorder: "#928471",
            borderRadius: 0
          },
          components: {
            Form: {
              labelFontSize: 16,
              labelColor: "#50483d",
              colorError: "#c11214",
              colorErrorText: "#c11214",
            },
            Pagination: {
              itemSize: window.innerWidth <= 768 ? 36 : 50,
              itemBg: "#f5ede0",
              itemActiveBg: "#b09171",
              colorText: "#956b40",
              colorPrimary: "#956b40"
            }
          },
        }}
        renderEmpty={() => (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div style={{ textAlign: "center" }}>
                <p>{ t('no_data')}</p>
              </div>
            }
          />
        )}
      >
        <Suspense fallback={<PageLoader />}>
          <Router basename={import.meta.env.VITE_BASE_PATH?.replace(/\/$/, '') || "/vi-vn/set16"}>
            <Routes>
              // --- Landing Page ---
              <Route path="/" element={<LandingPage />} />
              <Route path="/landing" element={<LandingPage />} />
              // --- End Landing Page ---

              // --- Admin Section ---
              <Route
                path="/cp"
                element={<AdminProtectedElement mainRoute={CMS} />}
              />
              <Route
                path="/cp/campaigns"
                element={<AuthElement mainRoute={Campaign} />}
              />
              <Route
                path="/cp/events"
                element={<AuthElement mainRoute={Events} />}
              />
              <Route
                path="/cp/events/add"
                element={<AuthElement mainRoute={EventForm} />}
              />
              <Route
                path="/cp/events/edit/:id"
                element={<AuthElement mainRoute={EventForm} />}
              />
              <Route
                path="/cp/cms"
                element={<AuthElement mainRoute={CMS} />}
              />
              <Route
                path="/cp/accounts"
                element={<AuthElement mainRoute={Account} />}
              />
              {/* <Route
                path="/cp/leaders"
                element={<AuthElement mainRoute={Leaders} />}
              />
              <Route
                path="/cp/community-events"
                element={<AuthElement mainRoute={CommunityEvents} />}
              /> */}
              {/* <Route
                path="/cp/partner-gaming-centers"
                element={<AuthElement mainRoute={PartnerGamingCenter} />}
              /> */}
              // --- End Admin Section ---

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </Suspense>
        <NotificationProvider />
        <AuthModalProvider />
      </ConfigProvider>
    </HelmetProvider>
  );
}

export default App;
