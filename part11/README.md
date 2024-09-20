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
