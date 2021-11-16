FROM node:17-alpine

RUN apk update && apk add --no-cache \
    g++ \
    make \
    cmake \
    unzip \
    curl-dev \
    autoconf \
    automake \
    libtool \
    libexecinfo-dev \
    python3

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

RUN apk add --no-cache \
    nodejs

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY package.json ./package.json
RUN npm install --production

COPY app.js ./app.js

# curl -# -L -O https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/latest/download/aws-lambda-rie-arm64
ADD aws-lambda-rie-arm64 /usr/local/bin/aws-lambda-rie
RUN chmod +x /usr/local/bin/aws-lambda-rie

COPY ./entry_script.sh /entry_script.sh
ENTRYPOINT [ "/entry_script.sh" ]

CMD [ "app.main" ]
