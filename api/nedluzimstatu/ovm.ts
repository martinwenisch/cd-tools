import { createProxyMiddleware } from "http-proxy-middleware";
import { NowRequest, NowResponse } from "@now/node";
import { addCORSHeaders, runMiddleware } from "./_shared";
import * as express from "express";

const apiKey = process.env.APITALKS_API_KEY as string;
const proxyTimeout = 8000;

const ovmApi = createProxyMiddleware({
  target: "https://api.apitalks.store/",
  prependPath: false,
  changeOrigin: true,
  proxyTimeout: proxyTimeout,
  timeout: proxyTimeout + 5,
  headers: {
    "x-api-key": apiKey,
  },
  pathRewrite: function (path: string, req: express.Request) {
    // strip all query string not to allow filters etc.
    var newPath = path.replace(/\?.*$/, '');
    // strip original path, update if this file is moved
    newPath = newPath.replace(/api\/nedluzimstatu\//, '');
    // disable ovm listing if id is empty
    if (newPath.match(/\/ovm[\/\?]*$/)) {
        newPath = newPath + "/unknown";
    }
    console.log("path:" + newPath);
    return newPath;
  },
  onProxyRes: addCORSHeaders,
  onError: (error, _, response) => {
    response.status(500).send(`Error: ${error}`);
  },
});

export default async function (req: NowRequest, res: NowResponse) {
  await runMiddleware(req, res, ovmApi);
}
