import { NowRequest, NowResponse } from "@now/node";
import Airtable from "airtable";

export default async (req: NowRequest, res: NowResponse) => {
  // Only GET or POST supported
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(501).send("Not implemented");
  }

  // GET: return event details
  if (req.method === "GET") {
    res.status(501).send("Not implemented yet. Pull requests welcome!");
    return;
  }

  // POST: Update RSVP
  try {
    const userId = req.body.userId;
    if (!userId) {
      throw "Required 'userId' argument missing.";
    }
    const apiToken = process.env.AIRTABLE_API_KEY;
    if (!apiToken) {
      throw "Airtable API key not found in env.";
    }
    const table = new Airtable({ apiKey: apiToken }).base("apppZX1QC3fl1RTBM")(
      "Volunteers"
    );
    await table.update(userId, { rsvp_test_zoul: true });
    res.status(200).send("Díky, budeme se těšit!");
  } catch (e) {
    // TBD: Remove error logging before production deployment
    res.status(500).send(`Error: ${e}`);
  }
};
