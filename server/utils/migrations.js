import { getPool } from '../config/db.js'

export const runMigrations = async () => {
  const pool = getPool()
  const associationSymbolBackfill = [
    ['Sunce', '☀️'],
    ['More', '🌊'],
    ['Galaksija', '🌌'],
    ['Atom', '⚛️'],
    ['Fudbal', '⚽'],
    ['Maraton', '🏃'],
    ['Kamera', '🎬'],
    ['Robot', '🤖'],
  ]
  const [userResetColumns] = await pool.query(
    "SHOW COLUMNS FROM users LIKE 'progress_reset_at'"
  )
  const [userEmailColumns] = await pool.query("SHOW COLUMNS FROM users LIKE 'email'")
  const [userAuthProviderColumns] = await pool.query("SHOW COLUMNS FROM users LIKE 'auth_provider'")
  const [userGoogleIdColumns] = await pool.query("SHOW COLUMNS FROM users LIKE 'google_id'")
  const [userAvatarColumns] = await pool.query("SHOW COLUMNS FROM users LIKE 'avatar_url'")
  const [userPasswordHashColumns] = await pool.query("SHOW COLUMNS FROM users LIKE 'password_hash'")
  const [userGoogleIdIndexes] = await pool.query(
    "SHOW INDEX FROM users WHERE Key_name = 'unique_users_google_id'"
  )
  const [userEmailIndexes] = await pool.query(
    "SHOW INDEX FROM users WHERE Key_name = 'unique_users_email'"
  )
  const [associationSymbolColumns] = await pool.query(
    "SHOW COLUMNS FROM association_words LIKE 'symbol'"
  )

  if (!userResetColumns.length) {
    await pool.query(
      'ALTER TABLE users ADD COLUMN progress_reset_at TIMESTAMP NULL DEFAULT NULL'
    )
  }

  if (!userEmailColumns.length) {
    await pool.query('ALTER TABLE users ADD COLUMN email VARCHAR(255) NULL AFTER username')
  }

  if (!userAuthProviderColumns.length) {
    await pool.query(
      "ALTER TABLE users ADD COLUMN auth_provider VARCHAR(30) NOT NULL DEFAULT 'local' AFTER password_hash"
    )
  }

  if (!userGoogleIdColumns.length) {
    await pool.query('ALTER TABLE users ADD COLUMN google_id VARCHAR(255) NULL AFTER auth_provider')
  }

  if (!userAvatarColumns.length) {
    await pool.query('ALTER TABLE users ADD COLUMN avatar_url TEXT NULL AFTER google_id')
  }

  if (userPasswordHashColumns[0]?.Null === 'NO') {
    await pool.query('ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NULL')
  }

  if (!userGoogleIdIndexes.length) {
    await pool.query('ALTER TABLE users ADD UNIQUE KEY unique_users_google_id (google_id)')
  }

  if (!userEmailIndexes.length) {
    await pool.query('ALTER TABLE users ADD UNIQUE KEY unique_users_email (email)')
  }

  if (!associationSymbolColumns.length) {
    await pool.query(
      'ALTER TABLE association_words ADD COLUMN symbol VARCHAR(24) NULL AFTER word'
    )
  }

  for (const [word, symbol] of associationSymbolBackfill) {
    await pool.query(
      'UPDATE association_words SET symbol = ? WHERE LOWER(word) = LOWER(?) AND (symbol IS NULL OR symbol = \'\')',
      [symbol, word]
    )
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS daily_challenge_completions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      challenge_date DATE NOT NULL,
      content_type ENUM('association', 'logic', 'relation') NOT NULL,
      content_id INT NOT NULL,
      reward INT NOT NULL DEFAULT 500,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_daily_completion (user_id, challenge_date),
      CONSTRAINT fk_daily_completion_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS support_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sender_id INT NOT NULL,
      recipient_id INT NOT NULL,
      message TEXT NOT NULL,
      is_read TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_support_message_sender
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_support_message_recipient
        FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)
}
