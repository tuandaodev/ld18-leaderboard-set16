import styled from 'styled-components';
import bgImage from '@images/page/bg_page_event.png';
import bgEventDetailTitle from '@images/page/bg_event_detail_title_bg.png';

export const EventDetailWrapper = styled.section`
  width: 100%;
  height: calc(100vh + 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 8rem 2rem 10rem;
  position: relative;
  background: url(${bgImage}) top/cover no-repeat;
//   background-position-y: 60px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 0;
  }

  @media (max-width: 768px) {
    height: auto;
    min-height: 100vh;
    padding: 5rem 1rem 2rem;
    overflow-y: auto;
  }

  @media (max-width: 480px) {
    padding: 4rem 0.75rem 1.5rem;
  }
`;

export const EventDetailContentContainer = styled.div`
  width: 100%;
  max-width: 1600px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  z-index: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 0.5rem;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #92805d;
    border-radius: 4px;
    outline: 2px solid #f7f1c7;
    
    &:hover {
      background: #956b40;
    }
  }

  @media (max-width: 768px) {
    height: auto;
    gap: 0.75rem;
    padding-right: 0.25rem;
  }
`;

export const EventHeaderSection = styled.div`
  display: grid;
  grid-template-columns: 360px 1fr;
  width: 100%;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

export const EventImageSection = styled.div`
  width: 100%;
  max-width: 360px;
  height: 100%;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 968px) {
    height: 300px;
    max-width: 100%;
  }

  @media (max-width: 768px) {
    height: 250px;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    height: 200px;
  }
`;

export const EventInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  background: url(${bgEventDetailTitle}) center/cover no-repeat;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;

  @media (max-width: 768px) {
    padding: 1.5rem;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    gap: 0.75rem;
    align-items: center;
  }
`;

export const EventTitle = styled.h1`
  font-family: 'NTH Justice', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
  line-height: 1.4;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    line-height: 1.3;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    letter-spacing: 0.5px;
  }
`;

export const EventInfoBottomRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
`;

export const EventInfoTable = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 1rem;
  flex: 1 1 auto;
  min-width: 0;
  justify-content: space-around;
  padding-right: 50px;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem 1rem;
    padding-right: 0;
    align-items: start;
  }
`;

export const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;

  @media (max-width: 768px) {
    text-align: left;
    gap: 0.25rem;
  }
`;

export const InfoLabel = styled.span`
  font-size: 0.9rem;
  font-weight: bold;
  color: #bda982;
  letter-spacing: 1px;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    letter-spacing: 0.5px;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

export const InfoValue = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: #f0e598;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

export const InfoDivider = styled.div`
  width: 1px;
  min-height: 60px;
  background-color: #bda982;
  margin: 0 0.5rem;
  align-self: stretch;
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const JoinButton = styled.button`
  padding: 12px 24px;
  background-color: #956b40;
    border: 1px solid #c18a53;
    outline: 4px solid #956b3f;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-end;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background-color: #a68561;
    border-color: #f4d03f;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    align-self: stretch;
    padding: 14px 24px;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 12px 20px;
    font-size: 0.9rem;
    outline-width: 2px;
  }
`;

export const EventBodySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  padding: 0 2rem 2rem 2rem;
  text-align: justify;

  @media (max-width: 768px) {
    padding: 0 1rem 1.5rem 1rem;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0 0.75rem 1rem 0.75rem;
    gap: 0.75rem;
  }
`;

export const SectionTitle = styled.h2`
  font-family: 'NTH Justice', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #8b4513;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

export const EventDescription = styled.div`
  font-size: 1.125rem;
  line-height: 1.8;
  color: #ffffff;
  word-wrap: break-word;

  /* Style HTML content */
  h1, h2, h3, h4, h5, h6 {
    margin: 1rem 0 0.5rem 0;
    color: #ffffff;
  }

  p {
    margin: 0.5rem 0;
  }

  ul, ol {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  a {
    color: #956b40;
    text-decoration: underline;
    
    &:hover {
      color: #a68561;
    }
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;

    h1, h2, h3, h4, h5, h6 {
      margin: 0.75rem 0 0.4rem 0;
      font-size: 1.1em;
    }

    p {
      margin: 0.4rem 0;
    }

    ul, ol {
      padding-left: 1.25rem;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1.5;

    h1, h2, h3, h4, h5, h6 {
      margin: 0.5rem 0 0.3rem 0;
      font-size: 1.05em;
    }

    ul, ol {
      padding-left: 1rem;
    }
  }
`;

