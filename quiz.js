const assert = require('assert')
const shuffle = require('lodash-es/shuffle')

const QUESTION_SIZE = 4

const words = require('./data/verb-forms.json')
const pronouns = require('./data/pronouns.json')

function generateQuestionText (word, lang) {
  let prefix = pronouns[word.pronoun].text[lang]
  // Capitalize first letter
  prefix = prefix.charAt(0).toUpperCase() + prefix.slice(1)
  return `${prefix} ${word.text[lang]}`
}

function generateQuestion (lang) {
  // Firstly, pick forms of a random word and shuffle them
  let forms = words[Math.floor(Math.random() * words.length)].forms

  assert(forms.length >= QUESTION_SIZE)

  shuffle(forms)

  // Now pick first 4 of them and without loss of generality
  // the first one will be the right answer
  let options = forms.slice(0, QUESTION_SIZE)
  let answer = options[Math.floor(Math.random() * QUESTION_SIZE)]

  return {
    'text': generateQuestionText(answer, lang),
    'answer': answer.text.ar,
    'options': options.map(option => option.text.ar)
  }
}

module.exports.generateQuestion = generateQuestion
