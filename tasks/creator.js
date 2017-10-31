'use strict';

const path = require('path');
const fse = require('fs-extra');
const chalk = require('chalk');
const async = require('async');
const spawn = require('child_process').spawn;
const constants = require('../config/constants');

/**
 * 构建 dist 包
 * mac 下直接构建出 dmg 安装包
 * window 下需要手动打包
 * @param {*} next 
 */
let makeDist = function (next) {
    let child = spawn('gulp', ['make-dist'], {
        stdio: [process.stdin, process.stdout, process.stderr],
        cwd: constants.REPO_CREATOR,
    });

    child.on('exit', (code) => {
        if (code) {
            console.log(code);
            console.log(`${chalk.bgBlue('Creator')} ${chalk.underline('make dist')} - ${chalk.red('failed')}`);
            process.exit(-1);
        }
        console.log(`${chalk.bgBlue('Creator')} ${chalk.underline('make dist')} - ${chalk.green('success')}`);
        next();
    });
};

/**
 * 安装 cocos2d-x-lite 的 node 依赖包
 * @param {*} next 
 */
let npmInstall = function (next) {
    let child = spawn('npm', ['install'], {
        stdio: 'inherit',
        cwd: constants.REPO_CREATOR,
    });

    child.on('exit', (code) => {
        if (code) {
            console.log(code);
            console.log(`${chalk.bgBlue('Creator:')} ${chalk.underline('npm install')} - ${chalk.red('failed')}`);
            process.exit(-1);
        }
        console.log(`${chalk.bgBlue('Creator:')} ${chalk.underline('npm install')} - ${chalk.green('success')}`);
        next();
    });
};

/**
 * bootstrap
 * @param {*} next 
 */
let boot = function (next) {
    let child = spawn('gulp', ['bootstrap'], {
        stdio: 'inherit',
        cwd: constants.REPO_CREATOR,
    });

    child.on('exit', (code) => {
        if (code) {
            console.log(code);
            console.log(`${chalk.bgBlue('Creator:')} ${chalk.underline('bootstrap')} - ${chalk.red('failed')}`);
            process.exit(-1);
        }
        console.log(`${chalk.bgBlue('Creator:')} ${chalk.underline('bootstrap')} - ${chalk.green('success')}`);
        next();
    });
};

/**
 * bower install
 * @param {*} next 
 */
let bower = function (next) {
    let child = spawn('bower', ['install'], {
        stdio: 'inherit',
        cwd: constants.REPO_CREATOR,
    });

    child.on('exit', (code) => {
        if (code) {
            console.log(code);
            console.log(`${chalk.bgBlue('Creator:')} ${chalk.underline('bower install')} - ${chalk.red('failed')}`);
            process.exit(-1);
        }
        console.log(`${chalk.bgBlue('Creator:')} ${chalk.underline('bower install')} - ${chalk.green('success')}`);
        next();
    });
};

/**
 * 安装依赖的额外的 npm 模块
 * @param {*} next 
 */
let installNpmModule = function (next) {
    let param;
    if (process.platform === 'win32') {
        param = ['install', 'rcedit'];
    } else {
        param = ['install', 'appdmg', '-g'];
    }

    let child = spawn('npm', param, {
        stdio: [process.stdin, process.stdout, process.stderr],
        cwd: constants.REPO_CREATOR,
    });

    child.on('exit', (code) => {
        if (code) {
            console.log(code);
            console.log(`${chalk.bgBlue('Creator')} ${chalk.underline('install npm module')} - ${chalk.red('failed')}`);
            process.exit(-1);
        }
        console.log(`${chalk.bgBlue('Creator')} ${chalk.underline('install npm module')} - ${chalk.green('success')}`);
        next();
    });
};

exports.init = function (next) {
    async.series([
        npmInstall,
        installNpmModule,
        boot,
        bower,
    ], next); 
};
exports.makeDist = makeDist;