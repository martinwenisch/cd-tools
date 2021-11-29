import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async (
  request: VercelRequest,
  response: VercelResponse
): Promise<void> => {
  const deploy_url = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (deploy_url) {
    const vercel_response = await fetch(deploy_url);
    if (vercel_response.ok) {
      response
        .status(200)
        .send("Už to frčí, detaily tady: https://cesko.digital/_logs");
    } else {
      response.status(500).send("Je to rozbitý, Vercel vrátil chybu :(");
    }
  } else {
    response
      .status(500)
      .send(
        "Služba je špatně nastavená, v prostředí chybí proměnná VERCEL_DEPLOY_HOOK_URL."
      );
  }
};
