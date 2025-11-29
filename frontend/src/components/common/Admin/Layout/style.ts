import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  padding-left: 300px;
  @media (max-width: 1194px) {
    padding-left: 250px;
  }
  height: -webkit-fill-available;
  height: 100dvh;
  background-color: #0c0f0e;

  main {
    width: 100%;
    height: -webkit-fill-available;
    height: 100dvh;
    background-color: #fff;
    overflow-y: scroll;
  }
`;
