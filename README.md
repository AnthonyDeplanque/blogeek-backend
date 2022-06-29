# blogeek-backEnd

## How to launch it ?

### 1 install dependencies

`npm install`

it will install all dependencies

### 2 install submodules

`git submodule init`

`git submodule update --recursive --remote`

It will install the library inside the repository

### 3 env variables

replace the **.env.sample** by **.env**

Make sure to put your environment variables in it.

### 4 migration

type `npx db-migrate up` to put the first insertions into the database.

(in order to test the application, the initial admin account is "admin" and the password is "password1234")

### 5 run

type `npm run dev` to launch the server without building it with `tsc`

otherwize, type `tsc` and `npm start`

Have fun !
