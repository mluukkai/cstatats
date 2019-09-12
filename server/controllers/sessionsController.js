const { ApplicationError } = require('@util/customErrors')
const models = require('@db/models')

const create = async (req, res) => {
  const credentials = {
    username: req.body.username,
    password: req.body.password
  }

  try {
    // ugly backdoor for testing
    if (credentials.username === 'testertester' && credentials.password === 'testertester123' ) {
      let user = await models.User.findOne({ username: 'testertester' })
      if (user === null) {
        user = models.User({
          username: 'testertester',
          token: jwt.sign({ username: 'testertester' }, process.env.SECRET),
          student_number: '012345678',
          first_names: 'Teppo',
          last_name: 'Testaaja',
        })
        await user.save()
      } 

      const response = {
        username: req.body.username,
        token: user.token,
        student_number: user.student_number,
        first_names: user.first_names,
        last_name: user.last_name,
        peerReview: user.peerReview
      }

      res.send(response)  
      return
    }

    const fromServer = await axios('https://opetushallinto.cs.helsinki.fi/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: credentials
    })

    if (fromServer.data.error) {
      res.status(401).send(fromServer.data)
    } else {
      const lowercase_username = credentials.username.toLowerCase()
      let user = await models.User.findOne({ username: lowercase_username })
      if (user===null) { 
        user = models.User({ 
          username: lowercase_username,
          token: jwt.sign({ username: lowercase_username }, process.env.SECRET),
          student_number : fromServer.data.student_number,
          first_names : fromServer.data.first_names,
          last_name : fromServer.data.last_name, 
        }) 
        res = await user.save()
      } 

      const response = {
        username: lowercase_username,
        token: user.token,
        student_number: user.student_number,
        first_names: user.first_names,
        last_name: user.last_name 
      }

      res.send(response)  
    }
  } catch(e){
    console.log(e)
    res.status(500).send({ error: "something went wrong..." })
  }
}

module.exports = {
  create
}