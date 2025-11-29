import styled from 'styled-components';

export const PartnerGamingCenterManageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  scroll-behavior: smooth;

  @media (max-width: 1920px) {
    /* Full HD optimization */
  }

  @media (max-width: 1366px) {
    /* Smaller desktop */
  }

  @media (max-width: 768px) {
    /* Tablet and mobile */
    overflow-x: hidden;
  }

  @media (max-width: 480px) {
    /* Small mobile */
  }
`;

