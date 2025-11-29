import styled from "styled-components";
import { COLORS } from "@lib/constants";

export const Wrapper = styled.aside`
  width: 300px;
  @media (max-width: 1194px) {
    width: 250px;
  }

  height: -webkit-fill-available;
  height: 100dvh;
  background-color: ${COLORS.VALORANT.BLACK};
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  /* border-top-right-radius: 1rem; */
  /* border-bottom-right-radius: 1rem; */
`;

export const NavHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  h1 {
    font-size: 30px;
    font-weight: 500;
    @media (max-width: 1194px) {
      font-size: 20px;
    }
  }

  span:nth-child(1) {
    margin-left: 1.25rem;
    transform: scale(0.9);
  }
`;
export const ItemsBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 1.5rem;
  gap: 8px;
`;
export const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
export const ItemMainRoute = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 0.5rem;

  font-size: 18px;
  height: 40px;
  @media (max-width: 1194px) {
    font-size: 14px;
    height: 40px;
  }

  font-weight: 200;
  transition: all 200ms ease-in-out;
  cursor: pointer;
  gap: 1rem;

  background-color: ${COLORS.VALORANT.BLACK};
  &:hover {
    background-color: ${COLORS.VALORANT.GRAY};
  }

  &.disabled {
    filter: opacity(0.5);
    cursor: not-allowed;
    &:hover {
      background-color: transparent;
      box-shadow: 0 0 10px 1px transparent;
    }
  }

  &.active {
    background-color: ${COLORS.VALORANT.BLUE};
    &:hover {
      background-color: ${COLORS.VALORANT.BLUE};
      box-shadow: 0 0 10px 1px ${COLORS.VALORANT.BLUE};
    }
  }

  &.active.subpage {
    border-radius: 0.5rem;
  }

  &.subpage:nth-child(1) {
    margin-top: 8px;
  }

  &.subpage {
    width: 90%;
    margin-left: auto;
    border-left: 1px solid #e8eae330;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    transition: all 300ms ease-in-out;

    &:hover {
      border-left: 1px solid #e8eae300;
      border-top-left-radius: 0.5rem;
      border-bottom-left-radius: 0.5rem;
    }

    svg {
      width: 35px;
      height: 35px;
    }
  }
`;
export const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;
  @media (max-width: 1194px) {
    width: 30px;
    height: 30px;
  }
  svg {
    width: 25px;
    height: 25px;
    @media (max-width: 1194px) {
      width: 20px;
      height: 20px;
    }
  }
`;

export const NavFooter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  height: 100px;

  .user-email {
    color: #fff;
    margin-bottom: 1rem;
    font-weight: 600;
    border-top: 1px solid #e8eae360;
    padding-top: 1rem;

    // overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    @media (max-width: 1194px) {
      font-size: 12px;
    }
  }

  .user-langugage {
    margin-bottom: 1rem;
  }
`;
