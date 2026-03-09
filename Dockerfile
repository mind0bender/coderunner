FROM oven/bun:1 AS base
WORKDIR /app

USER root
RUN apt-get update && apt-get install -y \
  g++ \
  autoconf \
  bison \
  flex \
  gcc \
  git \
  libprotobuf-dev \
  libnl-route-3-dev \
  libtool \
  make \
  pkg-config \
  protobuf-compiler \
  && rm -rf /var/lib/apt/lists/*

# 2. Build nsjail from source
RUN git clone https://github.com/google/nsjail.git /tmp/nsjail \
  && cd /tmp/nsjail && make \
  && mv /tmp/nsjail/nsjail /usr/local/bin/nsjail \
  && rm -rf /tmp/nsjail


FROM base AS install
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

FROM base AS release
COPY --from=install --chown=bun:bun /app/node_modules ./node_modules/
COPY --chown=bun:bun . .

USER bun
EXPOSE 8080
CMD ["bun", "run", "src/index.ts"]

