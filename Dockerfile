FROM nginx

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./dist/  /website_files
