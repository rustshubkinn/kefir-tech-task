import { IComment } from 'src/types';

export const buildCommentsTree = (comments: IComment[]): IComment[] => {
  const commentsById: Map<number, IComment> = new Map();

  comments.forEach((comment) => {
    commentsById.set(comment.id, { ...comment, replies: [], nestingLevel: 0 });
  });

  Array.from(commentsById.values()).forEach((comment) => {
    const parent = commentsById.get(comment.parent!);
    if (comment.parent !== null && parent) {
      parent.replies!.push(comment);
      comment.nestingLevel = parent.nestingLevel! + 1;

      parent.replies!.sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
      );
    }
  });

  const rootComments = Array.from(commentsById.values()).filter(
    (comment) => comment.parent === null
  );

  rootComments.sort(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
  );

  return rootComments;
};
