export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  removable?: boolean;
  comments: Comment[];
  email: string;
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
  removable?: boolean;
}
