const token = process.env.TOKEN
const Bot = require('node-telegram-bot-api')
const quiz = require('./quiz.js')
const words = require('./data.json')

let bot
let storage

if (process.env.NODE_ENV === 'production') {
  bot = new Bot(token)
  bot.setWebHook(process.env.HEROKU_URL + bot.token)
} else {
  bot = new Bot(token, { polling: true })
}

bot.on('message', function (msg) {
  const chatID = msg.chat.id
  if (storage == null) {
    // bot.sendMessage(chatID, 'The game is not started! Start the game by typing /play')
    return
  }

  if (msg.text === storage.answer) {
    bot.sendMessage(chatID, 'Well done!')
  } else {
    bot.sendMessage(chatID, 'Oops, the right answer is: ' + storage.answer)
  }
  storage = null
})

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Welcome ' + msg.from.first_name)
})

bot.onText(/\/play/, (msg) => {
  const question = quiz.generateQuestion(words)
  storage = { 'answer': question.answer }

  const opts = { 'reply_markup': { 'keyboard': [question.options], 'one_time_keyboard': true } }
  bot.sendMessage(msg.chat.id, question.text, opts)
})

module.exports = bot
