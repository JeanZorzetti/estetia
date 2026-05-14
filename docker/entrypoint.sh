#!/bin/sh
set -e

echo "Syncing database schema..."
node node_modules/prisma/build/index.js db push --accept-data-loss --skip-generate

echo "Starting Estetia CRM..."
exec node server.js
