import styled from 'styled-components';
import titleBg from '@images/page/title_bg.png';

export const StyledPageTitle = styled.div`
  background-color: transparent;
  background-image: url(${titleBg});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  padding: 1rem 6rem;
  color: #f6f1c5;
  font-family: 'NTH Justice', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  min-width: 600px;
  height: 47px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
  justify-self: center;
  align-self: center;

  @media (max-width: 1200px) {
    font-size: 1.5rem;
    padding: 0.9rem 4rem;
    min-width: 500px;
    height: 45px;
  }

  @media (max-width: 968px) {
    font-size: 1.3rem;
    padding: 0.8rem 3rem;
    min-width: 400px;
    height: 43px;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 0.7rem 1.5rem;
    min-width: 300px;
    height: 40px;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    min-width: 300px;
    height: 34px;
    margin-bottom: 1rem;
    letter-spacing: 0.05em;
  }
`;

