import React, { useState, useEffect } from "react";
import {
  Grid,
  Pagination,
  Paper,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  Button,
} from "@mui/material";
import httpService from "../../services/http-service";
import { SelectChangeEvent } from "@mui/material";

interface Image {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const ImagesComponent: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await httpService.get("/users");
        const imagesResponse = await httpService.get(`/photos`);
        setUsers(response.data);
        setImages(imagesResponse.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);

  const fetchAlbums = async () => {
    try {
      if (selectedUser) {
        const response = await httpService.get(
          `/albums?userId=${selectedUser}`
        );
        const albumIds = response.data.map((album: any) => album.id);

        const fetchImagePromises = albumIds.map(async (albumId: any) => {
          const imagesResponse = await httpService.get(
            `/photos?albumId=${albumId}`
          );
          return imagesResponse.data;
        });

        const images = (await Promise.all(fetchImagePromises)).flatMap(
          (imagesArray) => imagesArray
        );

        setImages(images);
      } else {
        const imagesResponse = await httpService.get(`/photos`);
        setImages(imagesResponse.data);
      }
    } catch (error) {
      console.error("Error fetching images", error);
    }
  };

  const handleUserChange = (event: SelectChangeEvent<string>) => {
    const selectedUserId = event.target.value;
    setSelectedUser(selectedUserId);
  };

  const handleFetchImages = () => {
    fetchAlbums();
    setPage(1);
  };

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="img-container">
      <div className="margin-20">
        <div>Select user</div>
        <Select
          className="width-300"
          value={selectedUser}
          onChange={handleUserChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </div>
      <Button variant="contained" onClick={handleFetchImages}>
        Filter Images
      </Button>
      <Grid container spacing={2} className="img-box">
        {images
          .slice((page - 1) * itemsPerPage, page * itemsPerPage)
          .map((image) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
              <Paper
                onClick={() => handleImageClick(image)}
                className="img-item"
              >
                <img src={image.thumbnailUrl} alt={image.title} />
                <p>{image.title}</p>
              </Paper>
            </Grid>
          ))}
      </Grid>
      <Pagination
        count={Math.ceil(images.length / itemsPerPage)}
        page={page}
        onChange={(event, value) => setPage(value)}
      />
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogContent>
          {selectedImage && (
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              style={{ width: "100%", height: "auto" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImagesComponent;
