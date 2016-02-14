FROM ubuntu
RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
RUN apt-get install -y nodejs
COPY . /app
WORKDIR /app
RUN npm i
RUN npm run build
EXPOSE 3000
CMD npm run docker
