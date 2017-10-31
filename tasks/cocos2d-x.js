'use strict';

const path = require('path');
const async = require('async');
const chalk = require('chalk');
const spawn = require('child_process').spawn;

const constants = require('../config/constants');

/**
 * 安装 cocos2d-x-lite 的 node 依赖包
 * @param {*} next 
 */
let npmInstall = function (next) {
    let child = spawn('npm', ['install'], {
        stdio: 'inherit',
        cwd: constants.REPO_COCOS_X,
    });

    child.on('exit', (code) => {
        if (code) {
            console.log(code);
            console.log(`${chalk.bgBlue('Cocos2d-x:')} ${chalk.underline('npm install')} - ${chalk.red('failed')}`);
            process.exit(-1);
        }
        console.log(`${chalk.bgBlue('Cocos2d-x:')} ${chalk.underline('npm install')} - ${chalk.green('success')}`);
        next();
    });
};

/**
 * 更新子仓库
 * @param {*} next 
 */
let submoduleUpdate = function (next) {
    let child = spawn('git', ['submodule', 'update', '--init'], {
        stdio: 'inherit',
        cwd: constants.REPO_COCOS_X,
    });

    child.on('exit', (code) => {
        if (code) {
            console.log(code);
            console.log(`${chalk.bgBlue('Cocos2d-x:')} ${chalk.underline('submodule update')} - ${chalk.red('failed')}`);
            process.exit(-1);
        }
        console.log(`${chalk.bgBlue('Cocos2d-x:')} ${chalk.underline('submodule update')} - ${chalk.green('success')}`);
        next();
    });
};

/**
 * 下载依赖库
 * @param {*} next 
 */
let downloadDeps = function (next) {
    let child = spawn('python', ['download-deps.py'], {
        stdio: ['pipe', process.stdout, process.stderr],
        cwd: constants.REPO_COCOS_X,
    });

    child.stdin.write('Yes\n');
    child.stdin.end();

    child.on('exit', (code) => {
        if (code) {
            console.log(code);
            console.log(`${chalk.bgBlue('Cocos2d-x')} ${chalk.underline('download deps')} - ${chalk.red('failed')}`);
            process.exit(-1);
        }
        console.log(`${chalk.bgBlue('Cocos2d-x')} ${chalk.underline('download deps')} - ${chalk.green('success')}`);
        next();
    });
};

/**
 * 下载 bin 文件
 * @param {*} next 
 */
let downloadBin = function (next) {
    let child = spawn('python', ['download-bin.py'], {
        stdio: ['pipe', process.stdout, process.stderr],
        cwd: path.join(constants.REPO_COCOS_X, './tools/cocos2d-console'),
    });

    child.stdin.write('no\n');
    child.stdin.end();

    child.on('exit', (code) => {
        if (code) {
            console.log(code);
            console.log(`${chalk.bgBlue('Cocos2d-x')} ${chalk.underline('download bin')} - ${chalk.red('failed')}`);
            process.exit(-1);
        }
        console.log(`${chalk.bgBlue('Cocos2d-x')} ${chalk.underline('download bin')} - ${chalk.green('success')}`);
        next();
    });
};

/**
 * 构建新的 cocos zip 包，并上传到 ftp 服务器
 * 这个安装包在 fireball 仓库内的 update-native 任务会使用
 * 环境变量内需要设置 ftpUser 和 ftpPass 两个参数用于 ftp 身份校验
 * 本地 zip 输出到 tools/make-package 文件夹内
 * @param {function} next
 */
let makeCocosSource = function (next) {
    // window 平台不需要上传源码
    if (process.platform === 'win32') {
        return next();
    }

    let child = spawn('gulp', ['make-cocos2d-x'], {
        stdio: [process.stdin, process.stdout, process.stderr],
        cwd: constants.REPO_COCOS_X,
    });

    child.on('exit', (code) => {
        if (code) {
            console.log(code);
            console.log(`${chalk.bgBlue('Cocos2d-x')} ${chalk.underline('download bin')} - ${chalk.red('failed')}`);
            process.exit(-1);
        }
        console.log(`${chalk.bgBlue('Cocos2d-x')} ${chalk.underline('download bin')} - ${chalk.green('success')}`);
        next();
    });
};

exports.init = function (next) {
    async.series([
        npmInstall,
        submoduleUpdate,
        downloadDeps,
        downloadBin,
    ], next); 
};

exports.makeSource = function (next) {
    async.series([
        makeCocosSource,
    ], next); 
};