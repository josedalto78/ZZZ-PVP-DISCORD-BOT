const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) console.error(err.message);
  else console.log("Conectado ao SQLite!");
});

db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS tb_player (
    cd_player INTEGER PRIMARY KEY AUTOINCREMENT,
    dc_id TEXT NOT NULL UNIQUE,
    qt_vitoria INTEGER DEFAULT 0,
    ds_rank TEXT,
    qt_pontos INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS tb_partida (
    cd_partida INTEGER PRIMARY KEY AUTOINCREMENT,
    dt_partida DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tb_partida_player (
    cd_partida INTEGER NOT NULL,
    cd_player INTEGER NOT NULL,
    fl_vencedor INTEGER DEFAULT 0,
    PRIMARY KEY (cd_partida, cd_player),
    FOREIGN KEY (cd_partida) REFERENCES tb_partida(cd_partida),
    FOREIGN KEY (cd_player) REFERENCES tb_player(cd_player)
  );
`);

module.exports = db;