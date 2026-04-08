USE word_association_lab;
SET NAMES utf8mb4;
SET @OLD_SQL_SAFE_UPDATES = @@SQL_SAFE_UPDATES;
SET SQL_SAFE_UPDATES = 0;

START TRANSACTION;

INSERT INTO users (username, password_hash, role, points, level)
VALUES
  ('admin_seed', '$2b$10$HjET1KVxoxyRTrrfjOi0teBDUWaLreZLUHKbu00/Ba6nrzTzuAY6i', 'admin', 0, 1),
  ('demo_mia', '$2b$10$1Kjyt57ByRJ7EuuGDMToOOaUhk5fBfze3Ty1w.xcjjBEIk4X3ZXOq', 'user', 0, 1),
  ('demo_nikola', '$2b$10$0xlcTlqwvZBa.rZfjow7NeC2K3xm24Z9.WIvNNPYkUoS0YF0xJLiO', 'user', 0, 1),
  ('demo_lana', '$2b$10$UJ7xnTA92t9wMWoNX9Vmg.GH9f6h/1jy.ryfEq/T7Ml0W68oNJkse', 'user', 0, 1)
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  role = VALUES(role);

DELETE FROM daily_challenge_completions
WHERE user_id IN (
  SELECT id FROM users WHERE username IN ('admin_seed', 'demo_mia', 'demo_nikola', 'demo_lana')
);

DELETE FROM game_history
WHERE user_id IN (
  SELECT id FROM users WHERE username IN ('admin_seed', 'demo_mia', 'demo_nikola', 'demo_lana')
);

DELETE FROM game_submissions
WHERE user_label IN ('admin_seed', 'demo_mia', 'demo_nikola', 'demo_lana', 'gost_demo');

DELETE FROM association_words
WHERE word IN (
  'Sunce',
  'More',
  'Vulkan',
  'Atom',
  'Galaksija',
  'Gravitacija',
  'Fudbal',
  'Maraton',
  'Gimnastika',
  'Kamera',
  'Scenario',
  'Montaza',
  'Piramida',
  'Renesansa',
  'Diplomatija',
  'Simfonija',
  'Skulptura',
  'Perspektiva',
  'Robot',
  'Algoritam',
  'Mikrocip',
  'Atlas',
  'Arhipelag',
  'Meridijan'
);

DELETE FROM logic_challenges
WHERE answer IN (
  'Astronomija',
  'Fjord',
  'Fudbal',
  'Reziser',
  'Film',
  'Glacijal',
  'Monarhija',
  'Baterija',
  'Voda',
  'Tablet',
  'Slikarstvo',
  'Satelit',
  'Softver',
  'Pehar',
  'Reljef',
  'Scenario'
);

DELETE FROM relation_challenges
WHERE
  (left_word = 'Topao' AND right_word = 'Hladan') OR
  (left_word = 'Talas' AND right_word = 'More') OR
  (left_word = 'Suma' AND right_word = 'Gaj') OR
  (left_word = 'Brz' AND right_word = 'Spor') OR
  (left_word = 'Pobjeda' AND right_word = 'Trijumf') OR
  (left_word = 'Lopta' AND right_word = 'Gol') OR
  (left_word = 'Glumac' AND right_word = 'Uloga') OR
  (left_word = 'Glavni' AND right_word = 'Sporedni') OR
  (left_word = 'Kadar' AND right_word = 'Scena') OR
  (left_word = 'Mir' AND right_word = 'Rat') OR
  (left_word = 'Staro' AND right_word = 'Drevno') OR
  (left_word = 'Kruna' AND right_word = 'Prijesto') OR
  (left_word = 'Tisina' AND right_word = 'Buka') OR
  (left_word = 'Kist' AND right_word = 'Platno') OR
  (left_word = 'Inspiracija' AND right_word = 'Ideja') OR
  (left_word = 'Kod' AND right_word = 'Program') OR
  (left_word = 'Siguran' AND right_word = 'Nesiguran') OR
  (left_word = 'Robot' AND right_word = 'Automatizacija') OR
  (left_word = 'Mapa' AND right_word = 'Karta') OR
  (left_word = 'Sjever' AND right_word = 'Jug') OR
  (left_word = 'Kompas' AND right_word = 'Pravac') OR
  (left_word = 'Tacan' AND right_word = 'Precizan') OR
  (left_word = 'Hipoteza' AND right_word = 'Teorija') OR
  (left_word = 'Stabilan' AND right_word = 'Nestabilan');

