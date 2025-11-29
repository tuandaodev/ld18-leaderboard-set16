import styled from 'styled-components';
import { Form } from 'antd';

export const StyledForm = styled(Form<any>)`
  display: flex;
  flex-direction: column;

  .ant-form-item {
    margin-bottom: 0.5rem;

    @media (max-width: 1366px) {
      margin-bottom: 0.4rem;
    }

    @media (max-width: 768px) {
      margin-bottom: 0.75rem;
    }

    @media (max-width: 480px) {
      margin-bottom: 0.5rem;
    }
  }

  .ant-form-item-label {
    padding-bottom: 0.5rem;

    @media (max-width: 1366px) {
      padding-bottom: 0.4rem;
    }

    @media (max-width: 768px) {
      padding-bottom: 0.4rem;
    }

    @media (max-width: 480px) {
      padding-bottom: 0.3rem;
    }
  }

  /* Center the submit button */
  button[type="submit"] {
    align-self: center;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const StyledFormItem = styled(Form.Item<any>)`
  margin-bottom: 1.5rem;

  @media (max-width: 1920px) {
    margin-bottom: 1.3rem;
  }

  @media (max-width: 1366px) {
    margin-bottom: 1.2rem;
  }

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 0.75rem;
  }
`;

export const FormLabel = styled.span`
  font-size: 1rem;
  font-weight: bold;
  // letter-spacing: 1px;

  @media (max-width: 1920px) {
    font-size: 0.95rem;
  }

  @media (max-width: 1366px) {
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

