
const path = require("path");
const env = require("../utils/environment");

const appDirectory = path.resolve(__dirname, '../../../');

const webPath = path.resolve(__dirname, "../../");
const assetPath = path.resolve(__dirname, "../../assets");
const distPath = path.resolve(__dirname, "../../wwwroot");
const appOutputPath = path.join(distPath, "app");

const templateSrcPath = path.join(assetPath, "template");
const templateDistPath = path.join(webPath, "Views", "Shared");

module.exports = {
    appRoot: env.getAppRoot(),

    appDirectory,

    app: path.resolve(appDirectory, 'index.web.js'),

    devServer: {
        contentBase: "./wwwroot",
        url: "https://localhost:8081",
        publicPath: "/wwwroot/",
        contentPath: "https://localhost:8081/wwwroot/",
        compress: true,
        port: 8081,
    },

    cleanOptions: [appOutputPath],

    relativePaths: {
        app: "app/"
    },

    assetPath,

    distPath,

    appOutputPath,

    templateSrcPath,

    templateDistPath,
}