import React, { useMemo } from 'react';
import Comment from './Comment';
import styled from 'styled-components';
import { Likes } from './Likes';
import { useComments } from 'src/hooks/useComments';
import { Loader } from './Loader';
import { useAuthors } from 'src/hooks/useAuthors';

const CommentsListSection = styled.section`
  padding: 2rem 0;
  margin: 0 auto;
  width: 90vw;

  @media (min-width: 620px) {
    padding: 3rem;
    width: 75vw;
  }

  @media (min-width: 968px) {
    padding: 3rem;
    width: 55vw;
  }
`;

const CommentSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #767676;

  p {
    margin: 0;
    font-weight: 600;
  }
`;

const ErrorMessage = styled.p`
  min-height: 16px;
  margin: 0;
  font-weight: 600;
  text-align: center;
  color: #d44f4f;
`;

const LoadMoreButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const LoadMoreButton = styled.button`
  width: 234px;
  height: 36px;
  color: #fff;
  background: #313439;
  border-radius: 4px;
  border: none;
  text-align: center;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const CommentsList: React.FC = () => {
  const {
    authors,
    isAuthorsLoading,
    isAuthorsFetching,
    isAuthorsError,
    error: authorsError,
  } = useAuthors();
  const {
    comments,
    isCommentsLoading,
    isCommentsError,
    isCommentsFetching,
    error: commentsError,
    loadMore,
    page,
    response,
    totalLikes,
  } = useComments();

  const isError = isCommentsError || isAuthorsError;
  const isFetching = isCommentsFetching || isAuthorsFetching;
  const isLoading = isCommentsLoading || isAuthorsLoading;
  const errorMessage = commentsError?.message || authorsError?.message;

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

  return isLoading ? (
    <Loader />
  ) : (
    <CommentsListSection>
      <CommentSectionHeader>
        {comments.length === 0 ? (
          'Комментариев нет'
        ) : (
          <p>{comments.length} комментариев</p>
        )}
        <Likes likesCount={totalLikes} disabled />
      </CommentSectionHeader>
      {isLoading && <div>Загружаем комментарии...</div>}
      {comments &&
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} authors={authors} />
        ))}
      {isError && (
        <ErrorMessage>
          Произошла ошибка: {errorMessage || 'Unknown error'}
        </ErrorMessage>
      )}

      <LoadMoreButtonWrapper>
        <LoadMoreButton onClick={loadMore} disabled={isFetching || isLastPage}>
          {renderButtonText}
        </LoadMoreButton>
      </LoadMoreButtonWrapper>
    </CommentsListSection>
  );
};

export default CommentsList;
