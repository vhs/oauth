FROM node:6.3.1

ADD . /var/app/

EXPOSE 3000

WORKDIR /var/app

CMD npm start
