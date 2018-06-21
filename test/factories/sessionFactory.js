const debug = require('debug')('testfactory:session');
const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require(__dirname + '/../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
  const sessionObject = {
    passport: {
      user: user._id.toString() // mongoose models - not actually a string. it is an object. therefore .toString
    }
  };
  const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
  const sig = keygrip.sign('session=' + session);

  return { session, sig };
};