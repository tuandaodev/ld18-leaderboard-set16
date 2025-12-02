 import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import btnHover from "../../../../img/header/btn_Hover.png";
import btnNormal from "../../../../img/header/btn_normal.png";
import riotGamesLogo from "../../../../img/header/Riot Games.png";
import tftLogo from "../../../../img/header/TFT.png";
import { getAccessToken, getLoginInfos, useAuth } from "../../../../store/useAuth";
import {
  LogoSection,
  NavActions,
  NavContainer,
  NavItem,
  NavMenu,
  NavWrapper,
  StyledActionButton
} from "./TopNavigation.styles";

export default function TopNavigation() {
  const [activeSection, setActiveSection] = useState("home");
  const { data, saveLogin, saveLogout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // const isLoggedIn = data.isAuthenticated;
  // const username = data.username;

  // Fetch unread notification count when user is logged in
  // const { data: unreadCountResponse } = useAxiosSWR<{ success: boolean; data: { count: number } }>(
  //   isLoggedIn ? ENDPOINTS.getUnreadNotificationCount : '',
  //   {
  //     forSWR: {
  //       revalidateOnMount: isLoggedIn,
  //       shouldRetryOnError: false,
  //       revalidateOnFocus: true,
  //       refreshInterval: 30000, // Refresh every 30 seconds
  //     }
  //   }
  // );

  // const unreadCount = unreadCountResponse?.data?.count || 0;

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

  // const handleLogin = () => {
  //   authModal.openLogin();
  // };

  // const handleLogout = () => {
  //   saveLogout();
  //   navigate("/");
  // };

  const navItems = [
    { label: "MỞ KHOÁ 100 HUYỀN THOẠI", href: "#information", id: "information" },
    { label: "ĐẤU TRƯỜNG 100", href: "#ranking", id: "ranking" },
    { label: "SỰ KIỆN KHÁC", href: "#events", id: "events" },
  ];

  // Route mappings: pathname -> section id
  const routeMappings: Record<string, string> = {
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
        const matchingItem = navItems.find(item => item.id === hash);
        if (matchingItem) {
          setActiveSection(hash);
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
            <a href="https://teamfighttactics.leagueoflegends.com/vi-vn/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
              <img src={riotGamesLogo} alt="Riot Games" className="logo-image" style={{ marginRight: '40px' }} />
              <img src={tftLogo} alt="TFT" className="logo-image" style={{ height: '50px' }} />
            </a>
          </LogoSection>

          <NavMenu>
            {navItems.map((item, index) => (
              <NavItem
                key={item.label || item.id}
                href={item.href}
                $isActive={activeSection === item.id}
              >
                {item.label}
              </NavItem>
            ))}
          </NavMenu>

          <NavActions>
            {/* {isLoggedIn ? (
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
              <>
                <LoginButton onClick={handleLogin}>
                  ĐĂNG NHẬP
                </LoginButton>
              </>
            )} */}
            <StyledActionButton 
              $normalImage={btnNormal} 
              $hoverImage={btnHover}
              onClick={() => {
                window.open('https://dtcl.vnggames.com/vi-vn/', '_blank');
              }}
            >
              VÀO CHƠI NGAY!
            </StyledActionButton>
          </NavActions>
        </NavContainer>
      </NavWrapper>
    </>
  );
}

