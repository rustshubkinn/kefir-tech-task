import styled from 'styled-components';

const LoaderWrapper = styled.div`
  display: flex;
  backdrop-filter: blur(50px);
  justify-content: center;
  padding-top: 50vh;
  z-index: 2;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100%;
`;

const LoaderStyled = styled.span`
  width: 48px;
  height: 48px;
  border: 5px dotted #fff;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  animation: rotation 2s linear infinite;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const Loader = () => (
  <LoaderWrapper>
    <LoaderStyled />
  </LoaderWrapper>
);
