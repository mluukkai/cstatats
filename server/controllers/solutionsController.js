const path = require('path')
const { ApplicationError } = require('@util/customErrors')
const fs = require('fs')

const solutionFolder = (courseName, part) => path.resolve(__dirname, `../assets/solutions/${courseName}/part${part}`)

const solutionFiles = async (req, res) => {
  const isDir = name => fs.lstatSync(name).isDirectory()

  const { courseName, part } = req.params
  const courseSolutions = solutionFolder(courseName, part)

  const recurse = (folder) => {
    const files = []

    fs.readdirSync(folder).forEach((name) => {
      const fullName = `${folder}/${name}`
      const type = isDir(fullName) ? 'dir' : 'file'

      const fileObject = { name, type, fullName: fullName.split(courseSolutions)[1] }
      if (isDir(fullName)) {
        fileObject.files = recurse(fullName)
      }

      files.push(fileObject)
    })

    return files
  }

  const files = recurse(courseSolutions)

  res.send(files)
}

const getSolutionFile = async (req, res) => {
  const { courseName, part } = req.params
  const user = await req.currentUser.populate('submissions').execPopulate()
  const completedParts = user.submissions.filter(s => s.courseName === courseName).map(s => s.week)
  if (!completedParts.includes(part)) throw new ApplicationError('not authorized', 401)

  const { file } = req.query
  const solutionFile = path.join(solutionFolder(courseName, part), file)
  console.log(solutionFile)
  res.sendFile(solutionFile)
}

module.exports = {
  solutionFiles,
  getSolutionFile,
}
