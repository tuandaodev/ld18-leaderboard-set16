import styled from "styled-components";

export const AccountsWrapper = styled.main`
  height: -webkit-fill-available;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const AccountSearchRow = styled.section`
  width: 100%;
  height: 90px;
  padding-inline: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SearchCol = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  .search-wrapper {
    width: 40%;
  }
`;

export const AccountTableRow = styled.section`
  width: 100%;
  flex: 1;
  padding-inline: 1.5rem;
  padding-bottom: 1.5rem;
  overflow-y: auto;
  transition: all 300ms ease-out;
  border: 2px solid #e8eae300;

  &.is-scroll {
    border: 3px solid #e8eae390;
  }

  .expand-row {
    cursor: pointer;
  }
`;

