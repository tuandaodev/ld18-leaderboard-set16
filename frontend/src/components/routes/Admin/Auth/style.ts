import { COLORS } from "@lib/constants";
import styled from "styled-components";

export const Wrapper = styled.main`
  width: 100dvw;
  height: -webkit-fill-available;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.GRAYSCALE.DARKGRAY};

  background-image: url("../admin_bg.webp");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;

  .bg-blur {
    width: 100%;
    height: -webkit-fill-available;
    height: 100%;
    position: absolute;
    inset: 1;
    backdrop-filter: blur(0.5rem) brightness(0.2);
    -webkit-backdrop-filter: blur(0.5rem) brightness(0.1);
  }
`;
export const FormBox = styled.div`
  width: 500px;
  height: max-content;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
  border-radius: 0.5rem;
  z-index: 10;
  background-color: #ffffff;
  transition: all 200ms ease-in-out;

  transform: scale(1.1);
  @media (max-width: 1194px) {
    transform: scale(0.9);
  }

  &:hover {
    box-shadow: 0 0 28px -1px #fe476770;
  }
`;
export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`;

export const Title = styled.h1`
  color: ${COLORS.VALORANT.BLACK};
  font-weight: 600;
  margin-bottom: 2rem;
  font-size: 1.6em;
`;
