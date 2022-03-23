# Infrastructure for running Faktory

The code in this folder is used to provision infrastructure for
the background queue system [`contribsys/faktory`](https://github.com/contribsys/faktory)
with [_Terraform_](https://www.terraform.io).

It expects the following prerequisites:

1. A project within [Google Cloud Platform](https://cloud.google.com) (GCP)
called `cesko-digital-faktory`.

2. An existing [service account](https://cloud.google.com/iam/docs/service-accounts)
with the following permissions: `Service Account User`, `Compute Admin`, `Storage Object Admin`.

3. A cloud storage bucket called `terraform-cesko-digital-faktory` with two folders:
    * `assets/`, which contains a `letsencrypt.tar.gz` file with SSL certificates,
    * `tf-state/`, which is used by Terraform to manage and synchronize state.

4. A hosted zone `ceskodigital.net` within [Amazon Web Services](https://aws.amazon.com) (AWS)
for accessing the service.

## Deployment

To create the infrastructure, first export the required environment variables.

The password for accessing Faktory (both the service and web UI:

```
export TF_VAR_faktory_password=secret
```

The path to file containing the GCP service account key:

```
export GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
```

The AWS credentials:

```
export AWS_ACCESS_KEY_ID=ABC123
export AWS_SECRET_ACCESS_KEY=456def
```

Then, setup and initialize Terraform:

```
terraform init
```

Preview planned changes:

```
terraform plan
```

Create the infrastructure:

```
terraform apply
```

## Troubleshooting

In case the provisioning process fails, and you need to login into the instance,
use the [`gcloud`](https://cloud.google.com/sdk/docs/install) command line utility.

After installation, authenticate to the `cesko.digital` organization and select
the `cesko-digital-faktory` project:

```
gcloud auth login
gcloud config set project cesko-digital-faktory
```

To log into the instance over SSH, run:

```
gcloud compute ssh --zone "europe-west1-b" "faktory"  --project "cesko-digital-faktory"
```

To inspect the log output of the startup script, run:

```
sudo journalctl -u google-startup-scripts.service
```

To inspect the state of the services, use the `docker ps`, `docker logs`, etc. commands.

NOTE: Before executing `docker` commands as an unpriviledged user, run:

```
sudo usermod -aG docker $USER
newgrp docker
```
