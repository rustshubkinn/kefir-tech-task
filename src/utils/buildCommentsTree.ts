import { IComment } from 'src/types';

export const buildCommentsTree = (comments: IComment[]): IComment[] => {
  const commentsById: { [id: number]: IComment } = {};

  comments.forEach((comment) => {
    commentsById[comment.id] = { ...comment, replies: [] };
  });

  Object.values(commentsById).forEach((comment) => {
    if (comment.parent !== null && commentsById[comment.parent]) {
      commentsById[comment.parent].replies!.push(comment);
      comment.nestingLevel = commentsById[comment.parent].nestingLevel! + 1;
    }
  });

  return Object.values(commentsById).filter(
    (comment) => comment.parent === null
  );
};
