FROM node:18
WORKDIR /home/node/app
COPY project /home/node/app
RUN npm install
CMD npm run start
EXPOSE 7016