FROM keymetrics/pm2:8-alpine
# Bundle APP files
COPY index.js /app
COPY custom-reg.js /app
COPY custombase.js /app
COPY twitch.js /app
COPY commands /app/
COPY package.json /app
COPY ecosystem.config.js /app
VOLUME data
# Install app dependencies
WORKDIR /app
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
