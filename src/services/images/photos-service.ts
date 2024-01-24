import httpService from "../http-service";
import fakeDbService from "../fakeDatabase/fake-database-service";

export interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  fakeDb: boolean;
  removable: boolean;
}

export interface Album {
  userId: number;
  id: number;
  title: string;
}

class PhotosService {
  async getPhotos(): Promise<Photo[]> {
    const dbResponse = await httpService.get(`/photos`);
    const localResponse: Photo[] = await fakeDbService.get(`photos`);

    let result: Photo[] = dbResponse.data;
    if (Array.isArray(localResponse)) {
      result = result.concat(localResponse);
    }
    await this.setIsPhotoRemovable(result);
    return result;
  }

  async getPhotoById(photoId: string): Promise<Photo> {
    const dbResponse = await httpService.get(`/photos?id=${photoId}`);
    const localResponse: Photo = await fakeDbService.get(`photos`, photoId);

    return dbResponse.data[0] ?? localResponse;
  }

  async getPhotosByAlbumIds(albumIds: number[]): Promise<Photo[]> {
    const fetchImagePromises = albumIds.map(async (albumId) => {
      const imagesResponse = await httpService.get(
        `/photos?albumId=${albumId}`
      );
      return imagesResponse.data;
    });

    let result: Photo[] = (await Promise.all(fetchImagePromises)).flatMap(
      (imagesArray) => imagesArray
    );

    const localResponse: Photo[] = await fakeDbService.get(`photos`);

    if (Array.isArray(localResponse)) {
      result = result.concat(
        localResponse.filter((item) => albumIds.includes(item.albumId))
      );
    }
    await this.setIsPhotoRemovable(result);

    return result;
  }

  async getLoggedInUserPhotos(): Promise<Photo[]> {
    const albumIds: number[] = await this.getLoggedUserAlbumIds();
    const photos: Photo[] = await this.getPhotosByAlbumIds(albumIds);
    return photos;
  }

  removePhoto(photoId: number): void {
    fakeDbService.delete(`photos`, photoId);
  }

  async setIsPhotoRemovable(photos: Photo[]): Promise<void> {
    const albumIds: number[] = await this.getLoggedUserAlbumIds();
    photos.map((photo) => ({
      ...photo,
      removable: photo.removable && albumIds.includes(photo.albumId),
    }));
  }

  async getLoggedUserAlbumIds(): Promise<number[]> {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const albumsResponse = await httpService.get(`/albums?userId=${user.id}`);
    const albumIds: number[] = albumsResponse.data.map(
      (album: Album) => album.id
    );
    return albumIds;
  }

  async getUserAlbumIds(userId: string): Promise<number[]> {
    const albumsResponse = await httpService.get(`/albums?userId=${userId}`);
    const albumIds: number[] = albumsResponse.data.map(
      (album: Album) => album.id
    );
    return albumIds;
  }

  async getAlbums(): Promise<Album[]> {
    const dbResponse = await httpService.get(`/albums`);
    const localResponse: Album[] = (await fakeDbService.get(`albums`)) ?? [];

    let result: Album[] = dbResponse.data;
    result = result.concat(localResponse);

    return result;
  }
}

const photosService = new PhotosService();

export default photosService;
