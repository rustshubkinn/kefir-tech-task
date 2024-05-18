import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from 'react';
import { IAuthors, IComment } from 'src/types';

interface CommentsState {
  likes: { [commentId: string]: number };
  totalLikes: number;
  authors: IAuthors;
  comments: IComment[];
  page: number;
}

interface ToggleLikeAction {
  type: 'TOGGLE_LIKE';
  payload: { commentId: number };
}

interface ToggleUpdateTotalLikesAction {
  type: 'UPDATE_TOTAL_LIKES';
  payload: { totalLikes: number };
}

interface AddCommentsAction {
  type: 'ADD_COMMENTS';
  payload: { comments: IComment[] };
}

interface AddAuthorsAction {
  type: 'ADD_AUTHORS';
  payload: { authors: IAuthors };
}

interface IncrementPageAction {
  type: 'INCREMENT_PAGE';
}

type CommentsAction =
  | ToggleLikeAction
  | ToggleUpdateTotalLikesAction
  | AddCommentsAction
  | IncrementPageAction
  | AddAuthorsAction;

const initialState: CommentsState = {
  likes: {},
  totalLikes: 0,
  authors: {},
  comments: [],
  page: 1,
};

const updateLikesInReplies = (
  comments: IComment[],
  commentId: number,
  isLiked: number
): IComment[] =>
  comments.map((comment) => {
    if (comment.id === commentId) {
      return { ...comment, likes: comment.likes + (isLiked ? -1 : 1) };
    }

    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateLikesInReplies(comment.replies, commentId, isLiked),
      };
    }

    return comment;
  });

const reducer = (
  state: CommentsState,
  action: CommentsAction
): CommentsState => {
  switch (action.type) {
    case 'TOGGLE_LIKE': {
      const { commentId } = action.payload;
      const isLiked = state.likes[commentId];
      const newLikes = {
        ...state.likes,
        [commentId]: !isLiked,
      };
      const newTotalLikes = isLiked
        ? state.totalLikes - 1
        : state.totalLikes + 1;
      const updatedComments = updateLikesInReplies(
        state.comments,
        commentId,
        isLiked
      );

      return {
        ...state,
        likes: newLikes,
        totalLikes: newTotalLikes,
        comments: updatedComments,
      };
    }
    case 'UPDATE_TOTAL_LIKES': {
      const { totalLikes } = action.payload;
      return {
        ...state,
        totalLikes: totalLikes,
      };
    }
    case 'ADD_COMMENTS': {
      const { comments } = action.payload;
      return {
        ...state,
        comments: [...state.comments, ...comments],
      };
    }
    case 'ADD_AUTHORS': {
      const { authors } = action.payload;
      return {
        ...state,
        authors,
      };
    }
    case 'INCREMENT_PAGE': {
      return {
        ...state,
        page: state.page + 1,
      };
    }
    default:
      return state;
  }
};

const CommentsContext = createContext<
  | {
      state: CommentsState;
      dispatch: Dispatch<CommentsAction>;
    }
  | undefined
>(undefined);

export const CommentsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CommentsContext.Provider value={{ state, dispatch }}>
      {children}
    </CommentsContext.Provider>
  );
};

export const useComments = () => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error('useComments must be used within a CommentsProvider');
  }
  return context;
};
