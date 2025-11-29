import styled from 'styled-components';

export const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 1rem;
  padding: 0;
  max-height: 70vh;
  overflow-y: auto;

  /* Scrollbar styling */
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
    grid-template-columns: 1fr;
    gap: 0rem;
    max-height: none;
    overflow-y: visible;
    padding: 10px 20px;
  }
`;

export const LeftSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
  height: fit-content;
  flex-direction: column;
`;

export const CenterImage = styled.img`
  max-width: 360px;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  border: 1px solid #928471;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  display: flex;
  align-self: center;

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
    max-height: 250px;
    height: auto;
  }

  @media (max-width: 480px) {
    max-height: 200px;
  }
`;

export const RightSection = styled.div`
  flex: 1;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 1rem;
  align-items: center;
  padding: 0.5rem 0;
  
  &:hover {
    background: rgba(139, 115, 85, 0.1);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0rem;
    padding: 0.25rem 0;
  }
`;

export const InfoLabel = styled.div`
  font-weight: 600;
  color: #50483d;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }
`;

export const InfoValue = styled.div`
  color: #956b40;
  font-size: 1.5rem;
  word-break: break-word;
  line-height: 1.6;

  a {
    color: #DAA520;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      color: #FFD700;
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

export const FooterSection = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
`;

export const FooterDivider = styled.hr`
  border: none;
  border-top: 1px solid #8b7355;
  margin: 0;
  width: 100%;
`;

export const FooterAddress = styled.div`
  color: #956b40;
  font-size: 1.5rem;
  margin-top: 1rem;
  padding-left: 0.5rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding-left: 0;
    margin-top: 0.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

