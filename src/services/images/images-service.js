import httpService from "../http-service";
import fakeDbService from "../fakeDatabase/fake-database-service";
import albumService from "../albums/album-service";

class ImageService {
  async getPhotos() {
    const dbResponse = await httpService.get(`/photos`);
    const localResponse = await fakeDbService.get(`photos`);

    let result = dbResponse.data;
    if (Array.isArray(localResponse)) {
      result = result.concat(localResponse);
    }
    await this.setIsPhotoRemovable(result);
    return result;
  }

  async getPhotosByAlbumIds(albumIds) {
    const fetchImagePromises = albumIds.map(async (albumId) => {
      const imagesResponse = await httpService.get(
        `/photos?albumId=${albumId}`
      );
      return imagesResponse.data;
    });

    let result = (await Promise.all(fetchImagePromises)).flatMap(
      (imagesArray) => imagesArray
    );

    const localResponse = await fakeDbService.get(`photos`);

    if (Array.isArray(localResponse)) {
      result = result.concat(
        localResponse.filter((item) => albumIds.includes(item.albumId))
      );
    }
    await this.setIsPhotoRemovable(result);

    return result;
  }

  async getLoggedInUserPhotos() {
    const albumIds = await albumService.getLoggedUserAlbumIds();
    const photos = await this.getPhotosByAlbumIds(albumIds);
    return photos;
  }

  removePhoto(photoId) {
    fakeDbService.delete(`photos`, photoId);
  }

  async setIsPhotoRemovable(photos) {
    const albumIds = await albumService.getLoggedUserAlbumIds();
    photos.map((photo) => ({
      ...photo,
      removable: photo.fakeDb && albumIds.includes(photo.albumId),
    }));
  }
}

const imageService = new ImageService();

export default imageService;
