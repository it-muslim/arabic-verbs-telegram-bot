const assert = require('assert')

const words = require('./data/verb-forms.json')
const questionTexts = require('./data/verb-question-texts.json')

function genQuestionText (word, lang) {
  const prefix = questionTexts[lang][word.person][word.number][word.gender]
  return `${prefix} ${word.text[lang]}`
}

function genQuestion (lang) {
  // Firstly, pick forms of a random word and shuffle them
  let forms = words[Math.floor(Math.random() * words.length)].forms
  assert(forms.length >= 4)
  forms = forms.sort(() => 0.5 - Math.random()) // shuffle

  // Now pick first 4 of them and without loss of generality
  // the first one will be the right answer
  let options = forms.slice(0, 4)
  let answer = options[0]

  return {
    'text': genQuestionText(answer, lang),
    'answer': answer.text.ar,
    'options': options.map(option => option.text.ar)
  }
}

module.exports.genQuestion = genQuestion
