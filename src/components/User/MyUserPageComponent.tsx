import { useState } from "react";
import PhotosPageComponent from "../Photos/PhotosPageComponent";
import PostsComponent from "../Posts/PostsComponent";
import UserDataComponent from "./UserDataComponent";
import { Button } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import usersService, { User } from "../../services/users/users-service";
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const MyUserPageComponent = () => {
  const [showPhotos, setShowPhotos] = useState(false);
  const [showUserData, setShowUserData] = useState(false);
  const [showPosts, setShowPosts] = useState(false);
  const [user, setUser] = useState<User>();
  const query = useQuery();

  useEffect(() => {
    const userId = query?.get("userId");
    const fetchData = async () => {
      const fetchedUser = await usersService.getUserById(userId);
      if (fetchedUser) {
        setUser(fetchedUser);
      }
    };
    fetchData();
  }, []);

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
      {showPosts && <PostsComponent userIds={user?.id ? [user.id] : []} />}
    </div>
  );
};

export default MyUserPageComponent;
