FROM nginx:1.23.0
ADD dist/ /usr/share/nginx/html/
ADD nginx.conf /etc/nginx/
EXPOSE 8089
