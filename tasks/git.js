'use strict';

const fse = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const async = require('async');
const vGit = require('v-git');
const spawn = require('child_process').spawn;

const constants = require('../config/constants');
const dependencies = require('../config/dependencies');

fse.ensureDirSync(constants.REPOSITORY);

/**
 * clone 仓库
 * 如果已有仓库，则跳过并提示 exists
 * @param {function} next 
 */
let clone = function (next) {

    let failed = false;
    vGit.config.stdio = [0, 1, 2];
    async.eachSeries(dependencies.repository, (item, next) => {
        let repoDir = path.join(constants.REPOSITORY, path.basename(item.url, '.git'));
        if (fse.existsSync(repoDir)) {
            console.log(`${chalk.bgBlue('Clone repository:')} ${chalk.underline(item.url)} - ${chalk.yellow('exists')}`);
            return next();
        }

        vGit.clone(constants.REPOSITORY, item.url).then(() => {
            console.log(`${chalk.bgBlue('Clone repository:')} ${chalk.underline(item.url)} - ${chalk.green('success')}`);
            next();
        }).catch(() => {
            console.log(`${chalk.bgBlue('Clone repository:')} ${chalk.underline(item.url)} - ${chalk.red('failed')}`);
            process.exit(-1);
        });
    }, () => {
        vGit.config.stdio = 'ignore';
        next();
    });
};

/**
 * 丢弃所有的仓库修改，以仓库内的数据为准
 * @param {function} next 
 */
let reset = function (next) {
    async.eachSeries(dependencies.repository, (item, next) => {
        let repoDir = path.join(constants.REPOSITORY, path.basename(item.url, '.git'));

        let repo = vGit.init(repoDir);
        repo.resetAll().then(() => {
            console.log(`${chalk.bgBlue('Reset repository:')} ${chalk.underline(repoDir)} - ${chalk.green('success')}`);
            next();
        }).catch(() => {
            console.log(`${chalk.bgBlue('Reset repository:')} ${chalk.underline(repoDir)} - ${chalk.red('failed')}`);
            process.exit(-1);
        });
    }, () => {
        next();
    });
};

/**
 * 切换到指定分支
 * 如果该分支存在，则切出一个新的 _t 临时分支，然后删除旧的分支
 * 最后再新建并切换到指定分支，删除 _t 临时分支
 * @param {*} next 
 */
let branch = function (next) {
    let failed = false;
    async.eachSeries(dependencies.repository, (item, next) => {
        let repoDir = path.join(constants.REPOSITORY, path.basename(item.url, '.git'));

        let repo = vGit.init(repoDir);
        let exists = repo.branchList.indexOf(dependencies.version) !== -1;

        Promise.resolve().then(() => {
            // 切到临时分支
            if (exists && repo.branchList.indexOf('_t') === -1) {
                return repo.createBranch('_t');
            }
        }).then(() => {
            // 删除已经存在的分支
            if (exists) {
                return repo.removeBranch(dependencies.version);
            }
        }).then(() => {
            return repo.createBranch(dependencies.version, `origin/${item.branch}`);
        }).then(() => {
            if (exists) {
                return repo.removeBranch('_t');
            }
        }).then(() => {
            console.log(`${chalk.bgBlue('Switch repository:')} ${chalk.underline('origin/' + dependencies.version)} - ${chalk.green('success')}`);
            next();
        }).catch(() => {
            console.log(`${chalk.bgBlue('Switch repository:')} ${chalk.underline('origin/' + dependencies.version)} - ${chalk.red('failed')}`);
            process.exit(-1);
        });

    }, () => {
        next();
    });
};

exports.clone = clone;
exports.reset = reset;
exports.branch = branch;