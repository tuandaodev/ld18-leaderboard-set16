import Content from "@icons/content.svg?react";
import Users from "@icons/users.svg?react";

export const COLORS = {
  BLUE: {
    LEVEL1: "#7ed5ea",
    LEVEL2: "#63bce5 ",
    LEVEL3: "#4b9fe1",
    LEVEL4: "#3778c2",
    LEVEL5: "#28559a",
    LEVEL6: "#0f2557",
    LEVEL7: "#150734",
  },
  LIPSTICK: {
    LIGHTGRAY: "#e8eae3",
    DARKGRAY: "#373833",
    LIPSTICK: "#fa2742",
  },
  SPRING: {
    CYAN: "#2cccc3",
    YELLOW: "#facd3d",
    PURPLE: "#5626c4",
    LIPSTICK: "#e60476",
    DARKBLUE: "#150734",
  },
  GRAYSCALE: {
    WHITE: "#ffffff",
    LIGHTGRAY: "#e8eae3",
    MIDGRAY: "#373833",
    DARKGRAY: "#181818",
    BLACK: "#000000",
  },
  VALORANT: {
    RED: "#fe4767",
    DARKRED: "#dd1304",
    BROWNRED: "#50483d",
    BLACK: "#0c0f0e",
    GRAY: "#292b2d",
    CYAN: "#30fccc",
    BLUE: "#5974a3",
    DARKBLUE: "#3c4666",
    PURPLE: '#4d33cc'
  },
};

type Route = {
  title: string;
  route: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};
type MainRoute = Route & { subpages?: Route[] };

export const NAV_ITEMS: MainRoute[] = [
  // { title: "campaigns", route: "/cp/campaigns", icon: Content },
  { title: "leaders", route: "/cp/leaders", icon: Content },
  { title: "community_events", route: "/cp/community-events", icon: Content },
  { title: "partner_gaming_centers", route: "/cp/partner-gaming-centers", icon: Content },
  { title: "CMS", route: "/cp/cms", icon: Content },
  { title: "cms_events", route: "/cp/events", icon: Content },
  { title: "accounts", route: "/cp/accounts", icon: Users },
];

export const RICH_TEXT_FONTS = [
  // "nth-justice",
  "open-sans",
  "inter",
  "nunito",
  "montserrat",
  "playfair",
  "space-grotesk",
  "serif",
  "monospace",
];

export const RICH_TEXT_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ font: RICH_TEXT_FONTS }],
    [{ size: [] }],
    [{ align: ["", "right", "center", "justify"] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    [{ color: ["#fa2742", "#000"] }],
  ],
};

export const RICH_TEXT_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "font",
  "list",
  "bullet",
  "link",
  "color",
  "align",
  "size",
];

export const ADMIN_LANGUAGES = [
  { label: "Tiếng Việt", code: "vi" },
  // { label: "English", code: "en" },
];

export const FRONTEND_LANGUAGES = [
  { label: "Tiếng Việt", code: "vi" },
  // { label: "English", code: "en" },
  // { label: "中文", code: "cn" },
];