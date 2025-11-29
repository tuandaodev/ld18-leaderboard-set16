import styled from 'styled-components';
import { Select, Input } from 'antd';
import btnBg from '../../../images/btn_bg.png';
import bgImage from '@images/page/bg.png';

export const PartnerGamingCenterListContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  background: url(${bgImage}) top/cover no-repeat;
`;

export const ContentWrapper = styled.div`
  padding-top: 8rem;
  padding-bottom: 4rem;
  width: 100%;
  max-width: 1600px;
  padding-left: 2rem;
  padding-right: 2rem;

  @media (max-width: 768px) {
    padding-top: 6rem;
    padding-bottom: 2rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  @media (max-width: 480px) {
    padding-top: 4rem;
    padding-bottom: 1.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
`;

export const SearchBar = styled.div`
  width: 100%;
  max-width: 1600px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  // margin-bottom: 2rem;

  @media (max-width: 968px) {
    flex-direction: column;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    gap: 1rem;
    padding: 0.75rem 0;
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
    padding: 0.5rem 0;
  }
`;

export const SearchBarLeft = styled.div`
  display: flex;
  gap: 25px;
  flex: 1;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

export const SearchBarRight = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ProvinceSelectWrapper = styled.div`
  min-width: 375px;

  .ant-select {
    width: 100%;
    height: 50px;

    .ant-select-selector {
      height: 50px !important;
      // border: 2px solid #a68561 !important;
      // background-color: #f5ede0 !important;
      // font-family: 'NTH Justice', sans-serif;
      // font-size: 1rem;
      color: #50483d !important;

      .ant-select-selection-item {
        line-height: 46px !important;
        color: #50483d !important;
      }

      .ant-select-selection-placeholder {
        line-height: 46px !important;
        color: #928471 !important;
      }
    }

    .ant-select-arrow {
      color: #a68561 !important;
    }

    &:hover .ant-select-selector {
      border-color: #956b3f !important;
    }

    &.ant-select-focused .ant-select-selector {
      border-color: #956b3f !important;
      box-shadow: 0 0 0 2px rgba(149, 107, 63, 0.2) !important;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;

    .ant-select {
      height: 45px;

      .ant-select-selector {
        height: 45px !important;

        .ant-select-selection-item {
          line-height: 41px !important;
        }

        .ant-select-selection-placeholder {
          line-height: 41px !important;
        }
      }
    }
  }

  @media (max-width: 480px) {
    .ant-select {
      height: 40px;

      .ant-select-selector {
        height: 40px !important;

        .ant-select-selection-item {
          line-height: 36px !important;
        }

        .ant-select-selection-placeholder {
          line-height: 36px !important;
        }
      }
    }
  }
`;

export const SearchInput = styled(Input)`
  min-width: 300px;
  height: 50px;
  
  border: 1px solid #a68561;
  background-color: #f5ede0;
  font-family: 'NTH Justice', sans-serif;
  font-size: 1rem;
  color: #50483d;

  &::placeholder {
    color: #928471;
  }

  &:hover {
    border-color: #956b3f;
  }

  &:focus {
    border-color: #956b3f;
    box-shadow: 0 0 0 2px rgba(149, 107, 63, 0.2);
  }

  .ant-input-prefix {
    color: #a68561;
    margin-right: 0.5rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
    height: 45px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    height: 40px;
    font-size: 0.85rem;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

export const ActionButton = styled.button`
  background-color: #956b3f;
  border: none;
  outline: none;
  padding: 0.5rem 1rem;
  color: #ffffff;
  font-family: 'NTH Justice', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 50px;

  &:hover {
    filter: brightness(1.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    border: 1px solid #c18a53;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.5rem 0.8rem;
    width: 100%;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.45rem 0.45rem;
    letter-spacing: 0.3px;
    height: 40px;
  }
`;

export const ContentArea = styled.div`
  width: 100%;
  max-width: 1600px;
  display: grid;
  grid-template-columns: 375px 1fr;
  gap: 25px;
  // padding: 0 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    gap: 1rem;
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

export const LeftPanel = styled.div`
  background-color: #e9e3d8;
  // border: 1px solid #a68561;
  // border-radius: 12px;
  // padding: 2rem;
  display: flex;
  flex-direction: column;
  // gap: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  justify-content: center;
  align-items: center;

  @media (max-width: 968px) {
    display: none;
  }
`;

export const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 800px;
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #92805d;
    border-radius: 4px;
    outline: 2px solid #f7f1c7;
    
    &:hover {
      background: #956b40;
    }
  }

  @media (max-width: 768px) {
    max-height: none;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

export const SelectedGamingCenterImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  
  border: 1px solid #a68561;
`;

export const SelectedGamingCenterInfo = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
  align-self: baseline;
`;

export const SelectedGamingCenterName = styled.h2`
  font-family: 'NTH Justice', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #753c05;
  margin: 0;
`;

export const SelectedGamingCenterAddress = styled.p`
  font-family: 'NTH Justice', sans-serif;
  font-size: 1.1rem;
  color: #50483d;
  margin: 0;
  line-height: 1.6;
`;

export const SelectedGamingCenterHours = styled.p`
  font-family: 'NTH Justice', sans-serif;
  font-size: 1.1rem;
  color: #50483d;
  margin: 0;
  line-height: 1.6;
`;

export const DetailsButton = styled.button`
  background-color: #956b3f;
  padding: 0.8rem 2rem;
  color: #ffffff;
  font-family: 'NTH Justice', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  width: 100%;
  margin-top: auto;
  border: none;
  outline: none;
  position: relative;
  
  &:hover {
    filter: brightness(1.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:before {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 4px;
    border: 1px solid #c18a53;
    pointer-events: none;
  }
`;

export const TableContainer = styled.div`
  width: 100%;
  overflow: hidden;
`;

export const TableContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  // margin-top: 10px;
`;

export const TableRow = styled.div<{ $isSelected?: boolean }>`
  display: grid;
  grid-template-columns: minmax(400px, 1fr) 150px 200px;
  gap: 20px;
  padding: 20px 30px;
  background-color: ${props => props.$isSelected ? '#f3eee4' : '#dcd6c9'};
  border: 1px solid #928471;
  transition: background-color 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #f3eee4;
  }

  @media (max-width: 968px) {
    grid-template-columns: 2fr 1fr 180px;
    padding: 15px 20px;
    gap: 15px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 2fr 1fr 150px;
    padding: 12px 15px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    padding: 10px 12px;
    gap: 8px;
  }
`;

export const TableCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 1.25rem;
  color: #50483d;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    font-weight: 600;
  }
`;

export const TableCellImageName = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;

  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

export const TableCellImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 1px solid #a68561;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
  }
`;

export const TableCellName = styled.h3`
  font-family: 'NTH Justice', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #50483d;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export const GetDirectionsButton = styled.button`
  background-color: #956b3f;
  border: 1px solid #c18a53;
  outline: 4px solid #956b3f;
  padding: 0.5rem 1rem;
  color: #ffffff;
  font-family: 'NTH Justice', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0;
  white-space: nowrap;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    filter: brightness(1.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.45rem 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.4rem 0.7rem;
    letter-spacing: 0.3px;
    width: 100%;
    justify-content: center;
  }
`;

export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 1.5rem 0 0.5rem;

  @media (max-width: 768px) {
    padding: 1rem 0 0.5rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 0 0.5rem;
  }

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
`;

