import { ADMIN_LANGUAGES, NAV_ITEMS } from "@lib/constants";
import { cn } from "@lib/utils";
import { useAuth } from "@store/useAuth";
import { useRoute } from "@store/useRoute";
import { Button, Select } from "antd";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import {
  IconWrapper,
  ItemMainRoute,
  ItemWrapper,
  ItemsBox,
  NavFooter,
  NavHeader,
  Wrapper,
} from "./style";

export default function Navbar() {
  // hooks
  const saveLogout = useAuth(({ saveLogout }) => saveLogout);
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const clickedMainRouteOrder = useRoute(
    ({ data }) => data.clickedMainRouteOrder
  );
  const handleLanguageChange = (value: string) => {
    const newLang = value;
    i18n.changeLanguage(newLang);
    localStorage.setItem('langCode', newLang);
  };
  const updateClickedMainRouteOrder = useRoute(
    ({ updateClickedMainRouteOrder }) => updateClickedMainRouteOrder
  );

  const username = useAuth(({ data }) => data.username);
  const userRole = useAuth(({ data }) => data.role);

  // methods
  const handleLogout = () => {
    saveLogout();
    location.pathname = "/cp";
  };

  return (
    <Wrapper>
      <Link
        onClick={userRole === 1 ? (e) => e.preventDefault() : undefined}
        to={userRole === 1 ? "/cp/leaders" : "/cp"}
      >
        <NavHeader>
          <span>
            <h1>Admin Area</h1>
          </span>
        </NavHeader>
      </Link>
      <ItemsBox>
        {NAV_ITEMS.map((item, parentOrder) => {
          return (
            <Link
              onClick={userRole === 1 ? (e) => e.preventDefault() : () => {}}
              to={
                userRole === 1 && item.route !== "/cp/leaders"
                  ? "/cp/leaders"
                  : item.route
              }
              key={item.title}
            >
              <ItemWrapper
                onClick={() => {
                  if (parentOrder === clickedMainRouteOrder)
                    updateClickedMainRouteOrder(-1);
                  else updateClickedMainRouteOrder(parentOrder);
                }}
              >
                <ItemMainRoute
                  className={cn(
                    (location.pathname === item.route ||
                      (item.route !== "/cp" &&
                        location.pathname.includes(item.route))) &&
                      "active",
                    userRole === 1 &&
                      item.route !== "/cp/leaders" &&
                      "disabled"
                  )}
                >
                  {/* <IconWrapper>
                    <ItemIcon />
                  </IconWrapper> */}
                  {t(item.title)}
                </ItemMainRoute>
                {((parentOrder === clickedMainRouteOrder &&
                  item.subpages?.length) ||
                  location.pathname.includes("/cp/dashboard")) && (
                  <div>
                    {item.subpages?.map((subpage) => {
                      const SubpageIcon = subpage.icon;
                      return (
                        <Link
                          to={`${item.route !== "/cp" ? item.route : ""}${
                            subpage.route
                          }`}
                          key={subpage.title}
                        >
                          <ItemWrapper className="subpages">
                            <ItemMainRoute
                              className={cn(
                                location.pathname === subpage.route && "active",
                                "subpage"
                              )}
                            >
                              <IconWrapper>
                                <SubpageIcon />
                              </IconWrapper>
                              {subpage.title}
                            </ItemMainRoute>
                          </ItemWrapper>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </ItemWrapper>
            </Link>
          );
        })}
      </ItemsBox>
      <NavFooter>
        <p className="user-email">{username}</p>
        {ADMIN_LANGUAGES.length > 1 && (
          <Select
            defaultValue="vi"
            value={i18n.language}
            className="user-langugage"
            onChange={handleLanguageChange}
          >
            {ADMIN_LANGUAGES.map(({ code, label }) => (
              <Select.Option key={code} value={code}>
                {label}
              </Select.Option>
            ))}
          </Select>
        )}
        <Button onClick={handleLogout} type="primary" block>
          { t("logout") }
        </Button>
      </NavFooter>
    </Wrapper>
  );
}
