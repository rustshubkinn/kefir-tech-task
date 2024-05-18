export interface IAuthor {
  id: number;
  name: string;
  avatar: string;
}

export type IAuthors = {
  [key: number]: IAuthor;
};

export interface IComment {
  author: number;
  created: string | Date;
  id: number;
  likes: number;
  parent: number | null;
  text: string;
  replies?: IComment[];
  nestingLevel?: number;
}

export interface IPagination {
  page: number;
  size: number;
  total_pages: number;
}

export interface ICommentsResponse {
  data: IComment[];
  pagination: IPagination;
}
