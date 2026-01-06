module.exports = (client, message, db) => {
  if (message.content === "!rank") {
    db.all(
      `SELECT ds_rank, qt_pontos, qt_vitoria
       FROM tb_player
       ORDER BY qt_pontos DESC
       LIMIT 10`,
      [],
      (err, rows) => {
        if (err) return console.error(err.message);

        if (!rows.length) {
          message.reply("Nenhum jogador registrado ainda.");
          return;
        }

        let ranking = "🏆 **Ranking PvP** 🏆\n\n";
        rows.forEach((player, i) => {
          ranking += `${i + 1}º - ${player.ds_rank} → ${player.qt_pontos} pts (${player.qt_vitoria} vitórias)\n`;
        });

        message.reply(ranking);
      }
    );
  }
};