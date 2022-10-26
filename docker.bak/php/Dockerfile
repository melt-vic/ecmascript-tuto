FROM php:7.2-apache

#RUN setfacl -R -m u:www-data:rwX -m u:`whoami`:rwX ./app/cache ./app/logs
#RUN setfacl -dR -m u:www-data:rwX -m u:`whoami`:rwX ./app/cache ./app/logs
#ENV APACHE_DOCUMENT_ROOT=/home/vic/PhpstormProjects/ecmascript-tuto/web
#RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
#RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

RUN apt update
RUN apt install git -y
#RUN apt install nodejs -y  Instala una versión anterior a la requerida por Yarn. No tengo tiempo para mirarlo
#RUN pecl install xdebug
#RUN docker-php-ext-enable xdebug
RUN a2enmod rewrite
RUN docker-php-ext-install pdo pdo_mysql && docker-php-ext-enable pdo_mysql
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer