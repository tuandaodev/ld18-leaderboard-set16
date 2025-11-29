import styled from 'styled-components';

export const NotificationContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 0 0 1rem 0;
  min-height: 200px;
  justify-content: center;
`;

export const NotificationMessage = styled.div`
  font-size: 1.25rem;
  line-height: 1.6;
  color: #50483d;
  text-align: center;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0 0.5rem;
  }
`;

