import { getPool } from '../config/db.js'

export const runMigrations = async () => {
  const pool = getPool()
  const associationAcceptedAnswersBackfill = [['Dubler', ['kaskader']]]
  const associationHintBackfill = [
    ['Hormon', 'Hemijski signal koji upravlja mnogim procesima u tijelu.'],
  ]
  const logicHintBackfill = [
    ['Hormon', 'Hemijski signal koji upravlja mnogim procesima u tijelu.'],
  ]
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
  const [submissionKindColumns] = await pool.query(
    "SHOW COLUMNS FROM game_submissions LIKE 'submission_kind'"
  )
  const [submissionContentTypeColumns] = await pool.query(
    "SHOW COLUMNS FROM game_submissions LIKE 'content_type'"
  )
  const [submissionContentItemIdColumns] = await pool.query(
    "SHOW COLUMNS FROM game_submissions LIKE 'content_item_id'"
  )
  const [submissionProposedAnswerColumns] = await pool.query(
    "SHOW COLUMNS FROM game_submissions LIKE 'proposed_answer'"
  )
  const [historyPerformanceBonusColumns] = await pool.query(
    "SHOW COLUMNS FROM game_history LIKE 'performance_bonus'"
  )
  const [historyComboBonusColumns] = await pool.query(
    "SHOW COLUMNS FROM game_history LIKE 'combo_bonus'"
  )
  const [historyMaxComboColumns] = await pool.query(
    "SHOW COLUMNS FROM game_history LIKE 'max_combo'"
  )
  const [historyWrongAttemptsColumns] = await pool.query(
    "SHOW COLUMNS FROM game_history LIKE 'wrong_attempts'"
  )
  const [historyPartialCountColumns] = await pool.query(
    "SHOW COLUMNS FROM game_history LIKE 'partial_count'"
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

  if (!submissionKindColumns.length) {
    await pool.query(
      "ALTER TABLE game_submissions ADD COLUMN submission_kind VARCHAR(30) NOT NULL DEFAULT 'game' AFTER is_daily"
    )
  }

  if (!submissionContentTypeColumns.length) {
    await pool.query(
      "ALTER TABLE game_submissions ADD COLUMN content_type VARCHAR(30) NULL AFTER submission_kind"
    )
  }

  if (!submissionContentItemIdColumns.length) {
    await pool.query(
      'ALTER TABLE game_submissions ADD COLUMN content_item_id INT NULL AFTER content_type'
    )
  }

  if (!submissionProposedAnswerColumns.length) {
    await pool.query(
      'ALTER TABLE game_submissions ADD COLUMN proposed_answer VARCHAR(255) NULL AFTER content_item_id'
    )
  }

  if (!historyPerformanceBonusColumns.length) {
    await pool.query(
      'ALTER TABLE game_history ADD COLUMN performance_bonus INT NOT NULL DEFAULT 0 AFTER awarded_points'
    )
  }

  if (!historyComboBonusColumns.length) {
    await pool.query(
      'ALTER TABLE game_history ADD COLUMN combo_bonus INT NOT NULL DEFAULT 0 AFTER performance_bonus'
    )
  }

  if (!historyMaxComboColumns.length) {
    await pool.query(
      'ALTER TABLE game_history ADD COLUMN max_combo INT NOT NULL DEFAULT 0 AFTER combo_bonus'
    )
  }

  if (!historyWrongAttemptsColumns.length) {
    await pool.query(
      'ALTER TABLE game_history ADD COLUMN wrong_attempts INT NOT NULL DEFAULT 0 AFTER hint_count'
    )
  }

  if (!historyPartialCountColumns.length) {
    await pool.query(
      'ALTER TABLE game_history ADD COLUMN partial_count INT NOT NULL DEFAULT 0 AFTER wrong_attempts'
    )
  }

  for (const [word, symbol] of associationSymbolBackfill) {
    await pool.query(
      'UPDATE association_words SET symbol = ? WHERE LOWER(word) = LOWER(?) AND (symbol IS NULL OR symbol = \'\')',
      [symbol, word]
    )
  }

  for (const [word, answersToAdd] of associationAcceptedAnswersBackfill) {
    const [rows] = await pool.query(
      'SELECT id, accepted_answers_json FROM association_words WHERE LOWER(word) = LOWER(?)',
      [word]
    )

    for (const row of rows) {
      let acceptedAnswers = []

      try {
        acceptedAnswers = Array.isArray(row.accepted_answers_json)
          ? row.accepted_answers_json
          : JSON.parse(String(row.accepted_answers_json || '[]'))
      } catch {
        acceptedAnswers = []
      }

      const nextAcceptedAnswers = [...acceptedAnswers]

      answersToAdd.forEach((answer) => {
        const alreadyExists = nextAcceptedAnswers.some(
          (item) => String(item || '').trim().toLowerCase() === String(answer).toLowerCase()
        )

        if (!alreadyExists) {
          nextAcceptedAnswers.push(answer)
        }
      })

      if (nextAcceptedAnswers.length !== acceptedAnswers.length) {
        await pool.query(
          'UPDATE association_words SET accepted_answers_json = ? WHERE id = ?',
          [JSON.stringify(nextAcceptedAnswers), row.id]
        )
      }
    }
  }

  for (const [word, hint] of associationHintBackfill) {
    await pool.query(
      'UPDATE association_words SET hint = ? WHERE LOWER(word) = LOWER(?)',
      [hint, word]
    )
  }

  for (const [answer, hint] of logicHintBackfill) {
    await pool.query(
      'UPDATE logic_challenges SET hint = ? WHERE LOWER(answer) = LOWER(?)',
      [hint, answer]
    )
  }

  await pool.query(
    `UPDATE users u
     LEFT JOIN (
       SELECT user_id, COALESCE(SUM(awarded_points), 0) AS total_points
       FROM game_history
       GROUP BY user_id
     ) history_totals ON history_totals.user_id = u.id
     SET u.points = COALESCE(history_totals.total_points, 0),
         u.level = FLOOR(COALESCE(history_totals.total_points, 0) / 1000) + 1
     WHERE u.role <> 'admin'`
  )

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
