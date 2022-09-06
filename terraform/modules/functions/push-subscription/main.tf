locals {
  function_name = var.create_function ? google_cloudfunctions_function.function[0].name : ""
  trigger_url   = var.create_function ? google_cloudfunctions_function.function[0].https_trigger_url : ""
  count         = var.create_function ? 1 : 0
  env_vars = merge(var.env_vars, {
    IS_CLOUD = "1"
  })
}

# Zip and upload function code to bucket
module "function_bucket" {
  source        = "../fn-bucket"
  project_id    = var.project_id
  location      = var.location
  function_name = var.function_name
  source_dir    = var.source_dir
  create_bucket = var.create_function
}

# Create Cloud Function
resource "google_cloudfunctions_function" "function" {
  project = var.project_id
  region  = var.location
  timeout = var.timeout
  runtime = var.runtime
  name    = var.function_name
  count   = local.count

  available_memory_mb   = var.available_memory_mb
  max_instances         = var.max_instances
  min_instances         = var.min_instances
  environment_variables = local.env_vars
  entry_point           = var.entry_point
  source_archive_bucket = module.function_bucket.bucket_name
  source_archive_object = module.function_bucket.object_name
  trigger_http          = true
}

# Create Subscription
resource "google_pubsub_subscription" "subscription" {
  name                 = "subscription_${var.topic_name}_${local.function_name}"
  topic                = var.topic_name
  filter               = var.filter
  ack_deadline_seconds = var.timeout
  count                = local.count

  push_config {
    push_endpoint = local.trigger_url
  }
}

# Give subscription permission to invoke function
resource "google_cloudfunctions_function_iam_binding" "binding" {
  project        = var.project_id
  region         = var.location
  count          = local.count
  cloud_function = local.function_name
  members        = ["allUsers"]
  role           = "roles/cloudfunctions.invoker"
}
