#!/bin/bash
set -e

echo "Setting up development environment..."

# First run a quick package to build necessary files
echo "Building initial webpack files..."
cross-env NODE_ENV=production electron-forge package &

# Store the process ID
PACKAGE_PID=$!

# Wait for the webpack files to be generated
echo "Waiting for webpack files..."
while ! [ -d ".webpack/arm64/main" ]; do
  # Check if the packaging process is still running
  if ! kill -0 $PACKAGE_PID 2>/dev/null; then
    echo "Package process ended unexpectedly"
    exit 1
  fi
  sleep 1
done

# Give it a moment to finish file operations
sleep 2

# Kill the packaging process once files are generated
kill $PACKAGE_PID 2>/dev/null || true

# Fix the paths
echo "Fixing paths..."
if [ -d ".webpack/arm64" ]; then
  mv .webpack/arm64/* .webpack/
  rmdir .webpack/arm64
fi

# Now start the dev server
echo "Starting dev server..."
cross-env NODE_ENV=development DEV_SERVER=true ts-node dev-server.ts