import httpService from "../http-service";
import fakeDbService from "../fakeDatabase/fake-database-service";
import usersService, { User } from "../users/users-service";

class PostsService {
  async getPosts(userIds: number[]): Promise<Post[]> {
    let result: Post[] = [];

    for (const userId of userIds) {
      const dbResponse = await httpService.get(`/posts?userId=${userId}`);
      const localResponse: Post[] = await fakeDbService.get(`posts`);

      let userPosts: Post[] = dbResponse.data;
      if (Array.isArray(localResponse)) {
        const localUserPosts = localResponse.filter((x) => x.userId === userId);
        this.setIsPostRemovable(localUserPosts);
        userPosts = userPosts.concat(localUserPosts);
      }
      result = result.concat(userPosts);
    }

    return result;
  }

  removePost(postId: Number) {}

  async addComment(
    postId: number,
    body: string,
    name: string
  ): Promise<Comment> {
    const user: User = usersService.getLoggedinUser();

    const dbResponse = await httpService.get(`/comments`);
    const localResponse: Comment[] =
      (await fakeDbService.get(`comments`)) ?? [];
    const allComments = dbResponse.data.concat(localResponse);

    const maxId: number = allComments.reduce(
      (max: number, obj: Comment) => (obj.id > max ? obj.id : max),
      allComments[0].id
    );

    const comment: Comment = {
      postId: postId,
      id: maxId + 1,
      name: name,
      email: user.email,
      body: body,
    };

    fakeDbService.post(`comments`, comment);
    comment.removable = true;
    return comment;
  }

  async setIsPostRemovable(posts: Post[]): Promise<void> {
    posts.map((post) => ({
      ...post,
      removable: true,
    }));
  }

  async getComments(postId: number): Promise<Comment[]> {
    const dbResponse = await httpService.get(`/comments?postId=${postId}`);
    const localResponse: Comment[] =
      (await fakeDbService.get(`comments`)) ?? [];

    let result: Comment[] = dbResponse.data;
    const localUserComments = localResponse.filter((x) => x.postId === postId);
    const mappedLocalComments = this.setIsCommentRemovable(localUserComments);
    result = result.concat(mappedLocalComments);

    return result;
  }

  removeComment(commentId: Number) {
    fakeDbService.delete(`comments`, commentId);
  }

  setIsCommentRemovable(comments: Comment[]): Comment[] {
    const user: User = usersService.getLoggedinUser();
    return comments.map((comment) => ({
      ...comment,
      removable: comment.email === user.email,
    }));
  }
}

const postsService = new PostsService();

export default postsService;

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
