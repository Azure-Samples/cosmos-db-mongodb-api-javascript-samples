#!/bin/bash
# Load environment variables from .env file into current shell
if [ -f .env ]; then
    echo "Loading environment variables from .env file..."
    set -a
    source .env
    set +a
    echo "Environment variables loaded successfully"
else
    echo "No .env file found. Run 'azd up' first to create it."
fi
