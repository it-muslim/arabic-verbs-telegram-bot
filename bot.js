const token = process.env.TOKEN
const ITMuslim = require('./itMuslim.js')
const Bot = require('node-telegram-bot-api')
const quiz = require('./quiz.js')
const l10 = require('./data/localization.json')

let bot
let storage = { base_language: ITMuslim.Language.en }

if (process.env.NODE_ENV === 'production') {
  bot = new Bot(token)
  bot.setWebHook(process.env.HEROKU_URL + bot.token)
} else {
  bot = new Bot(token, { polling: true })
}

// Prepares current user storage and user language of interface and content
function prepareUser (msg) {
  const chatID = msg.chat.id
  if (storage[chatID] != null) {
    return
  }

  let str = msg.from.language_code.toLowerCase()
  let lgCode = str.substring(0, 2) // dropping region code
  lgCode = ITMuslim.Language.hasOwnProperty(lgCode) ? lgCode : storage.base_language
  storage[chatID] = { language_code: lgCode }
}

function postNewQuestion (chatID) {
  const lgCode = (storage[chatID] && storage[chatID].language_code) || storage.base_language
  const question = quiz.generateQuestion(lgCode)
  storage[chatID].answer = question.answer

  const opts = {
    'reply_markup': {
      'keyboard': [question.options],
      'one_time_keyboard': true,
      parse_mode: 'Markdown' }
  }
  bot.sendMessage(chatID, question.text, opts)
}

bot.onText(/^[^/]/, function (msg) {
  const chatID = msg.chat.id
  const lgCode = (storage[chatID] && storage[chatID].language_code) || storage.base_language
  if (storage[chatID] == null || storage[chatID].answer == null) {
    bot.sendMessage(
      chatID,
      ITMuslim.localizeString(l10[lgCode].wrong_command),
      { parse_mode: 'Markdown' }
    )
    return
  }

  const answer = storage[chatID].answer
  let result
  if (msg.text === answer) {
    result = ITMuslim.localizeString(l10[lgCode].well_done)
  } else {
    result = ITMuslim.localizeString(l10[lgCode].wrong_answer_format, answer)
  }
  bot.sendMessage(chatID,
    result,
    { parse_mode: 'Markdown' }).then(() =>
    postNewQuestion(chatID)
  )
})

bot.onText(/^\/start$/, (msg) => {
  prepareUser(msg)

  const chatID = msg.chat.id
  const lgCode = (storage[chatID] && storage[chatID].language_code) || storage.base_language
  bot.sendMessage(
    msg.chat.id,
    ITMuslim.localizeString(l10[lgCode].welcome_format, msg.from.first_name),
    { parse_mode: 'Markdown' }
  )
})

bot.onText(/^\/play$/, (msg) => {
  prepareUser(msg)
  postNewQuestion(msg.chat.id)
})

module.exports = bot
