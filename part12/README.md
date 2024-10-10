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
