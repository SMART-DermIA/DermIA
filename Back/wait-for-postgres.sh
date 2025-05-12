#!/bin/sh
set -e

HOST=${DB_HOST:-db}
PORT=${DB_PORT:-5432}

echo "⏳ Attente de la base de données à $HOST:$PORT..."

until nc -z "$HOST" "$PORT"; do
  sleep 1
done

echo "✅ Base de données prête, lancement de l'application..."
exec "$@"