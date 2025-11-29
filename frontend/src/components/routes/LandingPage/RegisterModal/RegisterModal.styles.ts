import styled, { createGlobalStyle } from 'styled-components';
import { Checkbox } from 'antd';

export const LoginRegisterText = styled.p`
  text-align: center;
  font-size: 0.9rem;
  margin-top: 0.5rem;

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

export const TermsCheckbox = styled(Checkbox)`
  font-size: 0.9rem;
  color: #5a4a3a;

  a {
    color: #DAA520;
    text-decoration: underline;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      color: #FFD700;
      text-shadow: 0 0 10px rgba(218, 165, 32, 0.5);
    }
  }

  .ant-checkbox-inner {
    border-color: #8b7355;
    background-color: rgba(139, 115, 85, 0.1);
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #DAA520;
    border-color: #DAA520;
  }

  &:hover .ant-checkbox-inner {
    border-color: #DAA520;
  }
`;



export const RegisterModalGlobalStyle = createGlobalStyle`
  /* Scoped override for RegisterModal only */
  @media (max-width: 768px) {
    .register-modal .ant-modal-content {
      padding: 1rem 1rem 2rem 1rem !important;
    }
  }
`;





