FROM ghcr.io/onecx/docker-spa-base:v1

COPY nginx/locations.conf $DIR_LOCATION/locations.conf
COPY dist/onecx-document-management-ui $DIR_HTML

ENV BFF_URL http://onecx-document-management-bff:8080/
ENV APP_BASE_HREF /master/document-mgmt/
ENV CORS_ENABLED true
ENV CONFIG_ENV_LIST BFF_URL,APP_BASE_HREF,CORS_ENABLED,TKIT_PORTAL_URL

RUN chmod 775 -R $DIR_HTML/assets
USER 1001
