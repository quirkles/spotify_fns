locals {
  project_id           = "spotify-application-356414"
  location             = "us-central1"
  source_dir           = "${path.root}/../../../dist/handleArtistFromTopTrackAdd"
}

provider "google" {
  project = local.project_id
  region  = "us-central1"
  credentials = "${path.root}/../../../terraform/creds.json"
}

module "check_pubsub_function" {
  source                = "../../../terraform/modules/functions/push-subscription"
  function_name         = "handle_artist_from_top_track_add"
  # In base environments, the delivery-check-topic already exists, so we want to subscribe to it,
  # however, in dynamically named envs, we want to subscribe to the topic created for this env alone
  # in order to enable isolated testing
  topic_name            = "spotify_api_events"
  filter                = "attributes.eventType = \"ARTISTS_SAVED_FROM_TOP_TRACKS\""
  available_memory_mb   = 128
  project_id            = local.project_id
  location              = local.location
  source_dir            = local.source_dir
}
