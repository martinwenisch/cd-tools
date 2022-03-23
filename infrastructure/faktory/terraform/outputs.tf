output "instance_name" {
  value = google_compute_instance.faktory.name
}

output "instance_public_ip" {
  value = google_compute_instance.faktory.network_interface.0.access_config.0.nat_ip
}
