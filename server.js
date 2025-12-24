import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { readFile } from "fs/promises";

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  try {
    const data = await readFile("index.html");
    res.setHeader("Content-Type", "text/html");
    res.send(data);
  } catch (err) {
    console.error("Read index.html error:", err);
    res.status(500).send("Ошибка сервера");
  }
});

function getRandomColor() {
  const colors = ["#ff4040", "#40ff40", "#4040ff", "#ff80ff", "#ffff40", "#40ffff", "#ffaa00", "#a56cff"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function random(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const valera = {
  nick: "Валера",
  color: "#ffaa00",
  joined: false
};

const valeraRandomPhrases = [
  "ЭЭ"
];

const valeraCompliments = [
  "я влюблен в твою красоту", "ты сияешь сегодня", "твой стиль просто бомбический",
  "вашей папе мать не нужен?", "мама дорогая что персик наливной",
  "ваши родители не машинисты?тогда откуда у них такой паровоз", "иди поплачь немощь"
];

const valeraTrolls = [
  "ну ты и клоун конечно...", "мда… что за бред", "лучше бы молчал", "я IQ теряю, читая тебя",
  "ох уж эти идиоты", "ну и глупость", "маму ебал", "убежал в страхе от сюда",
  "Na, dann heul doch jetzt los, du Dicker."
];

const kisa = {
  nick: "Киса",
  color: "#ff69b4",
  joined: false,
  phrases: [
    "ты такой интересный 😏", "с тобой так интересно 😉", "ммм, интересно общаться 😘",
    "ух ты, как круто 😍", "так если ты обидешь меня я пожалуюсь валере", "люблю тебя малышка",
    "давай встречаться", "а ты прикольный", "ты милый", "покатаемся на твоей тачке?",
    "был бы ты ботом..."
  ]
};

const kisaFlirtResponses = [
  { trigger: /кто вообще тут/i, responses: ["Ну я тут… только для тебя 😉", "Только я, Валера 😏"] },
  { trigger: /чё молчим/i, responses: ["Да я слушаю… только тебя 😘", "Ну я здесь 😏"] },
  { trigger: /че бля|иди на хуй|ты охуел|да ну нахуй|ёбаный|долбоёбы/i, responses: ["Ой, Валера… ты такой 😘", "Хаха, ты шалун 😏"] }
];

function sendBotMessage(bot, text) {
  io.emit("chat-message", {
    nick: bot.nick,
    color: bot.color,
    text
  });
}
function getValeraResponse(msg) {
  const lower = msg.toLowerCase();
  for (const troll of valeraTrolls) {
    if (lower.includes(troll.toLowerCase())) return random(valeraRandomPhrases);
  }
  if (Math.random() < 0.3) return random(valeraCompliments);
  return random(valeraRandomPhrases);
}

io.on("connection", (socket) => {
  socket.nickname = Гость${Math.floor(Math.random() * 1000)};
  socket.color = getRandomColor();
  io.emit("system", ${socket.nickname} вошёл в чат);

  if (!valera.joined) {
    setTimeout(() => {
      io.emit("system", ${valera.nick} вошёл в чат);
      valera.joined = true;
    }, 1000);
  }

  if (!kisa.joined) {
    setTimeout(() => {
      io.emit("system", ${kisa.nick} вошёл в чат);
      kisa.joined = true;
    }, 1500);
  }

  socket.on("chat-message", (msgText) => {
    const fromNick = socket.nickname || "Гость";
    io.emit("chat-message", {
      nick: fromNick,
      color: socket.color || "#ffffff",
      text: msgText
    });

    if (valera.joined) {
      const resp = getValeraResponse(msgText);
      setTimeout(() => sendBotMessage(valera, resp), 1000 + Math.random() * 2000);
    }

    if (kisa.joined) {
      for (const r of kisaFlirtResponses) {
        if (r.trigger.test(msgText)) {
          const resp = random(r.responses);
          setTimeout(() => sendBotMessage(kisa, resp), 1500 + Math.random() * 2000);
        }
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(BubbleChat запущен на порту ${PORT});
});

