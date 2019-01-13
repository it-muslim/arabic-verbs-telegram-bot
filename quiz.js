const assert = require('assert')

function generateQuestionText (word) {
  let text = ''
  if (word.number === 'singular') {
    if (word.gender === 'male') {
      text += 'He '
    } else {
      text += 'She '
    }
  } else {
    text += 'They ('
    if (word.number === 'dual') {
      text += 'two '
    } else {
      text += 'many '
    }
    if (word.gender === 'male') {
      text += 'men) '
    } else {
      text += 'women) '
    }
  }
  text += word.text.en
  return text
}

function generateQuestion (words) {
  // Firstly, pick forms of a random word and shuffle them
  let forms = words[Math.floor(Math.random() * words.length)].forms
  assert(forms.length >= 4)
  forms = forms.sort(() => 0.5 - Math.random()) // shuffle

  // Now pick first 4 of them and the first one will be the right answer
  let options = forms.slice(0, 4)
  let answer = options[0]

  return {
    'text': generateQuestionText(answer),
    'answer': answer.text.ar,
    'options': options.map(option => option.text.ar)
  }
}

module.exports.generateQuestion = generateQuestion
