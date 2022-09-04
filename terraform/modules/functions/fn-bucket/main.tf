# Compress source code
data "archive_file" "source" {
  type        = "zip"
  source_dir  = var.source_dir
  output_path = "/tmp/${var.function_name}_fn.zip"
  count       = var.create_bucket ? 1 : 0
}

# Create bucket that will host the source code
resource "google_storage_bucket" "bucket" {
  project  = var.project_id
  name     = "${var.function_name}_fn"
  location = var.location
  count    = var.create_bucket ? 1 : 0

  timeouts {
    create = "10m"
    update = "10m"
  }
}

# Add source code zip to bucket
resource "google_storage_bucket_object" "zip" {
  name   = "${var.create_bucket ? data.archive_file.source[0].output_sha : ""}.zip"
  bucket = var.create_bucket ? google_storage_bucket.bucket[0].name : ""
  source = var.create_bucket ? data.archive_file.source[0].output_path : ""
  count  = var.create_bucket ? 1 : 0

  timeouts {
    create = "10m"
    update = "10m"
  }
}

output "bucket_name" {
  value = var.create_bucket ? google_storage_bucket.bucket[0].name : ""
}

output "object_name" {
  value = var.create_bucket ? google_storage_bucket_object.zip[0].name : ""
}
