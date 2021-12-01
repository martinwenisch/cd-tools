import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

const https = require('https');

export default async (
  request: VercelRequest,
  response: VercelResponse
): Promise<void> => {
  const deploy_url = process.env.VERCEL_DEPLOY_HOOK_URL;
  const webhook_url = request.query.webhook_url as string;
  const delay = request.query.delay as string;

  if (!deploy_url) {
    const msg = "Služba je špatně nastavená, v prostředí chybí proměnná VERCEL_DEPLOY_HOOK_URL.";
    console.error(msg);
    response.status(500).send(msg);
    return;
  }

  if (!webhook_url) {
    const msg = "Chybí parametr webhook_url.";
    console.error(msg);
    response.status(400).send(msg);
    return;
  }

  if (delay && (delay === 't' || delay === 'true')) {
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  const deploy_response = await fetch(deploy_url);
  if (deploy_response.ok) {
    const text = "Deployment už frčí! Za pár minut by měla naskočit nová verze webu.";
    await fetch(webhook_url, {
      method: "POST",
      body: JSON.stringify({ text }),
      headers: { "Content-Type": "application/json" },
    });

    let body = await deploy_response.json()
    console.log("job.createdAt:", body.job.createdAt)

    const params = new URLSearchParams({ webhook_url: webhook_url, start_time: body.job.createdAt });
    let options = {
      hostname: process.env.VERCEL_URL,
      method: 'GET',
      path: `/api/web_deploy/check?${params}`,
      headers: { 'Content-Type': 'application/json', 'Content-Length': 0 },
    };

    await new Promise((resolve, reject) => {
      let req = https.request(options);
      req.on('error', (e: Error) => {
        console.error(`Request error: ${e.message}`);
        reject(e);
      });
      req.end(() => {
        console.log("Request passed to /api/web_deploy/check");
        resolve();
      });
    });

    response.status(200).send(text);
  } else {
    console.error(JSON.stringify(deploy_response))
    response.status(500).send("Je to rozbitý, Vercel vrátil chybu :(");
  }
};
