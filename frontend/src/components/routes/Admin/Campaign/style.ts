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

export const ExpandRowWrapper = styled.div`
  margin: 0;
  width: calc(100dvw - 3rem - 390px);
  @media (max-width: 1194px) {
    width: calc(100dvw - 3rem - 275px);
  }
  /* padding-inline: 0.75rem; */
  /* padding-block: 0.5rem; */
  display: flex;
  /* align-items: center; */
  justify-content: center;
  gap: 0.75rem;
  @media (min-width: 1194px) {
    /* gap: 1rem; */
  }

  .col {
    width: 100%;
    height: -webkit-fill-available;
    height: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
    /* align-items: center; */
    flex-direction: column;

    .btns {
      margin-top: 1rem;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 1rem;
    }

    .content {
      width: 100%;
      @media (max-width: 1208px) {
        width: 155px;
      }
      display: flex;
      align-items: center;
      justify-content: space-between;

      p {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .btn-icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: scale(0.7);
        margin-left: 2px;

        width: 40px;
        height: 40px;

        svg {
          width: 25px;
          height: 25px;
        }
      }
    }
  }

  .col:nth-child(1) {
    flex: 1;
  }
  .col:nth-child(2) {
    flex: 2;
  }

  @media (max-width: 1194px) {
    .col:nth-child(1) {
      max-width: 200px;
    }
    .col:nth-child(2) {
      flex: 1;
    }
  }

  @media (max-width: 1208px) {
    .col:nth-child(1) {
      max-width: 275px;
    }
    .col:nth-child(2) {
      flex: 1;
    }
  }
`;
