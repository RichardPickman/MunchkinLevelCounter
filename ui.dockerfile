FROM nginx

COPY dist/ui.static /usr/share/nginx/html
EXPOSE 80