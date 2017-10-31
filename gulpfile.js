'use strict';

const gulp = require('gulp');

const check = require('./tasks/check');
const git = require('./tasks/git'); 
const cocos = require('./tasks/cocos2d-x');
const creator = require('./tasks/creator');
const gulpSequence = require('gulp-sequence');

gulp.task('check-cmd-dependencies', check.cmd);

gulp.task('clone-repository', git.clone);
gulp.task('reset-repository', git.reset);
gulp.task('checkout-repository', git.branch);

gulp.task('cocos-init', cocos.init);
gulp.task('cocos-make-source', cocos.makeSource);

gulp.task('creator-init', creator.init);
gulp.task('creator-make-dist', creator.makeDist);

gulp.task('default', gulpSequence(
    // 检查命令安装情况
    'check-cmd-dependencies',

    // 初始化项目
    'clone-repository',
    'reset-repository',
    'checkout-repository',
    'cocos-init',
    'creator-init',

    // 开始发布流程
    // 'cocos-make-source',
    'creator-make-dist',
));