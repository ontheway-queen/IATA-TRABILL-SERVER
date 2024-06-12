export type FilesType = {
  [fieldname: string]: Express.Multer.File[];
};

export type TSubFolder = 'passports' | 'logos' | 'file';
