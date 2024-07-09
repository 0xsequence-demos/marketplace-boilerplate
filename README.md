# marketplace-boilerplate

## Setup

1. Set up a white-label marketplace in builder https://docs.sequence.xyz/solutions/marketplaces/white-label-marketplace

2. Add an `.env` file to the root of the project with the following variables:

You can run

```sh
pnpm env-file
```

To create sample file from `.env.example`

File:

```sh
# Url of the marketplace you created in Builder
NEXT_PUBLIC_DOMAIN="https://{SUBDOMAIN}.sequence.market"

# Environment, must be set to "next" for now
NEXT_PUBLIC_ENV="next"

# API key from Builder > Settings > API keys. e.g. https://sequence.build/project/{PROJECT_ID}/settings/apikeys
NEXT_PUBLIC_SEQUENCE_ACCESS_KEY="XXXXXX"
# Project ID from Builder, found in the URL of the project, e.g. https://sequence.build/project/{PROJECT_ID}
NEXT_PUBLIC_SEQUENCE_PROJECT_ID="XXXXXX"
```

For now we hardcoded port for app at `4420`

## Start

To start and build the application, run the following commands:

```sh
pnpm install
pnpm build
pnpm start
```

Then you should be able to access the page on [http://localhost:4420](http://localhost:4420)

## Install

Install dependencies

```sh
pnpm install
```

## Development

Run in development mode, watches changes in code and rebuild on the fly

```sh
pnpm dev
```

## Build

Build server

```sh
pnpm build
```

## Common Errors

If you forget to change your marketplace type in Builder before building the app, you will need to remove the `.next` cache and rerun the server.
