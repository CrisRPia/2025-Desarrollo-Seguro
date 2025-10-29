#!/usr/bin/env bash

# Run backend tests
echo "Executing backend tests"
docker compose down -v \
    && docker compose up --build -d --wait \
    && docker exec -t backend npm run test:pocs

# Run python tests
echo "Loading python test data"
docker compose exec backend npx knex seed:run --knexfile src/knexfile.ts

echo "Executing python tests"
# We use uv for this. I'm not using pip like a caveman -- CR
# You can install it here: https://docs.astral.sh/uv/getting-started/installation/
uv run --project ./tests ./tests/main.py
