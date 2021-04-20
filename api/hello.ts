import { VercelRequest, VercelResponse } from "@vercel/node";

export default async (
  req: VercelRequest,
  res: VercelResponse
): Promise<void> => {
  const name = req.query.name || "world";
  res.status(200).send(`Hello, ${name}!`);
};
