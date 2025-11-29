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

export const LoginRegisterText = styled.p`
  text-align: center;
  font-size: 0.9rem;
  margin-top: 0.5rem;

  @media (max-width: 1366px) {
    font-size: 0.85rem;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-top: 0.75rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    margin-top: 0.5rem;
  }

  a {
    color: #DAA520;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      color: #FFD700;
      text-shadow: 0 0 10px rgba(218, 165, 32, 0.5);
    }
  }
`;

export const LoginModalGlobalStyle = createGlobalStyle`
  /* Scoped override for RegisterModal only */

  .login-modal .ant-modal-body {
    padding: 0 50px !important;
  }

  @media (max-width: 768px) {
    .login-modal .ant-modal-body {
      padding: 0 30px !important;
    }
  }
`;