INSERT INTO association_words (word, category, difficulty, clues_json, hint, accepted_answers_json)
VALUES
  ('Sunce', 'Priroda', 'Lako', JSON_ARRAY('Dan', 'Toplota', 'Svjetlost', 'Ljeto'), 'Nebesko tijelo koje nam daje svjetlost i toplotu.', JSON_ARRAY('sunce')),
  ('More', 'Priroda', 'Srednje', JSON_ARRAY('Talas', 'So', 'Plaza', 'Obala'), 'Velika slana vodena povrsina.', JSON_ARRAY('more')),
  ('Vulkan', 'Priroda', 'Tesko', JSON_ARRAY('Lava', 'Krater', 'Erupcija', 'Pepeo'), 'Prirodna pojava povezana sa magmom i erupcijom.', JSON_ARRAY('vulkan')),
  ('Atom', 'Nauka', 'Lako', JSON_ARRAY('Jezgro', 'Elektron', 'Hemija', 'Cestica'), 'Osnovna jedinica materije.', JSON_ARRAY('atom')),
  ('Galaksija', 'Nauka', 'Srednje', JSON_ARRAY('Zvijezde', 'Svemir', 'Mlijevni put', 'Orbita'), 'Ogromna grupa zvijezda i kosmickog materijala.', JSON_ARRAY('galaksija')),
  ('Gravitacija', 'Nauka', 'Tesko', JSON_ARRAY('Pad', 'Privlacnost', 'Masa', 'Njutn'), 'Sila koja privlaci tijela jedno drugom.', JSON_ARRAY('gravitacija')),
  ('Fudbal', 'Sport', 'Lako', JSON_ARRAY('Gol', 'Stadion', 'Lopta', 'Sudija'), 'Sport koji se igra najcesce nogom i loptom.', JSON_ARRAY('fudbal')),
  ('Maraton', 'Sport', 'Srednje', JSON_ARRAY('42 kilometra', 'Izdrzljivost', 'Staza', 'Trkac'), 'Dugacka trkacka disciplina.', JSON_ARRAY('maraton')),
  ('Gimnastika', 'Sport', 'Tesko', JSON_ARRAY('Parter', 'Greda', 'Salto', 'Ravnoteza'), 'Sport koji trazi koordinaciju, fleksibilnost i kontrolu tijela.', JSON_ARRAY('gimnastika')),
  ('Kamera', 'Film', 'Lako', JSON_ARRAY('Snimanje', 'Objektiv', 'Scena', 'Kadar'), 'Uredjaj bez kojeg nema snimanja filma.', JSON_ARRAY('kamera')),
  ('Scenario', 'Film', 'Srednje', JSON_ARRAY('Dijalog', 'Zaplet', 'Likovi', 'Scenarista'), 'Pisani plan filma ili serije.', JSON_ARRAY('scenario')),
  ('Montaza', 'Film', 'Tesko', JSON_ARRAY('Rez', 'Kadrove', 'Ritam', 'Postprodukcija'), 'Spajanje i uredjivanje snimljenog materijala.', JSON_ARRAY('montaza')),
  ('Piramida', 'Istorija', 'Lako', JSON_ARRAY('Egipat', 'Faraon', 'Pustinja', 'Grobnica'), 'Gradjevina najpoznatija iz starog Egipta.', JSON_ARRAY('piramida')),
  ('Renesansa', 'Istorija', 'Srednje', JSON_ARRAY('Leonardo', 'Preporod', 'Humanizam', 'Firenca'), 'Istorijski period preporoda umjetnosti i nauke.', JSON_ARRAY('renesansa')),
  ('Diplomatija', 'Istorija', 'Tesko', JSON_ARRAY('Pregovori', 'Ambasada', 'Sporazum', 'Drzava'), 'Umijece vodjenja medjudrzavnih odnosa.', JSON_ARRAY('diplomatija')),
  ('Simfonija', 'Umjetnost', 'Lako', JSON_ARRAY('Orkestar', 'Stav', 'Dirigent', 'Muzika'), 'Veliko muzicko djelo za orkestar.', JSON_ARRAY('simfonija')),
  ('Skulptura', 'Umjetnost', 'Srednje', JSON_ARRAY('Klesanje', 'Mermer', 'Figura', 'Vajar'), 'Umjetnicko djelo oblikovano u prostoru.', JSON_ARRAY('skulptura')),
  ('Perspektiva', 'Umjetnost', 'Tesko', JSON_ARRAY('Dubina', 'Linije', 'Slikarstvo', 'Prostor'), 'Likovni princip za prikaz prostora na ravnoj povrsini.', JSON_ARRAY('perspektiva')),
  ('Robot', 'Tehnologija', 'Lako', JSON_ARRAY('Masina', 'Senzor', 'Automatika', 'Program'), 'Pametna masina koja moze izvrsavati zadatke.', JSON_ARRAY('robot')),
  ('Algoritam', 'Tehnologija', 'Srednje', JSON_ARRAY('Koraci', 'Kod', 'Rjesenje', 'Logika'), 'Tacno odredjen niz koraka za rjesavanje problema.', JSON_ARRAY('algoritam')),
  ('Mikrocip', 'Tehnologija', 'Tesko', JSON_ARRAY('Tranzistor', 'Procesor', 'Ploca', 'Elektronika'), 'Mala elektronska komponenta koja sadrzi integrisana kola.', JSON_ARRAY('mikrocip', 'mikro cip')),
  ('Atlas', 'Geografija', 'Lako', JSON_ARRAY('Karta', 'Kontinent', 'Stranica', 'Planeta'), 'Zbirka geografskih karata.', JSON_ARRAY('atlas')),
  ('Arhipelag', 'Geografija', 'Srednje', JSON_ARRAY('Ostrvo', 'More', 'Grupa', 'Obala'), 'Skup vise ostrva na istom prostoru.', JSON_ARRAY('arhipelag')),
  ('Meridijan', 'Geografija', 'Tesko', JSON_ARRAY('Duzina', 'Greenwich', 'Koordinate', 'Karta'), 'Zamisljena linija koja spaja polove Zemlje.', JSON_ARRAY('meridijan'));

