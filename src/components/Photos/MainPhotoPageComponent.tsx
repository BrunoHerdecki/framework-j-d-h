import React, { useState } from "react";
import ImagesComponent from "./ImagesComponent";
import AlbumsComponent from "./AlbumsComponent";
import { Button, Dialog, DialogContent } from "@mui/material";
import AddPhotoComponent from "./AddPhotoComponent";
import SearchComponent from "../Header/SearchBarComponent";

const MainComponent: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addImage = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
          marginBottom: "30px",
        }}
      >
        <SearchComponent />
      </div>
      <div className="margin-20">
        <Button variant="contained" onClick={addImage}>
          Add Image
        </Button>
      </div>

      <h1 className="title">Images</h1>
      <ImagesComponent />
      <h1 className="title">Albums</h1>
      <AlbumsComponent />

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogContent>
          <AddPhotoComponent
            open={isDialogOpen}
            onClose={handleCloseDialog}
          ></AddPhotoComponent>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainComponent;
