## Creating New React Apps

How I create a new react app:

```bash
pnpm create vite courseinfo --template react
cd courseinfo
rm -r public/ src/assets src/App.css src/index.css .eslintrc.cjs
echo "" > README.md
```

## Creating new express apps

```bash
pnpm init
pnpm install express
pnpm install --save-dev nodemon
```

package.json:

```json
  "scripts": {
    "start": "node index.js",

    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
```

## Submitting Exercises

### How many Exercises?

https://studies.cs.helsinki.fi/stats/courses/fullstackopen

To see how many exercises I did in exercise 5:

- on unix:
  ```sh
  git log --oneline --extended-regexp --grep "^(Exercise )?6\.[0-9]+" --after "2024/01/01" | wc -l
  ```


- on Windows:
  ```powershell
  (git log --oneline --grep "^5\.[0-9]\+" --after "2024/01/01").Count
  ```

### How long spent?

My first commit of unit 8 was: bada4288ca8ccafae1e8ac3da142c7d61c86afe2

To list all the commits in this unit:

```sh
git log --oneline bada4288ca8ccafae1e8ac3da142c7d61c86afe2^..HEAD
```

To get the session ones...

```sh
git log bada4288ca8ccafae1e8ac3da142c7d61c86afe2^..HEAD -E --grep "^(start|end) session"
```

Now to get the timestamps:

```sh
git log bada4288ca8ccafae1e8ac3da142c7d61c86afe2^..HEAD -E --grep "^(start|end) session" --pretty="%at"
```

Powershell to do the math:
```powershell
$timestamps = (git log bada4288ca8ccafae1e8ac3da142c7d61c86afe2^..HEAD -E --grep "^(start|end) session" --pretty="%at")

$total = 0
$previous = 0
for ($i=0; $i -lt $timestamps.Length; $i++) {
  if ($i % 2 -eq 0) {
    $previous = $timestamps[$i]
  } else {
    $total += ($previous - $timestamps[$i])
  }
}

Write-Host ($total / 60 / 60)
```






## Course Grading Criteria

exercises completed |	credits |	grade
--- | --- | ---
138 |	7 |	5
127 |	6 |	5
116 |	5 |	5
105 |	5 |	4
94 |	5 |	3
83 |	5 |	2
72 |	5 |	1


## Learning Promises well, [from You Don't Know JS](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch3.md), keeps getting recommended

## Using `nvm` to manage node versions

`nvm use node` updates to the newest version

## Misc Notes

## Services

### Platform as a Service (PaaS)

e.g. Heroku. Developers don't have to worry about servers and infrastructure.

### Infrastructure as a Service (IaaS)

e.g. AWS. Provides compute, storage, networking, etc.

### Function as a Service (FaaS)

Running specific functions or pieces of code without managing the underlying infrastructure.

Example: AWS Lambda, Google Cloud Functions

### Containers as a Service (CaaS)

Focus: Managing and deploying containerized applications.
Example: Docker, Kubernetes

### Database as a Service (DBaaS)

Focus: Managing and providing database services without the complexities of database administration.
Example: Amazon RDS, Google Cloud SQL
