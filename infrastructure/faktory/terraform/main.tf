terraform {
  required_version = ">= 1.1"

  backend "gcs" {
    bucket = "terraform-cesko-digital-faktory"
    prefix = "tf-state"
  }
}

provider "google" {
  project = "cesko-digital-faktory"
  region  = var.instance_region
}

provider "aws" {}

resource "google_compute_network" "faktory" {
  name                    = "faktory-vpc"
  description             = "Network for Faktory"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "faktory" {
  name          = "faktory-subnet"
  ip_cidr_range = "10.0.0.0/22"
  region        = var.instance_region
  network       = google_compute_network.faktory.self_link
}

resource "google_compute_firewall" "allow-ssh" {
  name        = "${google_compute_network.faktory.name}-allow-ssh"
  description = "Allow SSH from external"
  network     = google_compute_network.faktory.self_link

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["allow-ssh"]
}

# Note: HTTP is needed for the Certbot standalone server
resource "google_compute_firewall" "allow-http" {
  name        = "${google_compute_network.faktory.name}-allow-http"
  description = "Allow HTTP from external"
  network     = google_compute_network.faktory.self_link

  allow {
    protocol = "tcp"
    ports    = ["443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["allow-http"]
}

resource "google_compute_firewall" "allow-https" {
  name        = "${google_compute_network.faktory.name}-allow-https"
  description = "Allow HTTPS from external"
  network     = google_compute_network.faktory.self_link

  allow {
    protocol = "tcp"
    ports    = ["443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["allow-https"]
}

resource "google_compute_firewall" "allow-faktory" {
  name        = "${google_compute_network.faktory.name}-allow-faktory"
  description = "Allow Faktory from external"
  network     = google_compute_network.faktory.self_link

  allow {
    protocol = "tcp"
    ports    = ["7491"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["allow-faktory"]
}

resource "google_compute_disk" "faktory" {
  name = "faktory-data"
  type = "pd-ssd"
  zone = "${var.instance_region}-b"
  size = 25
  # snapshot = "snapshot-1"
  labels = { group = "faktory" }
}

resource "google_compute_instance" "faktory" {
  name         = "faktory"
  description  = "Faktory running behind Nginx"
  zone         = "${var.instance_region}-b"
  machine_type = var.instance_type

  boot_disk {
    initialize_params {
      image = var.instance_image
    }
  }

  attached_disk {
    source      = google_compute_disk.faktory.self_link
    device_name = google_compute_disk.faktory.name
    mode        = "READ_WRITE"
  }

  network_interface {
    network    = google_compute_network.faktory.self_link
    subnetwork = google_compute_subnetwork.faktory.self_link
    access_config {}
  }

  service_account {
    scopes = ["storage-ro"]
  }

  tags   = ["allow-ssh", "allow-https", "allow-faktory"]
  labels = { group = "faktory" }

  metadata_startup_script = templatefile(
    "${path.module}/scripts/startup.sh.tmpl", {
      disk_id : "google-${google_compute_disk.faktory.name}",
      mount_path : "/data",
      nginx_config : file("${path.module}/config/nginx.conf"),
      bucket_name : var.assets_bucket_name,
      faktory_password : var.faktory_password
    }
  )
}

resource "aws_route53_record" "faktory" {
  zone_id         = var.aws_zone_id
  name            = "faktory.ceskodigital.net"
  type            = "A"
  ttl             = "60"
  records         = [google_compute_instance.faktory.network_interface.0.access_config.0.nat_ip]
  allow_overwrite = true
}
