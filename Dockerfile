FROM harbor.1000kit.org/1000kit/spa-base:v1

COPY nginx/locations.conf $DIR_LOCATION/locations.conf
COPY dist/tkit-document-management-ui $DIR_HTML

ENV BFF_URL http://tkit-document-management-bff-master:8080/
ENV APP_BASE_HREF /master/document-mgmt/
ENV CORS_ENABLED true
ENV TKIT_PORTAL_URL http://tkit-portal-server:8080/
ENV CONFIG_ENV_LIST BFF_URL,APP_BASE_HREF,CORS_ENABLED,TKIT_PORTAL_URL

RUN chmod 775 -R $DIR_HTML/assets
USER 1001
