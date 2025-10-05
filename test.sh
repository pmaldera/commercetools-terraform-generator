docker compose up --detach --wait
docker compose exec generator npm run build
docker compose exec generator npm run generate
docker compose run --rm terraform plan
docker compose down
rm ./tests/*.tf