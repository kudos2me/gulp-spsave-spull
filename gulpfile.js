var gulp = require('gulp')  // load gulp

var watch = require('gulp-watch')  //watches for any changes in the src file
var cached = require('gulp-cached'); // in-memory cache of all files, so it knows what files are being changed for push
var spsave = require('gulp-spsave');  // upload to sharepoint 

var sppull = require("sppull").sppull; // pull from SP

//-----   Global declarations -------//
var siteurl = "https://corehero.sharepoint.com/sites/isha";
var siteuser = "isha@corehero.onmicrosoft.com";
var sitepw = "Pass@word1"

//------  SPPull functions ----// 
var context = {
    siteUrl: siteurl,
    username: siteuser,
    password: sitepw
};

var options = {
    spRootFolder: "/Style Library/gulptest",
    dlRootFolder: "./src/",
    folderStructureOnly: false
};

gulp.task('sppull', function() {
    sppull(context, options)
        .then(function(downloadResults) {
            console.log("Files are downloaded");
            console.log("For more, please check the results", JSON.stringify(downloadResults));
        })
        .catch(function(err) {
            console.log("Core error has happened", err);
        });  
});

//------- SP-SAVE FUNCTIONS WITH WATCH ------//
// Credentials and SP-save actions 
var coreOptions = {  
    siteUrl: siteurl,
    notification: true,
    // path to document library or in this case the master pages gallery
    folder: "/Style Library/gulptest", 
    flatten: false, 
    checkin: true,
    checkinType: 1,
    checkinMessage: "Published using Gulp"
};
var creds = {  
    username: siteuser,
    password: sitepw
};

gulp.task('spdefault', function() {  
    // runs the spsave gulp command on only files the have 
    // changed in the cached files
    return gulp.src('src/**')
        .pipe(cached('spFiles'))
        .pipe(gulp.dest("./dist"))
        .pipe(spsave(coreOptions, creds));     
});

// run and watch 
gulp.task('default', function() {  
    // create an initial in-memory cache of files
    gulp.src('src/**')
    .pipe(cached('spFiles'));
    // watch the src folder for any changes of the files
    gulp.watch(['./src/**'], ['spdefault']);
});