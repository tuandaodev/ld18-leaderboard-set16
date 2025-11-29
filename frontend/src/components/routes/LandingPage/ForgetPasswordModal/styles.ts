import styled, { createGlobalStyle } from 'styled-components';

export const FormContainer = styled.div`
  min-width: 375px;
  max-width: 100%;
  align-self: center;
  width: 100%;

  @media (max-width: 768px) {
    min-width: unset;
    width: 100%;
    padding: 0;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const ForgetPasswordModalGlobalStyle = createGlobalStyle`
  @media (max-width: 768px) {
    .forget-password-modal .ant-modal-body {
      padding: 0 30px !important;
    }
  }
`;


