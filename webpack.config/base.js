const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const config = require('./config');
const root = path.resolve(__dirname, '..');
let htmlPlugins = [];

for (let page in config.pages) {
  let conf = {
    filename: `${page}.html`,
    template: config.pages[page],
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: false
    },
    hash: false,
    chunks: [page], // 引入当前对应的js
  };
  htmlPlugins.push(new HTMLWebpackPlugin(conf));
}

console.log(htmlPlugins)

module.exports = {
  entry: config.entries,
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader'
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
          },
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: 'images/[name].[ext]?[hash:8]'
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'fonts/[name].[ext]?[hash:8]'
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      assets: path.join(root, 'src/assets'),
      common: path.join(root, 'src/common'),
      components: path.join(root, 'src/components')
    },
    extensions: ['.js']
  },
  plugins: [
    ...htmlPlugins
  ]
}

