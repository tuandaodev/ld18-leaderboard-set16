import styled from 'styled-components';

export const FooterWrapper = styled.footer`
  width: 100%;
  background-color:rgb(0, 0, 0);
  padding: 1rem 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
  border-top: 2px solid #333;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 1rem 0.5rem 4.5rem 0.5rem;
    gap: 0rem;
  }
`;

export const LogoContainer = styled.div`
  flex-shrink: 0;

  @media (max-width: 768px) {
    align-self: center;
    margin-bottom: 0.5rem;
  }
`;

export const Logo = styled.img`
  height: 30px;
  width: auto;
  object-fit: contain;

  @media (max-width: 768px) {
    height: 28px;
    width: auto;
  }
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  // align-items: center;
  // gap: 0.5rem;
  color: #ccc;
  font-family: 'UVN La Xanh', sans-serif;
  font-size: 1.125rem;
  line-height: 1.6;
  flex: 1;
  max-width: 100%;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    line-height: 1.5;
    width: 100%;
    text-align: center;
    gap: 0.5rem;
  }
`;

export const InfoText = styled.p`
  margin: 0;
  padding: 0;
  color: #beccc9;
  // text-align: center;
  
  a {
    color: inherit;
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    margin: 0;
    padding: 0;
    text-align: center;
  }
`;

