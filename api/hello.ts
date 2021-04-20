import { NowRequest, NowResponse } from "@now/node";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const name = req.query.name;
  if (name) {
    res.status(200).send(`Hello, ${name}!`);
  } else {
    res.status(200).send("Hello, world!");
  }
};
