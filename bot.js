const token = process.env.TOKEN;
const Bot = require('node-telegram-bot-api');
const utils = require('./utils.js');
const quiz = require('./quiz.js');
let bot;
let storage;


if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else {
  bot = new Bot(token, { polling: true });
}


bot.on('message', function (msg) {
    var chatId = msg.chat.id;
    if (storage == null) {
      // bot.sendMessage(msg.chat.id, "Что это было, " + msg.from.first_name + "?");
      return;
    }
    const wordInfo = storage["currentWordInfo"];
    const rightWord = wordInfo["rightWord"];
    const isRightAnwer = (msg.text == rightWord.ar);
    if (isRightAnwer) {
      bot.sendMessage(msg.chat.id, "Красавчик!");
    }
    else {
      bot.sendMessage(msg.chat.id, "Упс, правильно было: " + rightWord.ar);
    }
    storage = null

});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome " + msg.from.first_name + " (Rustam's env)");
});

bot.onText(/\/play/, (msg) => {
  const chatID = msg.chat.id;

  const wordInfo = quiz.randomWordInfo();
  const rightWord = wordInfo["rightWord"];
  const question = quiz.questionText(rightWord);

  const variants = utils.shuffleArray(wordInfo["words"].map(word =>{
    return word.ar;
  }));

  const opts = { "reply_markup": { "keyboard": [variants], "one_time_keyboard": true  }};
  storage = {"currentWordInfo": wordInfo}

  bot.sendMessage(chatID, question, opts);
});

module.exports = bot;