INSERT INTO logic_challenges (mode, words_json, answer, hint, category, difficulty)
VALUES
  ('concept', JSON_ARRAY('Teleskop', 'Planeta', 'Zvijezda'), 'Astronomija', 'Pomisli na nauku koja prouceva svemir.', 'Nauka', 'Lako'),
  ('odd-one-out', JSON_ARRAY('Proton', 'Neutron', 'Elektron', 'Fjord'), 'Fjord', 'Tri pojma pripadaju atomu, jedan pripada geografiji.', 'Nauka', 'Srednje'),
  ('concept', JSON_ARRAY('Gol', 'Lopta', 'Sudija'), 'Fudbal', 'Rijesenje je popularan ekipni sport.', 'Sport', 'Lako'),
  ('odd-one-out', JSON_ARRAY('Sprint', 'Maraton', 'Skok', 'Reziser'), 'Reziser', 'Tri pojma su sportske discipline.', 'Sport', 'Srednje'),
  ('concept', JSON_ARRAY('Glumac', 'Kadar', 'Scenarista'), 'Film', 'Povezi pojmove sa jednom umjetnickom industrijom.', 'Film', 'Lako'),
  ('odd-one-out', JSON_ARRAY('Kamera', 'Mikrofon', 'Montaza', 'Glacijal'), 'Glacijal', 'Tri pojma pripadaju filmskoj produkciji.', 'Film', 'Srednje'),
  ('concept', JSON_ARRAY('Kruna', 'Dvor', 'Vladar'), 'Monarhija', 'Rijesenje je oblik vladavine.', 'Istorija', 'Srednje'),
  ('odd-one-out', JSON_ARRAY('Piramida', 'Koloseum', 'Akvadukt', 'Baterija'), 'Baterija', 'Tri pojma su istorijske gradjevine ili ostaci.', 'Istorija', 'Srednje'),
  ('concept', JSON_ARRAY('Rijeka', 'Jezero', 'More'), 'Voda', 'Sve pojmove povezuje ista prirodna supstanca.', 'Priroda', 'Lako'),
  ('odd-one-out', JSON_ARRAY('Bor', 'Hrast', 'Jela', 'Tablet'), 'Tablet', 'Tri pojma su vrste drveca.', 'Priroda', 'Lako'),
  ('concept', JSON_ARRAY('Platno', 'Cetkica', 'Boja'), 'Slikarstvo', 'Rijesenje je oblast likovne umjetnosti.', 'Umjetnost', 'Srednje'),
  ('odd-one-out', JSON_ARRAY('Violina', 'Klavir', 'Gitara', 'Satelit'), 'Satelit', 'Tri pojma su muzicki instrumenti.', 'Umjetnost', 'Srednje'),
  ('concept', JSON_ARRAY('Kod', 'Program', 'Aplikacija'), 'Softver', 'Povezi pojmove sa digitalnim proizvodom.', 'Tehnologija', 'Lako'),
  ('odd-one-out', JSON_ARRAY('Procesor', 'Memorija', 'Ekran', 'Pehar'), 'Pehar', 'Tri pojma pripadaju tehnologiji ili racunaru.', 'Tehnologija', 'Tesko'),
  ('concept', JSON_ARRAY('Planina', 'Dolina', 'Kanjon'), 'Reljef', 'Rijesenje opisuje oblik zemljine povrsine.', 'Geografija', 'Srednje'),
  ('odd-one-out', JSON_ARRAY('Atlas', 'Meridijan', 'Ekvator', 'Scenario'), 'Scenario', 'Tri pojma se vezuju za geografiju.', 'Geografija', 'Tesko');

