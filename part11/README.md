# CI/CD

## Why CI/CD

- "works on my machine" problems
- different changes to same code - which gets shipped?`

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
