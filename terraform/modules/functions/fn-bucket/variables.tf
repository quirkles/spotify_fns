variable "function_name" {
  type = string
}

variable "source_dir" {
  type = string
}

variable "project_id" {
  type = string
}

variable "location" {
  type = string
}

variable "create_bucket" {
  type    = bool
  default = true
}
