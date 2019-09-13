// This file is for mongo db initialization
db.createUser( // eslint-disable-line
  {
    user: 'mongo',
    pwd: 'mongo',
    roles: [
      {
        role: 'readWrite',
        db: 'mongo',
      },
    ],
  },
)
