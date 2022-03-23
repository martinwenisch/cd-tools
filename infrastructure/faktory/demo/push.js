const faktory = require("faktory-worker");
require('tls');

(async () => {
  const client = await faktory.connect();
  await client.job("Example", { foo: "bar" }).push();
  await client.close(); // reuse client if possible! remember to disconnect!
})().catch((e) => console.error(e));
