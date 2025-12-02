import styled from 'styled-components';
import { Modal } from 'antd';
import popupBgImg from '../../../../../img/f3/popup_bg.png';
import closeIcon from '../../../../../img/f3/close.png';

export const StyledRuleModal = styled(Modal)`
  /* Modal mask (backdrop) styling */
  & + .ant-modal-mask {
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
  }

  /* Responsive width constraints */
  @media (max-width: 1366px) {
    max-width: calc(100vw - 40px) !important;
  }

  @media (max-width: 768px) {
    max-width: calc(100vw - 20px) !important;
  }

  .ant-modal-content {
    background-color: transparent;
    background-image: url(${popupBgImg});
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    padding: 2rem 4rem;
    border: none;
    box-shadow: none;
    min-height: 500px;

    @media (max-width: 1920px) {
      padding: 2.5rem 1.8rem;
      min-height: 450px;
    }

    @media (max-width: 1366px) {
      padding: 2rem 1.5rem;
      min-height: 400px;
    }

    @media (max-width: 768px) {
      padding: 2rem 1.5rem;
      min-height: auto;
    }

    @media (max-width: 480px) {
      padding: 1.5rem 1rem;
    }
  }

  .ant-modal-header {
    background: transparent;
    padding: 0;
    margin-bottom: 0;
    border: none;
  }

  .ant-modal-title {
    display: none;
  }

  .ant-modal-close {
    transition: all 0.3s ease;
    top: 1.5rem;
    right: 1.5rem;
    width: 23px;
    height: 23px;
    color: #fff;

    @media (max-width: 1920px) {
      width: 36px;
      height: 36px;
      top: 1.2rem;
      right: 1.2rem;
    }

    @media (max-width: 1366px) {
      width: 32px;
      height: 32px;
      top: 1rem;
      right: 1rem;
    }

    @media (max-width: 768px) {
      width: 28px;
      height: 28px;
      top: 1rem;
      right: 1rem;
    }

    @media (max-width: 480px) {
      width: 24px;
      height: 24px;
      top: 0.75rem;
      right: 0.75rem;
    }

    &:hover {
      background: transparent;
      .ant-modal-close-x {
        transform: scale(1.1);
      }
    }

    .ant-modal-close-x {
      transition: transform 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      
      /* Hide default icon and show custom image */
      font-size: 0;
      line-height: 0;
      
      &::before {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        background-image: url(${closeIcon});
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }

  .ant-modal-body {
    padding: 0;

    @media (max-width: 768px) {
      padding: 0;
    }
  }
`;

export const RuleDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-height: 300px;

  @media (max-width: 1920px) {
    gap: 1.8rem;
    min-height: 280px;
  }

  @media (max-width: 1366px) {
    gap: 1.5rem;
    min-height: 250px;
  }

  @media (max-width: 768px) {
    gap: 1.2rem;
  }
`;

export const RuleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 1920px) {
    gap: 0.9rem;
  }

  @media (max-width: 1366px) {
    gap: 0.8rem;
  }

  @media (max-width: 768px) {
    gap: 0.6rem;
  }
`;

export const RuleTitle = styled.h3`
  font-size: 45px;
  font-weight: 700;
  font-family: 'GS3 Hustralge', sans-serif;
  color: #24286c;
  text-align: center;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  @media (max-width: 1920px) {
    font-size: 45px;
  }

  @media (max-width: 1366px) {
    font-size: 35px;
    letter-spacing: 0.8px;
  }

  @media (max-width: 768px) {
    font-size: 25px;
  }

  @media (max-width: 1024px) and (orientation: landscape) {
    font-size: 20px;
  }
`;

export const RuleContent = styled.p`
  font-size: 21px;
  color: #24286c;
  text-align: center;
  margin: 0;
  line-height: 1.5;
  
  @media (max-width: 1920px) {
    font-size: 21px;
  }

  @media (max-width: 1366px) {
    font-size: 18px;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    font-size: 15px;
  }

  @media (max-width: 1024px) and (orientation: landscape) {
    font-size: 12px;
  }
`;

export const RuleItem = styled.div`
  display: flex;
  gap: 1rem;
  align-items: baseline;
  margin-top: 0.5rem;

  @media (max-width: 1920px) {
    gap: 0.9rem;
    margin-top: 0.4rem;
  }

  @media (max-width: 1366px) {
    gap: 0.8rem;
    margin-top: 0.3rem;
  }

  @media (max-width: 768px) {
    gap: 0.6rem;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const RuleItemLabel = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #50483d;
  min-width: 80px;
  
  @media (max-width: 1920px) {
    font-size: 1.05rem;
    min-width: 75px;
  }

  @media (max-width: 1366px) {
    font-size: 1rem;
    min-width: 70px;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    min-width: auto;
  }
`;

export const RuleItemValue = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: #753c05;
  flex: 1;
  
  @media (max-width: 1920px) {
    font-size: 1.05rem;
  }

  @media (max-width: 1366px) {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

