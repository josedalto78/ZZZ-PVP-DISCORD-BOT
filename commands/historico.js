
module.exports = (client, message, db) => {
  if (!message.content.startsWith("!historico")) return;

  const user = message.mentions.users.first();
  if (!user) return message.reply("Marque um jogador para ver o histórico.");

  db.all(
    `SELECT p.cd_partida, pp.fl_vencedor, p.dt_partida
     FROM tb_partida_player pp
     JOIN tb_partida p ON pp.cd_partida = p.cd_partida
     JOIN tb_player pl ON pp.cd_player = pl.cd_player
     WHERE pl.dc_id = ?
     ORDER BY p.dt_partida DESC
     LIMIT 10`,
    [user.id],
    (err, rows) => {
      if (err) return console.error(err.message);
      if (!rows.length) return message.reply("Nenhuma partida encontrada para esse jogador.");

      let text = `🎮 **Histórico de ${user.username}:**\n`;
      rows.forEach((row) => {
        text += `- Partida #${row.cd_partida} em ${row.dt_partida} → ${
          row.fl_vencedor ? "Vitória 🏆" : "Derrota ❌"
        }\n`;
      });

      message.reply(text);
    }
  );
};