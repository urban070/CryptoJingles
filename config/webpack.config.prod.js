const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    chunkFilename: '[chunkhash]-[chunkhash].js',
  },
  module: {
    loaders: [
      { test: /\.(js|jsx)$/, loaders: ['babel-loader', 'eslint-loader'], exclude: /node_modules/ },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              optipng: {
                optimizationLevel: 7,
                interlaced: false,
              },
            }
          },

        ]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?minimize=true&modules&importLoaders=1&localIdentName=[local]', 'sass-loader', 'autoprefixer-loader?browsers=last 2 version']
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?minimize=true&modules&importLoaders=1&localIdentName=[local]', 'autoprefixer-loader?browsers=last 2 version']
        })
      },
      { test: /\.(eot|ttf|woff|woff2)$/, loader: 'file-loader?name=[name].[ext]' },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new CleanPlugin([path.resolve('dist')], { root: path.resolve(__dirname, '../') }),
    new ExtractTextPlugin('[name].css', {allChunks: true}),
    HtmlWebpackPluginConfig,
    // optimizations
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: {removeAll: true } },
      canPrint: true
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new UglifyJSPlugin({ uglifyOptions: {
      compress: {
        warnings: false,
      },
    } }),
    // new FaviconsWebpackPlugin(path.resolve('favicon.png')),
    new webpack.DefinePlugin({
      'process.env': {
        env: '"production"',
        NODE_ENV: '"production"',
      }
    })
  ]
};