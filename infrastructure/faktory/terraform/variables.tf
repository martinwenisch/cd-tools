variable "instance_type" {
  description = "The instance type"
  default     = "e2-micro"
}

variable "instance_image" {
  description = "The instance OS image"
  default     = "ubuntu-1804-lts"
}

variable "instance_region" {
  description = "The GCP region where to create the instance"
  default     = "europe-west1"
}

variable "assets_bucket_name" {
  description = "The bucket name for Terraform state and other assets"
  default     = "terraform-cesko-digital-faktory"
}

variable "aws_zone_id" {
  description = "The ID of the AWS Route 53 hosted zone"
  default     = "Z1GEPNR58RFJ4N"
}

variable "faktory_password" {
  type        = string
  description = "Password for accessing Faktory"
  nullable    = false
  sensitive   = true

  validation {
    condition     = length(var.faktory_password) >= 30
    error_message = "The password must be at least 30 character long."
  }
}
