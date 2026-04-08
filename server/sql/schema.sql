CREATE DATABASE IF NOT EXISTS word_association_lab;
USE word_association_lab;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  points INT NOT NULL DEFAULT 0,
  level INT NOT NULL DEFAULT 1,
  progress_reset_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS association_words (
  id INT AUTO_INCREMENT PRIMARY KEY,
  word VARCHAR(120) NOT NULL,
  category VARCHAR(80) NOT NULL,
  difficulty VARCHAR(40) NOT NULL,
  clues_json JSON NOT NULL,
  hint TEXT NULL,
  accepted_answers_json JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logic_challenges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mode ENUM('concept', 'odd-one-out') NOT NULL DEFAULT 'concept',
  words_json JSON NOT NULL,
  answer VARCHAR(120) NOT NULL,
  hint TEXT NULL,
  category VARCHAR(80) NOT NULL,
  difficulty VARCHAR(40) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS relation_challenges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  left_word VARCHAR(120) NOT NULL,
  right_word VARCHAR(120) NOT NULL,
  relation ENUM('Sinonim', 'Antonim', 'Asocijacija') NOT NULL,
  category VARCHAR(80) NOT NULL,
  difficulty VARCHAR(40) NOT NULL,
  hint TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_type VARCHAR(60) NOT NULL,
  score INT NOT NULL DEFAULT 0,
  base_score INT NULL,
  earned_points INT NOT NULL DEFAULT 0,
  awarded_points INT NOT NULL DEFAULT 0,
  total INT NOT NULL DEFAULT 0,
  correct INT NOT NULL DEFAULT 0,
  accuracy INT NOT NULL DEFAULT 0,
  time_seconds INT NOT NULL DEFAULT 0,
  category VARCHAR(80) NULL,
  difficulty VARCHAR(40) NULL,
  hint_count INT NOT NULL DEFAULT 0,
  is_daily TINYINT(1) NOT NULL DEFAULT 0,
  daily_reward INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_game_history_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS game_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_label VARCHAR(80) NOT NULL,
  game_type VARCHAR(80) NOT NULL,
  content TEXT NOT NULL,
  points INT NOT NULL DEFAULT 0,
  time_seconds INT NOT NULL DEFAULT 0,
  status ENUM('pending', 'approved', 'flagged') NOT NULL DEFAULT 'pending',
  is_daily TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_challenge_overrides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  challenge_date DATE NOT NULL UNIQUE,
  content_type ENUM('association', 'logic', 'relation') NOT NULL,
  content_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_challenge_completions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  challenge_date DATE NOT NULL,
  content_type ENUM('association', 'logic', 'relation') NOT NULL,
  content_id INT NOT NULL,
  reward INT NOT NULL DEFAULT 500,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_daily_completion (user_id, challenge_date),
  CONSTRAINT fk_daily_completion_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS support_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  recipient_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_support_message_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_support_message_recipient FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO association_words (word, category, difficulty, clues_json, hint, accepted_answers_json)
SELECT * FROM (
  SELECT
    'Sunce',
    'Priroda',
    'Lako',
    JSON_ARRAY('Dan', 'Toplota', 'Svjetlost', 'Ljeto'),
    'Pomisli na nebesko tijelo koje nam daje svjetlost i toplotu.',
    JSON_ARRAY('sunce')
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM association_words WHERE word = 'Sunce');

INSERT INTO logic_challenges (mode, words_json, answer, hint, category, difficulty)
SELECT * FROM (
  SELECT
    'concept',
    JSON_ARRAY('Pas', 'Macka', 'Lav'),
    'Zivotinja',
    'Rjesenje je povezano sa zivotinjama.',
    'Priroda',
    'Lako'
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM logic_challenges WHERE answer = 'Zivotinja');

INSERT INTO relation_challenges (left_word, right_word, relation, category, difficulty, hint)
SELECT * FROM (
  SELECT
    'Topao',
    'Hladan',
    'Antonim',
    'Priroda',
    'Lako',
    'Rijeci imaju suprotno znacenje.'
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM relation_challenges WHERE left_word = 'Topao' AND right_word = 'Hladan');
