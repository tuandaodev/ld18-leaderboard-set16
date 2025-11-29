import styled from 'styled-components';
import { Select } from 'antd';
import bgImage from '@images/page/bg.png';

export const NotificationListWrapper = styled.section`
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
    padding: 4rem 0.75rem 1.5rem;
  }
`;

export const NotificationListContentContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

export const ControlPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
  // background-color: #f5ede0;
  // border-radius: 4px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    padding: 0.75rem 0;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
    padding: 0.5rem 0;
  }
`;

export const LeftControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    align-items: stretch;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 375px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    min-width: 0;
    max-width: 100%;
    width: 100%;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #928471;
  background-color: #e5dfd4;
  color: #50483d;
  font-size: 1rem;
  // border-radius: 4px;
  font-family: 'NTH Justice', sans-serif;

  &::placeholder {
    color: #928471;
  }

  &:focus {
    outline: none;
    border-color: #a68561;
    box-shadow: 0 0 0 2px rgba(166, 133, 97, 0.2);
  }

  @media (max-width: 768px) {
    padding: 0.65rem 2.25rem 0.65rem 0.9rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 2rem 0.6rem 0.75rem;
    font-size: 0.85rem;
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  right: 0.75rem;
  color: #928471;
  font-size: 1.2rem;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  @media (max-width: 768px) {
    right: 0.65rem;
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    right: 0.6rem;
    font-size: 1rem;
  }
`;

export const FilterSelect = styled(Select)`
  min-width: 200px;

  @media (max-width: 768px) {
    min-width: 0;
    width: 100%;
  }
`;

export const TrashButton = styled.button`
  background-color: transparent;
  border: 1px solid #928471;
  color: #50483d;
  padding: 0.75rem 1rem;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  min-width: 48px;
  height: 40px;

  &:hover:not(:disabled) {
    background-color: #a68561;
    border-color: #a68561;
    color: #ffffff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.65rem 0.9rem;
    height: 38px;
    font-size: 1.1rem;

    img {
      width: 18px;
      height: 18px;
    }
  }

  @media (max-width: 480px) {
    padding: 0.6rem 0.75rem;
    height: 36px;
    font-size: 1rem;

    img {
      width: 16px;
      height: 16px;
    }
  }
`;

export const NotificationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

export const NotificationItem = styled.div<{ $isRead?: boolean }>`
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #e4ded2;
  border: 1px solid #928471;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  align-items: flex-start;
  opacity: ${props => props.$isRead ? 0.7 : 1};

  &:hover {
    background-color: #ede5d5;
  }

  @media (max-width: 768px) {
    grid-template-columns: 30px 1fr;
    gap: 0.75rem;
    padding: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 25px 1fr;
    gap: 0.5rem;
    padding: 0.75rem;
  }
`;

export const NotificationCheckbox = styled.div`
  display: flex;
  align-items: flex-start;
  padding-top: 0.25rem;
  align-self: center;

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #a68561;
    border: 2px solid #928471;
    border-radius: 2px;

    &:checked {
      background-color: #a68561;
      border-color: #a68561;
    }
  }

  @media (max-width: 768px) {
    padding-top: 0.2rem;

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
    }
  }

  @media (max-width: 480px) {
    padding-top: 0.15rem;

    input[type="checkbox"] {
      width: 16px;
      height: 16px;
    }
  }
`;

export const NotificationContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;

  @media (max-width: 480px) {
    gap: 0.375rem;
  }
`;

export const NotificationTitle = styled.div<{ $isRead?: boolean }>`
  font-family: 'NTH Justice', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${props => props.$isRead ? '#998b77' : '#50483d'};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 1rem;
    letter-spacing: 0.4px;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    letter-spacing: 0.3px;
  }
`;

export const NotificationMessage = styled.div`
  font-size: 1rem;
  color: #50483d;
  line-height: 1.5;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    line-height: 1.4;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    line-height: 1.35;
  }
`;

export const NotificationTimestamp = styled.div`
  font-size: 0.9rem;
  color: #956b3f;
  font-weight: 600;
  white-space: nowrap;
  padding-top: 0.25rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    grid-column: 1 / -1;
    margin-top: 0.5rem;
    padding-top: 0;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    margin-top: 0.375rem;
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
      .ant-select-item-link {
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

  @media (max-width: 768px) {
    margin-top: 1.5rem;
    padding: 0.5rem 0;
  }
`;

