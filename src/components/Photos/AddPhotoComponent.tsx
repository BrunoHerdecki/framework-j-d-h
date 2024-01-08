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

  const handleAlbumChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: Album | null
  ) => {
    setSelectedAlbum(value);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoTitle(event.target.value);
  };

  const handleAddPhoto = async () => {
    try {
      const xd = await httpService.post("/photos", {
        albumId: selectedAlbum?.id,
        title: photoTitle,
        url: "https://via.placeholder.com/600/392537",
        thumbnailUrl: "https://via.placeholder.com/150/392537",
      });
      console.log(xd);
      onClose();
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPhoto}
          style={{ marginTop: "16px" }}
        >
          Add Photo
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddPhotoComponent;
