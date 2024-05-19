import { useEffect } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import getAuthorsRequest from 'src/api/authors/getAuthorsRequest';
import { IAuthor, IAuthors } from 'src/types';
import { useCommentsContext } from 'src/context/CommentsContext';

interface UseAuthorsResult {
  authors: IAuthors;
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

  return {
    authors,
    isAuthorsLoading: isAuthorsLoading,
    isAuthorsError: isAuthorsError,
    isAuthorsFetching: isAuthorsFetching,
    error: authorsError,
  };
};
