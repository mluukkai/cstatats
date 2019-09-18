const common = require('@root/config/common')

const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:mongo@db/mongo'
const PORT = process.env.PORT || 8000

const ADMINS = ['mluukkai', 'laatopi', 'kalleilv', 'nikoniko']

const QUESTIONS = [
  {
    id: 1,
    title: 'Kuinka hyvin kukin ryhmän jäsen oli läsnä? Arvioi myös oma läsnäolosi.',
    description: 'IRC:n, Telegramin, Whatsupin ym pikaviestimien aktiivinen käyttö lasketaan myös läsnäoloksi',
    scale: 'Arvioi skaalalla 0 = ei ollenkaan ... 5 = erittäin paljon',
    type: 'rating',
  },
  {
    id: 2,
    title: 'Miten paljon kukin ryhmän jäsen kontribuoi projektin tuotoksiin',
    description: 'Tuotoksiksi lasketaan koodi, dokumentaatio, testit, bugiraportit, suunnitelmat ja muut projektin tuotokset. Arvioi myös oma tuotteliaisuutesi',
    scale: ' Arvioi skaalalla 0 = ei ollenkaan ... 5 = erittäin paljon',
    type: 'rating',
  },
  {
    id: 3,
    title: 'Mitkä olivat kuluneella ajanjaksolla kolme oleellisinta tuotosta joiden tuottamiseen itse osallistuit?',
    type: 'text',
  },
  {
    id: 4,
    title: 'Kuinka hyvin kukin vaikutti käyttäytymisellään siihen, että työskentelymme oli mielekästä',
    scale: '0 = negatiivisesti, 1 = ei lainkaan, 2 = vähän, 3 = melko paljon, 4 = paljon, 5 = erittäin paljon',
    type: 'rating',
  },
  {
    id: 5,
    title: 'Kuinka aktiivisesti kukin ryhmän jäsen osallistui projektiin? Arvioi myös oma aktiivisuutesi.',
    scale: '0 = erittäin passiivisesti ... 5 = erittäin aktiivisesti',
    type: 'rating',
  },
  {
    id: 6,
    title: 'Arvosanaehdotuksesi',
    type: 'rating',
  },
  {
    id: 7,
    title: 'Perusteet arvosanaehdotuksille',
    type: 'text',
  },
  {
    id: 8,
    title: 'Palautetta miniprojektista',
    description: 'Kerro mikä projektissa on hyvää ja mikä huonoa. Miten projektia kannattaisi kehittää?',
    type: 'text',
  },
]

const formProject = (p) => {
  const formUser = u => ({
    last_name: u.last_name,
    first_names: u.first_names,
    username: u.username,
  })

  if (p === null) {
    return null
  }

  return {
    name: p.name,
    github: p.github,
    _id: p._id,
    meeting: p.meeting,
    users: p.users.map(formUser),
  }
}

module.exports = {
  ...common,
  formProject,
  MONGO_URL,
  PORT,
  ADMINS,
  QUESTIONS,
}
