import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async (
  request: VercelRequest,
  response: VercelResponse
): Promise<void> => {
  const response_hook = request.body.response_url as string;
  if (!response_hook) {
    response.status(400).send("Chybí parametr response_hook.");
    return;
  }

  setTimeout(async () => {
    const params = new URLSearchParams({ response_hook });
    const root = process.env.VERCEL_URL;
    await fetch(`https://${root}/api/web_deploy/trigger?${params}`);
    console.log("Nice!");
  }, 2000);

  response
    .status(200)
    .send(
      "Potvrzuju příjem, domlouvám s Vercelem přenasazení webu, malý moment…"
    );
};
