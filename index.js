const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const token = "6154618091:AAGorrVr7loKxipxDUniwOle_mpPExTwf3Q";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

bot.setMyCommands([
  { command: "/start", description: "Начальное приветствие" },
  { command: "/info", description: "Получить информацию о пользователе" },
  { command: "/game", description: "Игра угадай цифру, мазафакер" },
]);

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Сейчас я загадаю цифру от 0 до 9, а ты должен ее отгадать`
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадай", gameOptions);
};

const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/6.webp"
      );
      return bot.sendMessage(
        chatId,
        `Добро пожаловать в телеграм бот, Мазафакер`
      );
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй еще раз!");
  });
};

bot.on("callback_query", async (msg) => {
  const data = msg.data;
  const chatId = msg.message.chat.id;
  if (data === "/again") {
    return startGame(chatId);
  }
  if (data == chats[chatId]) {
    return bot.sendMessage(
      chatId,
      `Поздравляю, ты отгадал цифру ${chats[chatId]}`,
      againOptions
    );
  } else {
    return bot.sendMessage(
      chatId,
      `Ты не угадал, бот загадал ${chats[chatId]}`,
      againOptions
    );
  }
});

start();
