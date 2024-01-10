import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import httpService from "../../services/http-service";
import { useAuth } from "../Auth/AuthContext";
import fakeDbService from "../../services/fakeDatabase/fake-database-service";

interface Album {
  id: number;
  title: string;
}

interface AddPhotoComponentProps {
  open: boolean;
  onClose: () => void;
}

const AddPhotoComponent: React.FC<AddPhotoComponentProps> = ({
  open,
  onClose,
}) => {
  const { userData } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [photoTitle, setPhotoTitle] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageThumbnailUrl, setImageThumbnailUrl] = useState<string>("");
  const [isImageValid, setIsImageValid] = useState<boolean>(false);
  const [isImageThumbnailValid, setIsImageThumbnailValid] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await httpService.get(
          `/albums?userId=${userData().id}`
        );
        setAlbums(response.data);
      } catch (error) {
        console.error("Error fetching albums", error);
      }
    };

    fetchAlbums();
  }, [userData]);

  const checkIfImage = (url: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => reject(false);
      img.src = url;
    });
  };

  const handleAlbumChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: Album | null
  ) => {
    setSelectedAlbum(value);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoTitle(event.target.value);
  };

  const handleImageUrlChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const url = event.target.value;
    setImageUrl(url);

    try {
      await checkIfImage(url);
      setIsImageValid(true);
    } catch {
      setIsImageValid(false);
    }
  };

  const handleThumbnailUrlUrlChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const url = event.target.value;
    setImageThumbnailUrl(url);

    try {
      await checkIfImage(url);
      setIsImageThumbnailValid(true);
    } catch {
      setIsImageThumbnailValid(false);
    }
  };

  const handleAddPhoto = async () => {
    try {
      if (
        selectedAlbum?.id &&
        photoTitle.trim() &&
        isImageThumbnailValid &&
        isImageValid
      ) {
        const photo = {
          albumId: selectedAlbum?.id,
          title: photoTitle,
          url: imageUrl,
          thumbnailUrl: imageThumbnailUrl,
        };
        await fakeDbService.post("photos", photo);
        onClose();
      }
    } catch (error) {
      console.error("Error adding photo", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Add Photo
        </Typography>
        <Autocomplete
          options={albums}
          getOptionLabel={(option) => option.title}
          value={selectedAlbum}
          onChange={handleAlbumChange}
          renderInput={(params) => (
            <TextField {...params} label="Select Album" variant="outlined" />
          )}
        />
        <TextField
          label="Photo Title"
          variant="outlined"
          fullWidth
          value={photoTitle}
          onChange={handleTitleChange}
          style={{ marginTop: "16px" }}
        />
        <TextField
          label="Image URL"
          variant="outlined"
          fullWidth
          value={imageUrl}
          onChange={handleImageUrlChange}
          style={{ marginTop: "16px" }}
        />

        <TextField
          label="Image thumbnail URL"
          variant="outlined"
          fullWidth
          value={imageThumbnailUrl}
          onChange={handleThumbnailUrlUrlChange}
          style={{ marginTop: "16px" }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPhoto}
          style={{ marginTop: "16px" }}
        >
          Add Photo
        </Button>
        <div>
          {isImageValid && (
            <img
              src={imageUrl}
              alt="Uploaded"
              style={{ marginTop: "16px", maxWidth: "100%" }}
            />
          )}
          {isImageThumbnailValid && (
            <img
              src={imageThumbnailUrl}
              alt="Uploaded"
              style={{
                marginTop: "16px",
                maxWidth: "100%",
                marginLeft: "20px",
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPhotoComponent;
