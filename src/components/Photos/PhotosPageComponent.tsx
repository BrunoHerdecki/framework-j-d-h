import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Grid, Paper } from "@mui/material";
import photosService, { Photo } from "../../services/images/photos-service";
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const PhotosPageComponent = () => {
  const query = useQuery();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [displayedPhotoCount, setDisplayedPhotoCount] = useState(10);

  useEffect(() => {
    const fetchPhotos = async () => {
      const userId = query?.get("userId");

      const queryIds = userId
        ? await photosService.getUserAlbumIds(userId)
        : query.getAll("albumIds").map(Number);
      const ids =
        queryIds?.length < 1
          ? await photosService.getLoggedUserAlbumIds()
          : queryIds;
      try {
        const response = await photosService.getPhotosByAlbumIds(ids);
        setPhotos(response);
      } catch (error) {
        console.error("Error fetching photos", error);
      }
    };

    fetchPhotos();
  }, [query]);

  const handleRemove = (Photo: Photo) => {
    photosService.removePhoto(Photo.id);
    const filteredPhotos = photos.filter((x) => x.id !== Photo.id);
    setPhotos(filteredPhotos);
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
