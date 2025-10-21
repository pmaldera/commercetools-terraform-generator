terraform {
        required_version = ">= 1.3.0"

        required_providers {
            commercetools = {
            source  = "labd/commercetools"
            version = "~> 1.19"
            }
        }
}

# Parses the .env file to create variables to use with the provider.
# We currently avoid using env variables with the provider because of the following issue: https://github.com/labd/terraform-provider-commercetools/issues/466#issuecomment-2539085971

locals {
        variables = { for tuple in regexall("(.*)=\"(.*)\"", file(".env")) : tuple[0] => tuple[1] }
}

provider "commercetools" {
        client_id     = local.variables["CTP_CLIENT_ID"]
        client_secret = local.variables["CTP_CLIENT_SECRET"]
        project_key   = local.variables["CTP_PROJECT_KEY"]
        scopes        = local.variables["CTP_SCOPES"]
        api_url       = local.variables["CTP_API_URL"]
        token_url     = local.variables["CTP_AUTH_URL"]
}