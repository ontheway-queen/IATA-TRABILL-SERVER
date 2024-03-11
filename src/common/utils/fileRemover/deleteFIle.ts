const { BlobServiceClient } = require('@azure/storage-blob');

import fs from 'fs';
import config from '../../../config/config';

class DeleteFile {
  constructor() { }

  public delete_image = async (
    blobUrl: string,
    CustomContainerName: string = 'trabillcontainer'
  ) => {
    if (blobUrl) {
      const urlParts = blobUrl.split('/');
      const blobName = urlParts.slice(4).join('/');

      const containerName = CustomContainerName;
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        config.AZURE_STORAGE_CONNECTION_STRING
      );

      // Get a reference to the container
      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      // Get a reference to the blob
      const blobClient = containerClient.getBlobClient(blobName);

      const blobExists = await blobClient.exists();

      if (blobExists) {
        await blobClient.delete();
      } else {
        console.log({ msg: 'Image not found on storage' });
      }
    } else {
      console.log({ msg: 'Previous image url not exist' });
    }
  };

  public delete = async (dir: string, files: string | string[]) => {
    try {
      if (files && files.length) {
        for (let i = 0; i < files.length; i++) {
          const filename = files[i];
          const path = `${__dirname}/../../../uploads/${dir}/${filename}`;

          await fs.promises.unlink(path);
        }
      } else {
        return;
      }
    } catch (err) {
      console.log({ from: 'deleteFile', err });
    }
  };
}

export default DeleteFile;
