const { isAdmin } = require("../utils/players");

module.exports = (client, message, db) => {
  if (!message.content.startsWith("!win")) return;

  if (!isAdmin(message.member)) {
    return message.reply("❌ Apenas administradores podem finalizar partidas.");
  }

  const vencedor = message.mentions.users.first();
  if (!vencedor) return message.reply("Marque o vencedor da partida.");

  // Buscar a última partida com algum jogador sem vencedor definido
  db.get(
    `SELECT p.cd_partida 
     FROM tb_partida p
     JOIN tb_partida_player pp ON p.cd_partida = pp.cd_partida
     WHERE pp.fl_vencedor = 0
     ORDER BY p.dt_partida DESC
     LIMIT 1`,
    [],
    (err, row) => {
      if (err) return console.error(err.message);
      if (!row) return message.reply("Nenhuma partida pendente encontrada.");

      const partidaId = row.cd_partida;

      // Verificar se o usuário mencionado participa da partida
      db.get(
        `SELECT cd_player FROM tb_player WHERE dc_id = ?`,
        [vencedor.id],
        (err, playerRow) => {
          if (err) return console.error(err.message);
          if (!playerRow) return message.reply("Jogador não encontrado no banco.");

          const vencedorId = playerRow.cd_player;

          // Atualizar a tabela de partida_player
          db.run(
            `UPDATE tb_partida_player 
             SET fl_vencedor = CASE WHEN cd_player = ? THEN 1 ELSE 0 END
             WHERE cd_partida = ?`,
            [vencedorId, partidaId],
            function (err) {
              if (err) return console.error(err.message);

              // Atualizar pontos e vitórias do vencedor
              db.run(
                `UPDATE tb_player
                 SET qt_vitoria = qt_vitoria + 1, qt_pontos = qt_pontos + 10
                 WHERE cd_player = ?`,
                [vencedorId],
                function (err) {
                  if (err) return console.error(err.message);

                  message.reply(`🏆 ${vencedor.username} venceu a partida #${partidaId}!`);
                }
              );
            }
          );
        }
      );
    }
  );
};