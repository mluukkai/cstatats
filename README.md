# Coursestats

[![Release](https://github.com/UniversityOfHelsinkiCS/coursestats/actions/workflows/main.yml/badge.svg)](https://github.com/UniversityOfHelsinkiCS/coursestats/actions/workflows/main.yml)

`npm ci` to install dependencies

Start development mode with `npm run dev`

# Getting dump from prod

Optional: To get started fast get a dump from the production server. You can generate a new dump with `backup.sh`, and it gets created under _/home/studies_user/coursestats/db_backups_

An example SCP command as a reminder. You need to apply correct access rights to the directory first.

```console
$ scp -r -o ProxyCommand="ssh -W %h:%p melkinpaasi.cs.helsinki.fi" studies.cs.helsinki.fi:/home/studies_user/coursestats/db_backups/XXX_YYY/mongo ./dump
```

Before running the following locally make sure the directory structure is

`dump/mongo/coursestats.bson`

The following copies dump folder into the container and restores it. By default mongorestore checks for /dump/_dbname_/_files_. For development dbname is mongo


```
$ docker cp dump coursestats_studies_db:/
$ docker exec -it coursestats_studies_db mongorestore -u root -p root
```

# Development Dotenv

Create .env file with 

```
USES_SHIBBOLETH=true
```

if you want to develop with the github login fill in the following

```
GITHUB_ID=
GITHUB_SECRET=
GITHUB_CALLBACK=
GITHUB_REDIRECT=
GITHUB_STATE=
JWT_SECRET=
```

## Maintainers and Contribution

Toska of University of Helsinki.
