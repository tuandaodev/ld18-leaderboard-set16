import styled from 'styled-components';
import bg from '../../../../img/header/nav_bar_bg.png';

export const NavWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-image: url(${bg});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  // backdrop-filter: blur(15px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
  animation: slideDown 0.6s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    position: relative;
    top: auto;
    left: auto;
    right: auto;
    width: 100%;
  }
`;

export const NavContainer = styled.div`
  margin: 0 auto;
  padding: 0.8rem 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  max-width: 95%;

  @media (max-width: 1600px) {
    padding: 0.5rem 3rem;
    gap: 2.5rem;
  }

  @media (max-width: 1366px) {
    padding: 0.4rem 2.5rem;
    gap: 2rem;
  }

  @media (max-width: 1200px) {
    padding: 0.3rem 2rem;
    gap: 1.5rem;
  }

  @media (max-width: 968px) {
    padding: 0.2rem 1.5rem;
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.6rem;
    padding: 0.2rem 0.5rem;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    padding: 0.2rem 1.2rem;
    gap: 1.2rem;
  }
`;

export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
  cursor: pointer;

  .logo-image {
    height: 33px;
    width: auto;
    filter: drop-shadow(0 0 15px rgba(218, 165, 32, 0.6));
    transition: all 0.3s ease;

    &:hover {
      filter: drop-shadow(0 0 25px rgba(218, 165, 32, 0.9));
      transform: scale(1.05);
    }
  }

  @media (max-width: 1600px) {
    gap: 0.8rem;
    .logo-image {
      height: 30px !important;
    }
  }

  @media (max-width: 1366px) {
    gap: 0.7rem;
    .logo-image {
      height: 28px !important;
    }
  }

  @media (max-width: 968px) {
    .logo-image {
      height: 40px !important;
    }
  }

  @media (max-width: 768px) {
    .logo-image {
      height: 35px !important;
    }
  }

  @media (max-width: 1024px) and (orientation: landscape) {
    .logo-image {
      height: 30px !important;
    }
  }
`;

export const NavDivider = styled.div`
  color: #DAA520;
  font-size: 1.5rem;
  opacity: 0.6;
  text-shadow: 0 0 10px rgba(218, 165, 32, 0.5);
  flex-shrink: 0;

  @media (max-width: 1200px) {
    display: none;
  }
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;
  flex: 1;
  justify-content: center;

  @media (max-width: 1600px) {
    gap: 2.5rem;
  }

  @media (max-width: 1366px) {
    gap: 2rem;
  }

  @media (max-width: 1200px) {
    gap: 1.2rem;
  }

  @media (max-width: 968px) {
    gap: 1rem;
  }

  @media (max-width: 768px) {
    display: none;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    gap: 1.2rem;
  }
`;

export const NavItem = styled.a<{ $isActive?: boolean }>`
  font-size: 1.25rem;
  font-family: 'NeueFrutigerWorld', sans-serif;
  font-weight: bold;
  color: ${props => props.$isActive ? '#ffffff' : '#fafefe'};
  background-color: ${props => props.$isActive ? '#066a73' : 'transparent'};
  text-decoration: none;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: ${props => props.$isActive 
    ? '0 0 10px rgba(255, 215, 0, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.8)' 
    : '2px 2px 4px rgba(0, 0, 0, 0.8)'};
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.2rem 1rem;
  border-radius: 4px;

  @media (max-width: 1600px) {
    font-size: 1rem;
    letter-spacing: 0.9px;
    padding: 0.2rem 0.9rem;
  }

  @media (max-width: 1366px) {
    font-size: 0.9rem;
    letter-spacing: 0.8px;
    padding: 0.2rem 0.8rem;
  }

  .nav-icon {
    font-size: 0;
    filter: ${props => props.$isActive 
      ? 'drop-shadow(0 0 10px rgba(218, 165, 32, 0.8))' 
      : 'drop-shadow(0 0 5px rgba(218, 165, 32, 0.5))'};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%) scaleX(${props => props.$isActive ? '1' : '0'});
    width: 100%;
    height: 3px;
    background-color: #DAA520;
    transition: transform 0.3s ease, opacity 0.3s ease;
    opacity: ${props => props.$isActive ? '1' : '0'};
    pointer-events: none;
  }

  @media (max-width: 1366px) {
    &::before {
      bottom: -88px;
      width: 110px;
      height: 118px;
    }
  }

  &:hover {
    color: #ffffff;
    background-color: #066a73;
    text-shadow: 
      0 0 10px rgba(255, 215, 0, 0.8),
      2px 2px 4px rgba(0, 0, 0, 0.8);

    &::after {
      transform: translateX(-50%) scaleX(1);
      opacity: 1;
    }

    &::before {
      transform: translateX(-50%) scaleX(1);
      opacity: 1;
    }

    .nav-icon {
      filter: drop-shadow(0 0 10px rgba(218, 165, 32, 0.8));
    }
  }

  @media (max-width: 968px) {
    letter-spacing: 0.5px;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    font-size: 0.8rem;
    padding: 0.15rem 0.7rem;
  }
`;

