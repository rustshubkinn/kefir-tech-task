import { CommentsProvider } from './context/CommentsContext';
import CommentsList from './components/CommentsList';
import bg from './assets/images/background.png';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;

const Container = styled.main`
  width: 100vw;
  background: url(${bg}) no-repeat fixed;
  background-color: #0f1728;
  background-position: top;
  background-size: cover;
  color: #fff;

  * {
    font-size: 16px;
    font-family: 'Lato', sans-serif;
  }

  @media (max-width: 768px) {
    * {
      font-size: 14px;
    }
  }
`;

const App = () => (
  <Container>
    <GlobalStyle />
    <CommentsProvider>
      <CommentsList />
    </CommentsProvider>
  </Container>
);

export default App;
