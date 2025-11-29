import { Frame4Wrapper, TextContainer, TextContent, CTAButton } from "./Frame4.styles";

interface Frame4Props {
  description?: string;
  ctaUrl?: string;
}

export default function Frame4({ description, ctaUrl }: Frame4Props) {
  const handleCTAClick = () => {
    if (ctaUrl) {
      window.open(ctaUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Frame4Wrapper id="guild">
      <TextContainer>
        <TextContent>
          {description || "Đang tải nội dung..."}
        </TextContent>
      </TextContainer>
      {ctaUrl && (
        <CTAButton onClick={handleCTAClick} />
      )}
    </Frame4Wrapper>
  );
}

