docker compose up --detach --wait
docker compose exec generator npm run build
docker compose exec generator npm run generate
docker compose run --rm terraform init
docker compose run --rm terraform plan
docker compose down
mv ./tests/provider.tf ./tests/provider.backup
rm ./tests/*.tf
rm -rf ./tests/.terraform/
rm ./tests/.terraform.lock.hcl
mv ./tests/provider.backup ./tests/provider.tf