INSERT INTO relation_challenges (left_word, right_word, relation, category, difficulty, hint)
VALUES
  ('Topao', 'Hladan', 'Antonim', 'Priroda', 'Lako', 'Rijeci imaju suprotno znacenje.'),
  ('Talas', 'More', 'Asocijacija', 'Priroda', 'Lako', 'Jedan pojam prirodno priziva drugi.'),
  ('Suma', 'Gaj', 'Sinonim', 'Priroda', 'Srednje', 'Rijeci oznacavaju vrlo slican pojam.'),
  ('Brz', 'Spor', 'Antonim', 'Sport', 'Lako', 'Pogledaj da li su pojmovi suprotnosti.'),
  ('Pobjeda', 'Trijumf', 'Sinonim', 'Sport', 'Srednje', 'Oba pojma opisuju isti ishod.'),
  ('Lopta', 'Gol', 'Asocijacija', 'Sport', 'Lako', 'Pojmovi su cesto povezani u istoj igri.'),
  ('Glumac', 'Uloga', 'Asocijacija', 'Film', 'Lako', 'Jedan pojam skoro uvijek ide uz drugi u filmu.'),
  ('Glavni', 'Sporedni', 'Antonim', 'Film', 'Srednje', 'Pojmovi opisuju suprotne uloge ili planove.'),
  ('Kadar', 'Scena', 'Asocijacija', 'Film', 'Srednje', 'Povezanost je filmska, ne znacenjska.'),
  ('Mir', 'Rat', 'Antonim', 'Istorija', 'Lako', 'Pomisli na suprotnosti.'),
  ('Staro', 'Drevno', 'Sinonim', 'Istorija', 'Srednje', 'Rijeci su gotovo isto znacenje.'),
  ('Kruna', 'Prijesto', 'Asocijacija', 'Istorija', 'Srednje', 'Oba pojma prizivaju vladara i dvor.'),
  ('Tisina', 'Buka', 'Antonim', 'Umjetnost', 'Lako', 'Pogledaj da li jedna rijec iskljucuje drugu.'),
  ('Kist', 'Platno', 'Asocijacija', 'Umjetnost', 'Lako', 'Pojmovi su prirodno povezani u stvaranju slike.'),
  ('Inspiracija', 'Ideja', 'Sinonim', 'Umjetnost', 'Srednje', 'Oba pojma ukazuju na pocetak stvaranja.'),
  ('Kod', 'Program', 'Asocijacija', 'Tehnologija', 'Lako', 'Jedan pojam je sastavni dio drugog.'),
  ('Siguran', 'Nesiguran', 'Antonim', 'Tehnologija', 'Srednje', 'Rijeci imaju suprotan smisao.'),
  ('Robot', 'Automatizacija', 'Asocijacija', 'Tehnologija', 'Srednje', 'Povezani su kroz savremene sisteme i procese.'),
  ('Mapa', 'Karta', 'Sinonim', 'Geografija', 'Lako', 'Rijeci se u praksi koriste kao isto ili skoro isto.'),
  ('Sjever', 'Jug', 'Antonim', 'Geografija', 'Lako', 'Pojmovi pokazuju suprotne strane svijeta.'),
  ('Kompas', 'Pravac', 'Asocijacija', 'Geografija', 'Srednje', 'Jedan pojam sluzi da odredi drugi.'),
  ('Tacan', 'Precizan', 'Sinonim', 'Nauka', 'Lako', 'Obje rijeci opisuju visoku mjeru ispravnosti.'),
  ('Hipoteza', 'Teorija', 'Asocijacija', 'Nauka', 'Srednje', 'Pojmovi su blisko povezani u naucnom procesu.'),
  ('Stabilan', 'Nestabilan', 'Antonim', 'Nauka', 'Tesko', 'Jedna rijec negira osobinu druge.');

