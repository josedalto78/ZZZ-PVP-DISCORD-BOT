const { addPlayerIfNotExists } = require("../utils/players");

module.exports = (client, message, db) => {
  if (!message.content.startsWith("!partida")) return;

  const mentions = message.mentions.users;
  if (mentions.size !== 2) return message.reply("Marque exatamente 2 jogadores para a partida.");

  const [player1, player2] = mentions.map(u => u);

  // Garantir que jogadores estão no banco
  addPlayerIfNotExists(db, player1);
  addPlayerIfNotExists(db, player2);

  // Criar a partida
  db.run(`INSERT INTO tb_partida DEFAULT VALUES`, function(err) {
    if (err) return console.error(err.message);

    const partidaId = this.lastID;

    db.run(
      `INSERT OR IGNORE INTO tb_partida_player (cd_partida, cd_player) 
       SELECT ?, cd_player FROM tb_player WHERE dc_id IN (?, ?)`,
      [partidaId, player1.id, player2.id],
      function(err) {
        if (err) return console.error(err.message);

        message.reply(`🎮 Partida criada! ID: ${partidaId}\n${player1.username} vs ${player2.username}`);
      }
    );
  });
};
