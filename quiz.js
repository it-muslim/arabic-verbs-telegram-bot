// Function to get a question
// @type - is a type of the question:
//   - 1 - find Arabic word for other (Russian). I.e. like "What is Arabic for 'He said'?"
//   - 2 - the opposite to 1
function getQuestion(type=1) {
  //TODO
}

// Generates a question text for a give question
function getQuestionText(question) {
  //TODO
}

function questionText(word) {
  // word.plurity
  // word.geneter

  // const question = { ... }
  // return question
  return "они (вдвоем) (женщины) сказали"; //TODO: Delete mock
}

function randomWordInfo() {
  // const db = database()
  // const word = Word({get random data from database})
  // const words = Word({get 3 random data from database that are not equal to wordId})

  const words = [{ "ar" : "قالت"},  //TODO: Delete mock
                 { "ar" : "قالوا"},
                 { "ar" : "قالو"}];
  const word = { "ar" : "قالتا", "ru" : "сказали" }; //TODO: Delete mock
  words.push(word)

  return {
    "rightWord": word,
    "words": words
  }
}

module.exports.randomWordInfo = randomWordInfo;
module.exports.questionText = questionText;