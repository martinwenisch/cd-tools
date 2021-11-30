import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async (
  request: VercelRequest,
  response: VercelResponse
): Promise<void> => {
  const deploy_url = process.env.VERCEL_DEPLOY_HOOK_URL;
  const response_hook = request.query.response_hook as string;

  if (!deploy_url) {
    const msg =
      "Služba je špatně nastavená, v prostředí chybí proměnná VERCEL_DEPLOY_HOOK_URL.";
    console.error(msg);
    response.status(500).send(msg);
    return;
  }

  if (!response_hook) {
    const msg = "Chybí parametr response_hook.";
    console.error(msg);
    response.status(400).send(msg);
    return;
  }

  const vercel_response = await fetch(deploy_url);
  if (vercel_response.ok) {
    const text =
      "Deployment už frčí! Za pár minut by měla naskočit nová verze webu.";
    fetch(response_hook, {
      method: "POST",
      body: JSON.stringify({ text }),
      headers: { "Content-Type": "application/json" },
    });
    response.status(200).send(text);
  } else {
    response.status(500).send("Je to rozbitý, Vercel vrátil chybu :(");
  }
};
