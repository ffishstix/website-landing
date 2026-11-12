const express = require("express");
const {publicPath} = require("./constants");

function configureApp(app) {
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
        if (req.method === "OPTIONS") return res.sendStatus(204);
        next();
    });
    app.use("/public", express.static(publicPath));
}

module.exports = {configureApp};
