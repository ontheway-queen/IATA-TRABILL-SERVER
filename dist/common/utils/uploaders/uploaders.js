"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// class Uploader {
//   private allowed_file_types: string[];
//   private error_message: string;
//   constructor(allowed_file_types: string[], error_message: string) {
//     this.allowed_file_types = allowed_file_types;
//     this.error_message = error_message;
//   }
//   /**
//    * memmoryStorage
//    */
//   public memmoryStorage() {
//     const storage = multer.memoryStorage();
//     const upload = multer({
//       storage: storage,
//       fileFilter: (req, file, cb) => {
//         if (this.allowed_file_types.includes(file.mimetype)) {
//           cb(null, true);
//         } else {
//           cb(new Error(this.error_message));
//         }
//       },
//     });
//     return upload;
//   }
//   // RAW IMAGE UPLOADER
//   public rawUpload(subfolder_path: string) {
//     const uploadsFolder = `${__dirname}/../../../uploads/${subfolder_path}`;
//     const storage = multer.diskStorage({
//       destination: (_req, _file, cb) => {
//         cb(null, uploadsFolder);
//       },
//       filename: (req, file, cb) => {
//         const uniqueName =
//           Date.now() +
//           '-' +
//           Math.round(Math.random() * 1e9) +
//           path.extname(file.originalname);
//         if (req.upFiles && req.upFiles.length) {
//           req.upFiles.push(uniqueName);
//         } else {
//           req.upFiles = [uniqueName];
//         }
//         cb(null, uniqueName);
//       },
//     });
//     // preapre the final multer upload object
//     const upload = multer({
//       storage: storage,
//       fileFilter: (_req, file, cb) => {
//         if (this.allowed_file_types.includes(file.mimetype)) {
//           cb(null, true);
//         } else {
//           cb(new Error(this.error_message));
//         }
//       },
//     });
//     return upload;
//   }
// }
exports.default = Uploader;
//# sourceMappingURL=uploaders.js.map