import btnBg from '@images/btn_bg.png';
import bgImage from '@images/page/bg.png';
import styled from 'styled-components';

export const TableWrapper = styled.section`
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

  @media (max-width: 1920px) {
    padding: 7rem 2rem 3.5rem;
  }

  @media (max-width: 1366px) {
    padding: 6rem 1.5rem 3rem;
  }

  @media (max-width: 1024px) {
    padding: 5rem 1.5rem 2.5rem;
  }

  @media (max-width: 768px) {
    padding: 4rem 1rem 2rem;
  }

  @media (max-width: 480px) {
    padding: 3rem 0.75rem 1.5rem;
  }
`;

export const ActionButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  
  @media (max-width: 640px) {
    display: none;
  }
`;

export const ActionButtonWrapperMobile = styled.div`
  display: none;
  justify-content: center;
  margin-top: 1rem;

  @media (max-width: 640px) {
    display: flex;
  }
`;

export const ActionButton = styled.button`
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
  min-width: 415px;
  height: 82px;
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

  @media (max-width: 1920px) {
    font-size: 1.4rem;
    min-width: 400px;
    height: 78px;
    padding: 0.75rem 2.3rem;
  }

  @media (max-width: 1366px) {
    font-size: 1.3rem;
    min-width: 380px;
    height: 75px;
    padding: 0.7rem 2.2rem;
  }

  @media (max-width: 1024px) {
    font-size: 1.25rem;
    min-width: 350px;
    height: 72px;
    padding: 0.7rem 2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 0.6rem 1.8rem;
    min-width: 300px;
    height: 65px;
    letter-spacing: 1.2px;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 0.5rem 1.5rem;
    min-width: 280px;
    height: 60px;
    letter-spacing: 1px;
  }
`;

export const TableContentContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: 1920px) {
    max-width: 1400px;
    gap: 1.75rem;
  }

  @media (max-width: 1366px) {
    max-width: 1200px;
    gap: 1.5rem;
  }

  @media (max-width: 1024px) {
    max-width: 100%;
    gap: 1.5rem;
    padding: 0 0.5rem;
  }

  @media (max-width: 768px) {
    gap: 1.25rem;
    padding: 0;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

export const TableContainer = styled.div`
  width: 100%;
  // background-color: #f5ede0;
  overflow: hidden;
  // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 640px) {
    overflow-x: visible;
  }
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 300px 150px;
  gap: 20px;
  padding: 10px 30px;
  background-color: #a68561;
  font-weight: 700;
  font-size: 1.25rem;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'NTH Justice', sans-serif;

  @media (max-width: 1920px) {
    grid-template-columns: 75px 1fr 280px 140px;
    font-size: 1.2rem;
    padding: 10px 28px;
    gap: 18px;
  }

  @media (max-width: 1366px) {
    grid-template-columns: 70px 1fr 260px 130px;
    font-size: 1.15rem;
    padding: 10px 25px;
    gap: 16px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 65px 1fr 240px 120px;
    font-size: 1.1rem;
    padding: 12px 22px;
    gap: 15px;
  }

  @media (max-width: 968px) {
    grid-template-columns: 60px 1fr 220px 110px;
    font-size: 1rem;
    padding: 12px 20px;
    gap: 14px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 50px 1fr 180px 100px;
    font-size: 0.9rem;
    padding: 10px 15px;
    gap: 10px;
    letter-spacing: 0.8px;
  }

  @media (max-width: 640px) {
    display: none; /* Hide header on very small screens, will use card layout */
  }
`;

export const TableContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 300px 150px;
  gap: 20px;
  padding: 20px 30px;
  background-color: #e4ded2;
  border: 1px solid #928471;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #ede5d5;
  }

  @media (max-width: 1920px) {
    grid-template-columns: 75px 1fr 280px 140px;
    padding: 18px 28px;
    gap: 18px;
  }

  @media (max-width: 1366px) {
    grid-template-columns: 70px 1fr 260px 130px;
    padding: 16px 25px;
    gap: 16px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 65px 1fr 240px 120px;
    padding: 15px 22px;
    gap: 15px;
  }

  @media (max-width: 968px) {
    grid-template-columns: 60px 1fr 220px 110px;
    padding: 14px 20px;
    gap: 14px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 50px 1fr 180px 100px;
    padding: 12px 15px;
    gap: 10px;
  }

  @media (max-width: 640px) {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 12px;
  }
`;

