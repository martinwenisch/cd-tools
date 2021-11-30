import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

const https = require('https');

export default async (
  request: VercelRequest,
  response: VercelResponse
): Promise<void> => {
  const response_hook = request.body.response_url as string;
  if (!response_hook) {
    response.status(400).send("Chybí parametr response_hook.");
    return;
  }

  const params = new URLSearchParams({ response_hook });
  let options = {
    hostname: process.env.VERCEL_URL,
    method: 'GET',
    path: `/api/web_deploy/trigger?${params}`,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': 0,
    },
  };

  await new Promise((resolve, reject) => {
    let req = https.request(options);
    req.on('error', (e: Error) => {
      console.error(`Problem with request: ${e.message}`);
      reject(e);
    });
    req.end(() => {
      console.log("Passed to /api/web_deploy/trigger");
      resolve();
    });
  });

  response
    .status(200)
    .send(
      "Potvrzuju příjem, domlouvám s Vercelem přenasazení webu, malý moment…"
    );
};
