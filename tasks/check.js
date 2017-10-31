'use strict';

const chalk = require('chalk');
const spawn = require('child_process').spawn;
const async = require('async');

const dependencies = require('../config/dependencies');

/**
 * 检查依赖的命令行工具是否安装
 * @param {*} next 
 */
let cmd = function (next) {
    let failed = false;
    async.eachLimit(dependencies.cmd, 5, (cmd, next) => {
        let child = spawn(cmd, ['--help']);
        child.on('exit', () => {
            console.log(`${chalk.bgBlue('Check cmd:')} ${chalk.underline(cmd)} - ${chalk.green('success')}`);
            next();
        });
        child.on('error', (error) => {
            console.log(`${chalk.bgBlue('Check cmd:')} ${chalk.underline(cmd)} - ${chalk.red('failed')}`);
            failed = true;
            next();
        });
    }, () => {
        if (failed) {
            console.log(chalk.red(`Please install all the dependant programs`));
            process.exit(-1);
        }
        next();
    });
};

exports.cmd = cmd;