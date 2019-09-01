const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');


module.exports = {
  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].[hash].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 9000,
    disableHostCheck: false,
    hot: true,
    historyApiFallback: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      title: 'RXJS Sand-box',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },

      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },

      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [
      new TerserPlugin(),
    ],
  },
  devtool: 'source-map',

  node: { fs: 'empty' },
};
