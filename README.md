# cordova-template-webpack-ts-scss

This template is designed to make it easy for you to write ES2015+, TypeScript, and SCSS code, and then bundle that code using webpack v2. It will do this automatically each time you run any Cordova/PhoneGap command that triggers the `prepare` phase.

This template is based on the [cordova-plugin-webpack-transpiler](https://github.com/kerrishotts/cordova-plugin-webpack-transpiler) plugin which is very similar and slightly more flexible. However, if you don't want to rely on a plugin, this template will work as well.

## Requirements

* Node v5 or better

* Cordova / PhoneGap CLI installed

## Usage

You can create a project using this template as follows:

```bash
$ cordova create hello com.example.hello hello --template cordova-template-webpack-ts-scss
```

Once the project has been created, you'll need to add a platform, like so:

```bash
$ cd hello
$ cordova platform add --save browser
```

The act of adding a platform will automatically trigger the first `prepare`, and when the process is finished, the example code supplied with this template will have been transformed automatically.

### Project Structure

This template uses an "external" structure for all transformed assets. This means there will be two directories that contain code:

* `www.src` &mdash; this is where your ES2015+, TypeScript, SCSS files, and all other assets live
* `www` &mdash; after `prepare` this will store copied assets and transformed files; **you should not make changes to this directory**

Within `www.src`, the following structure is assumed:

```text
www.src/
    index.html                          # your index.html file; app's entry point
    js/                                 # JavaScript files that don't need transpilation
    es/                                 # ES2015+ files
        index.js                        # ... App's javascript entry point
    ts/                                 # TypeScript files; if present overrides es/
        index.ts                        # ... App's typescript entry point; if present overrides es/index.js
    css/                                # CSS stylesheets that don't need transformed
    scss/                               # SCSS stylesheets
        styles.css                      # ... Primary styles; other styles need to be imported
    html/                               # HTML files
    img/                                # Image files
    lib/                                # Library files (perhaps frameworks)
    vendor/                             # Vendor files

```

> **Note**: You can change to a "sibling" structure if you desire by removing the `www.src` directory and moving `es`, `ts`, and `scss` to the `www` directory.

### Transformations

The following transformations occur just prior to the `prepare` phase.

Sibling     |      Entry Point           | Output
-----------:|:---------------------------|:------------------
TypeScript  | `www/ts/index.ts`          | `www/js/bundle.js`
ES2015      | `www/es/index.js`          | `www/js/bundle.js`
SCSS        | `www/scss/styles.scss`     | `www/css/bundle.css`

External    |      Entry Point           | Output
-----------:|:---------------------------|:------------------
TypeScript  | `www.src/ts/index.ts`      | `www/js/bundle.js`
ES2015      | `www.src/es/index.js`      | `www/js/bundle.js`
SCSS        | `www.src/scss/styles.scss` | `www/css/bundle.css`
HTML        | `www.src/*.html`           | `www/*.html`
CSS         | `www.src/css/**/*`         | `www/css/**/*`
Images      | `www.src/img/**/*`         | `www/img/**/*`
JavaScript  | `www.src/js/**/*`          | `www/js/**/*`
Lib files   | `www.src/lib/**/*`         | `www/lib/**/*`
Vendor files| `www.src/vendor/**/*`      | `www/vendor/**/*`

The `before prepare` hook will transpile your code (and copy files when using the external structure). If an error occurs during this process, you'll be notified. If no error occurs, you should see the something that looks like this:

```text
Starting webpack bundling and transpilation phase...
(node:46414) DeprecationWarning: loaderUtils.parseQuery() received a non-string value which can be problematic, see https://github.com/webpack/loader-utils/issues/56
parseQuery() will be replaced with getOptions() in the next major version of loader-utils.
ts-loader: Using typescript@2.2.1 and /.../example-ts-ext/tsconfig.json
... webpack bundling and typescript transpilation phase complete!
Hash: 76ef6d9645fc284a7a9c
Version: webpack 2.2.1
Time: 1977ms
         Asset     Size  Chunks             Chunk Names
  js/bundle.js  22.6 kB       0  [emitted]  main
css/bundle.css  14.8 kB       0  [emitted]  main
    index.html  2.52 kB          [emitted]
  img/logo.png  21.8 kB          [emitted]
```

The output indicates that four assets were generated. (The paths are relative to your `www` folder.) The `bundle.*` files are transformed from your ES2015+/TypeScript or SCSS files. The other files are files that were copied (this example was from an project using the external structure).

> **Note**: If you are using the sibling project structure, an `after prepare` step will execute. This step removes duplicate files in the resulting platform build artifacts so that your original source files aren't needlessly copied to your app bundles.

> **Note**: If you've copied in your own `index.html` file, you'll need to update your `index.html` file to reference `js/bundle.js` and `css/bundle.css` instead of your original entry files.

### Debug vs Release

The plugin watches for a `--release` switch on the command line; if it is detected the following occurs:

* Minification is turned on
* Sourcemaps are turned off

If you need to change this behavior, you can override it by copying `webpack.config.js` in your project root to `webpack.release.config.js` and making the desired changes.

### Modifying the configuration files

If you wish to modify `webpack.common.js`, `webpack.config.js`, `webpack.release.config.js`, or `tsconfig.json`, you can. The plugin will not attempt to override their contents, and it won't attempt to overwrite the files on a reinstall. If you need to reset these configuration files, delete them and reinstall the plugin.

> **Note**: You should prefer to override settings used by `webpack.common.js` in `webpack.config.js`.

# Built-in Webpack Loaders

The `webpack.config.js` files come with some useful loaders:

file pattern        | loader       | example
-------------------:|:------------:|:-----------------------------
*.json; *.json5     | json5-loader | `import pkg from "../../package.json";`
*.html; *.txt       | raw-loader   | `import template from "../templates/list-item.html";`
*.png; *.jpg; *.svg | file-loader  | `import icon from "../img/icon.svg";`

If a file pattern you need to import isn't matched with a loader, you can specify the loader directly:

```javascript
import xml from "raw-loader!../../config.xml";
```

# Built-in asset copying

When in the "external" operating mode, the following assets will be copied from `www.src` to `www`:

```
*.html
img/**/*
css/**.*
js/**.*
vendor/**.*
lib/**.*
html/**/*
```

# Built-in Module Resolution

The default configurations add the following module resolution paths (relative to project root):

```
(www|src.www)/(es|ts)/lib
(www|src.www)/(es|ts)/vendor
(www|src.www)/lib
(www|src.www)/vendor
node_modules
```

# Built-in Aliases

The default configurations add the following aliases, which may be useful in resolving your app's modules:

Alias            | Path
----------------:|:--------------------------------------
`$LIB`           | `(www|src.www)/lib`
`Lib`            | `(www|src.www)/lib`
`$VENDOR`        | `(www|src.www)/vendor`
`Vendor`         | `(www|src.www)/vendor`
`Components`     | `(www|src.www)/(es|ts)/components`
`Controllers`    | `(www|src.www)/(es|ts)/controllers`
`Models`         | `(www|src.www)/(es|ts)/models`
`Pages`          | `(www|src.www)/(es|ts)/pages`
`Routes`         | `(www|src.www)/(es|ts)/routes`
`Templates`      | `(www|src.www)/(es|ts)/templates`
`Utilities`      | `(www|src.www)/(es|ts)/utilities`
`Views`          | `(www|src.www)/(es|ts)/views`

# Overriding the configuration

Preferably you should make changes to `webpack.config.js` instead of changing `webpack.common.js`. The main reason is that doing so allows you to remove `webpack.common.js` should a new version of the plugin require a fresh version. Plus, unless you're completely changing how the bundling works, you'll end up with a more maintainable configuration.

## webpack.common.js exports

The following are exported by `webpack.common.js`:

* `config(options)`: returns a webpack configuration based on `options`, as follows:
    * `src` (optional): Source directory; defaults to `$PROJECT_ROOT/www.src` if present, or `$PROJECT_ROOT/www` otherwise.
    * `dirs` (required): directory mappings. A default mapping is exported as `defaults.dirs` and looks like follows:
        ```js
        {
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
        ```

        * The `alias` key is used to add additional module resolution aliases. In addition, `$LIB`, `Lib`, `$VENDOR` and `Vendor` point to `dirs.lib` and `dirs.vendor`.
    * `sourcePaths` (optional): Provides the names of the source paths that can be transformed. Any missing paths are copied from the default, as follows:
        ```js
        {
            src: options.src,
            es: dirs.es,
            ts: dirs.ts
            scss: dirs.scss
        }
        ```
    * `outputPaths` (optional): Provides the names of the output paths. Any missing paths are copied from the default, as follows:
        ```js
        {
            www: dirs.www,
            js: dirs.js,
            css: dirs.css
        }
        ```
    * `indexes` (optional): Provides source/destination mapping for varies entry and index files. Extended from the following form (`from` is relative to `sourcePaths.src`, and `to` is relative to `outputPaths.www`):
        ```js
        {
            scss: {from:, to:},
            es: {from:, to:},
            ts: {from:, to:},
            vendor: {to:}
        }
        ```
    * `outputFile` (optional): Specifies the output filename for the JavaScript bundle. Defaults to `indexes.es.to + "bundle.js"` (or `bundle.ts` if using TypeScript).
    * `vendor` (required): Modules to output as part of the `vendor` chunk. If none, pass `[]`.
    * `entryFiles` (optional): Specifies the entry files for the app. If not provided, defaults to (substituting `ts` if using TypeScript):
        ```js
        {
            app: ["./" + indexes.es.from, "./" + indexes.scss.from],
            vendor: vendor  // if vendor has length > 0
        }
        ```
    * `allowTypeScript` (optional): Indicates if typescript is permitted. This enables extra extensions and configuration for the TypeScript compiler. Defaults to `false`.
    * `allowScss` (optional): Indicates if Scss is permitted. Defaults to `false`.
    * `transpiler` (optional): Indicates the webpack loader to use for JavaScript files. If `allowTypeScript` is `true`, defaults to `ts-loader`.
    * `assetsToCopyIfExternal` (required): Indicates the assets to copy from `dirs.external` to `dirs.www`. A default list is exported under `defaults.assetsToCopyIfExternal`, and looks like follows:
        ```js
        [
            { from: "*.html" },
            { from: dirs.img + "/**/*" },
            { from: dirs.css + "/**/*" },
            { from: dirs.js + "/**/*" },
            { from: dirs.vendor + "/**/*" },
            { from: dirs.lib + "/**/*" },
            { from: dirs.html + "/**/*" },
        ]
        ```
    * `assetsToCopyIfSibling` (required): Same as `assetsToCopyIfExternal`, but applies if the source directory is the `dirs.www` folder instead of `dirs.external`. The exported default (`defaults.assetsToCopyIfSibling`) is `[]`.
* `defaults`: useful defaults, as follows
    * `dirs`: exports default directory mappings
    * `vendor`: exports default vendor modules
    * `assetsToCopyIfExternal`, `assetsToCopyIfSibling`: exports default assets to copy
    * `transpiler`: exports default transpiler

# License

Apache 2.0.
