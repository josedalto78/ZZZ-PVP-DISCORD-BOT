module.exports = (client, message, db) => {
  if (message.content === "!ping") {
    message.reply("Pong!");
  }
};