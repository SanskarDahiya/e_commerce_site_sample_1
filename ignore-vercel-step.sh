#!/bin/bash

echo "VERCEL_ENV: $VERCEL_ENV"
echo "NEXT_PUBLIC_VERCEL_ENV: $NEXT_PUBLIC_VERCEL_ENV"
echo "gitBranch: $(git branch)"
echo "gitBranchMain: $(git branch | grep main)"
echo "NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF: $NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF"


if [[ "$VERCEL_ENV" == "production" ]] ; then
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1;

else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
fi