var OPMODE_SIBLING = "sibling",
    OPMODE_EXTERNAL = "external";

function installRequiredDependencies(ctx) {
    var shell = ctx.requireCordovaModule("shelljs");

    return (shell.exec("npm install").code === 0);
}

function detectOperatingMode(ctx) {
    var fs = ctx.requireCordovaModule("fs"),
        path = ctx.requireCordovaModule("path");
    if (fs.existsSync(path.join(ctx.opts.projectRoot, "www.src"))) {
        return OPMODE_EXTERNAL;
    }
    return OPMODE_SIBLING;
}

module.exports = {
    installRequiredDependencies: installRequiredDependencies,
    detectOperatingmode: detectOperatingMode,
    OPMODE: {
        EXTERNAL: OPMODE_EXTERNAL,
        SIBLING: OPMODE_SIBLING
    }
};