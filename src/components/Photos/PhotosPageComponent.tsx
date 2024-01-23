import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Grid, Paper } from "@mui/material";
import imageService from "../../services/images/images-service";
import albumService from "../../services/albums/album-service";
import { WidthFull } from "@mui/icons-material";

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
  const [displayedPhotoCount, setDisplayedPhotoCount] = useState(10);

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
  }, [query]);

  const handleRemove = (image: Image) => {
    imageService.removePhoto(image.id);
    const filteredImages = photos.filter((x) => x.id !== image.id);
    setPhotos(filteredImages);
  };

  const currentPhotos = photos.slice(0, displayedPhotoCount);

  return (
    <Grid container spacing={2}>
      {currentPhotos.map((photo) => (
        <Grid item xs={12} key={photo.id}>
          <Paper elevation={3} style={{ marginBottom: "16px" }}>
            <img
              src={photo.url}
              alt={photo.title}
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
            <p style={{ textAlign: "center" }}>{photo.title}</p>
            <div>
              {photo.fakeDb ? (
                <Button
                  style={{ width: "100%" }}
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
      {photos.length > displayedPhotoCount && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setDisplayedPhotoCount(displayedPhotoCount + 10)}
          style={{ width: "100%" }}
        >
          Show More
        </Button>
      )}
    </Grid>
  );
};

export default PhotosPageComponent;
