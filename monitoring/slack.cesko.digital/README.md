Monitoring https://slack.cesko.digital
======================================

Tento adresář obsahuje `Dockerfile` a aplikaci pro monitorování [zvací stránky do Slacku Česko.Digital](https://slack.cesko.digital).

`Dockerfile` je optimalizovaný pro spuštění přes [AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html), Node.js aplikace v `app.js` ověřuje, že stránka obsahuje očekávaný text. Chráníme se především proti [expirovanému odkazu](https://join.slack.com/t/cesko-digital/shared_invite/zt-v2nf2xox-zCQHwEk4NHHmkgM4mxeXdQ).

Aplikace využívá knihovnu [`puppeteer`](https://github.com/puppeteer/puppeteer) pro instalaci, spuštění a interakci s _headless_ prohlížečem Chrome.

Lokální vývoj
-------------

Nainstalujte závislosti pomocí `npm install` a spusťte `npm run setup`.

Aplikaci můžete přímo spustit příkazem `npm run local`.

Docker
------

Pro vytvoření _Docker_ image nejprve stáhněte runtime environment pro AWS Lambda:

```
curl -# -L -O https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/latest/download/aws-lambda-rie-arm64
```

Poté vytvořte image a spusťte container:

```
docker build -t slack-invite-monitoring .
docker run -it -p 9000:8080 slack-invite-monitoring
```

Aplikace je dostupná lokálně:

```
curl 'http://localhost:9000/2015-03-31/functions/function/invocations' -d '{}'
```

Deployment
----------

Aplikace je hostována v AWS Lambda jako Docker container (arm64) umístěný v Elastic Container Registry (ECR). Pro deployment vytvořte a otagujte image:

```
docker build -t slack-invite-monitoring .
docker tag slack-invite-monitoring:latest <REPLACE>.dkr.ecr.us-east-2.amazonaws.com/slack-invite-monitoring:latest
```

Přihlašte se do ECR a nahrajte image:

```
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin <REPLACE>.dkr.ecr.us-east-2.amazonaws.com
docker push <REPLACE>.dkr.ecr.us-east-2.amazonaws.com/slack-invite-monitoring:latest
```

Vytvořte nebo aktualizujte funkci v AWS konzoli.
