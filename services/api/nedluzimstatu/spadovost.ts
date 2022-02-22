import { createProxyMiddleware } from "http-proxy-middleware";
import { NowRequest, NowResponse } from "@now/node";
import { addCORSHeaders, runMiddleware } from "./_shared";
import * as express from "express";

const apiKey = process.env.APITALKS_API_KEY as string;
const proxyTimeout = 8000;

function rewritePath(path: string, req: express.Request): string {
  var query = req.query;
  var filter = "";
  if (query.kod_obce) {
    filter = filter + ',"where":%7B"KOD_OBCE": ' + query.kod_obce + "%7D";
  } else if (query.kod_momc) {
    filter = filter + ',"where":%7B"KOD_MOMC": ' + query.kod_momc + "%7D";
  } else {
    filter = filter + ',"where":%7B"KOD_OBCE": ' + "0" + "%7D"; // default, returns not found
  }
  return path.replace(/\?*.*$/, "?filter=%7B%22limit%22:2" + filter + "%7D");
}

const spadovostApi = createProxyMiddleware({
  target: "https://api.apitalks.store/apitalks.com/spadovost",
  changeOrigin: true,
  proxyTimeout: proxyTimeout,
  timeout: proxyTimeout + 5,
  headers: { "x-api-key": apiKey },
  pathRewrite: rewritePath,
  onProxyRes: addCORSHeaders,
  onError: (error, _, response) => {
    response.status(500).send(`Error: ${error}`);
  },
});

export default async function (req: NowRequest, res: NowResponse) {
  await runMiddleware(req, res, spadovostApi);
}
