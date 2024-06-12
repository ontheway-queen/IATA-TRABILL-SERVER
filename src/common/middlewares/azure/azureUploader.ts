import { NextFunction, Request, Response } from 'express';
import path from 'path';
import config from '../../../config/config';
import FuncWrapper from '../../utils/assyncWrapper/funcWrapper';
import { FilesType, TSubFolder } from '../types/MWTypes';
const { BlobServiceClient } = require('@azure/storage-blob');

class Azure {
  private funcWrapper: FuncWrapper;

  constructor() {
    this.funcWrapper = new FuncWrapper();
  }

  public imageUpload(subfolder_path: TSubFolder) {
    const containerName = 'trabillcontainer';

    return this.funcWrapper.wrap(
      async (req: Request, res: Response, next: NextFunction) => {
        const files = req.files as FilesType;

        const keys = Object.keys(files);

        const fileFields: { [key: string]: string } = {};

        const blobServiceClient = BlobServiceClient.fromConnectionString(
          config.AZURE_STORAGE_CONNECTION_STRING
        );

        const containerClient =
          blobServiceClient.getContainerClient(containerName);

        for await (const key of keys) {
          const file = files[key][0];

          const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

          const fullPathName = `images/${subfolder_path}/${uniqueName}`;

          const blockBlobClient =
            containerClient.getBlockBlobClient(fullPathName);

          await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: { blobContentType: file.mimetype },
          });

          const imageUrl = blockBlobClient.url;

          fileFields[key] = imageUrl;
        }

        req.image_files = fileFields;

        next();
      }
    );
  }
}

export default Azure;
