#!/bin/bash

# Version
VERSION=$1

# Check if VERSION is empty
if [ -z "$VERSION" ]; then
  echo "Error: Version is not specified."
  echo "Usage: bash publish.sh <version>"
  exit 1
  set -eu -o pipefail
fi

# Run build and proceed only if successful
npm run build && {
  echo "Publishing version $VERSION"

  npm version $VERSION

  # Publish changes
  git push
  git push origin tag $VERSION

  # Publish to npm
  npm publish
}