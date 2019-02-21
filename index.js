const rfg = require("rfg-api").init();
const path = require("path");

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

  // This is the function Webpack calls during compilation
  apply(compiler) {
    // Hook into https://webpack.js.org/api/compiler-hooks#thiscompilation
    compiler.hooks.thisCompilation.tap(pluginName, compilation => {
      const jsonPath = path.join(compiler.context, this.options.faviconJson);
      const json = require(jsonPath);
      const outputPath = this.options.outputPath;

      const opts = {
        // https://github.com/RealFaviconGenerator/cli-real-favicon/blob/master/common.js
        // Seems as though this can just be hard-coded?
        apiKey: "402333a17311c9aa68257b9c5fc571276090ee56",
        masterPicture: json.masterPicture,
        iconsPath: json.iconsPath,
        design: json.design,
        settings: json.settings,
        versioning: json.versioning
      };

      const request = rfg.createRequest(opts);

      // Hook into https://webpack.js.org/api/compilation-hooks#additionalassets
      compilation.hooks.additionalAssets.tapAsync(pluginName, cb => {
        rfg.generateFavicon(request, this.options.outputPath, (err, res) => {
          if (err) return cb(err);

          const html = res.favicon.html_code;
          compilation.assets["favicons.html"] = {
            source: () => html,
            size: () => html.length
          };
          cb();
        });
      });
    });
  }
}

module.exports = RealFaviconPlugin;
