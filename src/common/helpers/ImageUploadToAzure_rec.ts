import { BlobServiceClient } from '@azure/storage-blob';
import { NextFunction, Request, Response } from 'express';
import config from '../../config/config';

const containerName = 'recruitmentcon';

const blobServiceClient = BlobServiceClient.fromConnectionString(
  config.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(containerName);

export const uploadImageToAzure_rec = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.files) {
    return res.status(400).send('No image uploaded');
  }

  const images = req.files as any;

  const imageURLlist: any[] = [];

  for (const key in images) {
    if (Object.prototype.hasOwnProperty.call(images, key)) {
      const element = images[key];

      const image = element[0];

      const currentDateTime = Date.now();
      const uniqueName = 'images/' + currentDateTime + image.originalname;
      const blockBlobClient = containerClient.getBlockBlobClient(uniqueName);

      await blockBlobClient.upload(image.buffer, image.buffer.length);

      const imageUrl = `https://trabillteststorage.blob.core.windows.net/${containerName}/${uniqueName}`;

      const myObject: { [key: string]: any } = {};
      myObject[key] = imageUrl;

      imageURLlist.push(myObject);
    }
  }

  req.imgUrl = imageURLlist;

  next();
};
