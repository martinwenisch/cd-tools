require('dotenv').config();

const fetch  = require("node-fetch");
const https = require('https');

module.exports = async (request, response) => {
  // Webhook URL is typically coming from a Slack integration
  const webhook_url = request.query.webhook_url;
  // Start time is coming from the response of Vercel Deploy Hook
  const start_time = request.query.start_time;
  // Counter is passed and increased in each request
  let counter = request.query.counter;

  if (!webhook_url) {
    const msg = "Chybí parametr webhook_url.";
    console.error(msg);
    response.status(400).send(msg);
    return;
  }

  if (!start_time) {
    const msg = "Chybí parametr start_time.";
    console.error(msg);
    response.status(400).send(msg);
    return;
  }

  if (!counter) {
    counter = 0;
  } else {
    counter = Number(counter)
  }

  counter += 1;

  // Try to get latest deployment since `start_time`

  const deployment = await fetch_last_deployment(start_time);
  console.log('deployment:', deployment)

  // If a deployment is found, notify webhook, respond to the caller and return

  if (deployment) {
    let date = new Date(deployment.ready).toLocaleString("cs", { timeZone: 'Europe/Prague' });
    const text = `Nová verze webu [${deployment.uid.replace('dpl_', '')}] nasazena ${date}`;
    console.log(text)
    await fetch(webhook_url, {
      method: "POST",
      body: JSON.stringify({ text }),
      headers: { "Content-Type": "application/json" },
    });
    response.status(200).send(text)
    return;
  }

  // If the threshold of 30 repetitions is not reached, call self with increased `counter`

  if (counter < 30) {
    // Call self in 10 seconds without waiting for an answer

    const params = new URLSearchParams({ webhook_url: webhook_url, start_time: start_time, counter: counter });

    let options = {
      hostname: process.env.VERCEL_URL,
      method: 'GET',
      path: `/api/web_deploy/check?${params}`,
      headers: { 'Content-Type': 'application/json', 'Content-Length': 0 },
    };

    await new Promise((resolve, reject) => {
      setTimeout(async function() {
       let req = https.request(options);
        req.on('error', (e) => {
          console.error(`Request error: ${e.message}`);
          reject(e);
        });
        req.end(() => {
          console.log(`Scheduled next request to /api/web_deploy/check [counter=${counter}]`);
          resolve();
        });
      }, 10000);
    });

    // Respond to the caller (typically a no-op)

    response.status(200).send(`Stále čekám na nově nasazenou verzi, pokus číslo ${counter}.`)
    return;
  };

  // If the threshold has been reached, bail out and respond to the caller.
  // TODO(karmi): Notify webhook_url as well

  response.status(200).send(`Ani po ${counter} pokusech jsem nenašel nově nasazenou verzi, vzdávám to.`)
};

// Fetch latest deployment from the Vercel API for the project, in the production environment,
// with the state of READY, created later than the passed `start_time`
//
let fetch_last_deployment = async function (start_time) {
  let url = `https://api.vercel.com/v6/deployments?limit=1&target=production&state=READY&teamId=${process.env.VERCEL_TEAM_ID}&projectId=${process.env.VERCEL_PROJECT_WEB_ID}&since=${start_time}`;
  let response = await fetch(url, {
    method: "GET",
    headers: { "Authorization": `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`},
  });
  let body = await response.json();
  return body.deployments[0];
}
