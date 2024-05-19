import { useEffect } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import getCommentsRequest from 'src/api/comments/getCommentsRequest';
import { IComment, ICommentsResponse } from 'src/types';
import { useCommentsContext } from 'src/context/CommentsContext';
import { buildCommentsTree } from 'src/utils/buildCommentsTree';

interface UseCommentsResult {
  comments: IComment[];
  isCommentsLoading: boolean;
  isCommentsError: boolean;
  isCommentsFetching: boolean;
  error: Error | null;
  loadMore: () => void;
  refetchComments: () => void;
  page: number;
  response: ICommentsResponse | undefined;
  totalLikes: number;
}

export const useComments = (): UseCommentsResult => {
  const { state, dispatch } = useCommentsContext();
  const { comments, page } = state;

  const {
    data: commentsResponse,
    error: commentsError,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    isFetching: isCommentsFetching,
    refetch: refetchComments,
  } = useQuery<ICommentsResponse, Error>({
    queryKey: ['comments', page],
    queryFn: () => getCommentsRequest(page),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (page > 1) {
      refetchComments();
    }
  }, [page, refetchComments]);

  useEffect(() => {
    if (commentsResponse) {
      const newTotalLikes = commentsResponse.data.reduce(
        (totalLikes, comment) => totalLikes + comment.likes,
        0
      );
      dispatch({
        type: 'UPDATE_TOTAL_LIKES',
        payload: { totalLikes: state.totalLikes + newTotalLikes },
      });
      const commentsTree = buildCommentsTree(commentsResponse.data);

      dispatch({
        type: 'ADD_COMMENTS',
        payload: { comments: commentsTree },
      });
    }
  }, [commentsResponse, dispatch]);

  const loadMore = () => {
    dispatch({ type: 'INCREMENT_PAGE' });
    refetchComments();
  };

  return {
    comments,
    isCommentsLoading: isCommentsLoading,
    isCommentsError: isCommentsError,
    isCommentsFetching: isCommentsFetching,
    error: commentsError,
    loadMore,
    refetchComments,
    page,
    response: commentsResponse,
    totalLikes: state.totalLikes,
  };
};
