<p align="center">

  <h1 align="center">Lucky Movie Server</h1>

  <p align="center">
    <br />
    <a href="#">View Live Application</a>
    ·
    <a href="#">Report Bug</a>
    ·
    <a href="#">Request Feature</a>
  </p>
</p>

## Table of Contents

- [About the Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Related Project](#related-project)

## About The Project

Lucky Movie is an ticketing system for movie cinemas .

### Built With

[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
<br>

## Getting Started

### Prerequisites

- [NodeJs](https://nodejs.org/)
- [PostgreSql](https://www.postgresql.org/)
- [Postman](https://www.postman.com/)

### Installation

1. Clone the repo

```sh
$ git clone https://github.com/luckymovie/luckymovie-server.git
```

2. Install NPM packages

```sh
$ npm install
```

3. Add .env file at root folder project, and add following

```sh
PORT=*YOUR PORT*
DATABASE_URL=*YOUR DATABASE_URL*
MAIL_USERNAME=*YOUR MAIL_USERNAME*
MAIL_PASSWORD=*YOUR MAIL_PASSWORD*
OAUTH_CLIENTID=*YOUR OAUTH_CLIENTID*
OAUTH_CLIENT_SECRET=*YOUR OAUTH_CLIENT_SECRET*
OAUTH_REFRESH_TOKEN=*YOUR OAUTH_REFRESH_TOKEN*
CLIENT_URL=*YOUR CLIENT_URL*
CLOUD_NAME=*YOUR CLOUDINARY_CLOUD*
CLOUD_API_KEY=*YOUR CLOUDINARY_KEY*
CLOUD_API_SECRET=*YOUR CLOUDINARY_SECRET*
REDIS_CLIENT_URL=*YOUR REDIS CLIENT URL*
MIDTRANS_SERVER_KEY=*YOUR MIDTRANS SERVER KEY*
MIDTRANS_CLIENT_KEY=*YOUR MIDTRANS CLIENT KEY*
```

4. This app using cloudinary as a file storage

```sh
CLOUDINARY_URL=*YOUR CLOUDINARY URL*
```

5. Starting application

```sh
$ npm run startDev
```

6. Lucky Movie Server App is Running

### Related Project

- [`Frontend-luckymovie`](https://github.com/zilgya/luckymovie-client)
- [`Backend-luckymovie`](https://github.com/zilgya/luckymovie-server)
