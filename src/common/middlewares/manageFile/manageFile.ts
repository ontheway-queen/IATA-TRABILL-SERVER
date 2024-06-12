import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import AbstractUploader from '../../../abstracts/abstract.uploader';
import config from '../../../config/config';
import { rootFileFolder } from '../uploader/uploaderConstants';

class ManageFile extends AbstractUploader {
  constructor() {
    super();
  }

  // Delete From Cloud;
  public deleteFromCloud = async (files: string[]) => {
    try {
      if (files.length) {
        for await (const file of files) {
          const deleteParams = {
            Bucket: config.AWS_S3_BUCKET,
            Key: `${rootFileFolder}/${file}`,
          };

          const res = await this.s3Client.send(
            new DeleteObjectCommand(deleteParams)
          );
          console.log({ res });
          console.log('file deleted -> ', files);
        }
      }
    } catch (err) {
      console.log({ err });
    }
  };
}
export default ManageFile;
