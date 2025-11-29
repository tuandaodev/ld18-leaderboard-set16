import { ENDPOINTS } from "@components/api/endpoints";
import useAxiosSWR from "@components/api/useAxiosSWR";
import { Badge } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import homeIcon from "../../../../images/header/home.png";
import logoImage from "../../../../images/header/logo.png";
import logoutIcon from "../../../../images/header/logout_icon.png";
import underlineImage from "../../../../images/header/menu_item_under_line.png";
import { getAccessToken, getLoginInfos, useAuth } from "../../../../store/useAuth";
import { authModal } from "../../../../store/useAuthModal";
import LoginButton from "../LoginButton";
import {
  LogoSection,
  LogoutIcon,
  MobileBottomMenu,
  MobileNavItem,
  NavActions,
  NavContainer,
  NavItem,
  NavMenu,
  NavWrapper,
  NotificationWrapper,
  UsernameText,
  UserSection
} from "./TopNavigation.styles";

export default function TopNavigation() {
  const [activeSection, setActiveSection] = useState("home");
  const { data, saveLogin, saveLogout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = data.isAuthenticated;
  const username = data.username;

  // Fetch unread notification count when user is logged in
  const { data: unreadCountResponse } = useAxiosSWR<{ success: boolean; data: { count: number } }>(
    isLoggedIn ? ENDPOINTS.getUnreadNotificationCount : '',
    {
      forSWR: {
        revalidateOnMount: isLoggedIn,
        shouldRetryOnError: false,
        revalidateOnFocus: true,
        refreshInterval: 30000, // Refresh every 30 seconds
      }
    }
  );

  const unreadCount = unreadCountResponse?.data?.count || 0;

  // Check for stored token and restore login state on mount
  useEffect(() => {
    const accessToken = getAccessToken();
    const loginInfos = getLoginInfos();

    if (accessToken && loginInfos && loginInfos.isAuthenticated) {
      // Restore login state from local storage
      saveLogin({
        username: loginInfos.username || loginInfos.email || "",
        isAuthenticated: true,
      });
    }
  }, [saveLogin]);

  const handleLogin = () => {
    authModal.openLogin();
  };

  const handleLogout = () => {
    saveLogout();
    navigate("/");
  };

  // Helper function to format labels with line breaks for mobile
  const formatMobileLabel = (label: string): string[] => {
    const breakMap: Record<string, string[]> = {
      "THỦ LĨNH CỘNG ĐỒNG": ["THỦ LĨNH", "CỘNG ĐỒNG"],
      "PHÒNG MÁY ĐỐI TÁC": ["PHÒNG MÁY", "ĐỐI TÁC"],
    };
    return breakMap[label] || [label];
  };

  const navItems = [
    { label: "", href: "#home", icon: <img src={homeIcon} alt="Home" className="nav-icon-image" />, id: "home" },
    { label: "THỦ LĨNH CỘNG ĐỒNG", href: "#community", id: "community" },
    { label: "BANG HỘI", href: "#guild", id: "guild" },
    { label: "PHÒNG MÁY ĐỐI TÁC", href: "#partners", id: "partners" },
    { label: "SỰ KIỆN", href: "/events", id: "events" },
  ];

  // Route mappings: pathname -> section id
  const routeMappings: Record<string, string> = {
    "/register-event": "community",
    "/register-community-leader": "community",
    "/register-partner-gaming-center": "partners",
    "/manage-partner-gaming-center": "partners",
    "/list-partner-gaming-centers": "partners",
    "/events": "events",
  };

  useEffect(() => {
    // Check if current pathname maps to a section
    const mappedSection = routeMappings[location.pathname];
    if (mappedSection) {
      setActiveSection(mappedSection);
    } else {
      // Set initial active section based on URL hash and scroll to it
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        // Map "ranking" to "community" so both Frame 2 and Frame 3 activate the community menu
        const mappedHash = hash === "ranking" ? "community" : hash;
        const matchingItem = navItems.find(item => item.id === mappedHash);
        if (matchingItem) {
          setActiveSection(mappedHash);
          // Scroll to the section after a short delay to ensure page is fully loaded
          setTimeout(() => {
            const element = document.getElementById(hash);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      }
    }

    // Listen for hash changes (only if not on a mapped route)
    const handleHashChange = () => {
      if (routeMappings[window.location.pathname]) {
        return; // Don't handle hash changes on mapped routes
      }
      const newHash = window.location.hash.replace('#', '');
      if (newHash) {
        // Map "ranking" to "community" so both Frame 2 and Frame 3 activate the community menu
        const mappedHash = newHash === "ranking" ? "community" : newHash;
        const matchingItem = navItems.find(item => item.id === mappedHash);
        if (matchingItem) {
          setActiveSection(mappedHash);
          // Scroll to the section
          const element = document.getElementById(newHash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px", // Trigger when section is in the middle part of viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Don't update active section if on a mapped route
      if (routeMappings[window.location.pathname]) {
        return;
      }
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          // Map "ranking" to "community" so both Frame 2 and Frame 3 activate the community menu
          const mappedSectionId = sectionId === "ranking" ? "community" : sectionId;
          setActiveSection(mappedSectionId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    // Also observe the "ranking" section (Frame 3) so it activates the community menu
    const rankingElement = document.getElementById("ranking");
    if (rankingElement) {
      observer.observe(rankingElement);
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <>
      <NavWrapper>
        <NavContainer>
          <LogoSection>
            <a href="https://nghichthuyhan.vnggames.com/" target="_blank" rel="noopener noreferrer">
              <img src={logoImage} alt="Logo" className="logo-image" />
            </a>
          </LogoSection>

          <NavMenu>
            {navItems.map((item, index) => (
              <NavItem
                key={item.label || item.id}
                href={item.href}
                $underlineImage={underlineImage}
                $isActive={activeSection === item.id}
              >
                {item.icon && <span className="nav-icon">{item.icon}</span>}
                {item.label}
              </NavItem>
            ))}
          </NavMenu>

          <NavActions>
            {isLoggedIn ? (
              <UserSection>
                <NotificationWrapper
                  onClick={() => {
                    // Navigate to the notification page
                    window.location.href = "/notification";
                  }}
                >
                  <Badge 
                    count={unreadCount > 0 ? unreadCount : 0} 
                    size="small" 
                    title={unreadCount > 0 ? `Bạn có ${unreadCount} thông báo mới` : "Không có thông báo mới"}
                  >
                    <UsernameText>
                      {username}
                    </UsernameText>
                  </Badge>
                </NotificationWrapper>
                <span>|</span>
                <LogoutIcon src={logoutIcon} alt="Logout" onClick={handleLogout} />
              </UserSection>
            ) : (
              <LoginButton onClick={handleLogin}>
                ĐĂNG NHẬP
              </LoginButton>
            )}
          </NavActions>
        </NavContainer>
      </NavWrapper>

      <MobileBottomMenu>
        {navItems.map((item) => (
          <MobileNavItem
            key={item.label || item.id}
            href={item.href}
            $underlineImage={underlineImage}
            $isActive={activeSection === item.id}
          >
            {item.icon && item.icon}
            {item.label && (
              <span>
                {formatMobileLabel(item.label).map((part, idx, arr) => (
                  <Fragment key={`${item.id}-${idx}`}>
                    {part}
                    {idx < arr.length - 1 && <br />}
                  </Fragment>
                ))}
              </span>
            )}
          </MobileNavItem>
        ))}
      </MobileBottomMenu>
    </>
  );
}

