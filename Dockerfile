FROM node:15.12.0-slim

LABEL "com.github.actions.name"="Automated NPM CalVer version bump"
LABEL "com.github.actions.description"="GitHub Action for automated CalVer version bumps for NPM."
LABEL "com.github.actions.icon"="calendar"
LABEL "com.github.actions.color"="blue"

COPY package*.json ./

RUN apt-get update
RUN apt-get -y install git
RUN npm ci --only=production

COPY . .

ENTRYPOINT ["node", "/index.js"]
