import { useMemo } from 'react';
import styled from 'styled-components';

const LoadMoreButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const LoadMoreButtonStyled = styled.button`
  width: 234px;
  height: 36px;
  color: #fff;
  background: #313439;
  border-radius: 4px;
  border: none;
  text-align: center;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

interface LoadMoreButtonProps {
  loadMore: () => void;
  isError: boolean;
  isLoading: boolean;
  isLastPage: boolean;
}

export const LoadMoreButton = ({
  loadMore,
  isError,
  isLoading,
  isLastPage,
}: LoadMoreButtonProps) => {
  const isDisabled = isLoading || isLastPage;

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

  return (
    <LoadMoreButtonWrapper>
      <LoadMoreButtonStyled
        type="button"
        onClick={loadMore}
        disabled={isDisabled}
      >
        {renderButtonText}
      </LoadMoreButtonStyled>
    </LoadMoreButtonWrapper>
  );
};
