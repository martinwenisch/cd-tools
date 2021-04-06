import { NowRequest, NowResponse } from "@now/node";
import Airtable from "airtable";

export default async (req: NowRequest, res: NowResponse) => {
  try {
    const apiToken = process.env.AIRTABLE_API_KEY;
    if (!apiToken) {
      throw "Airtable API key not found in env.";
    }
    const table = new Airtable({ apiKey: apiToken }).base("apppZX1QC3fl1RTBM")(
      "Volunteers"
    );
    // TBD: Take record ID, update RSVP column in Airtable
    res.status(200).send("Všecko bude!");
  } catch (e) {
    // TBD: Remove error logging before production deployment
    res.status(500).send(`Error: ${e}`);
  }
};
