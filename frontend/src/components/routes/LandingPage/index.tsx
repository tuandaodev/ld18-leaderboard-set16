import { ENDPOINTS } from "@components/api/endpoints";
import useAxiosSWR from "@components/api/useAxiosSWR";
import { useMemo } from "react";
import "../../../styles/landing.css";
import Footer from "./Footer";
import Frame1 from "./Frame1";
import Frame2 from "./Frame2";
import Frame3 from "./Frame3";
import Frame4 from "./Frame4";
import btnNap from "../../../img/float/btn_nap.png";
import {
  LandingPageContainer,
  FloatTopupWrapper,
  FloatTopupButton,
} from "./LandingPage.styles";
import TopNavigation from "./TopNavigation";

interface LanguageContent {
  lang: string;
  image: string;
  value: string;
}

interface ContentConfig {
  contentId: string;
  description: string;
  valueType: string;
  translate: LanguageContent[];
}

interface ContentConfigsResponse {
  success: boolean;
  data: ContentConfig[];
}

const NAP_XU_URL = "https://shop.vnggames.com/vn/game/dtcl";

// Helper function to get content by contentId (only one language: vi)
function getContentValue(
  contentConfigs: ContentConfig[] | undefined,
  contentId: string
): string {
  if (!contentConfigs) return "";
  
  const config = contentConfigs.find((c) => c.contentId === contentId);
  if (!config || !config.translate || config.translate.length === 0) return "";
  
  // Get the first translation (only one language: vi)
  return config.translate[0]?.value || "";
}

function getContentImage(
  contentConfigs: ContentConfig[] | undefined,
  contentId: string
): string {
  if (!contentConfigs) return "";

  const config = contentConfigs.find((c) => c.contentId === contentId);
  if (!config || !config.translate || config.translate.length === 0) return "";

  return config.translate[0]?.image || "";
}

export default function LandingPage() {
  // Fetch content configs
  const { data: contentConfigsResponse } = useAxiosSWR<ContentConfigsResponse>(
    ENDPOINTS.findAllContentConfigsForPublic
  );

  // Memoize content values
  const contentValues = useMemo(() => {
    const configs = contentConfigsResponse?.data || [];
    return {
      f3Rule: getContentValue(configs, "f3_rule"),
    };
  }, [contentConfigsResponse?.data]);

  const handleOpenNapXu = () => {
    window.open(NAP_XU_URL, "_blank");
  };

  return (
    <LandingPageContainer>
      <TopNavigation />
      <Frame1 />
      <Frame2 />
      <Frame3 f3Rule={contentValues.f3Rule} />
      <Frame4 />
      <Footer />
      <FloatTopupWrapper>
        <FloatTopupButton
          src={btnNap}
          alt="Nạp Xu ĐTCL - Ưu đãi đến 17%"
          onClick={handleOpenNapXu}
        />
      </FloatTopupWrapper>
    </LandingPageContainer>
  );
}

