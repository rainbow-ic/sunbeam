#!/bin/bash

# Version
VERSION=$1

# Check if VERSION is empty
if [ -z "$VERSION" ]; then
  echo "Error: Version is not specified."
  echo "Usage: bash publish.sh <version>"
  exit 1
fi

echo "Publishing version $VERSION"

npm version $VERSION
git push && git push --tags
