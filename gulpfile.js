'use strict';

const path = require('path');
const fs = require('fs');
const sass = require('node-sass');
const gulp = require('gulp');

/** */
gulp.task('build-styles',gulp.series((done) => {
    const css = sass.renderSync({
        file: path.join(__dirname,'src/styles/app.scss')
    });
    fs.writeFileSync(path.join('build/meal-planner.css'),css.css.toString());
    done();
}));

/** */
gulp.task('default',gulp.series(['build-styles'],(done) => {
    done();
}));