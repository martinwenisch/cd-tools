# API for deploying the Česko.Digital website

Scripts in this folder provide an API to deploy the [cesko.digital](https://cesko.digital) website.

The entrypoint of the API is `web_deploy/accept`, which immediately responds to the caller, typically a Slack integration, while executing a request to `web_deploy/trigger` without waiting for the response.

The `web_deploy/trigger` endpoint creates a new deployment through the [Vercel Deploy Hook](https://vercel.com/docs/concepts/git/deploy-hooks), responds to the caller and executes a request to `web_deploy/check` without waiting for the response.

The `web_deploy/check` endpoint tries to get a new deployment from the [Vercel List Deployments](https://vercel.com/docs/rest-api#endpoints/deployments/list-deployments) API which was created later than the `createdAt` value returned from the previous step. If it is (typically) not yet found, it schedules a new request to itself in 10 seconds, again without waiting for the response. Therefore, the `web_deploy/check` endpoint is self-executing periodically, until the deployment is found, or a timeout (5 minutes) is reached.