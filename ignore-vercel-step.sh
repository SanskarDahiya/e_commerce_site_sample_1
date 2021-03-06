#!/bin/bash
echo "VERCEL_ENV: $VERCEL_ENV <--"

if [[ "$VERCEL_ENV" == "production" ]]; then
  if [[ $VERCEL_GIT_COMMIT_MESSAGE == *"deploy"* ]]; then
    # Proceed with the build
    echo "✅ - Build can proceed"
    exit 1
  else
    # Don't build
    echo "🛑 - Build Secret Not Found"
    exit 0
  fi
else
  # if
  #   [[ $VERCEL_GIT_COMMIT_MESSAGE == *"deploy"* ]] &&
  #     [[ $VERCEL_GIT_COMMIT_AUTHOR_NAME == *"Sanskar"* ]]
  # then
  #   # Proceed with the build
  #   echo "✅ - Build can proceed"
  #   exit 1
  # else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0
  # fi

fi

# -------------- SAMPLES --------------------------------
# VERCEL:->  1 <<--END-->>
# CI:->  1 <<--END-->>
# VERCEL_ENV:->  preview <<--END-->>
# VERCEL_URL:->  e-commerce-foywtmdrx-sanskardahiyarecro.vercel.app <<--END-->>
# VERCEL_REGION:->   <<--END-->>
# VERCEL_GIT_PROVIDER:->  github <<--END-->>
# VERCEL_GIT_REPO_SLUG:->  e_commerce_site_sample_1 <<--END-->>
# VERCEL_GIT_REPO_OWNER:->  SanskarDahiya <<--END-->>
# VERCEL_GIT_REPO_ID:->  507618706 <<--END-->>
# VERCEL_GIT_COMMIT_REF:->  prod2 <<--END-->>
# VERCEL_GIT_COMMIT_SHA:->  2f50a6757bc74baa5cd83fdacb93aa14683a4d85 <<--END-->>
# VERCEL_GIT_COMMIT_MESSAGE:->  logs <<--END-->>
# VERCEL_GIT_COMMIT_AUTHOR_LOGIN:->  sanskardahiyarecro <<--END-->>
# VERCEL_GIT_COMMIT_AUTHOR_NAME:->  Sanskar <<--END-->>
# NEXT_PUBLIC_VERCEL:->   <<--END-->>
# NEXT_PUBLIC_CI:->   <<--END-->>
# NEXT_PUBLIC_VERCEL_ENV:->   <<--END-->>
# NEXT_PUBLIC_VERCEL_URL:->   <<--END-->>
# NEXT_PUBLIC_VERCEL_REGION:->   <<--END-->>
# NEXT_PUBLIC_VERCEL_GIT_PROVIDER:->   <<--END-->>
# NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG:->   <<--END-->>
# NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER:->   <<--END-->>
# NEXT_PUBLIC_VERCEL_GIT_REPO_ID:->   <<--END-->>
# NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF:->   <<--END-->>
# NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA:->   <<--END-->>
# NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE:->   <<--END-->>
# NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_LOGIN:->   <<--END-->>
# NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME:->   <<--END-->>

# echo "VERCEL:->  $VERCEL <<--END-->>"
# echo "CI:->  $CI <<--END-->>"
# echo "VERCEL_ENV:->  $VERCEL_ENV <<--END-->>"
# echo "VERCEL_URL:->  $VERCEL_URL <<--END-->>"
# echo "VERCEL_REGION:->  $VERCEL_REGION <<--END-->>"
# echo "VERCEL_GIT_PROVIDER:->  $VERCEL_GIT_PROVIDER <<--END-->>"
# echo "VERCEL_GIT_REPO_SLUG:->  $VERCEL_GIT_REPO_SLUG <<--END-->>"
# echo "VERCEL_GIT_REPO_OWNER:->  $VERCEL_GIT_REPO_OWNER <<--END-->>"
# echo "VERCEL_GIT_REPO_ID:->  $VERCEL_GIT_REPO_ID <<--END-->>"
# echo "VERCEL_GIT_COMMIT_REF:->  $VERCEL_GIT_COMMIT_REF <<--END-->>"
# echo "VERCEL_GIT_COMMIT_SHA:->  $VERCEL_GIT_COMMIT_SHA <<--END-->>"
# echo "VERCEL_GIT_COMMIT_MESSAGE:->  $VERCEL_GIT_COMMIT_MESSAGE <<--END-->>"
# echo "VERCEL_GIT_COMMIT_AUTHOR_LOGIN:->  $VERCEL_GIT_COMMIT_AUTHOR_LOGIN <<--END-->>"
# echo "VERCEL_GIT_COMMIT_AUTHOR_NAME:->  $VERCEL_GIT_COMMIT_AUTHOR_NAME <<--END-->>"
# echo "NEXT_PUBLIC_VERCEL:->  $NEXT_PUBLIC_VERCEL <<--END-->>"
# echo "NEXT_PUBLIC_CI:->  $NEXT_PUBLIC_CI <<--END-->>"
# echo "NEXT_PUBLIC_VERCEL_ENV:->  $NEXT_PUBLIC_VERCEL_ENV <<--END-->>"
# echo "NEXT_PUBLIC_VERCEL_URL:->  $NEXT_PUBLIC_VERCEL_URL <<--END-->>"
# echo "NEXT_PUBLIC_VERCEL_REGION:->  $NEXT_PUBLIC_VERCEL_REGION <<--END-->>"
# echo "NEXT_PUBLIC_VERCEL_GIT_PROVIDER:->  $NEXT_PUBLIC_VERCEL_GIT_PROVIDER <<--END-->>"
# echo "NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG:->  $NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG <<--END-->>"
# echo "NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER:->  $NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER <<--END-->>"
# echo "NEXT_PUBLIC_VERCEL_GIT_REPO_ID:->  $NEXT_PUBLIC_VERCEL_GIT_REPO_ID <<--END-->>"
# echo "NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF:->  $NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF <<--END-->>"
# echo "NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA:->  $NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA <<--END-->>"
# echo "NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE:->  $NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE <<--END-->>"
# echo "NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_LOGIN:->  $NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_LOGIN <<--END-->>"
# echo "NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME:->  $NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME <<--END-->>"
