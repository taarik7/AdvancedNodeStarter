module.exports = {
  googleClientID:
    '964808011168-29vqsooppd769hk90kjbjm5gld0glssb.apps.googleusercontent.com',
  googleClientSecret: 'KnH-rZC23z4fr2CN4ISK4srN',
  mongoURI: 'mongodb://taarik:password@127.0.0.1/blog_dev',
  cookieKey: '123123123',
  redisUrl: 'redis://127.0.0.1:6379',
  amazonS3: {
    accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
    secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
    region: 'eu-west-3'
  }
};