import styled from 'styled-components';
import { Form, Radio } from 'antd';
import bgImage from '@images/page/bg.png';
import uploadBg from '@images/page/upload_bg.png';

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

  /* Date Picker - only width setting */
  .ant-picker {
    width: 100%;
  }

  @media (max-width: 768px) {
    gap: 1rem;
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  color: #6b3e2e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    gap: 0.25rem;
  }
`;

export const SectionNumber = styled.span`
  font-size: 1.75rem;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;
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

export const AvatarUploadSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 1rem;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

export const AvatarBox = styled.div`
  width: 376px;
  height: 376px;
  background: url(${uploadBg}) center/cover no-repeat;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    opacity: 0.9;
    filter: brightness(1.2);
  }

  @media (max-width: 1024px) {
    width: 200px;
    height: 200px;
  }

  @media (max-width: 768px) {
    width: 180px;
    height: 180px;
  }

  @media (max-width: 480px) {
    width: 150px;
    height: 150px;
  }
`;

export const UploadIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }

  @media (max-width: 1024px) {
    img {
      width: 70px;
      height: 70px;
    }
  }

  @media (max-width: 768px) {
    img {
      width: 60px;
      height: 60px;
    }
  }

  @media (max-width: 480px) {
    img {
      width: 50px;
      height: 50px;
    }
  }
`;

export const AvatarLabel = styled.div`
  font-size: 1.125rem;
  font-weight: bold;
  color: #f6f1c5;
  text-align: center;
  letter-spacing: 0.05em;
  margin-top: 10px;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-top: 8px;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    margin-top: 6px;
  }
`;

export const AvatarPreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    gap: 0;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FullWidthFormGroup = styled(FormGroup)`
  grid-column: 1 / -1;
`;

export const StyledRadioGroup = styled(Radio.Group)`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

export const StyledFormItem = styled(Form.Item)`
  margin-bottom: 0.5rem;

  .ant-form-item-control {
    flex: 1;
  }

  .ant-form-item-label > label {
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }

    @media (max-width: 480px) {
      font-size: 0.85rem;
    }
  }

  .ant-radio-group {
    @media (max-width: 768px) {
      gap: 1rem !important;
      flex-direction: column;
    }

    @media (max-width: 480px) {
      gap: 0.75rem !important;
    }
  }

  .ant-radio-wrapper {
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
