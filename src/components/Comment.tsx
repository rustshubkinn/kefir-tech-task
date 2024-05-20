import React from 'react';
import { IAuthor, IComment } from 'src/types';
import { Likes } from './Likes';
import styled from 'styled-components';
import { formatCommentCreateDate } from 'src/helpers/formatCommentCreateDate';

const Wrapper = styled.div<{ $nestedLevel: number }>`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    ${(props) =>
      props.$nestedLevel > 0 && `margin-left: ${20 / props.$nestedLevel}px`}
  }

  @media (min-width: 768px) {
    ${(props) =>
      props.$nestedLevel > 0 && `margin-left: ${24 / props.$nestedLevel}px`}
  }

  @media (min-width: 1080px) {
    ${(props) =>
      props.$nestedLevel > 0 && `margin-left: ${28 / props.$nestedLevel}px`}
  }

  @media (min-width: 1280px) {
    ${(props) =>
      props.$nestedLevel > 0 && `margin-left: ${34 / props.$nestedLevel}px`}
  }
`;

const Card = styled.div`
  display: flex;
  margin-bottom: 4vh;
  color: #fff;
  font-size: 14px;
`;

const Body = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.2rem 0;

  @media (min-width: 768px) {
    margin: 0.4rem 0;
  }

  @media (min-width: 1080px) {
    margin: 0.6rem 0;
  }

  @media (min-width: 1280px) {
    margin: 1rem 0;
  }
`;

const Info = styled.div`
  font-weight: 600;
  display: flex;
  flex-direction: column;
`;

const InfoDate = styled.p`
  font-weight: 400;
  margin: 0;
  margin-top: 3px;
  color: #8297ab;

  @media (min-width: 768px) {
    margin-top: 6px;
  }
`;

const AuthorAvatar = styled.img`
  width: 100%;
  max-width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;

  @media (min-width: 768px) {
    max-width: 48px;
    height: 48px;
  }

  @media (min-width: 1080px) {
    max-width: 56px;
    height: 56px;
  }

  @media (min-width: 1280px) {
    max-width: 68px;
    height: 68px;
  }
`;

const Text = styled.p`
  margin: 0;
  margin-top: 5px;
  max-width: 70vw;
  overflow: scroll;
  scrollbar-width: none;

  @media (min-width: 768px) {
    white-space: normal;
  }
`;

interface CommentProps {
  comment: IComment;
  authors: Map<number, IAuthor>;
}

const Comment: React.FC<CommentProps> = ({ comment, authors }) => {
  const author = authors.get(comment.author);
  if (!author) return null;

  return (
    <Wrapper $nestedLevel={comment.nestingLevel || 0}>
      <Card>
        <AuthorAvatar src={author.avatar} />
        <Body>
          <Header>
            <Info>
              {author.name}
              <InfoDate>{formatCommentCreateDate(comment.created)}</InfoDate>
            </Info>
            <Likes
              commentId={comment.id}
              likesCount={comment.likes}
              disabled={false}
            />
          </Header>

          <Text>{comment.text}</Text>
        </Body>
      </Card>
      {comment.replies &&
        comment.replies.length > 0 &&
        comment.replies.map((commentChild) => (
          <Comment
            comment={commentChild}
            key={commentChild.id}
            authors={authors}
          />
        ))}
    </Wrapper>
  );
};

export default Comment;
