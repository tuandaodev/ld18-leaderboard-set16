import { useState, useEffect } from "react";
import {
  RuleDetailContainer,
  RuleSection,
  RuleTitle,
  RuleContent,
  RuleItem,
  RuleItemLabel,
  RuleItemValue,
  StyledRuleModal
} from "./RuleDetailPopup.styles";

interface RuleDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  f3Rule: string;
}

export default function RuleDetailPopup({ isOpen, onClose, f3Rule }: RuleDetailPopupProps) {
  const [modalWidth, setModalWidth] = useState(700);
  
  useEffect(() => {
    const updateWidth = () => {
      if (window.innerWidth <= 1366) {
        setModalWidth(700);
      } else if (window.innerWidth <= 1920) {
        setModalWidth(800);
      } else {
        setModalWidth(900);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <StyledRuleModal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={modalWidth}
      centered={true}
      title=""
      destroyOnClose={true}
    >
      <RuleDetailContainer>
        <RuleSection>
          <RuleTitle>Thông Tin Sự Kiện</RuleTitle>
          <RuleContent
            style={{ textAlign: 'left', fontSize: '18px' }}
            dangerouslySetInnerHTML={{ __html: f3Rule }}
          />
        </RuleSection>
      </RuleDetailContainer>
    </StyledRuleModal>
  );
}

