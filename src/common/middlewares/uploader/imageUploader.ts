import AWS from 'aws-sdk';
import axios from 'axios';
import stream from 'stream';
import config from '../../../config/config';

AWS.config.update({
  accessKeyId: config.AWS_S3_ACCESS_KEY,
  secretAccessKey: config.AWS_S3_SECRET_KEY,
  region: 'ap-south-1',
});

// Create an S3 client
const s3 = new AWS.S3();

export const uploadImageToS3 = async (
  imageUrl: string,
  bucketName: string,
  pathName: string
) => {
  try {
    const urlParts = imageUrl.split('/');
    const s3Filename = pathName + '/' + urlParts[urlParts.length - 1];

    // Download the image
    const response = await axios({
      url: imageUrl,
      responseType: 'stream',
    });

    // Create a pass-through stream to upload to S3
    const passThrough = new stream.PassThrough();

    // Upload the image to S3
    const uploadParams = {
      Bucket: bucketName,
      Key: s3Filename,
      Body: passThrough,
      ContentType: response.headers['content-type'],
    };

    const uploadPromise = s3.upload(uploadParams).promise();

    // Pipe the image stream to the pass-through stream
    response.data.pipe(passThrough);

    // Wait for the upload to finish
    await uploadPromise;

    const uploadUrl = `https://${bucketName}.s3.${s3.config.region}.amazonaws.com/${s3Filename}`;

    return uploadUrl;
  } catch (error) {
    console.error('Error uploading image to S3:', error);
  }
};

// uploadImageToS3(image_url, 'm360ict', 'trabill/iata');

export const uploadImageWithBuffer = async (
  imageBuffer: Buffer,
  fileName: string,
  ContentType: string
) => {
  try {
    const s3Filename = `trabill/bsp/${fileName}`;

    // Upload the image buffer to S3
    const uploadParams = {
      Bucket: 'm360ict',
      Key: s3Filename,
      Body: imageBuffer,
      ContentType: ContentType,
    };

    const uploadPromise = s3.upload(uploadParams).promise();

    // Wait for the upload to finish
    await uploadPromise;

    const uploadUrl = `https://m360ict.s3.ap-south-1.amazonaws.com/${s3Filename}`;

    return uploadUrl;
  } catch (error) {
    console.error('Error uploading image to S3:', error);
  }
};
