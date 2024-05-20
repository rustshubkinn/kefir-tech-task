import { useEffect } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import getAuthorsRequest from 'src/api/authors/getAuthorsRequest';
import { IAuthor } from 'src/types';
import { useCommentsContext } from 'src/context/CommentsContext';

interface UseAuthorsResult {
  authors: Map<number, IAuthor>;
  isAuthorsLoading: boolean;
  isAuthorsError: boolean;
  isAuthorsFetching: boolean;
  error: Error | null;
}

export const useAuthors = (): UseAuthorsResult => {
  const { state, dispatch } = useCommentsContext();
  const { authors } = state;

  const {
    data: authorsResponse,
    error: authorsError,
    isLoading: isAuthorsLoading,
    isFetching: isAuthorsFetching,
    isError: isAuthorsError,
  } = useQuery<IAuthor[], Error>({
    queryKey: ['authors'],
    queryFn: () => getAuthorsRequest(),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (authorsResponse) {
      const authorsMap = new Map();
      authorsResponse.forEach((author) => {
        return authorsMap.set(author.id, author);
      });
      dispatch({
        type: 'ADD_AUTHORS',
        payload: { authors: authorsMap },
      });
    }
  }, [authorsResponse, dispatch]);

  return {
    authors,
    isAuthorsLoading: isAuthorsLoading,
    isAuthorsError: isAuthorsError,
    isAuthorsFetching: isAuthorsFetching,
    error: authorsError,
  };
};
