import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from 'react';

interface CommentsState {
  likes: { [key: string]: boolean };
  totalLikes: number;
}

interface ToggleLikeAction {
  type: 'TOGGLE_LIKE';
  payload: { commentId: number };
}

interface ToggleUpdateTotalLikesAction {
  type: 'UPDATE_TOTAL_LIKES';
  payload: { totalLikes: number };
}

type CommentsAction = ToggleLikeAction | ToggleUpdateTotalLikesAction;

const initialState: CommentsState = {
  likes: {},
  totalLikes: 0,
};

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
      return {
        ...state,
        likes: newLikes,
        totalLikes: newTotalLikes,
      };
    }
    case 'UPDATE_TOTAL_LIKES': {
      const { totalLikes } = action.payload;
      return {
        ...state,
        totalLikes: state.totalLikes + totalLikes,
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
