const { clearHash } = require('../services/cache');
const debug = require('debug')('middleware:cache');

module.exports = async (req, res, next) => {
  await next();

  debug('issuing bust the cache');
  clearHash(req.user.id);
};