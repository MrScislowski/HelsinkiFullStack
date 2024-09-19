Hypothetical: 6 people working on a python project in active development to be released soon.

Software tools:

- linting
  - flake8
  - ruff
- testing
  - pytest
- building

  - I don't think this would be necessary. Could incorporate more fancy compiled modules if speed was an issue; no premature optimization though.

- CI alternatives to jenkins/gh actions

  - Gitlab
  - circleCI
  - avoid atlassian b/c it gets really expensive according to people

- self-hosted or cloud-based
  - cloud-hosted since it's going to be released soon
  - in the absence of fancy GPU / other requirements, 6 developers could probably use a github actions without any probem
