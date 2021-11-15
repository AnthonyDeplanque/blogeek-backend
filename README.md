#blogeek-backEnd

##How to launch it ?

###1
`npm i`
it will install all dependencies

###2
`git submodule init`
`git submodule update --recursive --remote`
It will install the library inside the repository

###3
replace the ".env.sample" by ".env"
Make sure to put your environment variables in it.

###4
type `npx db-migrate up` to put the first insertions into the database.
(in order to test the application, the initial admin account is "admin" and the password is "password1234")
