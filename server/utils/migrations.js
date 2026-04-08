import { getPool } from '../config/db.js'

export const runMigrations = async () => {
  const pool = getPool()
  const [userResetColumns] = await pool.query(
    "SHOW COLUMNS FROM users LIKE 'progress_reset_at'"
  )

  if (!userResetColumns.length) {
    await pool.query(
      'ALTER TABLE users ADD COLUMN progress_reset_at TIMESTAMP NULL DEFAULT NULL'
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
