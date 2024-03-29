import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
  Typography,
  TextField,
} from "@mui/material";
import postsService, { Post } from "../../services/posts/posts-service";
import usersService from "../../services/users/users-service";

interface PostsComponentProps {
  userIds: number[];
}

const PostsComponent: React.FC<PostsComponentProps> = ({ userIds }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [displayedPostCount, setDisplayedPostCount] = useState(10);
  const [commentInputs, setCommentInputs] = useState<{
    [key: number]: { name: string; text: string };
  }>({});

  useEffect(() => {
    const fetchPostsAndComments = async () => {
      const fetchedPosts =
        userIds.length > 0
          ? await postsService.getPosts(userIds)
          : await postsService.getAllPosts();

      const postsWithComments = await Promise.all(
        fetchedPosts.map(async (post) => {
          const comments = await postsService.getComments(post.id);
          return { ...post, comments };
        })
      );
      const postsWithCommentsAndEmails = await Promise.all(
        postsWithComments.map(async (post) => {
          const user = await usersService.getUserById(post.userId.toString());
          return { ...post, email: user.email };
        })
      );
      setPosts(postsWithCommentsAndEmails);
    };

    fetchPostsAndComments();
  }, [userIds]);

  const handleRemovePost = async (post: Post) => {
    post.comments.forEach((comment) => {
      postsService.removeComment(comment.id);
    });
    postsService.removePost(post.id);
    setPosts(posts.filter((x) => x.id !== post.id));
  };

  const handleRemoveComment = async (commentId: number, postId: number) => {
    postsService.removeComment(commentId);
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.filter(
                (comment) => comment.id !== commentId
              ),
            }
          : post
      )
    );
  };

  const handleCommentChange = (postId: number, name: string, text: string) => {
    setCommentInputs({
      ...commentInputs,
      [postId]: { ...commentInputs[postId], [name]: text },
    });
  };

  const handleSendComment = async (postId: number) => {
    const comment = await postsService.addComment(
      postId,
      commentInputs[postId].text,
      commentInputs[postId].name
    );
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );
    setCommentInputs({ ...commentInputs, [postId]: { name: "", text: "" } });
  };

  const handleNewPostChange = (name: string, value: string) => {
    setNewPost({ ...newPost, [name]: value });
  };

  const handleAddNewPost = async () => {
    const post = await postsService.addPost(newPost.title, newPost.body);
    setPosts([post, ...posts]);
    setNewPost({ title: "", body: "" });
  };

  const currentPosts = posts.slice(0, displayedPostCount);

  return (
    <div>
      {userIds.length === 0 && (
        <Paper style={{ margin: "10px", padding: "10px" }}>
          <TextField
            label="Post Title"
            variant="outlined"
            fullWidth
            value={newPost.title}
            onChange={(e) => handleNewPostChange("title", e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Post Body"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={newPost.body}
            onChange={(e) => handleNewPostChange("body", e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddNewPost}
          >
            Add Post
          </Button>
        </Paper>
      )}
      <List>
        {currentPosts &&
          currentPosts.map((post) => (
            <Paper
              key={post.id}
              elevation={3}
              style={{ margin: "10px", padding: "10px" }}
            >
              <Typography variant="h4">{post.email}:</Typography>
              <Typography variant="h5">{post.title}</Typography>
              <Typography variant="body1">{post.body}</Typography>
              {post.removable && (
                <Button
                  color="secondary"
                  onClick={() => handleRemovePost(post)}
                >
                  Remove Post
                </Button>
              )}
              <List>
                {post.comments &&
                  post.comments.map((comment) => (
                    <ListItem key={comment.id}>
                      <ListItemText
                        primary={
                          <div>
                            <Typography>{comment.email}:</Typography>
                            <Typography>{comment.name}</Typography>
                          </div>
                        }
                        secondary={comment.body}
                      />
                      {comment.removable && (
                        <Button
                          color="secondary"
                          onClick={() =>
                            handleRemoveComment(comment.id, post.id)
                          }
                        >
                          Remove Comment
                        </Button>
                      )}
                    </ListItem>
                  ))}
              </List>
              <div>
                <TextField
                  label="Comment Name"
                  variant="outlined"
                  fullWidth
                  value={commentInputs[post.id]?.name || ""}
                  onChange={(e) =>
                    handleCommentChange(post.id, "name", e.target.value)
                  }
                  style={{ marginTop: "20px" }}
                />
                <TextField
                  label="Comment Body"
                  variant="outlined"
                  fullWidth
                  value={commentInputs[post.id]?.text || ""}
                  onChange={(e) =>
                    handleCommentChange(post.id, "text", e.target.value)
                  }
                  style={{ marginTop: "10px" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "20px" }}
                  onClick={() => handleSendComment(post.id)}
                >
                  Send
                </Button>
              </div>
            </Paper>
          ))}
      </List>
      {posts.length > displayedPostCount && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setDisplayedPostCount(displayedPostCount + 10)}
          style={{ width: "100%" }}
        >
          Show More
        </Button>
      )}
    </div>
  );
};

export default PostsComponent;
