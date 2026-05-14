#!/bin/sh
set -e

echo "Syncing CRM database schema..."
node node_modules/prisma/build/index.js db push --accept-data-loss --skip-generate

echo "Skipping WhatsApp DB push (schema managed by whatsmeow Go service)..."

echo "Starting Estetia CRM..."
exec node server.js
