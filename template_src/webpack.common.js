/*******************************************************************************
 *
 * cordova-plugin-webpack-transpiler webpack.config.js
 * ---------------------------------------------------
 *
 * Feel free to modify this file to your needs; it will not be overwritten by
 * the plugin unless you delete the file entirely.
 *
 * Notes:
 *
 *   - External/Sibling mode is detected automatically. When in External mode,
 *     additional assets can be copied (for example, from "www.src -> www").
 *   - The names of all the files and paths are not hard-coded; you can change
 *     them below to match your configuration.
 *
 ******************************************************************************/

// portions based on https://github.com/simonfl3tcher/react-progressive-web-app/blob/master/webpack.config.js

var path = require("path"),
    fs = require("fs"),
    webpack = require("webpack"),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    CopyWebpackPlugin = require("copy-webpack-plugin");

var extensions = [".js", ".ts", ".jsx", ".es", // typical JS extensions
                  ".jsm", ".esm",               // jsm is node's ES6 module ext
                  ".json",                      // some modules require json without an extension
                  ".css", ".scss",              // CSS & SASS extensions
                  "*"];                         // allow extensions on imports

var dirs = {
    css:      "css",
    es:       "es",
    external: "www.src",
    html:     "html",
    img:      "img",
    js:       "js",
    lib:      "lib",
    scss:     "scss",
    ts:       "ts",
    vendor:   "vendor",
    www:      "www",
    aliases: {
        Components:  "components",
        Controllers: "controllers",
        Models:      "models",
        Pages:       "pages",
        Routes:      "routes",
        Templates:   "templates",
        Utilities:   "util",
        Views:       "views",
    }
}

/*
 * These files and globs will be copied if using the external configuration
 * (www.src -> www).
 *
 * For full information, see https://github.com/kevlened/copy-webpack-plugin
 ******************************************************************************/
var assetsToCopyIfExternal = [
    { from: "*.*" },
    { from: dirs.img + "/**/*" },
    { from: dirs.css + "/**/*" },
    { from: dirs.js + "/**/*" },
    { from: dirs.vendor + "/**/*" },
    { from: dirs.lib + "/**/*" },
    { from: dirs.html + "/**/*" },
];

var assetsToCopyIfSibling = [];

var vendor = [];

/*
 * If you're just changing file and path names, you don't need to proceed any
 * further. If you need to change the logic, proceed.
 ******************************************************************************/


