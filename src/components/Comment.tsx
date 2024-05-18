import React from 'react';
import LikeButton from './LikeButton';
import { IComment } from 'src/types';

interface CommentProps {
  comment: IComment;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <div>
      <p>{comment.text}</p>
      <LikeButton commentId={comment.id} />
      {comment.replies &&
        comment.replies.map((reply) => (
          <Comment key={reply.id} comment={reply} />
        ))}
    </div>
  );
};

export default Comment;