export const TableCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #50483d;
  font-weight: bold;

  @media (max-width: 1920px) {
    font-size: 1.2rem;
  }

  @media (max-width: 1366px) {
    font-size: 1.15rem;
  }

  @media (max-width: 1024px) {
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 640px) {
    font-size: 0.95rem;
    justify-content: flex-start;
    flex-direction: row;
    align-items: center;

    /* Hide index column on mobile card layout */
    &.index-col {
      display: none;
    }

    &[data-label="THÔNG TIN"]::before {
      display: none;
    }
    
    &::before {
      content: attr(data-label);
      font-weight: 700;
      color: #a68561;
      margin-right: 8px;
      min-width: 100px;
      text-transform: uppercase;
      font-size: 0.85rem;
      flex-shrink: 0;
    }
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    
    &::before {
      min-width: 90px;
      font-size: 0.8rem;
      margin-right: 0;
    }
  }
`;

export const InfoButton = styled.button`
  background-color: #956b3f;
  border: none;
  padding: 0.5rem 1rem;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
  white-space: nowrap;
  border: 1px solid #c18a53;
  outline: 4px solid #956b3f;
  border-radius: 0;

  &:hover {
    filter: brightness(1.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 1920px) {
    font-size: 0.85rem;
    padding: 0.5rem 0.95rem;
  }

  @media (max-width: 1366px) {
    font-size: 0.8rem;
    padding: 0.45rem 0.9rem;
  }

  @media (max-width: 1024px) {
    font-size: 0.8rem;
    padding: 0.45rem 0.85rem;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
    white-space: normal;
    text-align: center;
  }

  @media (max-width: 640px) {
    width: 100%;
    font-size: 0.7rem;
    padding: 0.5rem 0.75rem;
  }

  @media (max-width: 480px) {
    font-size: 0.65rem;
    padding: 0.45rem 0.7rem;
  }
`;

export const StatusText = styled.div<{ $color: string }>`
  color: ${props => props.$color};
  font-weight: 600;
  font-size: 1.25rem;

  @media (max-width: 1920px) {
    font-size: 1.2rem;
  }

  @media (max-width: 1366px) {
    font-size: 1.15rem;
  }

  @media (max-width: 1024px) {
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 640px) {
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem 0;

  .ant-pagination {
    .ant-pagination-item {
      border-color: #a68561;
      a {
        color: #956b40;
      }

      &:hover {
        border-color: #956b3f;
        a {
          color: #fff;
        }
      }
    }

    .ant-pagination-item-active {
      background-color: #a68561;
      border-color: #a68561;

      a {
        color: #fff;
      }

      &:hover {
        background-color: #956b3f;
        border-color: #956b3f;
      }
    }

    .ant-pagination-prev,
    .ant-pagination-next {
      .ant-pagination-item-link {
        border-color: #a68561;
        color: #956b40;
        &:hover {
          border-color: #956b3f;
          color: #956b3f;
        }
      }
    }

    .ant-pagination-disabled {
      .ant-pagination-item-link {
        border-color: #d9d9d9;
        color: rgba(0, 0, 0, 0.25);
        cursor: not-allowed;
      }
    }

    .ant-pagination-jump-prev,
    .ant-pagination-jump-next {
        .ant-pagination-item-link-icon {
          color: #a68561;
        }
      }
    }
  }

  @media (max-width: 1920px) {
    padding: 1rem 0;
  }

  @media (max-width: 1366px) {
    padding: 0.9rem 0;
  }

  @media (max-width: 1024px) {
    padding: 0.8rem 0;
  }

  @media (max-width: 768px) {
    margin-top: 1.5rem;
    padding: 0.5rem 0;
    
    .ant-pagination {
      .ant-pagination-item {
        min-width: 32px;
        height: 32px;
        line-height: 30px;
        font-size: 14px;
      }
    }
  }

  @media (max-width: 480px) {
    padding: 0.4rem 0;
    
    .ant-pagination {
      .ant-pagination-item {
        min-width: 28px;
        height: 28px;
        line-height: 26px;
        font-size: 12px;
        margin: 0 2px;
      }
      
      .ant-pagination-prev,
      .ant-pagination-next {
        min-width: 28px;
        height: 28px;
        line-height: 26px;
      }
    }
  }
`;

