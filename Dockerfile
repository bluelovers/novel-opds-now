# specify the node base image with your desired version node:<version>
FROM node:18.12-alpine AS base
ENV NODE_VERSION 18.12.1

# replace this with your application's default port
EXPOSE 3000
ENV PORT 3000

FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock* ./
CMD [ "yarn", "--frozen-lockfile" ]

FROM deps AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
CMD [ "yarn", "add", "tsx", "&&", "yarn", "start:tsx" ]
