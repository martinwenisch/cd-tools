import { NextApiRequest, NextApiResponse } from "next";
import mjml2html from "mjml";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const mjmlSource = request.body;
  if (!mjmlSource || request.method !== "POST") {
    response
      .status(400)
      .send("Please POST with the MJML source in request body.");
    return;
  }
  response.setHeader("Content-Type", "text/html; encoding=utf-8");
  response.status(200).send(mjml2html(mjmlSource).html);
}
