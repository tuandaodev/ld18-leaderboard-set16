import { createGlobalStyle } from 'styled-components';

export const GamingCenterDetailModalStyles = createGlobalStyle`
  /* Target the modal body specifically for GamingCenterDetailModal */
  .gaming-center-detail-modal-open .ant-modal-body {
    padding: 1rem 4rem !important;
  }

  .ant-upload-select {
    width: 100% !important;
    height: 53px !important;
    border: none !important;
  }

  @media (max-width: 1920px) {
    .gaming-center-detail-modal-open .ant-modal-body {
      padding: 1rem 3.5rem !important;
    }
  }

  @media (max-width: 1366px) {
    .gaming-center-detail-modal-open .ant-modal-body {
      padding: 1rem 3rem !important;
    }
  }

  @media (max-width: 1024px) {
    .gaming-center-detail-modal-open .ant-modal-body {
      padding: 1rem 2rem !important;
    }
  }

  @media (max-width: 768px) {
    .gaming-center-detail-modal-open .ant-modal-body {
      padding: 0.75rem 1rem !important;
    }

    .ant-upload-select {
      height: 48px !important;
    }
  }

  @media (max-width: 480px) {
    .gaming-center-detail-modal-open .ant-modal-body {
      padding: 0.5rem 0.75rem !important;
    }

    .ant-upload-select {
      height: 44px !important;
    }
  }

  /* Modal header responsive */
  .gaming-center-detail-modal-open .ant-modal-header {
    @media (max-width: 768px) {
      padding: 1rem 1rem !important;
    }

    @media (max-width: 480px) {
      padding: 0.75rem 0.75rem !important;
    }
  }

  /* Modal title responsive */
  .gaming-center-detail-modal-open .ant-modal-title {
    @media (max-width: 768px) {
      font-size: 1.1rem !important;
    }

    @media (max-width: 480px) {
      font-size: 1rem !important;
    }
  }

  /* Modal close button responsive */
  .gaming-center-detail-modal-open .ant-modal-close {
    @media (max-width: 768px) {
      top: 0.75rem !important;
      right: 0.75rem !important;
      width: 32px !important;
      height: 32px !important;
    }

    @media (max-width: 480px) {
      top: 0.5rem !important;
      right: 0.5rem !important;
      width: 28px !important;
      height: 28px !important;
    }
  }
`;

