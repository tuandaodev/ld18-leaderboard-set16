import {
  FooterWrapper,
  FooterContainer,
  LogoContainer,
  Logo,
  CopyrightContainer,
  CopyrightText,
  LinksContainer,
  FooterLink,
} from "./Footer.styles";
import footerLogo from '../../../../img/footer/footer_logo.png';

export default function Footer() {
  return (
    <FooterWrapper>
      <FooterContainer>
        <LogoContainer>
          <Logo src={footerLogo} alt="VNG Logo" loading="lazy" />
        </LogoContainer>

        <CopyrightContainer>
          <CopyrightText>
            Chơi quá 180 phút một ngày sẽ ảnh hưởng xấu đến sức khỏe<br />
            Công Ty Cổ Phần VNG. Địa chỉ: Z06 đường số 13, Phường Tân Thuận Đông, Quận 7, Thành phố Hồ Chí Minh.<br />
            Giấy phép cung cấp dịch vụ trò chơi điện tử G1 trên mạng số: 251/GP-BTTTT do Bộ Thông tin và Truyền thông cấp ngày 22/06/2015.<br />
            Quyết định phê duyệt nội dung kịch bản trò chơi điện tử G1 trên mạng số 15/QĐ-BTTTT do Bộ Thông tin và Truyền thông cấp ngày 08/01/2021.
          </CopyrightText>
        </CopyrightContainer>

        <LinksContainer>
          <FooterLink target="_blank" href="https://id.zing.vn/v2/policy/privacy" rel="noreferrer">
            CHÍNH SÁCH BẢO MẬT
          </FooterLink>
          <FooterLink target="_blank" href="https://www.riotgames.com/vi/terms-of-service" rel="noreferrer">
            ĐIỀU KHOẢN SỬ DỤNG (RIOT)
          </FooterLink>
          <FooterLink target="_blank" href="https://dtcl.vnggames.com/thoa-thuan-nguoi-dung" rel="noreferrer">
            ĐIỀU KHOẢN SỬ DỤNG (VNG)
          </FooterLink>
        </LinksContainer>
      </FooterContainer>
    </FooterWrapper>
  );
}

