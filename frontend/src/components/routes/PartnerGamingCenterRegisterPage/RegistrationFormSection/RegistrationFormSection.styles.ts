import styled from 'styled-components';
import { Form } from 'antd';
import bgImage from '@images/page/bg.png';
import btnBg from '@images/btn_bg.png';

export const FormWrapper = styled.section`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 8rem 2rem 4rem;
  position: relative;
  background: url(${bgImage}) top/cover no-repeat;
  // background-position-y: 60px;

  @media (max-width: 768px) {
    padding: 6rem 1rem 2rem;
  }

  @media (max-width: 480px) {
    padding: 2rem 0.75rem 1.5rem;
  }
`;

export const FormContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  z-index: 1;

  /* Ant Design Form global styles */
  .ant-form {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  @media (max-width: 768px) {
    gap: 1rem;
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0rem;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const StyledFormItem = styled(Form.Item)`
  margin-bottom: 0.5rem;

  .ant-form-item-control {
    flex: 1;
  }

  .ant-upload-select {
    width: 100% !important;
    height: 53px !important;
    border: none !important;

    @media (max-width: 768px) {
      height: 48px !important;
    }

    @media (max-width: 480px) {
      height: 44px !important;
    }
  }

  .ant-input,
  .ant-select-selector,
  .ant-picker {
    @media (max-width: 768px) {
      font-size: 16px; /* Prevents zoom on iOS */
    }
  }

  .ant-form-item-label > label {
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }

    @media (max-width: 480px) {
      font-size: 0.85rem;
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 0.5rem;
  }
`;

export const SubmitButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 2rem 0 0;

  @media (max-width: 768px) {
    margin: 1.5rem 0 0;
  }

  @media (max-width: 480px) {
    margin: 1rem 0 0;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 1rem;
    width: 100%;
  }

  @media (max-width: 480px) {
    gap: 0rem;
    justify-content: space-around;
  }
`;

export const BackButton = styled.button`
  background-color: transparent;
  background-image: url(${btnBg});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  border: none;
  padding: 0.8rem 2.5rem;
  color: #f9f7da;
  font-family: 'NTH Justice', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  height: 82px;
  min-width: 415px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));

  &:hover {
    filter: brightness(1.3) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
  }

  &:active {
    filter: brightness(1.3);
  }

  @media (max-width: 1200px) {
    font-size: 0.95rem;
    padding: 0.7rem 2rem;
    min-width: 180px;
  }

  @media (max-width: 968px) {
    font-size: 0.9rem;
    padding: 0.6rem 1.8rem;
    min-width: 130px;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 0.5rem 1.5rem;
    min-width: 160px;
    width: 100%;
  }
`;

export const SuccessMessage = styled.div`
  padding: 1rem;
  background: rgba(76, 175, 80, 0.2);
  border: 2px solid #4caf50;
  border-radius: 8px;
  color: #2e7d32;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
`;

export const ErrorMessage = styled.div`
  padding: 1rem;
  background: rgba(244, 67, 54, 0.2);
  border: 2px solid #f44336;
  border-radius: 8px;
  color: #c62828;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
`;

export const UploadContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 53px;
  width: 100%;
  padding: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }

  @media (max-width: 768px) {
    height: 48px;
  }

  @media (max-width: 480px) {
    height: 44px;
  }
`;

