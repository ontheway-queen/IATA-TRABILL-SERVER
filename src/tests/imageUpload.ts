import AWS from 'aws-sdk';
import axios from 'axios';
import stream from 'stream';

AWS.config.update({
  accessKeyId: 'AKIA33M2Q5WREAJ7WOWU',
  secretAccessKey: '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',
  region: 'ap-south-1',
});

// Create an S3 client
const s3 = new AWS.S3();

export async function uploadImageToS3(
  imageUrl: string,
  bucketName: string,
  pathName: string
) {
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

    console.log({
      uploadUrl,
    });
  } catch (error) {
    console.error('Error uploading image to S3:', error);
  }
}

// uploadImageToS3(image_url, 'm360ict', 'trabill/iata');
