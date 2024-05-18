import { CommentsProvider } from './context/CommentsContext';
import CommentsList from './components/CommentsList';

const App = () => (
  <CommentsProvider>
    <CommentsList />
  </CommentsProvider>
);

export default App;
