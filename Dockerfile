FROM node:6.3.1

WORKDIR /var/app

EXPOSE 3000

ADD . /var/app/

RUN cd /var/app/ && npm install --production

CMD npm start
