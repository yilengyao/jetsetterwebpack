#!/bin/bash
# filepath: /Users/yilengyao/Documents/Electron/jetsetterwebpack/package-app.sh
set -e

echo "Running custom packaging script..."

# First remove any existing webpack output
if [ -d ".webpack" ]; then
  echo "Removing old webpack output..."
  rm -rf .webpack
fi

# Run the electron-forge package command
echo "Running electron-forge package..."
cross-env NODE_ENV=production electron-forge package &

# Store the PID of electron-forge
FORGE_PID=$!

# Wait for the .webpack/arm64 directory to be created (monitor for it)
echo "Waiting for webpack files to be generated..."
while ! [ -d ".webpack/arm64/main" ]; do
  # Check if electron-forge is still running
  if ! kill -0 $FORGE_PID 2>/dev/null; then
    echo "Electron Forge process ended unexpectedly"
    exit 1
  fi
  sleep 1
done

# Give electron-forge a bit more time to finish writing files
sleep 3

# Sometimes electron-forge hangs, so we'll kill it after files are generated
echo "Files detected, terminating electron-forge process..."
kill $FORGE_PID 2>/dev/null || true

# Move files from architecture directory
echo "Fixing paths..."
mv .webpack/arm64/* .webpack/
rmdir .webpack/arm64

echo "Packaging completed successfully!"