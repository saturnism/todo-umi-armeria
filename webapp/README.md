## Install

`npm install`

## Run with Mocks

`npm start`

This will serve traffic to `/com.example.todo.TodoService` using `mocks/todo.js`

## Run without Mocks

1. Start the `todo-service` backend, in its directory, run `./mvnw spring-boot:run`
1. Start the frontend: `npm run start:nomock`

The traffic to `/com.example.todo.TodoService' will be proxied to the backend.

## Production build

`npm build`

The result will be in `dist` directory

## Containerize

`docker build -t saturnism/todo-frontend .`

Replace the image coordinate with your own. This will build a container to serve SPA with NGINX.

Don't forget to push `docker push saturnism/todo-frontend`
