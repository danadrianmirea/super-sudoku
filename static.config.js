import React from "react";
import {ServerStyleSheet} from "styled-components";
import path from "path";
import fs from "fs";
import showdown from "showdown";
import ExtractTextPlugin from "extract-text-webpack-plugin";

const converter = new showdown.Converter();

const URL = "https://practical-bartik-1e6a2d.netlify.com";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

function getPrivacyHtml() {
  return new Promise(resolve => {
    fs.readFile(path.join(__dirname, "src/privacy.md"), "utf8", (err, text) => {
      const html = converter.makeHtml(text);
      resolve(html);
    });
  });
}

export default {
  entry: path.join(__dirname, "src", "index.tsx"),
  getSiteData: () => ({
    title: "supersudoku",
  }),
  siteRoot: URL,
  getRoutes: async () => {
    const privacyHtml = await getPrivacyHtml();
    return [
      {
        path: "/",
        component: "src/components/pages/Game",
      },
      {
        path: "/playground",
        component: "src/components/pages/Playground",
      },
      {
        path: "/about",
        component: "src/components/pages/About",
      },
      {
        path: "404",
        component: "src/components/pages/404",
      },
    ];
  },
  renderToHtml: (render, Comp, meta) => {
    const sheet = new ServerStyleSheet();
    const html = render(sheet.collectStyles(<Comp />));
    meta.styleTags = sheet.getStyleElement();
    return html;
  },
  Document: ({Html, Head, Body, children, siteData, renderMeta}) => (
    <Html lang="en-US">
      <Head>
        <meta charSet="UTF-8" />
        <title>Super Sudoku</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1.0, shrink-to-fit=no, user-scalable=no"
        />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        <link rel="icon" href="favicon.ico" type="image/x-icon" />
        <meta name="description" content="Play sudoku games from easy to evil" />
        <meta name="keywords" content="Sudoku,Sudoku App,Game,Sudoku Generate" />
        <meta property="og:title" content="Super Sudoku" />
        <meta property="og:site_name" content="Super Sudoku" />
        <meta property="og:type" content="website" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={URL} />
        <meta property="og:description" content="Play sudoku games from easy to evil" />
        <meta property="og:image" content={`${URL}/logo-512.png`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#999999" />
        <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700" rel="stylesheet" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        {renderMeta.styleTags}
      </Head>
      <Body>{children}</Body>
    </Html>
  ),
  webpack: (config, {defaultLoaders, stage}) => {
    // Add .ts and .tsx extension to resolver
    config.resolve.extensions.push(".ts", ".tsx");

    const tsconfig = require("./tsconfig.json");

    config.resolve.alias = {
      src: path.join(__dirname, "src"),
    };

    config.module.rules = [
      {
        oneOf: [
          // defaultLoaders.cssLoader,
          {
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: defaultLoaders.jsLoader.exclude, // as std jsLoader exclude
            use: [
              {
                loader: "babel-loader",
              },
              {
                loader: require.resolve("ts-loader"),
                options: {
                  transpileOnly: true,
                },
              },
            ],
          },
          defaultLoaders.fileLoader,
          {
            test: /\.(json)$/,
            include: path.join(__dirname, "src/assets"),
            use: "file-loader",
          },
        ],
      },
    ];

    config.plugins.push(new ExtractTextPlugin("styles.css"));

    return config;
  },
};
