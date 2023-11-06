Let's suppose the application is written primarily in Java.

Checkstyle could be a linting tool.
JUnit is a unit testing framework.
Gradle and Maven are two popular build frameworks.
They may have to be configured pretty well to compile using javac plus all dependency libraries.
CircleCI and Buddy were two cloud-based CI/CD alternatives to Jenkins or Github actions.

I would say start with a cloud-based CI/CD system, and if the project runs into limitations there, start setting up a dedicated server of your own that meets the requirements. But until then it may be difficult to predict the requirements.