INSERT INTO game_submissions (user_label, game_type, content, points, time_seconds, status, is_daily)
VALUES
  ('demo_mia', 'Asocijacija', 'Sunce -> sunce | More -> more | Vulkan -> vulkan', 240, 68, 'pending', 0),
  ('demo_nikola', 'Logicki test', 'Teleskop, Planeta, Zvijezda -> Astronomija', 180, 54, 'approved', 0),
  ('demo_lana', 'Ne pripada', 'Violina, Klavir, Gitara, Satelit -> Satelit', 170, 49, 'flagged', 0),
  ('gost_demo', 'Lanac rijeci', 'centar: more | talas | plaza | barka | dubina', 210, 77, 'pending', 0),
  ('admin_seed', 'Dnevna relacija', 'Topao / Hladan -> Antonim', 650, 21, 'approved', 1);

INSERT INTO game_history (
  user_id, game_type, score, base_score, earned_points, awarded_points, total, correct,
  accuracy, time_seconds, category, difficulty, hint_count, is_daily, daily_reward, created_at
)
SELECT id, 'association', 1420, 1420, 220, 220, 3, 3, 100, 46, 'Priroda', 'Lako', 1, 0, 0, DATE_SUB(NOW(), INTERVAL 7 DAY)
FROM users WHERE username = 'demo_mia';

INSERT INTO game_history (
  user_id, game_type, score, base_score, earned_points, awarded_points, total, correct,
  accuracy, time_seconds, category, difficulty, hint_count, is_daily, daily_reward, created_at
)
SELECT id, 'logic', 1375, 1375, 175, 175, 4, 3, 75, 62, 'Nauka', 'Lako', 1, 0, 0, DATE_SUB(NOW(), INTERVAL 6 DAY)
FROM users WHERE username = 'demo_mia';

INSERT INTO game_history (
  user_id, game_type, score, base_score, earned_points, awarded_points, total, correct,
  accuracy, time_seconds, category, difficulty, hint_count, is_daily, daily_reward, created_at
)
SELECT id, 'relation', 1330, 1330, 130, 130, 4, 3, 75, 33, 'Sport', 'Lako', 0, 0, 0, DATE_SUB(NOW(), INTERVAL 4 DAY)
FROM users WHERE username = 'demo_mia';

INSERT INTO game_history (
  user_id, game_type, score, base_score, earned_points, awarded_points, total, correct,
  accuracy, time_seconds, category, difficulty, hint_count, is_daily, daily_reward, created_at
)
SELECT id, 'word-chain', 1210, 1210, 210, 210, 1, 1, 100, 71, 'Umjetnost', 'Srednje', 0, 0, 0, DATE_SUB(NOW(), INTERVAL 2 DAY)
FROM users WHERE username = 'demo_mia';

INSERT INTO game_history (
  user_id, game_type, score, base_score, earned_points, awarded_points, total, correct,
  accuracy, time_seconds, category, difficulty, hint_count, is_daily, daily_reward, created_at
)
SELECT id, 'association', 1480, 1480, 280, 280, 3, 3, 100, 39, 'Nauka', 'Srednje', 0, 0, 0, DATE_SUB(NOW(), INTERVAL 8 DAY)
FROM users WHERE username = 'demo_nikola';

INSERT INTO game_history (
  user_id, game_type, score, base_score, earned_points, awarded_points, total, correct,
  accuracy, time_seconds, category, difficulty, hint_count, is_daily, daily_reward, created_at
)
SELECT id, 'logic-odd-one-out', 1405, 1405, 205, 205, 4, 4, 100, 41, 'Geografija', 'Tesko', 1, 0, 0, DATE_SUB(NOW(), INTERVAL 5 DAY)
FROM users WHERE username = 'demo_nikola';

