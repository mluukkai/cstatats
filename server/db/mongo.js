const models = require('@db/models')

const student_number = '012345678'

const main = async () => {
  const user = await models
    .User
    .findOne({ student_number })

  const obj = {
    week: 0,
    exercises: [1, 2, 3],
    comment: "good",
    time: 5,
    github: "github.com/mluukkai/mluukkai.github.io/issues",
    username: user.username,
    user: user._id
  }

  console.log('USER',user)

  const submission = new models.Submission(obj)

  const res = await submission.save()
  console.log('id', res._id)

  user.submissions = user.submissions.concat(res._id)
  
  console.log('USER2', user)
  const ressi = await user.save()
  console.log(ressi)

  models.mongoose.connection.close()
}

const main1 = async () => {
  const user = await models
    .User
    .findOne({ student_number })
    .populate('submissions')

  console.log(user)
  models.mongoose.connection.close()
}

const main2 = async () => {
  const subs = await models
    .Submission
    .find({ })
  console.log(subs)
  models.mongoose.connection.close()
}

const main3 = async () => {
  const subs = await models
    .Submission
    .remove({})
  console.log(subs)
  models.mongoose.connection.close()
}

const main4 = async () => {
  const subs = await models
    .Submission
    .find({})
  console.log(subs)
  models.mongoose.connection.close()
}

main()
