const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    './src/js/index.js', 
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: path.resolve(__dirname, '/')
  },
  module: {
    rules: [
        { test: /\.(js|jsx)?$/, exclude: /node_modules/, loader: "babel-loader" },
        { test: /\.md$/, use: [
              {
                  loader: "html-loader"
              },
              {
                  loader: "markdown-loader",
                  options: {
                      /* your options here */
                  }
              }
          ]
        },
        {
          test: /\.(css|scss)$/, use: [{
              loader: "style-loader" // creates style nodes from JS strings
          }, {
              loader: "css-loader" // translates CSS into CommonJS
          }, {
              loader: "sass-loader" // compiles Sass to CSS
          }]
        }, //css only files
        { 
          test: /\.(png|svg|jpg|gif)$/, use: {
            loader: 'file-loader',
            options: { name: '[name].[ext]' } 
          }
        }, //for images
        { test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/, use: ['file-loader'] } //for fonts
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
        favicon: 'favicon.png',
        template: 'template.html'
    })
  ]
};