INSERT INTO game_history (
  user_id, game_type, score, base_score, earned_points, awarded_points, total, correct,
  accuracy, time_seconds, category, difficulty, hint_count, is_daily, daily_reward, created_at
)
SELECT id, 'association', 1180, 1180, 180, 680, 1, 1, 100, 19, 'Nauka', 'Srednje', 1, 1, 500, DATE_SUB(NOW(), INTERVAL 1 DAY)
FROM users WHERE username = 'demo_nikola';

INSERT INTO game_history (
  user_id, game_type, score, base_score, earned_points, awarded_points, total, correct,
  accuracy, time_seconds, category, difficulty, hint_count, is_daily, daily_reward, created_at
)
SELECT id, 'word-chain', 1240, 1240, 240, 240, 1, 1, 100, 56, 'Tehnologija', 'Srednje', 0, 0, 0, DATE_SUB(NOW(), INTERVAL 12 HOUR)
FROM users WHERE username = 'demo_nikola';

INSERT INTO game_history (
  user_id, game_type, score, base_score, earned_points, awarded_points, total, correct,
  accuracy, time_seconds, category, difficulty, hint_count, is_daily, daily_reward, created_at
)
SELECT id, 'association', 1460, 1460, 260, 260, 3, 3, 100, 44, 'Film', 'Lako', 0, 0, 0, DATE_SUB(NOW(), INTERVAL 9 DAY)
FROM users WHERE username = 'demo_lana';

INSERT INTO game_history (
  user_id, game_type, score, base_score, earned_points, awarded_points, total, correct,
  accuracy, time_seconds, category, difficulty, hint_count, is_daily, daily_reward, created_at
)
SELECT id, 'logic', 1390, 1390, 190, 190, 4, 3, 75, 58, 'Umjetnost', 'Srednje', 1, 0, 0, DATE_SUB(NOW(), INTERVAL 7 DAY)
FROM users WHERE username = 'demo_lana';

INSERT INTO game_history (
  user_id, game_type, score, base_score, earned_points, awarded_points, total, correct,
  accuracy, time_seconds, category, difficulty, hint_count, is_daily, daily_reward, created_at
)
SELECT id, 'relation', 1360, 1360, 160, 160, 4, 4, 100, 28, 'Istorija', 'Srednje', 0, 0, 0, DATE_SUB(NOW(), INTERVAL 4 DAY)
FROM users WHERE username = 'demo_lana';

INSERT INTO game_history (
  user_id, game_type, score, base_score, earned_points, awarded_points, total, correct,
  accuracy, time_seconds, category, difficulty, hint_count, is_daily, daily_reward, created_at
)
SELECT id, 'word-chain', 1270, 1270, 270, 270, 1, 1, 100, 63, 'Geografija', 'Tesko', 0, 0, 0, DATE_SUB(NOW(), INTERVAL 3 DAY)
FROM users WHERE username = 'demo_lana';

INSERT INTO game_history (
  user_id, game_type, score, base_score, earned_points, awarded_points, total, correct,
  accuracy, time_seconds, category, difficulty, hint_count, is_daily, daily_reward, created_at
)
SELECT id, 'association', 1190, 1190, 90, 90, 3, 1, 33, 82, 'Istorija', 'Tesko', 3, 0, 0, DATE_SUB(NOW(), INTERVAL 18 HOUR)
FROM users WHERE username = 'demo_lana';

INSERT INTO daily_challenge_completions (user_id, challenge_date, content_type, content_id, reward, created_at)
SELECT u.id, CURDATE(), 'association', a.id, 500, NOW()
FROM users u
JOIN association_words a ON a.word = 'Galaksija'
WHERE u.username = 'demo_nikola'
LIMIT 1;

INSERT INTO daily_challenge_overrides (challenge_date, content_type, content_id)
SELECT CURDATE(), 'association', id
FROM association_words
WHERE word = 'Galaksija'
LIMIT 1
ON DUPLICATE KEY UPDATE
  content_type = VALUES(content_type),
  content_id = VALUES(content_id);

UPDATE users u
LEFT JOIN (
  SELECT user_id, COALESCE(SUM(awarded_points), 0) AS total_points
  FROM game_history
  GROUP BY user_id
) history_totals ON history_totals.user_id = u.id
SET
  u.points = COALESCE(history_totals.total_points, 0),
  u.level = FLOOR(COALESCE(history_totals.total_points, 0) / 1000) + 1
WHERE u.username IN ('admin_seed', 'demo_mia', 'demo_nikola', 'demo_lana');

COMMIT;
SET SQL_SAFE_UPDATES = @OLD_SQL_SAFE_UPDATES;
