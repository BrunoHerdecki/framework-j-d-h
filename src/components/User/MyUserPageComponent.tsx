import { useState } from "react";
import PhotosPageComponent from "../Photos/PhotosPageComponent";
import PostsComponent from "../Posts/PostsComponent";
import UserDataComponent from "./UserDataComponent";
import { Button } from "@mui/material";

const MyUserPageComponent = () => {
  const [showPhotos, setShowPhotos] = useState(false);
  const [showUserData, setShowUserData] = useState(false);
  const [showPosts, setShowPosts] = useState(false);

  const togglePhotos = () => {
    setShowPhotos(!showPhotos);
  };

  const toggleUserData = () => {
    setShowUserData(!showUserData);
  };

  const togglePosts = () => {
    setShowPosts(!showPosts);
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={toggleUserData}
        style={{ width: "100%", marginTop: "40px" }}
      >
        {showUserData ? "Hide User Data" : "Display User Data"}
      </Button>
      {showUserData && <UserDataComponent />}

      <Button
        variant="contained"
        onClick={togglePhotos}
        style={{ width: "100%", marginTop: "40px" }}
      >
        {showPhotos ? "Hide Photos" : "Display Photos"}
      </Button>
      {showPhotos && <PhotosPageComponent />}

      <Button
        variant="contained"
        onClick={togglePosts}
        style={{ width: "100%", marginTop: "40px" }}
      >
        {showPosts ? "Hide Posts" : "Display Posts"}
      </Button>
      {showPosts && <PostsComponent userIds={[]} />}
    </div>
  );
};

export default MyUserPageComponent;
