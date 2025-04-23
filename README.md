# ⚠️ Repository Deprecated

> This repository is no longer maintained.  
> Please use the new Marketplace Boilerplate here:  
> 👉 https://github.com/0xsequence/marketplace-boilerplate

# marketplace-boilerplate

A starter White-label Marketplace boilerplate, powered by Sequence.

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
# API key from Builder > Settings > API keys. e.g. https://sequence.build/project/{PROJECT_ID}/settings/apikeys
NEXT_PUBLIC_SEQUENCE_ACCESS_KEY="XXXXXX"
# Project ID from Builder, found in the URL of the project, e.g. https://sequence.build/project/{PROJECT_ID}
NEXT_PUBLIC_SEQUENCE_PROJECT_ID="XXXXXX"

# Optional: For integrating with WalletConnect, set the WalletConnect project ID
# NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="XXXXXX"
```

App will run at port `4420`.

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
