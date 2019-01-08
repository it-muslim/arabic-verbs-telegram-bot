const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TOKEN, {polling: true});

var storage = null;

// Utls

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}


// Logic

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

// `OnText` Callbacks

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
	bot.sendMessage(msg.chat.id, "Welcome " + msg.from.first_name);
});

bot.onText(/\/play/, (msg) => {
  const chatID = msg.chat.id;

  const wordInfo = randomWordInfo();
  const rightWord = wordInfo["rightWord"];
  const question = questionText(rightWord);

  const variants = shuffle(wordInfo["words"].map(word =>{ 
    return word.ar;
  }));
  const opts = { "reply_markup": { "keyboard": [variants], "one_time_keyboard": true  }};
  storage = {"currentWordInfo": wordInfo}

	bot.sendMessage(chatID, question, opts);
});


