'use strict';

/**
 * 制作的包版本号
 */
exports.version = 'v1.7-test';

exports.cmd = [
    'gulp',
    'git',
    'nuitka', // anysdk 需要使用
];

if (process.platform === 'win32') {
    // exports.cmd.push('rcedit');
} else {
    exports.cmd.push('appdmg');
}

exports.repository = [
    {
        url: 'git@github.com:cocos-creator/cocos2d-x-lite.git',
        branch: 'v1.7',
    }, {
        url: 'git@github.com:cocos-creator/fireball.git',
        branch: 'v1.7',
    },
];