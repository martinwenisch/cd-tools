import { NowRequest, NowResponse } from "@now/node";
import Airtable from "airtable";

interface Event {
  Name: string | undefined;
  Attendees: string[] | undefined;
}

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
    const eventId = req.body.eventId;
    if (!eventId) {
      throw "Required 'eventId' argument missing.";
    }
    const apiToken = process.env.AIRTABLE_API_KEY;
    if (!apiToken) {
      throw "Airtable API key not found in env.";
    }
    const table = new Airtable({ apiKey: apiToken }).base("apppZX1QC3fl1RTBM")(
      "RSVP"
    );
    // TBD: Is this a race condition?
    // https://community.airtable.com/t/append-linked-record-using-api/39420
    const event = (await table.find(eventId)) as Airtable.Record<Event>;
    const attendees = event.fields["Attendees"] || [];
    if (!attendees.includes(userId)) {
      await table.update(eventId, {
        Attendees: attendees.concat([userId]),
      });
    }
    res.status(200).send("Díky, budeme se těšit!");
  } catch (e) {
    // TBD: Remove error logging before production deployment
    res.status(500).send(`Error: ${e}`);
  }
};
