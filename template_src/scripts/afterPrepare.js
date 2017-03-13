#!/usr/bin/env node

var common = require("./common.js");

module.exports = function(ctx) {
    var shell = ctx.requireCordovaModule("shelljs"),
        path = ctx.requireCordovaModule("path"),
        events = ctx.requireCordovaModule("cordova-common").events;

    var filesToDelete;

    if (ctx.cmdLine.toLowerCase().indexOf("--notransform") > -1) {
        return;
    }

    // only delete duplicated platform files if we're in SIBLING mode
    if (ctx.opts.projectRoot && common.detectOperatingmode(ctx) === common.OPMODE.SIBLING) {
        events.emit("info", "Removing bundle artifacts from prepared platforms...");
        try {
            filesToDelete = shell.find(path.join(ctx.opts.projectRoot))
                          .filter(function(file) {
                              return file.match(/platforms[\/|\\].+[\/|\\]www[\/|\\](ts|es|scss)[\/|\\].+\.(js|ts|scss)$/);
                          });
            if (filesToDelete.length > 0) {
                filesToDelete = filesToDelete.map(function (file) {
                    return path.resolve(file);
                });
                shell.rm(filesToDelete);
            }
        } catch (err) {
            events.emit("verbose", "... could not remove bundle artifacts from platforms!");
        }
    }
}