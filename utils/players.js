
function addPlayerIfNotExists(db, user) {
  db.run(
    `INSERT OR IGNORE INTO tb_player (dc_id, ds_rank) VALUES (?, ?)`,
    [user.id, user.username],
    (err) => {
      if (err) console.error(err.message);
    }
  );
}

function isAdmin(member) {
  return member && member.permissions.has("Administrator");
}

module.exports = { addPlayerIfNotExists, isAdmin };