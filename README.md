# Coursestats

`npm ci` to install dependencies

Start development mode with `npm run dev`

# Getting dump from prod

Optional: To get started fast get a dump from the production server

So that the directory structure is

dump/mongo/coursestats.bson

Run

```
docker cp dump coursestats_studies_db:/
docker exec -it coursestats_studies_db mongorestore -u root -p root
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