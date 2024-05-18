import React from 'react';
import { useComments } from '../context/CommentsContext';

interface LikeButtonProps {
  commentId: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({ commentId }) => {
  const { state, dispatch } = useComments();
  const isLiked = state.likes[commentId];

  const toggleLike = () =>
    dispatch({ type: 'TOGGLE_LIKE', payload: { commentId } });

  return (
    <button onClick={toggleLike}>
      {isLiked ? 'Unlike' : 'Like'} ({isLiked ? '❤️' : '♡'})
    </button>
  );
};

export default LikeButton;
