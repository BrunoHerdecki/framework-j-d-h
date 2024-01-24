import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import photosService from "../../services/images/photos-service";
import { Photo } from "../../services/images/photos-service";
import { Paper } from "@mui/material";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const PhotoComponent: React.FC = () => {
  const [photo, setPhoto] = useState<Photo>();
  const query = useQuery();
  const photoId = query.get("photoId");

  useEffect(() => {
    const fetchPhoto = async () => {
      if (photoId) {
        try {
          const response = await photosService.getPhotoById(photoId);
          setPhoto(response);
        } catch (error) {
          console.error("Error fetching photo", error);
        }
      }
    };

    fetchPhoto();
  }, [photoId]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {photo ? (
        <Paper style={{ textAlign: "center" }}>
          <div>
            <img
              src={photo.url}
              alt={photo.title}
              style={{ maxWidth: "100%", maxHeight: "80vh" }}
            />
          </div>
          <div style={{ fontWeight: "bold" }}>{photo.title}</div>
        </Paper>
      ) : (
        <p>Loading photo...</p>
      )}
    </div>
  );
};

export default PhotoComponent;
