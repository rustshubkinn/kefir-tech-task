import { useEffect } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import getCommentsRequest from 'src/api/comments/getCommentsRequest';
import getAuthorsRequest from 'src/api/authors/getAuthorsRequest';
import { IComment, ICommentsResponse, IAuthor, IAuthors } from 'src/types';
import { useComments } from 'src/context/CommentsContext';
import { buildCommentsTree } from 'src/utils/buildCommentsTree';

interface UseCommentsAndAuthorsResult {
  comments: IComment[];
  authors: IAuthors;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  error: Error | null;
  loadMore: () => void;
  refetch: () => void;
  page: number;
  response: ICommentsResponse | undefined;
  totalLikes: number;
}

export const useCommentsAndAuthors = (): UseCommentsAndAuthorsResult => {
  const { state, dispatch } = useComments();
  const { authors, comments, page } = state;

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

  const {
    data: authorsResponse,
    error: authorsError,
    isLoading: isAuthorsLoading,
    isFetching: isAuthorsFetching,
    isError: isAuthorsError,
    refetch: refetchAuthors,
  } = useQuery<IAuthor[], Error>({
    queryKey: ['authors'],
    queryFn: () => getAuthorsRequest(),
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

  useEffect(() => {
    if (authorsResponse) {
      const normalizedAuthors = authorsResponse.reduce((acc, author) => {
        acc[author.id] = author;
        return acc;
      }, {} as { [key: number]: IAuthor });
      dispatch({
        type: 'ADD_AUTHORS',
        payload: { authors: normalizedAuthors },
      });
    }
  }, [authorsResponse, dispatch]);

  const loadMore = () => {
    dispatch({ type: 'INCREMENT_PAGE' });
    refetchComments();
  };

  return {
    comments,
    authors,
    isLoading: isCommentsLoading || isAuthorsLoading,
    isError: isCommentsError || isAuthorsError,
    isFetching: isCommentsFetching || isAuthorsFetching,
    error: commentsError || authorsError,
    loadMore,
    refetch: () => {
      refetchComments();
      refetchAuthors();
    },
    page,
    response: commentsResponse,
    totalLikes: state.totalLikes,
  };
};
