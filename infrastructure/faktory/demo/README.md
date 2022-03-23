# Demo for Faktory background jobs infrastructure

1. Generate the certificates:

```
mkdir cert
docker run -it --rm -v $PWD/cert:/cert -w /cert alpine/openssl req -x509 -out /cert/localhost.crt -keyout /cert/localhost.key -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost'
```

2. Launch Faktory and Nginx:

```
FAKTORY_PASSWORD=secret docker-compose up
```

3. Run the demonstration script:

```
bundle install
SSL_CERT_FILE=cert/localhost.crt FAKTORY_PROVIDER=FAKTORY_URL FAKTORY_URL=tcp+tls://:secret@localhost:7491 bundle exec faktory-worker -r ./app.rb
```
