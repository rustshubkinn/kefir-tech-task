import React, { useState, useEffect, useMemo } from 'react';
import { buildCommentsTree } from '../utils/buildCommentsTree';
import Comment from './Comment';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import getCommentsRequest from 'src/api/comments/getCommentsRequest';
import { IComment, ICommentsResponse } from 'src/types';
import { useComments } from 'src/context/CommentsContext';

const CommentsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const { state, dispatch } = useComments();
  const [comments, setComments] = useState<IComment[]>([]);
  const {
    data: response,
    error,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery<ICommentsResponse, Error>({
    queryKey: ['comments', page],
    queryFn: () => getCommentsRequest(page),
    placeholderData: keepPreviousData,
  });
  const commentsTree = useMemo(() => buildCommentsTree(comments), [comments]);
  const isLastPage = page === response?.pagination.total_pages;

  const renderButtonText = useMemo(() => {
    if (isError) {
      return 'Попробовать еще раз';
    }

    if (isLoading) {
      return 'Загрузка комментариев...';
    } else if (isLastPage) {
      return 'Комментариев больше нет';
    } else {
      return 'Загрузить еще';
    }
  }, [isError, isLastPage, isLoading]);

  useEffect(() => {
    if (page > 1) {
      refetch();
    }
  }, [page, refetch]);

  useEffect(() => {
    if (response) {
      const newTotalLikes = response.data.reduce(
        (totalLikes, comment) => totalLikes + comment.likes,
        0
      );
      dispatch({
        type: 'UPDATE_TOTAL_LIKES',
        payload: { totalLikes: newTotalLikes },
      });
      setComments((prevComments) => [...prevComments, ...response.data]);
    }
  }, [response, dispatch]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (isLoading && !comments.length) return <div>Loading...</div>;

  if (isError) return <div>Error loading comments: {error.message}</div>;

  return (
    <div>
      <div>Total Likes: {state.totalLikes}</div>
      {commentsTree.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
      <button onClick={loadMore} disabled={isFetching || isLastPage}>
        {renderButtonText}
      </button>
    </div>
  );
};

export default CommentsList;
