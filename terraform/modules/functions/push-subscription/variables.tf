variable "function_name" {
  type = string
}

variable "source_dir" {
  type = string
}

variable "topic_name" {
  type = string
}

variable "filter" {
  type    = string
  default = ""
}

variable "max_instances" {
  type    = number
  default = 0
}

variable "min_instances" {
  type    = number
  default = 0
}

variable "available_memory_mb" {
  type    = number
  default = 256
}

variable "project_id" {
  type = string
}

variable "location" {
  type = string
}

variable "env_vars" {
  type    = map(string)
  default = {}
}

variable "timeout" {
  type    = number
  default = 540
}

variable "create_function" {
  type = bool
  default = true
}

variable "runtime" {
  type    = string
  default = "nodejs16"
}

variable "entry_point" {
  type    = string
  default = "main"
}
