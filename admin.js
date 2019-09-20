const models = require('@db/models')

async function removeCourse(id) {
  try {
    await models.Course.findByIdAndRemove(id)
    models.mongoose.connection.close()
  } catch (e) {
    console.log(e)
    models.mongoose.connection.close()
  }
}

async function remove_mluukkai() {
  try {
    console.log('before', await models.Submission.count())
    const resp = await models.Submission.remove({ username: 'mluukkai' })
    const user = await models.User.findOne({ username: 'mluukkai' })
    user.peerReview = null
    const resp2 = await models.Project.remove({ name: 'koeaihe' })
    user.submissions = []
    user.project = null
    await user.save()
    const user2 = await models.User.findOne({ username: 'testertester' })
    user2.project = null
    await user2.save()
    console.log('after removal', await models.Submission.count())

    models.mongoose.connection.close()
  } catch (e) {
    console.log(e)
    models.mongoose.connection.close()
  }
}

async function acceptMinirproject(student_number) {
  try {
    const user = await models.User.findOne({ student_number })

    if (user.project !== undefined && user.project !== null) {
      const proj = await models.Project.findById(user.project)
      const users = proj.users.filter(u => !u.equals(user._id))
      proj.users = users
      await proj.save()

      user.project = null
    }

    user.projectAccepted = true
    await user.save()
    models.mongoose.connection.close()
  } catch (e) {
    console.log(e)
    models.mongoose.connection.close()
  }
}

async function remove_crediting(student_number) {
  try {
    const user = await models.User.findOne({ student_number })
    await models.Extension.deleteOne({ username: user.username })

    user.extensions = []
    console.log('LOL')
    console.log(user)
    await user.save()
    models.mongoose.connection.close()
  } catch (e) {
    console.log(e)
    models.mongoose.connection.close()
  }
}

async function unAcceptMinirproject(student_number) {
  try {
    const user = await models.User.findOne({ student_number })

    user.projectAccepted = null
    await user.save()
    models.mongoose.connection.close()
  } catch (e) {
    console.log(e)
    models.mongoose.connection.close()
  }
}

async function student(student_number) {
  try {
    const user = await models
      .User
      .findOne({ student_number })
      // .//populate('project')
      .populate('submissions')

    const submissions = user.submissions.map(s => ({
      week: s.week,
      time: s.time,
      github: s.github,
      exercises: s.exercises.join(','),
    }))

    const formatted = {
      token: user.token,
      student_number: user.student_number,
      first_names: user.first_names,
      last_name: user.last_name,
      submissions,
    }

    if (user.project && user.project.name) {
      formatter.project = {
        name: user.project.name,
        github: user.project.github,
      }
    }

    console.log(formatted)
    models.mongoose.connection.close()
  } catch (e) {
    console.log(e)
    models.mongoose.connection.close()
  }
}


async function project_fix_duplicates(id) {
  try {
    const project = await models
      .Project
      .findOne({ _id: id })

    console.log(project)

    const uniq_users = []
    project.users.forEach((u) => {
      if (!uniq_users.find(p => p.equals(u))) {
        uniq_users.push(u)
      }
    })

    project.users = uniq_users
    await project.save()

    console.log('-')
    console.log(project)

    models.mongoose.connection.close()
  } catch (e) {
    console.log(e)
    models.mongoose.connection.close()
  }
}

async function project(id) {
  try {
    const project = await models
      .Project
      .findOne({ _id: id })
      .populate('users')

    console.log(project)
    models.mongoose.connection.close()
  } catch (e) {
    console.log(e)
    models.mongoose.connection.close()
  }
}

async function addToProject(student_number, id) {
  try {
    const project = await models
      .Project
      .findOne({ _id: id })
      .populate('users')

    const user = await models
      .User
      .findOne({ student_number })
      .populate('submissions')

    if (user.project) {
      console.log('user already in a project')
    } else {
      user.project = project._id
      project.users.push(user._id)
      await project.save()
      await user.save()
    }

    models.mongoose.connection.close()
  } catch (e) {
    console.log(e)
    models.mongoose.connection.close()
  }
}

async function meeting(id, time) {
  try {
    const project = await models
      .Project
      .findOne({ _id: id })

    project.meeting = time.split(':').join(' ')
    const x = await project.save()
    console.log(x)
    models.mongoose.connection.close()
  } catch (e) {
    console.log(e)
    models.mongoose.connection.close()
  }
}

async function submission(courseName, student_number, week, time, exers, github) {
  try {
    const user = await models
      .User
      .findOne({ student_number })
      .populate('submissions')

    const exercises = exers.split(',').map(s => Number(s))

    const sub = new models.Submission({
      week,
      exercises,
      time,
      github,
      user: user._id,
      comment: '',
      username: user.username,
      courseName,
    })

    await sub.save()

    user.submissions.push(sub._id)
    await user.save()

    console.log(user)

    models.mongoose.connection.close()
  } catch (e) {
    console.log(e)
    models.mongoose.connection.close()
  }
}

async function changeRepo(name, github) {
  try {
    const project = await models
      .Project
      .findOne({ name })
    project.github = github

    await project.save()

    models.mongoose.connection.close()
  } catch (e) {
    console.log(e)
    models.mongoose.connection.close()
  }
}

