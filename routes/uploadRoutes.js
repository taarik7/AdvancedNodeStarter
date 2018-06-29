const debug = require('debug')('routes:upload');
const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const requireLogin = require('../middlewares/cleanCache');
const keys = require('../config/keys');

const s3 = new AWS.S3({
  accessKeyId: keys.amazonS3.accessKeyId,
  secretAccessKey: keys.amazonS3.secretAccessKey,
  signatureVersion: keys.amazonS3.signatureVersion,
  region: keys.amazonS3.region
});

module.exports = app => {
  app.get('/api/upload', requireLogin, (req, res) => {
    const Key = `${req.user.id}/${uuid()}.jpeg`;

    s3.getSignedUrl('putObject', {
      Bucket: 'my-tsblog-bucket-123',
      ContentType: 'image/jpeg',
      Key
    }, (err, url) => res.send({ Key, url }));
  });
};