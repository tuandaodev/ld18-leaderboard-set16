import styled from 'styled-components';
import { Modal } from 'antd';
import bgSmall from '../../../images/popup/bg_small.png';
import bgLarge from '../../../images/popup/bg_large.png';
import closeIcon from '../../../images/popup/close.png';

interface StyledModalProps {
  $size?: 'small' | 'large';
}

export const StyledModal = styled(Modal)<StyledModalProps>`
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
    background-image: url(${props => props.$size === 'large' ? bgLarge : bgSmall});
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    padding: 3rem 1rem 3rem 6.5rem;
    padding: ${props => props.$size === 'large' ? '3rem 1rem 3rem 6.5rem' : '2rem 1rem 3rem 6.5rem'};
    border: none;
    box-shadow: none;
    min-height: 400px;

    @media (max-width: 1920px) {
      min-height: 350px;
    }

    @media (max-width: 1366px) {
      min-height: 300px;
    }

    @media (max-width: 768px) {
      background-size: 100% 100%;
      padding: 2rem 1.5rem 2rem 3rem;
      min-height: auto;
    }

    @media (max-width: 480px) {
      padding: ${props => props.$size === 'large' ? '1rem 0.5rem' : '1.5rem 1rem 2rem 2.5rem'};
      margin-left: ${props => props.$size === 'large' ? '0rem' : '-1.5rem'};
    }
  }

  .ant-modal-header {
    background: transparent;
    padding: 1rem 1rem 1rem;
    margin-bottom: 0;
  }

  .ant-modal-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #DAA520;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-shadow: 
      0 0 15px rgba(218, 165, 32, 0.6),
      2px 2px 4px rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;

    @media (max-width: 1920px) {
      font-size: 1.6rem;
      letter-spacing: 1.5px;
    }

    @media (max-width: 1366px) {
      font-size: 1.4rem;
      letter-spacing: 1px;
    }

    @media (max-width: 768px) {
      font-size: 1.2rem;
      letter-spacing: 1px;
    }

    @media (max-width: 480px) {
      font-size: 1rem;
      letter-spacing: 0.5px;
    }
  }

  .ant-modal-close {
    transition: all 0.3s ease;
    top: ${props => props.$size === 'large' ? '2rem' : '0rem'};
    right: ${props => props.$size === 'large' ? '2rem' : '-4rem'};
    width: 76px;
    height: 76px;

    @media (max-width: 1920px) {
      width: 68px;
      height: 68px;
      top: ${props => props.$size === 'large' ? '1.8rem' : '0rem'};
      right: ${props => props.$size === 'large' ? '1.8rem' : '-3.5rem'};
    }

    @media (max-width: 1366px) {
      width: 60px;
      height: 60px;
      top: ${props => props.$size === 'large' ? '1.5rem' : '0rem'};
      right: ${props => props.$size === 'large' ? '1.5rem' : '-3rem'};
    }

    @media (max-width: 768px) {
      width: 36px;
      height: 36px;
      top: 1rem;
      right: 1rem;
    }

    @media (max-width: 480px) {
      width: 28px;
      height: 28px;
      top: 0.75rem;
      right: 0rem;
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

      @media (max-width: 768px) {
        &::before {
        } 
      }
    }
  }

  .ant-modal-body {
    padding: 1rem 2rem;

    @media (max-width: 1366px) {
      padding: 1rem 1.5rem;
    }

    @media (max-width: 768px) {
      padding: 0 1.5rem 1.5rem;
    }

    @media (max-width: 480px) {
      padding: 0;
    }
  }

  @media (max-width: 768px) {
    .ant-modal-header {
      padding: 1.2rem 1.5rem 0.8rem;
    }
  }

  @media (max-width: 480px) {
    .ant-modal-header {
      padding: 0.5rem 0.5rem 0.5rem;
    }
  }
`;

