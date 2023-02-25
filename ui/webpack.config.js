const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconWebpackPlugin = require("favicons-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        exclude: "/node_modules/",
        use: "babel-loader",
      },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      {
        test: /\.(css|scss)$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 30 * 1024,
          },
        },
        generator: {
          filename: "static/media/[name].[ext]",
        },
      },
      {
        test: /\.(eot|ttf|woff)$/i,
        type: "asset/resource",
        generator: {
          filename: "static/fonts/[name].[ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"], // разрешение импорта без подставления extension
  },
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[fullhash].js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "assets", "index.html"),
      //filename: "index.[fullhash].html",  // ДЛЯ PRODUCTION
      favicon: "./src/assets/icons/favicon.ico",
    }),
    new FaviconWebpackPlugin({
      logo: "./src/assets/icons/android-chrome-512x512.png",
      logoMaskable: "./src/assets/icons/android-chrome-maskable-512x512.png",
      prefix: "static/icon/",
      inject: true,
      favicons: {
        appName: "KR Forum",
        appShortName: "KR Forum",
        appDescription:
          "KR Forum - учебный проект с целью изучения стека технологий React, Redux, TypeScript, Webpack",
        developerName: "Denis Losev",
        theme_color: "#657a6b",
        appleStatusBarStyle: "#657a6b",
        background: "#000000",
        display: "standalone",
        start_url: ".",
        scope: "/",
        lang: "ru",
        icons: {
          favicons: false,
        },
      },
    }),
    new CleanWebpackPlugin(),
    new webpack.EnvironmentPlugin({
      CUSTOM_ENV: "lol",
    }),
  ],
  devServer: {
    static: "./src",
    hot: true,
    port: 8080,
  },
};
