const token = process.env.TOKEN
const Bot = require('node-telegram-bot-api')
const quiz = require('./quiz.js')
const i18n = require('i18n')
const defaultLocale = 'en'
const supportedLocales = ['en', 'ru']

function createBot () {
  if (process.env.NODE_ENV !== 'production') {
    return new Bot(token, { polling: true })
  }

  let bot = new Bot(token)
  bot.setWebHook(process.env.HEROKU_URL + bot.token)
  return bot
}

function localeFromMsg (msg) {
  const chatID = msg.chat.id
  let locale = msg.from.language_code.toLowerCase()
  if (supportedLocales.includes(locale) === false) {
    locale = defaultLocale
  }
  return (storage[chatID] && storage[chatID].locale) || locale
}

function postNewQuestion (chatID, locale) {
  const question = quiz.generateQuestion(locale)
  if (!storage[chatID]) {
    storage[chatID] = {}
  }
  storage[chatID].answer = question.answer

  const opts = {
    'reply_markup': {
      'keyboard': [question.options],
      'one_time_keyboard': true,
      parse_mode: 'Markdown' }
  }
  bot.sendMessage(chatID, question.text, opts)
}

let bot = createBot()
let storage = {}
i18n.configure({
  directory: 'data/locales/',
  locales: supportedLocales,
  defaultLocale: defaultLocale
})

bot.onText(/^[^/]/, function (msg) {
  const chatID = msg.chat.id
  const locale = localeFromMsg(msg)
  if (storage[chatID] == null || storage[chatID].answer == null) {
    bot.sendMessage(
      chatID,
      i18n.__({
        phrase: 'wrong_command',
        locale: locale
      }),
      { parse_mode: 'Markdown' }
    )
    return
  }

  const answer = storage[chatID].answer
  let answerReply
  if (msg.text === answer) {
    answerReply = i18n.__({ phrase: 'well_done', locale: locale })
  } else {
    answerReply = i18n.__({ phrase: 'wrong_answer_format', locale: locale }, answer)
  }
  bot.sendMessage(chatID,
    answerReply,
    { parse_mode: 'Markdown' }).then(() =>

    postNewQuestion(chatID, locale)
  )
})

bot.onText(/^\/start$/, (msg) => {
  const locale = localeFromMsg(msg)
  const chatID = msg.chat.id
  const welcomeMsg = i18n.__({
    phrase: 'welcome_format',
    locale: locale },
  msg.from.first_name)
  bot.sendMessage(
    chatID,
    welcomeMsg,
    { parse_mode: 'Markdown' }
  )
})

bot.onText(/^\/play$/, (msg) => {
  const chatID = msg.chat.id
  const locale = localeFromMsg(msg)
  postNewQuestion(chatID, locale)
})

bot.onText(/\/language (.+)/, (msg, match) => {
  const chatID = msg.chat.id
  const userLocale = match[1]
  let locale
  let responseMsg
  if (!supportedLocales.includes(userLocale)) {
    locale = localeFromMsg(msg)
    responseMsg = i18n.__({
      phrase: 'failed_change_language_format',
      locale: locale
    },
    userLocale)
  } else {
    locale = userLocale
    responseMsg = i18n.__({
      phrase: 'success_change_language_format',
      locale: locale
    },
    userLocale)
  }

  if (storage[chatID]) {
    storage[chatID].locale = locale
  } else {
    storage[chatID] = { locale: locale }
  }

  bot.sendMessage(
    chatID,
    responseMsg,
    { parse_mode: 'Markdown' }
  )
})

bot.on('polling_error', (error) => {
  console.log(error)
})

module.exports = bot
