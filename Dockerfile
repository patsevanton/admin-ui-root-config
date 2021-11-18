# build environment
FROM node:14.15.4-alpine as build
ARG ENV
ARG VERSION
ARG API_HOST
ENV REACT_APP_ENV "$ENV"
ENV REACT_APP_VERSION "$VERSION"
ENV REACT_APP_API_HOST "$API_HOST"
WORKDIR /app
COPY . /app
RUN npm install --silent
RUN npm run build

# production environment
FROM nginx:1.17.6-alpine-perl
RUN apk update && apk add apache2-utils
ENV UPSTREAM "drill-admin:8090"
ENV AUTH_HTPASSWD $AUTH_HTPASSWD
# support running as arbitrary user which belogs to the root group
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/ /etc/nginx/
RUN addgroup nginx root
# setup wait utility
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait
RUN apk add bash
COPY --from=build /app/parse-plugin-env.sh .
RUN chmod +x ./parse-plugin-env.sh
COPY --from=build /app/dist /usr/share/nginx/html
RUN rm -v /etc/nginx/nginx.conf
COPY nginx /etc/nginx/
RUN chgrp -R 0 /usr/share/nginx/html && chmod -R g=u /usr/share/nginx/html

EXPOSE 8080
CMD /bin/bash ./parse-plugin-env.sh && /wait && echo "$AUTH_HTPASSWD" && htpasswd -c -b /etc/nginx/.htpasswd admin "$AUTH_HTPASSWD" && /bin/sh -c "envsubst < /etc/nginx/upsteam.conf.template > /etc/nginx/upstream.conf && exec nginx -g 'daemon off;'"
