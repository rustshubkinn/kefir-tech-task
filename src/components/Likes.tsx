import styled from 'styled-components';
import { ReactComponent as HeartSvg } from '../assets/icons/heart.svg';
import { ReactComponent as DisabledHeart } from '../assets/icons/disabledheart.svg';
import { ReactComponent as FilledHeart } from '../assets/icons/filledheart.svg';
import { addSpacingForNumbers } from 'src/helpers/addSpacingForNumbers';
import { useCallback, useMemo } from 'react';
import { useCommentsContext } from 'src/context/CommentsContext';

const LikesWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
`;

const LikeButtonStyled = styled.button<{ $active?: boolean }>`
  display: flex;
  background: transparent;
  border: none;
  margin-right: 6px;
  animation: ${({ $active }) => ($active ? 'like 0.5s 1' : 'none')};
  cursor: ${(props) => (props.disabled ? 'unset' : 'pointer')};
  color: ${(props) => (props.disabled ? '#8297ab' : 'inherit')};

  @-webkit-keyframes like {
    0% {
      transform: scale(1);
    }
    90% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1.1);
    }
  }
`;

interface LikesProps {
  likesCount: number;
  commentId?: number;
  disabled?: boolean;
}

export const Likes = ({ likesCount, commentId, disabled }: LikesProps) => {
  const { state, dispatch } = useCommentsContext();
  const isLiked = commentId !== undefined && state.likes[commentId];

  const toggleLike = useCallback(() => {
    if (commentId) {
      dispatch({ type: 'TOGGLE_LIKE', payload: { commentId } });
    }
  }, [commentId, dispatch]);

  const renderHeart = useMemo(() => {
    if (isLiked) {
      return <FilledHeart />;
    }

    if (disabled) {
      return <DisabledHeart />;
    }

    return <HeartSvg />;
  }, [disabled, isLiked]);

  return (
    <LikesWrapper>
      <LikeButtonStyled
        $active={Boolean(isLiked)}
        disabled={disabled}
        onClick={toggleLike}
      >
        {renderHeart}
      </LikeButtonStyled>
      {addSpacingForNumbers(likesCount)}
    </LikesWrapper>
  );
};
