import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

const https = require('https');

export default async (
  request: VercelRequest,
  response: VercelResponse
): Promise<void> => {
  // Webhook URL is typically coming from a Slack integration
  const webhook_url = request.body.response_url as string;
  const delay =  request.query ? request.query.delay as string : '';

  if (!webhook_url) {
    response.status(400).send("Chybí parametr webhook_url.");
    return;
  }

  const params = new URLSearchParams({ webhook_url });
  if (typeof delay !== 'undefined' && delay.length > 0) {
    params.set("delay", delay);
  }

  // Call the `web_deploy/trigger` without waiting for an answer

  let options = {
    hostname: process.env.VERCEL_URL,
    method: 'GET',
    path: `/api/web_deploy/trigger?${params}`,
    headers: { 'Content-Type': 'application/json', 'Content-Length': 0 },
  };

  await new Promise((resolve, reject) => {
    let req = https.request(options);
    req.on('error', (e: Error) => {
      console.error(`Request error: ${e.message}`);
      reject(e);
    });
    req.end(() => {
      console.log("Request passed to /api/web_deploy/trigger");
      resolve();
    });
  });

  // Respond immediately to the caller

  response
    .status(200)
    .send(
      "Potvrzuju příjem, domlouvám s Vercelem přenasazení webu, malý moment…"
    );
};
