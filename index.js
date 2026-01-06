require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Banco
const db = require("./database/db");

// Comandos
const pingCommand = require("./commands/ping");
const winCommand = require("./commands/win");
const rankCommand = require("./commands/rank");
const historicoCommand = require("./commands/historico");
const partidaCommand = require("./commands/partida");

client.once("ready", () => {
  console.log("Bot está online!");
});

// Remove listeners antigos ANTES de adicionar o novo (evita duplicação ao reiniciar)
client.removeAllListeners("messageCreate");

client.on("messageCreate", (message) => {
  pingCommand(client, message, db);
  winCommand(client, message, db);
  rankCommand(client, message, db);
  historicoCommand(client, message, db);
  partidaCommand(client, message, db);
});

// Login do bot
client.login(process.env.DISCORD_TOKEN);

// Tratamento graceful de shutdown
process.on("SIGINT", () => {
  db.close();
  client.destroy();
  process.exit();
});