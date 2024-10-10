# Part 12: Containers

## Intro

- containers prevent the processes from accessing files/resources outside the container
- containers are OS-level virtualizations
- containers are a bit like VMs, but take much less overhead

## Containers vs Images

A container is a runtime instance of an image. Images are immutable files (you can use existing images to create new images)

Docker engine turns images into containers.

`Docker compose` allows you to "orchestrate" (control) multiple containers at once

## Docker

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
