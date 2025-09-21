#!/usr/bin/env bash

docker compose down -v \
    && docker compose up --build -d --wait \
    && docker exec -t backend npm run test:pocs
