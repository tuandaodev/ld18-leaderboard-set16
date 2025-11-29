import styled from 'styled-components';
import { Select } from 'antd';
import bgImage from '@images/page/bg_page_event.png';
import bgEventItem from '@images/page/bg_event_item.png';

export const EventListWrapper = styled.section`
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

export const EventListContentContainer = styled.div`
  width: 100%;
  max-width: 1600px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

export const TitleImage = styled.img`
  width: auto;
  height: 74px;
  display: flex;
  justify-self: center;
  align-self: center;

  @media (max-width: 768px) {
    height: 50px;
  }

  @media (max-width: 480px) {
    height: 40px;
  }
`;

export const ControlPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: row;
    gap: 0.5rem;
    padding: 0.75rem 0;
  }
`;

export const FilterSelect = styled(Select)`
  min-width: 300px;

  @media (max-width: 768px) {
    min-width: 0;
    flex: 1;
  }
`;

export const EventListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const EventCard = styled.div`
  display: flex;
  // gap: 1rem;
  // padding: 1.5rem;
  // background-color: #e4ded2;
  // border: 1px solid #928471;
  // border-radius: 4px;
  // transition: background-color 0.2s ease;
  align-items: flex-start;
  height: 200px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: #ede5d5;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    flex-direction: row;
    height: auto;
    min-height: 120px;
  }
`;

export const EventImage = styled.div`
  flex-shrink: 0;
  width: 300px;
  height: 100%;
  overflow: hidden;
  // border-radius: 4px;
  // border: 1px solid #928471;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 150px;
    height: 120px;
    flex-shrink: 0;
  }
`;

export const EventDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 1rem;
  flex: 1;
  background: url(${bgEventItem}) center/cover no-repeat;
  padding: 1.5rem;
  color: #f0e598;
  height: 100%;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    gap: 0.5rem;
    min-height: 120px;
  }
`;

export const EventBottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

export const EventName = styled.div`
  font-family: 'NTH Justice', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.3;
  }
`;

export const EventTime = styled.div`
  font-size: 1rem;
  color: #f6f1c5;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

export const EventStatusButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

export const StatusButton = styled.div<{ $status?: "notstarted" | "ongoing" | "finished"; $eventType?: "online" | "offline" | "tournament" }>`
  padding: 0 10px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'NTH Justice', sans-serif;
  height: 24px;
  
  ${props => {
    if (props.$status) {
      switch (props.$status) {
        case "notstarted":
          return `
            background-color:rgb(55, 68, 78);
            color:rgb(255, 255, 255);
          `;
        case "ongoing":
          return `
            background-color: #c5502c;
            color: #f0e598;
          `;
        case "finished":
          return `
            background-color: #745c54;
            color: #f0e598;
          `;
      }
    } else if (props.$eventType) {
      // Event type button (ONLINE / OFFLINE)
      if (props.$eventType === "online") {
        return `
          background-color: #19976f;
          color: #ffffff;
        `;
      } else if (props.$eventType === "offline") {
        return `
            background-color: #8243d7;
            color: #ffffff;
          `;
        } else if (props.$eventType === "tournament") {
          return `
            background-color:rgb(12, 97, 255);
            color: #ffffff;
          `;
        }
      }
      }
    }
    return '';
  }}

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0 8px;
    height: 20px;
    border-radius: 15px;
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

