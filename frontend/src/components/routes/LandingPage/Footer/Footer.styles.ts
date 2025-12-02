import styled from 'styled-components';

export const FooterWrapper = styled.footer`
  width: 100%;
  background-color: rgb(0, 0, 0);
  padding: 2rem 0;
  border-top: 2px solid #333;

  @media (max-width: 768px) {
    padding: 1.5rem 0 4.5rem 0;
  }

  @media (max-width: 1024px) and (orientation: landscape) {
    padding: 1rem 0 1rem 0;
  }
`;

export const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
    gap: 1rem;
  }
`;

export const SocialIconsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

export const SocialIcon = styled.img`
  height: 50px;
  width: auto;
  object-fit: contain;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    height: 40px;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
  }
`;

export const Logo = styled.img`
  height: auto;
  width: auto;
  max-height: 100px;
  object-fit: contain;

  @media (max-width: 768px) {
    max-height: 80px;
  }

  @media (max-width: 1024px) and (orientation: landscape) {
    max-height: 30px;
  }
`;

export const CopyrightContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const CopyrightText = styled.p`
  margin: 0;
  padding: 0;
  color: #beccc9;
  text-align: center;
  font-family: 'UVN La Xanh', sans-serif;
  font-size: 0.875rem;
  line-height: 1.6;
  max-width: 1000px;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    line-height: 1.5;
    padding: 0 0.5rem;
  }

  @media (max-width: 1024px) and (orientation: landscape) {
    font-size: 10px;
    font-family: 'Open Sans', sans-serif;
  }
`;

export const LinksContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

export const FooterLink = styled.a`
  color: #beccc9;
  text-decoration: none;
  font-family: 'UVN La Xanh', sans-serif;
  font-size: 0.875rem;
  transition: color 0.3s ease;
  white-space: nowrap;

  &:hover {
    color: #fff;
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }

  @media (max-width: 1024px) and (orientation: landscape) {
    font-size: 10px;
    font-family: 'Open Sans', sans-serif;
  }
`;

