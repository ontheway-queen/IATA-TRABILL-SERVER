import { NextFunction, Request, Response } from 'express';
import Azure from '../common/middlewares/azure/azureUploader';

const allowed_file_types = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
];

abstract class AbstractUploader {
  protected allowed_file_types: string[];
  protected error_message: string;
  protected azure: Azure;

  constructor() {
    this.allowed_file_types = allowed_file_types;
    this.error_message = 'Only .jpg, .jpeg, .webp or .png format allowed!';
    this.azure = new Azure();
  }

  abstract rawUpload(
    folder: string
  ): (req: Request, res: Response, next: NextFunction) => void;
}

export default AbstractUploader;
