import styled from 'styled-components';

export const LeaderDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 1rem;
  min-height: 300px;

  @media (max-width: 1920px) {
    padding: 1.8rem 0.9rem;
    min-height: 280px;
    gap: 0.9rem;
  }

  @media (max-width: 1366px) {
    padding: 1.5rem 0.8rem;
    min-height: 250px;
    gap: 0.8rem;
  }
`;

export const LeaderAvatar = styled.img`
  width: 155px;
  height: 155px;
  object-fit: cover;
  border: 2px solid #92805d;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 1920px) {
    width: 140px;
    height: 140px;
  }

  @media (max-width: 1366px) {
    width: 120px;
    height: 120px;
  }
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

export const LeaderName = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #753c05;
  text-align: center;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  @media (max-width: 1920px) {
    font-size: 1.8rem;
  }

  @media (max-width: 1366px) {
    font-size: 1.6rem;
    letter-spacing: 0.8px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const LeaderTitle = styled.p`
  font-size: 1.5rem;
  color: #50483d;
  text-align: center;
  margin: 0;
  
  @media (max-width: 1920px) {
    font-size: 1.3rem;
  }

  @media (max-width: 1366px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const LeaderInfoRow = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 400px;
  margin-top: 1rem;
  gap: 2rem;
  
  @media (max-width: 1920px) {
    max-width: 380px;
    gap: 1.8rem;
    margin-top: 0.9rem;
  }

  @media (max-width: 1366px) {
    max-width: 350px;
    gap: 1.5rem;
    margin-top: 0.8rem;
  }
  
  @media (max-width: 768px) {
    gap: 1.5rem;
    align-items: center;
  }
  
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;

    @media (max-width: 1366px) {
      gap: 0.4rem;
    }
  }
`;

export const InfoLabel = styled.div`
  font-size: 1.2rem;
  color: #50483d;
  text-align: center;

  @media (max-width: 1920px) {
    font-size: 1.1rem;
  }

  @media (max-width: 1366px) {
    font-size: 1rem;
  }
`;

export const InfoValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #753c05;
  text-align: center;
  
  @media (max-width: 1920px) {
    font-size: 1.8rem;
  }

  @media (max-width: 1366px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const FacebookLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

export const FacebookIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  @media (max-width: 1920px) {
    width: 44px;
    height: 44px;
  }

  @media (max-width: 1366px) {
    width: 40px;
    height: 40px;
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

export const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #666;

  @media (max-width: 1920px) {
    padding: 2.5rem;
    font-size: 1.1rem;
  }

  @media (max-width: 1366px) {
    padding: 2rem;
    font-size: 1rem;
  }
`;

export const ErrorContainer = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #d32f2f;

  @media (max-width: 1920px) {
    padding: 2.5rem;
    font-size: 1.1rem;
  }

  @media (max-width: 1366px) {
    padding: 2rem;
    font-size: 1rem;
  }
`;