function config(options) {
    var src = options.src,
        assetsToCopyIfExternal = options.assetsToCopyIfExternal,
        assetsToCopyIfSibling = options.assetsToCopyIfSibling,
        sourcePaths = options.sourcePaths,
        entryFiles = options.entryFiles,
        outputFile = options.outputFile,
        outputPaths = options.outputPaths,
        indexes = options.indexes,
        dirs = options.dirs,
        extensions = options.extensions,
        vendor = options.vendor,
        allowTypeScript = options.allowTypeScript || false,
        allowScss = options.allowScss | false,
        transpiler = options.transpiler || (allowTypeScript ? "ts-loader" : "babel-loader");
    var assetsToCopy = [];

    if (!src) {
        src = path.resolve(__dirname, dirs.external);
        assetsToCopy = assetsToCopyIfSibling;
    }
    if (!fs.existsSync(src)) {
        src = path.resolve(__dirname, dirs.www);
    } else {
        assetsToCopy = assetsToCopyIfExternal;
    }

    /*
    * it is assumed that you will be using "es/*.js" for ES2015+, "ts/*.ts" for
    * TypeScript, and "scss/*.scss" for SASS. You can change these as needed.
    ******************************************************************************/
    sourcePaths = Object.assign({}, sourcePaths ? sourcePaths : {}, {
        src: src,
        es: dirs.es,
        ts: dirs.ts,
        scss: dirs.scss
    });

    /*
    * It is assumed that your output is going to "www", and that the JavaScript
    * (or TypeScript) should be stored in "www/js", and that any generated CSS
    * should be stored in "www/css".
    ******************************************************************************/
    outputPaths = Object.assign({}, outputPaths ? outputPaths : {}, {
        www: dirs.www,
        js: dirs.js,
        css: dirs.css
    });

    /*
    * Feel free to change the following if these assumptions are incorrect:
    *   - If you are using SASS, the entry file will be named "styles.scss" and
    *     will be copied to bundle.css
    *   - If you are using ES2015+, the entry file will be named "index.js" and
    *     will be copied to bundle.js
    *   - If you are using TypeScript, the entry file will be named "index.ts"
    *     and will be copied to bundle.js
    ******************************************************************************/
    indexes = Object.assign({}, indexes ? indexes : "", {
        scss: { from: path.join(sourcePaths.scss, "styles.scss"), to: path.join(outputPaths.css, "bundle.css") },
        es: { from: path.join(sourcePaths.es, "index.js"), to: path.join(outputPaths.js, "bundle.js") },
        ts: { from: path.join(sourcePaths.ts, "index.ts"), to: path.join(outputPaths.js, "bundle.js") },
    vendor: { to: path.join(outputPaths.js, "vendor.js") },
    });

    var usingTypeScript = allowTypeScript && fs.existsSync(path.resolve(sourcePaths.src, sourcePaths.ts));

    var jsEntryFile = usingTypeScript ? indexes.ts.from : indexes.es.from,
        sassEntryFile = indexes.scss.from,
        extractSass = allowScss ? new ExtractTextPlugin(indexes.scss.to) : null;

    if (!outputFile) {
        outputFile = usingTypeScript ? indexes.ts.to : indexes.es.to;
    }

    if (!entryFiles) {
        entryFiles = { app: ["./" + jsEntryFile] };

        if (allowScss && fs.existsSync(path.resolve(sourcePaths.src, sassEntryFile))) {
            entryFiles.app.push("./" + sassEntryFile);
        }
    }

    if (vendor.length > 0) {
        entryFiles.vendor = vendor;
    }

    return {
        context: sourcePaths.src,
        entry: entryFiles,
        devtool: "inline-source-map",
        output: {
            filename: outputFile,
            path: outputPaths.www,
        },
        resolve: {
            extensions: extensions ||
                       [".js", ".ts", ".jsx", ".es", // typical JS extensions
                        ".jsm", ".esm",               // jsm is node's ES6 module ext
                        ".json",                      // some modules require json without an extension
                        ".css", ".scss",              // CSS & SASS extensions
                        "*"],                         // allow extensions on imports
            modules: [
                path.resolve(sourcePaths.src, dirs.es, "lib"),
                path.resolve(sourcePaths.src, dirs.es, "vendor"),
                path.resolve(sourcePaths.src, dirs.ts, "lib"),
                path.resolve(sourcePaths.src, dirs.ts, "vendor"),
                path.resolve(sourcePaths.src, "lib"),
                path.resolve(sourcePaths.src, "vendor"),
                "node_modules"
            ],
            alias: Object.assign({}, {
                "$LIB": path.join(dirs.lib),
                "Lib": path.join(dirs.lib),
                "$VENDOR": path.join(dirs.vendor),
                "Vendor": path.join(dirs.vendor),
            }, (function getAliases() {
                var k, v, obj = {};
                for (k in dirs.aliases) {
                    if (Object.prototype.hasOwnProperty.call(dirs.aliases, k)) {
                        v = dirs.aliases[k];
                        obj["$" + k.toUpperCase()] = path.join(usingTypeScript ? dirs.ts : dirs.es, v);
                        obj[k] = path.join(usingTypeScript ? dirs.ts : dirs.es, v);
                    }
                }
                return obj;
            }()))
        },
        module: {
            rules: [
                { test: /\.(html|txt)$/, use: "raw-loader" },
                { test: /\.(png|jpg|svg|gif)$/, use: ["file-loader"]},
                { test: /\.(json|json5)$/, use: "json5-loader" },
                {
                    test: /\.scss$/,
                    use: extractSass.extract({
                        fallback: "style-loader",
                        use: [
                                { loader: "css-loader?sourceMap=true&import=false&url=false"},
                                { loader: "resolve-url-loader?sourceMap=true"},
                                { loader: "sass-loader?sourceMap=true"}
                                ]
                    })
                },
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    use: [ transpiler + (allowTypeScript ? (usingTypeScript ? "" : "?entryFileIsJs") : "") ],
                    exclude: /node_modules/
                },
            ]
        },
        plugins: (function() {
            var plugins = [];
            if (extractSass) {
                plugins.push(extractSass);
            }
            plugins.push(new CopyWebpackPlugin(assetsToCopy));
            if (vendor.length > 0) {
                plugins.push(new webpack.optimize.CommonsChunkPlugin({
                    name: "vendor",
                    filename: indexes.vendor.to
                }));
            }
            return plugins;
        }())
    };
}

module.exports = {
    defaults: {
        dirs: dirs,
        extensions: extensions,
        assetsToCopyIfExternal: assetsToCopyIfExternal,
        assetsToCopyIfSibling: assetsToCopyIfSibling,
        vendor: vendor,
        transpiler: "ts-loader",
    },
    config: config
}