const path = require('path');
const createPost = require('../').createPost;
const logoSrc = path.join('test', 'logo.png');
const assert = require('assert');
let config = require('../config/default');

function actual (src, conf) {
  let postData = createPost(src, conf);
  return JSON.stringify(postData);
}

function expected (name) {
  return JSON.stringify(require('./expected/' + name));
}

assert.equal(actual(logoSrc, config), expected('default'), 'Includes config for all devices (default)');

config.icons = { android: true };
assert.equal(actual(logoSrc, config), expected('android_only'), 'Includes android settings only');

config.icons = {};
assert.equal(actual('http://via.placeholder.com/80x80', config), expected('logo_url'), 'Logo source is set as url');

console.log('Tests successful!');
