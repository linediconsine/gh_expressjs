# Express Js - Simple test

Using:

	- Superagent
	- Jest
	- EjS templating
	

## step 1 - Create an OAuth Apps in github:

Tutorial:
https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/

## step 2 - Install all the dependecies

```bash
$ git clone https://github.com/linediconsine/gh_expressjs.git

Cloning into 'gh_expressjs'...
remote: Counting objects: 23, done.
remote: Compressing objects: 100% (18/18), done.
remote: Total 23 (delta 1), reused 23 (delta 1), pack-reused 0
Unpacking objects: 100% (23/23), done.

$ cd gh_expressjs/

$ npm install

```
## step 3 - Configure App.js
Edit in App.js configure follow fields:

```
// ## Edit this
const SUPER_SECRET_KEY = "SUPER_SECRET_KEY" // TO-DO CRYPT BEFORE SHARE
const GITHUB_CLIENT_ID = "7a011111111111111136"
const GITHUB_CLIENT_SECRET = "22a11111111111111111128"

```
## step 3 - run App.js
```bash
$ npm start
```

Open [http://localhost:3000](http://localhost:3000)


## step 4 - testing
Lunch test

```bash
$ npm run test
```

Lunch interactive test

```bash
$ npm run test:watch
```

