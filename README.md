# real-favicon-webpack-plugin

Generate favicons using [RealFaviconGenerator](https://github.com/RealFaviconGenerator) as part of your Webpack build process.


## Install

```
yarn add --dev real-favicon-webpack-plugin
```

```
npm i --save-dev real-favicon-webpack-plugin
```


## Usage

In your Webpack config:

**webpack.config.js**

```js
const RealFaviconPlugin = require('real-favicon-webpack-plugin');

module.exports = {
  plugins: [
    new RealFaviconPlugin({
      faviconJson: 'favicon.json',
      outputPath: 'dist/assets/favicons',
      inject: true
    })
  ]
}
```

The options are:

* `faviconJson` (required): the path to a JSON configuration file from the [RFG website](https://realfavicongenerator.net)
* `outputPath` (required): the path where the plugin will output the favicon files generated from your config
* `inject` (optional): if `true`, hooks into [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin) to inject `<link>` tags for your favicons into your HTML


Note that the `inject` option requires you to be using `html-webpack-plugin@next`. It also requires you to have set `settings.htmlCodeFile: true` in your `faviconJson` configuration file (the "Generate `html_code.html`" option when generating the configuration on the RFG website).


### Generated files

The plugin will generate files based on your configuration file. Generally these will include one or more favicon images, and possibly some browser- or device-specific files such as `browserconfig.xml` for IE11.
