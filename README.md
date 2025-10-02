# Commercetools Terraform Generator

**A CLI tool to generate Terraform Configuration files from existing Commercetools projects.**

## Usage
1. `npm i commercetools-terraform-generator`
2. Use the different env values to configure the generator (see [Configuration](#configuration)). If a .env is provided at the root of your project it will be used.
3. Run `npx commercetools-terraform-generator`.
4. You can now use the generated `.tf` files from the output directory in your IaC setup using [the labd commercetools terraform provider](https://registry.terraform.io/providers/labd/commercetools/latest/).

## Configuration

### `IMPORT_RESOURCE` - required
The resources to import from the commercetools project and transform into terraform files, separated by commas.
Values should correspond to at least one of the resources of [labd commercetools terraform provider](https://registry.terraform.io/providers/labd/commercetools/latest/docs).

Supported values:
- `"type"`: [Commercetools Types](https://docs.commercetools.com/api/projects/types)
- `"tax_category"`: [Commercetools tax category](https://docs.commercetools.com/api/projects/taxCategories) including their [tax rates](https://docs.commercetools.com/api/projects/taxCategories#taxrate) and [sub rates](https://docs.commercetools.com/api/projects/taxCategories#subrate)
- `"all"`: All of the supported values above.

Example: 
- `"types,tax_category""`
- `"types"`
- `"all"`

### `OUTPUT_DIR` - required
The directory to generate the Terraform `.tf` files.

Examples:
- `"output"`
- `"/home/user/terraform_files/"`

### `CTP_AUTH_URL` - required
Specifies [the Commercetools auth url](https://docs.commercetools.com/api/authorization#request-an-access-token-using-the-composable-commerce-oauth-20-service) to use.

Example: `"https://auth.europe-west1.gcp.commercetools.com/"`

### `CTP_API_URL` - required
Specifies [the Commercetools api url](https://docs.commercetools.com/api/general-concepts#hosts) to use.

Example: `"https://api.europe-west1.gcp.commercetools.com/"`

### `CTP_CLIENT_ID` - required
Specifies the Commercetools API Client id to use, more info in [the HTTP API autorization Commercetools documentation](https://docs.commercetools.com/api/authorization).

### `CTP_CLIENT_SECRET` - required
Specifies the Commercetools API Client secret to use, more info in [the HTTP API autorization Commercetools documentation](https://docs.commercetools.com/api/authorization).

### `CTP_PROJECT_KEY` - required
Specifies the Commercetools project you want to import the resources from.

### `CTP_SCOPES` - optional
Specifies the [scopes](https://docs.commercetools.com/api/scopes) you want to use, separated by spaces.
If not specified all scopes defined for the API Client will be used.

Examples:
- `"manage_types:myproject`
- `"manage_types:myproject manage_tax_categories:myproject"`

### `ENABLE_CTP_LOGS` - optional
Specifies the Commercetools logger should be used.

Supported values: `"true"` or `"false"`. `"false"` if not specified.

### `SEPERATE_RESOURCES` - optional
Specifies if the generated terraform configuration files should be grouped in resource type folder.

Supported values: `"true"` or `"false"`. `"false"` if not specified, meaning all files will be generated in the directory specified by `OUTPUT_DIR`.

## "All included" docker folder
The ̀`docker` folder in [this package's github repository](https://github.com/pmaldera/commercetools-terraform-generator) contains the docker compose file and the `provider.tf` to run both this npm package and [the labd commercetools terraform provider](https://registry.terraform.io/providers/labd/commercetools/latest/) with terraform in a docker image.

1. Add your `.env` file in the folder.
2. Install the npm package and init terraform: `docker compose up`
3. Generate the terraform configuration files: `sudo docker compose run --rm npx commercetools-terraform-generator`
4. Plan terraform changes: `docker compose run --rm terraform plan`
5. Apply the changes: `docker compose run --rm terraform apply`

## Todolist
- Generate terraform's `import` commands to facilitate [state import](https://registry.terraform.io/providers/labd/commercetools/latest/docs/guides/state-import).
- Create tests to ensure compatibility with upcoming updates.
- Support all types supported by [the labd commercetools terraform provider](https://registry.terraform.io/providers/labd/commercetools/latest/).
- Add prettier/linter
- Add comments