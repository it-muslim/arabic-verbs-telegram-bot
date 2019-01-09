function questionText (word) {
  // word.plurity
  // word.geneter

  // const question = { ... }
  // return question
  return 'они (вдвоем) (женщины) сказали' // TODO: Delete mock
}

function randomWordInfo () {
  // const db = database()
  // const word = Word({get random data from database})
  // const words = Word({get 3 random data from database that are not equal to wordId})

  const words = [
    { 'ar': 'قالت' }, // TODO: Delete mock
    { 'ar': 'قالوا' },
    { 'ar': 'قالو' }
  ]
  const word = { 'ar': 'قالتا', 'ru': 'сказали' } // TODO: Delete mock
  words.push(word)

  return {
    'rightWord': word,
    'words': words
  }
}

module.exports.randomWordInfo = randomWordInfo
module.exports.questionText = questionText
