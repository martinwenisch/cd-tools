import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async (
  request: VercelRequest,
  response: VercelResponse
): Promise<void> => {
  const deploy_url = process.env.VERCEL_DEPLOY_HOOK_URL;
  const response_hook = request.query.response_url as string;

  if (!deploy_url) {
    response
      .status(500)
      .send(
        "Služba je špatně nastavená, v prostředí chybí proměnná VERCEL_DEPLOY_HOOK_URL."
      );
    return;
  }

  if (!response_hook) {
    response.status(400).send("Chybí parametr response_url.");
    return;
  }

  response
    .status(200)
    .send("Potvrzuju příjem, domlouvám s Vercelem přenasazení webu, moment…");

  const deploy_response = await fetch(deploy_url);
  const msg = deploy_response.ok
    ? "Už to frčí 🥳  Za pár minut by se měla objevit nová verze webu."
    : "Je to rozbitý, Vercel vrátil chybu :(";

  await fetch(response_hook, {
    method: "POST",
    body: JSON.stringify({ text: msg, replace_original: true }),
    headers: { "Content-Type": "application/json" },
  });
};
