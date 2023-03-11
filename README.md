<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


## Description

Pokemon API

## Steps for recreate App

1. Clone repository

2. Install dependencies

```bash
$ yarn install
```
3. Install nest cli

```bash
$ npm i -g @nestjs/cli
```

4. Rise db

```bash
  $ docker-compose up -d
```
5. rename .env.template -> .env

6. fill enviroment variables into .env

7. pupulate db for testing

```bash
  $ curl --location 'http://localhost:3000/api/seed'
```

## Run app
```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Stack

- NestJs
- MongoDB
