FROM node:18-alpine as builder

WORKDIR /build

# Install dependencies (with only production packages)
COPY package*.json ./
RUN npm i

# Install TypeScript locally (for the build step only)
RUN npm install typescript --save-dev

# Copy the rest of the source files
COPY . .

# Build the project
RUN npm run build



FROM node:18-alpine as runner

WORKDIR /app

COPY --from=builder /build/package*.json ./
COPY --from=builder /build/node_modules ./node_modules/
COPY --from=builder /build/dist ./dist/
COPY --from=builder /build/node_modules/.prisma ./node_modules/.prisma

EXPOSE 5000

ENTRYPOINT [ "npm", "start" ]