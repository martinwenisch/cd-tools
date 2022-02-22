import * as http from "http";
import * as express from "express";

const corsAllowedHeaders = "Origin, X-Requested-With, Content-Type, Accept";
const httpCacheControl = "public, max-age=3600";

export function addCORSHeaders(
  proxyResponse: http.IncomingMessage,
  request: express.Request,
  _: express.Response
) {
  proxyResponse.headers["Access-Control-Allow-Origin"] = '*'; // vercel cache stores reply incl. cors header -> * is required here
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
