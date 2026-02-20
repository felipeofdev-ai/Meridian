FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY apps/collector/package.json apps/collector/package.json
COPY apps/policy-engine/package.json apps/policy-engine/package.json
COPY apps/cli/package.json apps/cli/package.json
RUN npm install
COPY . .
RUN npm run -w apps/collector build
USER node
EXPOSE 8080
CMD ["npm", "run", "-w", "apps/collector", "start"]
