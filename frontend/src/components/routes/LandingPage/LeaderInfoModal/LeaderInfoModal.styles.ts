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

  @media (max-width: 1920px) {
    grid-template-columns: 360px 1fr;
    gap: 1rem;
  }

  @media (max-width: 1600px) {
    grid-template-columns: 320px 1fr;
    gap: 0.9rem;
  }

  @media (max-width: 1366px) {
    grid-template-columns: 280px 1fr;
    gap: 0.8rem;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    max-height: 80vh;
  }
`;

export const LeftSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 1rem;
  // background: rgba(139, 115, 85, 0.05);
  // border-radius: 8px;
  // border: 2px solid rgba(218, 165, 32, 0.3);
  height: fit-content;
  position: sticky;
  top: 0;

  @media (max-width: 1920px) {
    padding: 0.9rem;
  }

  @media (max-width: 1366px) {
    padding: 0.8rem;
  }

  @media (max-width: 1024px) {
    position: relative;
    padding: 1rem;
  }

  @media (max-width: 768px) {
    position: relative;
    padding: 0.5rem;
  }
`;

export const AvatarImage = styled.img`
  width: 360px;
  height: 360px;
  object-fit: cover;
  border: 7px solid #95835f;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;

  @media (max-width: 1920px) {
    width: 320px;
    height: 320px;
    border-width: 6px;
  }

  @media (max-width: 1600px) {
    width: 280px;
    height: 280px;
    border-width: 6px;
  }

  @media (max-width: 1366px) {
    width: 240px;
    height: 240px;
    border-width: 5px;
  }

  @media (max-width: 1024px) {
    width: 280px;
    height: 280px;
    border-width: 6px;
  }

  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
    border-width: 4px;
  }
`;

export const RightSection = styled.div`
  flex: 1;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 1920px) {
    gap: 0.7rem;
  }

  @media (max-width: 1366px) {
    gap: 0.65rem;
  }

  @media (max-width: 768px) {
    gap: 0.6rem;
  }
`;

export const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1rem;
  align-items: center;
  &:hover {
    background: rgba(139, 115, 85, 0.1);
  }

  @media (max-width: 1920px) {
    grid-template-columns: 180px 1fr;
    gap: 0.9rem;
  }

  @media (max-width: 1600px) {
    grid-template-columns: 160px 1fr;
    gap: 0.8rem;
  }

  @media (max-width: 1366px) {
    grid-template-columns: 140px 1fr;
    gap: 0.75rem;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 160px 1fr;
    gap: 0.8rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    align-items: flex-start;
  }
`;

export const InfoLabel = styled.div`
  font-weight: 600;
  color: #50483d;
  font-size: 1.1rem;

  @media (max-width: 1920px) {
    font-size: 1rem;
  }

  @media (max-width: 1366px) {
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
`;

export const InfoValue = styled.div<{ status?: string }>`
  color: #956b40;
  font-size: 1.5rem;
  word-break: break-word;

  a {
    color: #DAA520;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      color: #FFD700;
      text-decoration: underline;
    }
  }

  ${({ status }) => status === 'approved' && `
    color: #52c41a;
    font-weight: 600;
  `}

  ${({ status }) => status === 'pending' && `
    color: #faad14;
    font-weight: 600;
  `}

  ${({ status }) => status === 'rejected' && `
    color: #f5222d;
    font-weight: 600;
  `}

  @media (max-width: 1920px) {
    font-size: 1.3rem;
  }

  @media (max-width: 1600px) {
    font-size: 1.2rem;
  }

  @media (max-width: 1366px) {
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