async function deleteExistingSubmission(courseName, student_number, week) {
  try {
    const user = await models
      .User
      .findOne({ student_number })
      .populate('submissions')

    const toRemove = user.submissions.find(s => s.week === Number(week) && s.courseName === courseName)

    if (toRemove) {
      const submissions = user.submissions.filter(s => s._id !== toRemove._id)
      user.submission = submissions
      await models.Submission.findByIdAndRemove(toRemove._id)
      await user.save
      console.log('removed')
    }

    models.mongoose.connection.close()
  } catch (e) {
    console.log(e)
    models.mongoose.connection.close()
  }
}

const args = process.argv.slice(2)

const commands = [
  'setWeek', 'course', 'exercises', 'submission', 'delete_existing_submission',
  'remove_mluukkai', 'accept_proj', 'unaccept_proj', 'add_to_project',
  'student', 'project', 'mluukkai', 'meeting', 'changeRepo', 'project_fix_duplicates',
  'setup', 'setName', 'setUrl', 'remove_tester', 'set_fullname', 'toggle',
  'removeCourse', 'toggleMiniproject', 'toggleExtension', 'remove_crediting',

]

const command = args[0]

if (args.length < 1 || !commands.includes(args[0])) {
  console.log('commands: ', commands.join(', '))
  process.exit(0)
}

if (command === 'setWeek') {
  if (args.length < 3) {
    console.log('no course/week specified')
    process.exit(0)
  }
  const week = Number(args[2])
  setWeekTo(args[1], week)
} else if (command === 'removeCourse') {
  if (args.length < 2) {
    console.log('no courseid')
    process.exit(0)
  }
  removeCourse(args[1])
} else if (command === 'set_fullname') {
  if (args.length < 3) {
    console.log('no course/name specified')
    process.exit(0)
  }

  const course = args[1]
  args.shift()
  args.shift()
  const name = args.join(' ')
  console.log(name)
  setFullname(course, name)
} else if (command === 'toggleMiniproject') {
  if (args.length < 2) {
    console.log('no course specified')
    process.exit(0)
  }
  toggleMiniproject(args[1])
} else if (command === 'toggleExtension') {
  if (args.length < 2) {
    console.log('no course specified')
    process.exit(0)
  }
  toggleExtension(args[1])
} else if (command === 'toggle') {
  if (args.length < 2) {
    console.log('no course specified')
    process.exit(0)
  }
  toggleCourse(args[1])
} else if (command === 'exercises') {
  if (args.length < 4) {
    console.log('no course/week/cnt specified')
    process.exit(0)
  }
  const week = Number(args[2])
  const cnt = Number(args[3])
  setWeekExercises(args[1], week, cnt)
} else if (command === 'remove_mluukkai') {
  remove_mluukkai()
} else if (command === 'remove_tester') {
  remove_tester()
} else if (command === 'student') {
  if (args.length < 2) {
    console.log('no student')
    process.exit(0)
  }
  student(args[1])
} else if (command === 'mluukkai') {
  student('011120775')
} else if (command === 'remove_crediting') {
  if (args.length < 2) {
    console.log('no student')
    process.exit(0)
  }

  remove_crediting(args[1])
} else if (command === 'accept_proj') {
  if (args.length < 2) {
    console.log('no student')
    process.exit(0)
  }

  acceptMinirproject(args[1])
} else if (command === 'unaccept_proj') {
  if (args.length < 2) {
    console.log('no student')
    process.exit(0)
  }

  unAcceptMinirproject(args[1])
} else if (command === 'project') {
  if (args.length < 2) {
    console.log('no id')
    process.exit(0)
  }

  project(args[1])
} else if (command === 'project_fix_duplicates') {
  if (args.length < 2) {
    console.log('no id')
    process.exit(0)
  }

  project_fix_duplicates(args[1])
} else if (command === 'add_to_project') {
  if (args.length < 3) {
    console.log('no student/project')
    process.exit(0)
  }

  addToProject(args[1], args[2])
} else if (command === 'meeting') {
  if (args.length < 3) {
    console.log('no id/time')
    process.exit(0)
  }

  meeting(args[1], args[2])
} else if (command === 'submission') {
  if (args.length < 6) {
    console.log('usage: (course, studentnro, week, hours, exercises)')
    console.log('submission course 01234567 4 10 1,2,3,4 https://github.com/mluukkai/repo')
    process.exit(0)
  }

  let exe = args[5]
  if (exe.includes('-')) {
    const [from, to] = exe.split('-')
    console.log(from, to)
    const ee = []
    for (let x = from; x <= to; x++) {
      ee.push(`${x}`)
    }
    exe = ee.join(',')
  }

  console.log(exe)

  submission(args[1], args[2], args[3], args[4], exe, args[6])
} else if (command === 'changeRepo') {
  if (args.length < 2) {
    console.log('miniproj/repo missing')
    process.exit(0)
  }

  changeRepo(args[1], args[2])
} else if (command === 'delete_existing_submission') {
  if (args.length < 2) {
    console.log('usage: coursename student week')
    process.exit(0)
  }

  deleteExistingSubmission(args[1], args[2], args[3])
} else if (command === 'setup') {
  if (args.length < 3) {
    console.log('name url term year missing')
    process.exit(0)
  }
  setUp(args[1], args[2], args[3], args[4])
} else if (command === 'setName') {
  if (args.length < 2) {
    process.exit(0)
  }

  const name = `${args[1]} ${args[2]} -${args[3]}`

  setName(name)
} else if (command === 'setUrl') {
  if (args.length < 2) {
    process.exit(0)
  }
  args.shift()

  setUrl(args.shift())
}

// models.mongoose.connection.close()
