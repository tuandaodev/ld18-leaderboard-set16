import { Frame1Wrapper, TitleContainer, TitleTop, TitleMain, ButtonContainer, DescriptionText, MobileImageContainer, MobileImage, MobileImageBangHoi } from "./Frame1.styles";
import titleTop from '@images/f1/title_top.png';
import titleMain from '@images/f1/title.png';
import bangHoiImg from '@images/mobile/f1/bang hoi.png';
import thuLinhImg from '@images/mobile/f1/thu linh.png';
import phongMayImg from '@images/mobile/f1/phong may.png';
import PrimaryButton from '../PrimaryButton';

interface Frame1Props {
  description?: string;
}

export default function Frame1({ description }: Frame1Props) {
  const defaultDescription =
    "Chương trình phát triển cộng đồng chính thức của Nghịch Thủy Hàn - một chốn giang hồ riêng để cùng nhau kết nối - đồng hành - và hỗ trợ những người chơi tâm huyết đang xây dựng các bang hội, cộng đồng và câu lạc bộ địa phương trên toàn quốc.";
  const descriptionText = description && description.trim().length > 0 ? description : defaultDescription;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = [
    { label: "THỦ LĨNH CỘNG ĐỒNG", href: "#community", id: "community" },
    { label: "BANG HỘI", href: "#guild", id: "guild" },
    { label: "PHÒNG MÁY ĐỐI TÁC", href: "#partners", id: "partners" },
  ];

  return (
    <Frame1Wrapper id="home">
      <TitleContainer>
        <TitleTop src={titleTop} alt="Top Title" />
        <TitleMain src={titleMain} alt="Main Title" />
        <DescriptionText>
          {descriptionText}
        </DescriptionText>
      </TitleContainer>

      <ButtonContainer>
        {sections.map((section) => (
          <PrimaryButton key={section.id} onClick={() => scrollToSection(section.id)}>
            {section.label}
          </PrimaryButton>
        ))}
      </ButtonContainer>

      <MobileImageContainer>
        <MobileImage 
          src={thuLinhImg} 
          alt="Thủ Lĩnh Cộng Đồng" 
          onClick={() => scrollToSection('community')}
        />
        <MobileImageBangHoi 
          src={bangHoiImg} 
          alt="Bang Hội" 
          onClick={() => scrollToSection('guild')}
        />
        <MobileImage 
          src={phongMayImg} 
          alt="Phòng Máy Đối Tác" 
          onClick={() => scrollToSection('partners')}
        />
      </MobileImageContainer>
      
    </Frame1Wrapper>
  );
}