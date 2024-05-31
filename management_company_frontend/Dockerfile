## Stage 1: Build
#FROM oven/bun:1 AS build
#
#WORKDIR /app
#
#COPY package.json .
#COPY bun.lockb .
#
#RUN bun install
#
#COPY . .
#
## Stage 2: Final
#FROM oven/bun:1
#
#WORKDIR /app
#
#COPY --from=build /app .
#
#EXPOSE 5173
#
#CMD ["bun", "run", "dev", "--host"]
