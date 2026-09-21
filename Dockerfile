# Use PHP 8.2 with Apache as our base image.
FROM php:8.2-apache

# Install the PHP MySQL extension.
# This allows PHP to communicate with MySQL.
RUN docker-php-ext-install mysqli

# Copy our entire application into Apache's web directory.
COPY . /var/www/html/

# Make Apache listen on port 80.
EXPOSE 80