import { Credentials } from 'aws-sdk'
// import S3 from 'aws-sdk/clients/s3'
import {
  DeleteObjectCommand,
  GetObjectAclCommand,
  GetObjectAttributesCommand,
  GetObjectCommand,
  PutBucketCorsCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3'
import path from 'path'
/*

var base64 = require('base-64');
var utf8 = require('utf8');

var text = 'foo © bar 𝌆 baz';
var bytes = utf8.encode(text);
var encoded = base64.encode(bytes);


*/

const s3Client = new S3Client({
  region: process.env.LOK_S3_REGION,
  // endpoint: process.env.LOK_S3_ENDPOINT,
  sslEnabled: true,
  s3ForcePathStyle: false,
  credentials: {
    accessKeyId: process.env.LOK_S3_ACCESS_KEY,
    secretAccessKey: process.env.LOK_S3_ACCESS_KEY_SECRET,
  },
})
// Set parameters.
// Create initial parameters JSON for putBucketCors.
const thisConfig = [
  {
    AllowedHeaders: ['*'],
    AllowedMethods: ['GET', 'POST'],
    AllowedOrigins: ['*'],
    ExposeHeaders: ['ETag'],
  },
]
// Create CORS parameters.
const corsParams = {
  Bucket: process.env.LOK_S3_BUCKET,
  CORSConfiguration: { CORSRules: thisConfig },
}

s3Client.send(new PutBucketCorsCommand(corsParams))

export async function uploadFileToObjectStorage(base64Data, path, fileName, ContentType) {
  const params = {
    Bucket: process.env.LOK_S3_BUCKET,
    Key: `${path}/${fileName}`,
    Body: base64Data,
    ACL: 'public-read',
    // ContentEncoding: 'base64',
    ContentType: `${ContentType}`,
  }

  // see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
  await s3Client.send(new PutObjectCommand(params))

  return `${process.env.LOK_S3_ENDPOINT}/${path}/${fileName}`
}

export async function deleteFileFromObjectStorage(url) {
  const Key = url.split(`${process.env.LOK_S3_ENDPOINT}/`).pop()
  const params = {
    Bucket: process.env.LOK_S3_BUCKET,
    Key,
  }

  // see: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property
  // eslint-disable-next-line consistent-return
  return s3Client.send(new DeleteObjectCommand(params))
}

export default async function API(req, res) {
  let bodyData = JSON.parse(req.body)
  let method = bodyData.method

  if (method === 'upload') {
    let fileData = Buffer.from(bodyData.fileData, 'base64')
    let fileName = path.basename(bodyData.fileName)
    let contentType = bodyData.contentType

    let result = await uploadFileToObjectStorage(fileData, process.env.LOK_S3_FOLDER, fileName, contentType)

    res.json(result)
  } else if (method === 'delete') {
    let url = bodyData.url
    let result = await deleteFileFromObjectStorage(url)

    res.json(result)
  }
}

//
