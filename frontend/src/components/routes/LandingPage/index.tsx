import { LandingPageContainer } from "./LandingPage.styles";
import TopNavigation from "./TopNavigation";
import Frame1 from "./Frame1";
import Frame2 from "./Frame2";
import Frame3 from "./Frame3";
import Frame4 from "./Frame4";
import Frame5 from "./Frame5";
import Footer from "./Footer";
import "../../../styles/landing.css";
import useAxiosSWR from "@components/api/useAxiosSWR";
import { ENDPOINTS } from "@components/api/endpoints";
import { useMemo } from "react";

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
      f1Description: getContentValue(configs, "f1_description"),
      f2ProgramInfo: getContentValue(configs, "f2_program_info"),
      f2AvatarImage: getContentImage(configs, "f2_avatar_image"),
      f4Description: getContentValue(configs, "f4_description"),
      f4CtaUrl: getContentValue(configs, "f4_cta_url"),
    };
  }, [contentConfigsResponse?.data]);

  return (
    <LandingPageContainer>
      <TopNavigation />
      <Frame1 description={contentValues.f1Description} />
      <Frame2
        programInfo={contentValues.f2ProgramInfo}
        avatarImage={contentValues.f2AvatarImage}
      />
      <Frame3 />
      <Frame4 
        description={contentValues.f4Description}
        ctaUrl={contentValues.f4CtaUrl}
      />
      <Frame5 />
      <Footer />
    </LandingPageContainer>
  );
}

