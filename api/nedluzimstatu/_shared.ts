import * as http from "http";
import * as express from "express";

const corsAllowedOrigins = [
  "https://www.nedluzimstatu.cz",
  "https://staging.nedluzimstatu.cz",
  "https://nedluzimstatu.ceskodigital.net",
];
const corsAllowedHeaders = "Origin, X-Requested-With, Content-Type, Accept";
const httpCacheControl = "public, max-age=3600";

export function addCORSHeaders(
  proxyResponse: http.IncomingMessage,
  request: express.Request,
  _: express.Response
) {
  let origin = request.headers.origin;
  if (Array.isArray(origin)) {
    origin = origin[0];
  }
  let theOrigin =
    (typeof origin !== 'udefined' && corsAllowedOrigins.indexOf(origin) >= 0) ? origin : corsAllowedOrigins[0];
  proxyResponse.headers["Access-Control-Allow-Origin"] = theOrigin;
  proxyResponse.headers["Access-Control-Allow-Headers"] = corsAllowedHeaders;
  proxyResponse.headers["Cache-Control"] = httpCacheControl;
}

export function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      } else {
        return resolve(result);
      }
    });
  });
}
