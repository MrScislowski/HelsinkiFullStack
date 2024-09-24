# CI/CD

## Why CI/CD

- "works on my machine" problems
  - build packages in known environment of CI system
- different changes to same code - which gets shipped?
  - => disallow commits on the `main` branch
  - CI system runs on all pull requests (PR) against main branch, and only get merged if all tests pass
  - only allow merges to main branch if the branch is up to date with the main branch

## Glossary

- branch: independent line of development
- pull request: a developer who has made changes to their own branch who wants to merge these changes back into to the main branch
- deployment pipeline:
  - e.g. deploy each commit of your code automatically as long as it doesn't break anything
  - Can be more complicated if require, e.g. zero downtime, or database migrations
- CI = merging developer changes to main branch often
- pipeline may include steps like:
  - Lint: to keep our code clean and maintainable
  - Build: put all of our code together into runnable software bundle
  - Test: to ensure we don't break existing features
  - Package: Put it all together in an easily movable batch
  - Deploy: Make it available to the world
- package & deploy are sometimes not considered to be part of "CI", but they're where a lot of the problems can crop up, and every time something is integrated, it might break the deployment
- "CD": the main branch is kept deployable at all times
- NB: `main` branch is often the production version. Sometimes it'll be some other `release` branch

## Principles

The goal is better, faster software development, with fewer preventable bugs, and better team cooperation.

CI/CD should answer the questions... how to make sure:

- tests are run on all code that will be deployed
- main branch is deployable at all times
- builds will be consistent and will run on the platform we're deploying to
- changes don't overwrite one another
- deployments happen automatically when one merges to main branch

## Types of CI setup

There's an entire server dedicated to CI.

- self-hosted (often using jenkins)
  - 😀 flexible, and plugins for lots of stuff. Resources under your control, secrets never exposed.
  - 😔 complicated to set up. Lot of boilerplate. Need to learn jenkins domain-specific language.
- cloud-based (e.g. github actions)
  - 😀 simpler set up, especially for common tasks
  - 😔 less flexible for weird setup. Resources more limited (2 vCPUs and 8GB of RAM on github), and may be billed for compute time

## How GitHub Actions Work

- A triggering event happens (e.g. a push to the main branch)
- the workflow (a series of jobs) associated with that trigger is executed
- cleanup happens

### General requirements for CI operating on a repository

- The definition of what the CI needs to do needs to be defined either in the repository, or in the CI system
- The CI needs to be able to access the repository
- The CI needs permissions to perform the actions it is supposed to do (e.g. if it needs to be able to deploy ato a production environment, it needs credentials for that environment)

Since GitHub provides both the repository and the CI platform, a lot of this interconnection is taken care of frictionlessly.

## Workflows

Hierarchy of a workflow:

- Job1
  - step1
  - step2
- Job2
  - step1

Each workflow must specify at least one Job. The Jobs are run in parallel. The steps to each job are run sequentially.

### specifying workflows

- specified in `.github/workflows`
- each workflow is its own separate file, configured using `YAML`
- each workflow contains:
  - name
  - triggers: events that trigger the workflow to be executed
  - jobs: the separate jobs that the workflow will execute

### example workflow

```yaml
name: Hello World!

on:
  push:
    branches:
      - main

jobs:
  hello_world_job:
    runs-on: ubuntu-20.04
    steps:
      - name: Say hello
        run: |
          echo "Hello World!"
```

### trigger options

A workflow can be started once:

- an event on GitHub occurs, such as someone pushing a commit to a repo, or when an issue/pull request is created
- a scheduled event (specified using cron-syntax)
- an external event occurs, e.g. a command in an external application like Slack or Discord

### more complicated lint / test/ build steps

```yml
jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - name: Install dependencies
        run: npm install

      - name: Check style
        run: npm run eslint
```

Notes:

- use the same virtual environment as will be running in production
- `uses` keyword tells workflow to run a specific action. Actions are reusable pieces of codes, like a function. `checkout` is a github action that is documented [here](https://github.com/actions/checkout). The version number is included in case updates break it in future.
- `setup-node` is documented [here](https://github.com/actions/setup-node). The `with` gives the action a "parameter".
- after the environment has been set up, we can run all the scripts from `package.json` just like on our own machine.
- NB: it is optional to specify a name for each action; you can just say `run: npm run eslint`

### Note about Exercises 11.5-11.9

`pnpm run eslint` on my windows box gives:

```
Oops! Something went wrong! :(

ESLint: 8.57.1

No files matching the pattern "'./**/*.{js,jsx}'" were found.
Please check for typing mistakes in the pattern.

 ELIFECYCLE  Command failed with exit code 2.
```

But on my mac, it runs fine except for a warning:

```
Warning: React version not specified in eslint-plugin-react settings. See https://github.com/jsx-eslint/eslint-plugin-react#configuration .
```

I wonder if it's got to do with wildcards and filesystem stuff on windows...

Hmmm... if I just run `npx run eslint .` on windows, I get the same stuff as on Mac. And running `pnpm dlx eslint .` gives similar, but even more informative.

### Playwright starts its own frontend/backend

put this kind of thing in `playwright.config.js`:

```js
  webServer: {
    command: "npm run start-prod",
    url: "http://127.0.0.1:5000/",
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:5000/",
  },
```

## Deployment

Rules:

- deployment system should never leave software in a broken state
- silent failures are very bad

Requirements:

- should be able to fail gracefully at any step of the deployment
- should allow a rollback to a previous deployment
  - this should be easier/less failure prone than a full deployment
  - auto rollback in case of deployment failures

### FlyIO - Health Check

Fly.io allows "health checks" to be performed (e.g. issue a GET request to a specific URL and expect a certain response), and the deployment will be considered successful/unsuccesful based on these checks.

### Render

Allows health checks also, but since I'm using the deploy hook, the build is triggered by a simple GET request by github actions, so github doesn't know that the deployment was unsuccessful... that seems sub-optimal.

Also, render is HELLA slow to deploy.

## Pull Requests

Instead of committing any changes directly to the main branch, commit to a branch based on the freshest possible version of the main branch, then create a GitHub Pull Request (PR) to request a merge to main.

Github action to trigger stuff when a PR is

- opened, or
- updated:

```yaml
on:
  push:
    branches:
      - main
  pull_request:
    branches: [main]
    types: [opened, synchronize]
```

### Conditionally running some steps

Workflow context gives information that can be used. `github.event_name` will be "push" whenever code is pushed, or a pull request is merged.

```yaml
jobs:
  linting:
    runs-on: ubuntu-20.04
    steps:
      - name: checkout the code
        uses: actions/checkout@v4
      # ...
      - name: set up fly.io
        if: ${{ github.event_name == 'push' }}
        uses: superfly/flyctl-actions/setup-flyctl@master
      - name: deploy to fly.io
        if: ${{ github.event_name == 'push' }}
        run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

Alternatively, you could split these up to different jobs:

```yaml
jobs:
  build-and-test:
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v4
    # ...
  deploy:
    runs-on: ubuntu-20.04
    if: ${{ github.event_name == 'push' }}
    needs: build-and-test
    steps:
      - name: set up fly.io
        if: ${{ github.event_name == 'push' }}
        uses: superfly/flyctl-actions/setup-flyctl@master
      - name: deploy to fly.io
        if: ${{ github.event_name == 'push' }}
        run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```