export const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
`;

export const StyledActionButton = styled.button<{ $normalImage: string; $hoverImage: string }>`
  background-color: transparent;
  background-image: url(${props => props.$normalImage});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  border: none;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-family: 'NeueFrutigerWorld', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;

  &:hover {
    background-image: url(${props => props.$hoverImage});
    filter: brightness(1.1);
  }

  &:active {
    transform: scale(0.98);
    filter: brightness(0.9);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      filter: none;
    }
  }

  @media (max-width: 1600px) {
    font-size: 16px;
    padding: 0.5rem 1.4rem;
    min-width: 190px;
    letter-spacing: 1.3px;
  }

  @media (max-width: 1366px) {
    font-size: 15px;
    padding: 0.5rem 1.3rem;
    min-width: 180px;
    letter-spacing: 1.2px;
  }

  @media (max-width: 1200px) {
    padding: 0.7rem 2rem;
    min-width: 180px;
  }

  @media (max-width: 968px) {
    padding: 0.6rem 1.8rem;
    min-width: 130px;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1.5rem;
    min-width: 160px;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    font-size: 14px;
    padding: 0.45rem 1.3rem;
    min-width: 150px;
    letter-spacing: 1px;
  }
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  color: #f0e495;
  font-family: 'UVN La Xanh', sans-serif;
  font-size: 1.125rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);

  @media (max-width: 1366px) {
    font-size: 1rem;
    gap: 12px;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    font-size: 0.9rem;
    gap: 10px;
  }
`;

export const LogoutIcon = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 5px rgba(218, 165, 32, 0.5));

  &:hover {
    filter: drop-shadow(0 0 15px rgba(218, 165, 32, 0.9));
    transform: scale(1.1);
  }

  @media (max-width: 1366px) {
    width: 26px;
    height: 26px;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    width: 22px;
    height: 22px;
  }
`;

export const NotificationWrapper = styled.span`
  cursor: pointer;
  margin-right: 12px;

  @media (max-width: 1366px) {
    margin-right: 10px;
  }
`;

export const UsernameText = styled.span`
  color: #f0e495;
  font-weight: bold;
  font-size: 1.25rem;
  margin-right: 12px;

  @media (max-width: 1366px) {
    font-size: 1.1rem;
    margin-right: 10px;
  }

  /* Điện thoại màn hình ngang */
  @media (max-width: 1024px) and (orientation: landscape) {
    font-size: 0.95rem;
    margin-right: 8px;
  }
`;

export const MobileBottomMenu = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.95) 0%, rgb(47 34 16 / 90%) 100%);
    backdrop-filter: blur(15px);
    box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.5);
    padding: 0.8rem 0.5rem;
    justify-content: space-around;
    align-items: center;
    gap: 0.5rem;
  }
`;

export const MobileNavItem = styled.a<{ $underlineImage?: string; $isActive?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  text-decoration: none;
  color: ${props => props.$isActive ? '#f0e398' : '#fafefe'};
  font-size: 0.7rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: ${props => props.$isActive 
    ? '0 0 10px rgba(255, 215, 0, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.8)' 
    : '2px 2px 4px rgba(0, 0, 0, 0.8)'};
  transition: all 0.3s ease;
  flex: 1;
  padding: 0.3rem 0.2rem;
  min-width: 0;
  text-align: center;
  max-width: 100%;
  position: relative;
  height: 35px;

  span {
    display: block;
    line-height: 1.3;
    word-break: break-word;
    white-space: normal;
    width: 100%;
  }

  &::before {
    content: '';
    position: absolute;
    top: -48px;
    left: 50%;
    transform: translateX(-50%) scaleX(${props => props.$isActive ? '1' : '0'});
    width: 80px;
    height: 89px;
    background-image: ${props => props.$underlineImage ? `url(${props.$underlineImage})` : 'none'};
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center top;
    transition: transform 0.3s ease, opacity 0.3s ease;
    opacity: ${props => props.$isActive ? '1' : '0'};
    pointer-events: none;
  }

  .nav-icon-image {
    width: 24px;
    height: 24px;
    object-fit: contain;
    filter: ${props => props.$isActive 
      ? 'drop-shadow(0 0 10px rgba(218, 165, 32, 0.8))' 
      : 'drop-shadow(0 0 5px rgba(218, 165, 32, 0.5))'};
    transition: filter 0.3s ease;
    flex-shrink: 0;
  }

  &:hover {
    color: #f0e398;
    text-shadow: 
      0 0 10px rgba(255, 215, 0, 0.8),
      2px 2px 4px rgba(0, 0, 0, 0.8);

    &::before {
      transform: translateX(-50%) scaleX(1);
      opacity: 1;
    }

    .nav-icon-image {
      filter: drop-shadow(0 0 10px rgba(218, 165, 32, 0.8));
    }
  }

  @media (max-width: 480px) {
    font-size: 0.6rem;
    gap: 0.2rem;
    padding: 0.3rem 0.1rem;

    .nav-icon-image {
      width: 20px;
      height: 20px;
    }

    span {
      font-size: 0.65rem;
      line-height: 1.2;
    }
  }
`;

