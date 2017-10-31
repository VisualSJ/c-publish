'use strict';

const path = require('path');

exports.REPOSITORY = path.join(__dirname, '../repository');
exports.REPO_COCOS_X = path.join(exports.REPOSITORY, 'cocos2d-x-lite');
exports.REPO_CREATOR = path.join(exports.REPOSITORY, 'fireball');
exports.REPO_ENGINE = path.join(exports.REPOSITORY, 'engine');