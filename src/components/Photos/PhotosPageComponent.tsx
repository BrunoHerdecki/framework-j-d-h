import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Grid, Paper } from "@mui/material";
import imageService from "../../services/images/images-service";
import albumService from "../../services/albums/album-service";

interface Image {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  fakeDb: boolean;
}
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const PhotosPageComponent = () => {
  const query = useQuery();
  const [photos, setPhotos] = useState<Image[]>([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const queryIds = query.getAll("albumIds").map(Number);
      const ids =
        queryIds?.length < 1
          ? await albumService.getLoggedUserAlbumIds()
          : queryIds;
      try {
        const response = await imageService.getPhotosByAlbumIds(ids);
        setPhotos(response);
      } catch (error) {
        console.error("Error fetching photos", error);
      }
    };

    fetchPhotos();
  });
  const handleRemove = (image: Image) => {
    imageService.removePhoto(image.id);
    const filteredImages = photos.filter((x) => x.id !== image.id);
    setPhotos(filteredImages);
  };

  return (
    <Grid container spacing={2}>
      {photos.map((photo) => (
        <Grid item xs={12} key={photo.id}>
          {" "}
          {/* Full width for each photo */}
          <Paper elevation={3} style={{ marginBottom: "16px" }}>
            {" "}
            {/* Add some margin for better spacing */}
            <img
              src={photo.url}
              alt={photo.title}
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
            <p style={{ textAlign: "center" }}>{photo.title}</p>{" "}
            <div>
              {photo.fakeDb ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleRemove(photo)}
                >
                  Remove
                </Button>
              ) : null}
            </div>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default PhotosPageComponent;
