import { FooterWrapper, LogoContainer, Logo, InfoContainer, InfoText } from "./Footer.styles";
import logo from '@images/footer/logo.png';

export default function Footer() {
  return (
    <FooterWrapper>
      <LogoContainer>
        <Logo src={logo} alt="VNG Logo" />
      </LogoContainer>
      
      <InfoContainer>
        <InfoText>
          Công ty Cổ phần Tập đoàn VNG: Z06 Đường số 13, Phường Tân Thuận, Thành phố Hồ Chí Minh, Việt Nam
        </InfoText>
        <InfoText>
          Giấy phép cung cấp dịch vụ trò chơi điện tử G1 trên mạng số: 251/GP-BTTTT do Bộ Thông tin và Truyền thông cấp ngày 22/06/2015
        </InfoText>
        <InfoText>
          Quyết định phát hành trò chơi điện tử G1 trên mạng số: 322/QĐ-PTTH&TTĐT do Cục Phát thanh Truyền hình và Thông tin Điện tử cấp ngày 17/07/2025
        </InfoText>
        <InfoText>
          <a href="https://vnggames.com/vn/vi/privacy-policy-vn" target="_blank" rel="noreferrer">
            Chính sách bảo mật
          </a>
        </InfoText>
      </InfoContainer>
    </FooterWrapper>
  );
}

