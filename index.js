const rfg = require("rfg-api").init();
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const pluginName = "RealFaviconPlugin";

class RealFaviconPlugin {
  // Do some setup and check we were given the correct options
  constructor(options) {
    const { faviconJson, outputPath } = options;
    if (!faviconJson)
      throw new Error(`${pluginName}: Missing faviconJson option`);
    if (!outputPath)
      throw new Error(`${pluginName}: Missing outputPath option`);

    this.options = options;
  }

  // Generate and write favicon images
  generateFavicons(cb) {
    rfg.generateFavicon(this.request, this.options.outputPath, cb);
  }

  // This is the function Webpack calls during compilation
  apply(compiler) {
    // Hook into https://webpack.js.org/api/compiler-hooks#thiscompilation
    // for the initial setup
    compiler.hooks.thisCompilation.tap(pluginName, compilation => {
      const jsonPath = path.join(compiler.context, this.options.faviconJson);
      const json = require(jsonPath);
      const outputPath = this.options.outputPath;

      const opts = {
        apiKey: "6ab35684defad6496917dd53a88c9b25dad4f072",
        masterPicture: json.masterPicture,
        iconsPath: json.iconsPath,
        design: json.design,
        settings: json.settings,
        versioning: json.versioning
      };

      this.request = rfg.createRequest(opts);

      // If we are injecting into some HTML, do the work once html-webpack-plugin is
      // ready to emit assets https://github.com/jantimon/html-webpack-plugin#beforeemit-hook
      if (this.options.inject === true) {
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
          pluginName,
          (data, cb) => {
            this.generateFavicons((err, res) => {
              if (err) return cb(err);
              data.html = data.html.replace(
                "</head>",
                res.favicon.html_code + "</head>"
              );
              cb(null, data);
            });
          }
        );
      }
    });

    // If we're not injecting, generate the favicons just before Webpack
    // emits assets https://webpack.js.org/api/compiler-hooks/#emit
    if (this.options.inject !== true) {
      compiler.hooks.emit.tapAsync(pluginName, (compilation, cb) => {
        this.generateFavicons((err, res) => {
          if (err) return cb(err);
          cb(null, compilation);
        });
      });
    }
  }
}

module.exports = RealFaviconPlugin;
