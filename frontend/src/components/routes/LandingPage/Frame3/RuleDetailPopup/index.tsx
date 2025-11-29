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
}

export default function RuleDetailPopup({ isOpen, onClose }: RuleDetailPopupProps) {
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
          <RuleContent>
            Chế độ chơi: Xếp Hạng Mùa 16
            <br/>
            Cách tính điểm: Tùy vào thứ hạng của Cờ thủ trong trận đấu Xếp Hạng với thời gian tối thiểu là 20 phút/ trận đấu.
            <br/>
            Top 1: 10 Điểm
            <br/>
            Top 2: 8 Điểm
            <br/>
            Top 3: 6 Điểm
            <br/>
            Top 4: 4 Điểm
            <br/>
            <br/>
            Thời gian:
            <br/>
            Chặng 1: 00:00 08.12 - 23:59 22.12    
            <br/>
            Chặng 2: 00:00 23.12 - 06.01 
            <br/>
            <br/>

            Bảng xếp hạng sẽ cập nhật vào 23:59 mỗi ngày
            <br/>
            Điểm số sẽ tính từ các kết quả trận đấu đạt được trong thời gian quy định, không phải từ lúc đăng ký sự kiện để đảm bảo tính công bằng cho người chơi đăng ký sau.
          </RuleContent>
        </RuleSection>

     
        <RuleSection>
          <RuleContent style={{ textAlign: 'left', fontSize: '18px' }}>
          *Lưu ý:
            <br/>
            Phần thưởng Xu ĐTCL sẽ nạp trực tiếp vào Riot ID đăng ký của anh em, Code sân đấu sẽ gửi vào Mail đăng ký Riot ID.
            <br/>
            Phần thưởng sẽ là Xu ĐTCL trong phiên bản Mobile, anh em cờ thủ PC tải ĐTCL Mobile để nhận nếu có giải nhé!
          </RuleContent>
        </RuleSection>
      </RuleDetailContainer>
    </StyledRuleModal>
  );
}

