#!/usr/bin/env bash
set -e

if [ -z "$AUTH_HTPASSWD" ]
then
    echo "Variable AUTH_HTPASSWD is empty"
    exit 0
else
    echo "Variable AUTH_HTPASSWD is NOT empty"
    /bin/bash ./parse-plugin-env.sh && \
    /wait \
    && echo "$AUTH_HTPASSWD" \
    && htpasswd -c -b /etc/nginx/.htpasswd admin "$AUTH_HTPASSWD" \
    && /bin/sh -c "envsubst < /etc/nginx/upsteam.conf.template > /etc/nginx/upstream.conf && exec nginx -g 'daemon off;'"
fi
