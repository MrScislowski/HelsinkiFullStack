# Part 12: Containers

## Intro

- containers prevent the processes from accessing files/resources outside the container
- containers are OS-level virtualizations
- containers are a bit like VMs, but take much less overhead

## Containers vs Images

A container is a runtime instance of an image. Images are immutable files (you can use existing images to create new images)

Docker engine turns images into containers.

`Docker compose` allows you to "orchestrate" (control) multiple containers at once

## Basic Docker

- ```sh
  docker container run hello-world
  ```

  Since the `hello-world` image doesn't exist on my computer, this'll download it from Docker Hub

- ```sh
  docker image pull hello-world
  ```

  This just pulls the image.

- ```sh
  docker container run -it ubuntu bash
  ```

  Runs the `ubuntu` image interactively (`-i`) with a terminal (`-t`), and when it first logs in, runs the command `bash`

- ```sh
  docker container run --rm ubuntu ls
  ```

  Removes container after execution (this doesn't happen by default)

- ```sh
  docker container ls -a
  ## shorter form:
  # docker ps -a
  ```

  Lists all (including exited) containers

- ```sh
  docker start stoic_sammet
  ```

  starts the container called `stoic sammet` (but since this isn't running interactively, we won't be able to communicate with it)

- ```sh
  docker kill stoic_sammet
  ```

  stops the container

- ```sh
  docker container diff stoic_sammet
  ```

  lists the differences between the original image that the container was generated from, and the current state of the container

- ```sh
  docker commit stoic_sammet hello-node-world
  ```

  creates a new image called `hello-node-world` based on the current state of the container

- ```sh
  docker image ls
  ```

  lists all the images you have. (`hello-node-world` should now appear in that list)

- ```sh
  docker rm stoic_sammet
  ```

  remove the old container

- There are already lighter weight installs with node in docker hub. E.g.

  ```sh
  docker container run -it --name hello-node node:20 bash
  ```

  (NB: gives your own name to the container)

- To copy files from local filesystem to container:

  ```sh
  docker container cp ./index.js hello-node:/usr/src/app/index.js
  ```

## Building Images & Configuring Environments

- Dockerfile is a simple text file that contains all the instructions to create an image:

  ```
  FROM node:20

  WORKDIR /usr/src/app

  COPY ./index.js ./index.js

  CMD node index.js
  ```

  - `FROM` specifies the base for the image
  - `CMD` is the default command when `docker run` is called (can be overwritten w/ argument given after image name)
  - `WORKDIR` is created if it doesn't already exist. Important to prevent accidental overwriting of existing image files

  To build an image called `fs-hello-world` with the Dockerfile in the current directory (`.`), use the command:

  ```sh
  docker build -t fs-hello-world .
  ```

- To build a simple express app:

  - Build the app locally... In a new directory `using-dockerfile`
    ```sh
    pnpm dlx express-generator
    ```
    Then install dependencies with
    ```sh
    npm install
    ```
    And test running the app with the command given by the generator, For me it was:
    ```sh
    DEBUG=using-dockerfile:* npm start
    ```
  - Now create this `Dockerfile`:

    ```
    FROM node:20

    WORKDIR /usr/src/app

    COPY . .

    CMD DEBUG=dockerfile:* npm start
    ```

  - Then build the image and run it:
    ```sh
    docker build -t express-server .
    docker run -p 3123:3000 express-server
    ```

- A better way... The problem with that, was it copied the `node_modules` from the local system to the image which is not optimal. Better to do:

  - ignore stuff in a `.dockerignore`

    ```
    .dockerignore
    .gitignore
    node_modules
    Dockerfile
    ```

  - modify `Dockerfile` to install stuff itself, and don't bother with dev dependencies:

    ```
    // ...
    RUN npm clean-install --omit=dev # aka npm ci
    CMD DEBUG=using-dockerfile:* npm start
    ```

  - and actually, using `ENV` in `Dockerfile` is even better:

    ```
    // ...
    ENV DEBUG=using-dockerfile:*
    CMD npm start
    ```

  - don't run as root... `Dockerfile`:

    ```
    FROM node:20
    WORKDIR /usr/src/app
    COPY --chown=node:node . .
    RUN npm ci
    ENV DEBUG=playground:*
    USER node
    CMD npm start
    ```

- more in-depth best practices for node apps inside docker [here](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/)

### Docker compose

- Helps manage containers
- uses yaml, so they can be committed to repo
- example:

  - config file: `docker-compose.yml`

    ```yml
    services:
    app: # The name of the service, can be anything
      image: express-server # Declares which image to use
      build: . # Declares where to build if image is not found
      ports: # Declares the ports to publish
        - 3000:3000
    ```

  - build and run the application:

    ```sh
    docker compose up
    ```

  - rebuild the image:

    ```sh
    docker compose up --build
    ```

- A mongo example:

  - configuration file `docker-compose.dev.yml`
    ```yml
    services:
      mongo:
        image: mongo
        ports:
          - 3456:27017
        environment:
          MONGO_INITDB_ROOT_USERNAME: root
          MONGO_INITDB_ROOT_PASSWORD: example
          MONGO_INITDB_DATABASE: the_database
    ```
  - to distinguish between two configuration files,
    ```sh
    docker compose -f docker-compose.dev.yml up
    ```
  - to start it in the background:
    ```sh
    docker compose -f docker-compose.dev.yml up -d.
    ```
  - to view the logs from the background process

    ```sh
    docker compose -f docker-compose.dev.yml logs -f
    ```

  - But this code doesn't actually initialize the database and create users/entries at the beginning. Instead of extending the image, we can `bind mount` a file to the container.

    - this is done by passing `-v FILE-IN-HOST:FILE-IN-CONTAINER` to `docker run`
    - or, using `docker compose`:

      ```yml
      services:
        mongo:
          # ...
          volumes:
            - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
      ```

  - NB: these two files are now linked; changes to one causes changes to the other
  - `docker compose -f docker-compose.dev.yml down --volumes` will start from a clean slate to do `docker compose -f docker-compose.dev.yml up` to initialize the database

  - to make sure data persists once the container is shut down / restarted. There are two options to do this:

    1. `bind mount` (declare a location in your filesystem to store it). Example `docker compose` config file:

    ```yml
    services:
      mongo:
        # ...
        volumes:
          -  #
          - ./mongo/data:/data/db
    ```

    2. `named volume` (docker will decide where to store the data)

    ```yml
    services:
      mongo:
        # ...
    volumes:
      mongo_data:
    ```

    You can then work with the volumes using:

    ```sh
    docker volume ls
    docker volume inspect
    docker volume rm
    ```

### Debugging Docker

- `docker container run -d -p 8080:80 nginx`: `-d` runs in detached mode
- `docker exec -it wonderful_ramanujan bash`: connects to an already running container
- `docker compose up -d`

### Redis

```yml
services:
  mongo:
    # ...
  redis:
    image: redis
    ports:
      - 6378:6379
```

There was also some set-up already done for me...

### Docker-izing React

#### First attempt... generate all the files needed for the react app:

```sh
npm create vite@latest hello-front -- --template react
cd hello-front
```

To build it, we'd do:

```sh
npm install
npm run build
```

To server it, we could do,

```sh
npm install -g serve
serve dist
```

So our dockerfile could be:

```yml
FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

RUN npm install -g serve

CMD ["serve", "dist"]
```

#### Improvement...

- A goal is to create Docker images so that nothing irrelevant is included
- minimal number of dependencies => images less likely to break / become vulnerable
- Multi-stage builds are a solution to this... they split the build process into many separate stages, and limit what parts of the image files are moved between the stages (to reduce size of images etc)

```yml
# The first FROM is now a stage called build-stage

FROM node:20 AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

# This is a new stage, everything before this is gone, except for the files that we want to COPY

FROM nginx:1.25-alpine

# COPY the directory dist from the build-stage to /usr/share/nginx/html
# The target location here was found from the Docker hub page

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
```

## Development in containers

Pros of developing in containers:

- development and production environments can be more similar
- different developers can all have the same environment
- new members / computers can be set up simply by installing container runtime

Need to do these things to move application to container:

- start the application in development mode
- access files with VS Code

### `dev.Dockerfile`

```yml
FROM node:20

WORKDIR /usr/src/app

COPY . .

# Change npm ci to npm install since we are going to be in development mode
RUN npm install

# npm run dev is the command to start the application in development mode
CMD ["npm", "run", "dev", "--", "--host"]
```

The `--host` parameter exposes the development server to be visible outside the Docker network (not just to localhost)

```sh
docker build -f ./dev.Dockerfile -t hello-front-dev .
```

### Accessing files with text editor

This course will use volumes to solve this problem (which works for any editor). VSCode has [native ways](https://code.visualstudio.com/docs/remote/containers) of solving this problem too.

This connects our current working directory with the /usr/src/app directory, and edits we make to files should be made to the container too.

```sh
docker run -p 5173:5173 -v "$(pwd):/usr/src/app/" hello-front-dev
```

#### Mac problems

The `rollup` library (maybe used in the vite development server?) has different versions for different processor architectures, and the M1/M2 installed version may be used instead of the linux-based one appropriate for the container. So isntalling the linux version can fix it:

```sh
docker run -it -v "$(pwd):/usr/src/app/" front-dev bash
npm install
```

When you mount the current directory to the container's working directory, the local `node_modules` directory overrides the `node_modules` that were installed during the build process.

#### compose

With this configuration, `docker compose -f docker-compose.dev.yml` will run the application in development node, and you don't even need Node installed to develop it!

`docker-compose.dev.yml`:

```yml
services:
  app:
    image: hello-front-dev
    build:
      context: . # The context will pick this directory as the "build context"
      dockerfile: dev.Dockerfile # This will simply tell which dockerfile to read
    volumes:
      - ./:/usr/src/app # The path can be relative, so ./ is enough to say "the same location as the docker-compose.yml"
    ports:
      - 5173:5173
    container_name: hello-front-dev # This will name the container hello-front-dev
```

Installing dependencies is annoying in a set up like this. Instead of `npm install axios` you have to do it in the running container:

```sh
docker exec hello-front-dev npm install axios
```

Or add it to the `package.json` and run `docker build` again.

### Networking between containers

If our `docker-compose.dev.yml` looks like:

```yml
services:
  app:
    image: hello-front-dev
    build:
      context: .
      dockerfile: dev.Dockerfile
    volumes:
      - ./:/usr/src/app
    ports:
      - 5173:5173
    container_name: hello-front-dev

  debug-helper:
    image: busybox
```

And we run:

```sh
docker compose -f docker-compose.dev.yml run debug-helper wget -O - http://app:5173
```

It connects. If we had changed the port assignment in the `docker-compose.dev.yml` file to:

```yml
ports:
  - 3210:5173
```

This command:

```sh
docker compose -f docker-compose.dev.yml run debug-helper wget -O - http://app:5173
```

would still work because the port is still 5173 within the docker network.

## Reverse Proxy

- Can act as the single point of entry to your application, and can put both both frontend and backend behind it
- implementation options: traefik, caddy, nginx, apache

### Using nginx

`nginx.dev.conf`: development configuration

```
# events is required, but defaults are ok
events { }

# A http server, listening at port 80
http {
  server {
    listen 80;

    # Requests starting with root (/) are handled
    location / {
      # The following 3 lines are required for the hot loading to work (websocket).
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';

      # Requests are directed to http://localhost:5173
      proxy_pass http://app:5173;
    }
  }
}
```

`nginx.conf` would be used for production configuration.

To start this up on a container, `docker-compose.dev.yml`:

```yml
services:
  app:
    # ...
  nginx:
    image: nginx:1.20.1
    volumes:
      - ./nginx.dev.conf:/etc/nginx/nginx.conf:ro
    ports:
      - 8080:80
    container_name: reverse-proxy
    depends_on:
      - app # wait for the frontend container to be started
```
