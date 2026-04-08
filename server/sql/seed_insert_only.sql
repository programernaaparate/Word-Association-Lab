USE word_association_lab;
SET NAMES utf8mb4;

START TRANSACTION;

INSERT INTO users (username, password_hash, role, points, level)
VALUES
('admin_seed', '$2b$10$HjET1KVxoxyRTrrfjOi0teBDUWaLreZLUHKbu00/Ba6nrzTzuAY6i', 'admin', 0, 1),
('demo_mia', '$2b$10$1Kjyt57ByRJ7EuuGDMToOOaUhk5fBfze3Ty1w.xcjjBEIk4X3ZXOq', 'user', 735, 1),
('demo_nikola', '$2b$10$0xlcTlqwvZBa.rZfjow7NeC2K3xm24Z9.WIvNNPYkUoS0YF0xJLiO', 'user', 1405, 2),
('demo_lana', '$2b$10$UJ7xnTA92t9wMWoNX9Vmg.GH9f6h/1jy.ryfEq/T7Ml0W68oNJkse', 'user', 970, 1)
ON DUPLICATE KEY UPDATE
password_hash = VALUES(password_hash),
role = VALUES(role),
points = VALUES(points),
level = VALUES(level);

INSERT INTO association_words (word, category, difficulty, clues_json, hint, accepted_answers_json) VALUES
('Sunce', 'Priroda', 'Lako', JSON_ARRAY('Dan', 'Toplota', 'Svjetlost', 'Ljeto'), 'Nebesko tijelo koje daje svjetlost i toplotu.', JSON_ARRAY('sunce')),
('More', 'Priroda', 'Srednje', JSON_ARRAY('Talas', 'So', 'Plaza', 'Obala'), 'Velika slana vodena povrsina.', JSON_ARRAY('more')),
('Vulkan', 'Priroda', 'Tesko', JSON_ARRAY('Lava', 'Krater', 'Erupcija', 'Pepeo'), 'Prirodna pojava povezana sa magmom.', JSON_ARRAY('vulkan')),
('Atom', 'Nauka', 'Lako', JSON_ARRAY('Jezgro', 'Elektron', 'Hemija', 'Cestica'), 'Osnovna jedinica materije.', JSON_ARRAY('atom')),
('Galaksija', 'Nauka', 'Srednje', JSON_ARRAY('Zvijezde', 'Svemir', 'Mlijevni put', 'Orbita'), 'Ogromna grupa zvijezda i kosmickog materijala.', JSON_ARRAY('galaksija')),
('Gravitacija', 'Nauka', 'Tesko', JSON_ARRAY('Pad', 'Privlacnost', 'Masa', 'Njutn'), 'Sila koja privlaci tijela jedno drugom.', JSON_ARRAY('gravitacija')),
('Fudbal', 'Sport', 'Lako', JSON_ARRAY('Gol', 'Stadion', 'Lopta', 'Sudija'), 'Sport sa loptom i golovima.', JSON_ARRAY('fudbal')),
('Maraton', 'Sport', 'Srednje', JSON_ARRAY('42 kilometra', 'Izdrzljivost', 'Staza', 'Trkac'), 'Dugacka trkacka disciplina.', JSON_ARRAY('maraton')),
('Kamera', 'Film', 'Lako', JSON_ARRAY('Snimanje', 'Objektiv', 'Scena', 'Kadar'), 'Uredjaj bez kojeg nema snimanja filma.', JSON_ARRAY('kamera')),
('Scenario', 'Film', 'Srednje', JSON_ARRAY('Dijalog', 'Zaplet', 'Likovi', 'Scenarista'), 'Pisani plan filma ili serije.', JSON_ARRAY('scenario')),
('Piramida', 'Istorija', 'Lako', JSON_ARRAY('Egipat', 'Faraon', 'Pustinja', 'Grobnica'), 'Gradjevina iz starog Egipta.', JSON_ARRAY('piramida')),
('Renesansa', 'Istorija', 'Srednje', JSON_ARRAY('Leonardo', 'Preporod', 'Humanizam', 'Firenca'), 'Istorijski period preporoda umjetnosti i nauke.', JSON_ARRAY('renesansa')),
('Simfonija', 'Umjetnost', 'Lako', JSON_ARRAY('Orkestar', 'Stav', 'Dirigent', 'Muzika'), 'Veliko muzicko djelo za orkestar.', JSON_ARRAY('simfonija')),
('Robot', 'Tehnologija', 'Lako', JSON_ARRAY('Masina', 'Senzor', 'Automatika', 'Program'), 'Pametna masina koja izvrsava zadatke.', JSON_ARRAY('robot')),
('Algoritam', 'Tehnologija', 'Srednje', JSON_ARRAY('Koraci', 'Kod', 'Rjesenje', 'Logika'), 'Niz koraka za rjesavanje problema.', JSON_ARRAY('algoritam')),
('Atlas', 'Geografija', 'Lako', JSON_ARRAY('Karta', 'Kontinent', 'Stranica', 'Planeta'), 'Zbirka geografskih karata.', JSON_ARRAY('atlas'));

INSERT INTO logic_challenges (mode, words_json, answer, hint, category, difficulty) VALUES
('concept', JSON_ARRAY('Teleskop', 'Planeta', 'Zvijezda'), 'Astronomija', 'Pomisli na nauku koja prouceva svemir.', 'Nauka', 'Lako'),
('odd-one-out', JSON_ARRAY('Proton', 'Neutron', 'Elektron', 'Fjord'), 'Fjord', 'Tri pojma pripadaju atomu, jedan geografiji.', 'Nauka', 'Srednje'),
('concept', JSON_ARRAY('Gol', 'Lopta', 'Sudija'), 'Fudbal', 'Rijesenje je popularan ekipni sport.', 'Sport', 'Lako'),
('odd-one-out', JSON_ARRAY('Sprint', 'Maraton', 'Skok', 'Reziser'), 'Reziser', 'Tri pojma su sportske discipline.', 'Sport', 'Srednje'),
('concept', JSON_ARRAY('Glumac', 'Kadar', 'Scenarista'), 'Film', 'Povezi pojmove sa filmskom industrijom.', 'Film', 'Lako'),
('odd-one-out', JSON_ARRAY('Kamera', 'Mikrofon', 'Montaza', 'Glacijal'), 'Glacijal', 'Tri pojma pripadaju filmskoj produkciji.', 'Film', 'Srednje'),
('concept', JSON_ARRAY('Kruna', 'Dvor', 'Vladar'), 'Monarhija', 'Rijesenje je oblik vladavine.', 'Istorija', 'Srednje'),
('concept', JSON_ARRAY('Rijeka', 'Jezero', 'More'), 'Voda', 'Sve pojmove povezuje ista supstanca.', 'Priroda', 'Lako'),
('odd-one-out', JSON_ARRAY('Bor', 'Hrast', 'Jela', 'Tablet'), 'Tablet', 'Tri pojma su vrste drveca.', 'Priroda', 'Lako'),
('concept', JSON_ARRAY('Platno', 'Cetkica', 'Boja'), 'Slikarstvo', 'Rijesenje je oblast likovne umjetnosti.', 'Umjetnost', 'Srednje'),
('concept', JSON_ARRAY('Kod', 'Program', 'Aplikacija'), 'Softver', 'Povezi pojmove sa digitalnim proizvodom.', 'Tehnologija', 'Lako'),
('concept', JSON_ARRAY('Planina', 'Dolina', 'Kanjon'), 'Reljef', 'Rijesenje opisuje oblik zemljine povrsine.', 'Geografija', 'Srednje');

INSERT INTO relation_challenges (left_word, right_word, relation, category, difficulty, hint) VALUES
('Topao', 'Hladan', 'Antonim', 'Priroda', 'Lako', 'Rijeci imaju suprotno znacenje.'),
('Talas', 'More', 'Asocijacija', 'Priroda', 'Lako', 'Jedan pojam prirodno priziva drugi.'),
('Suma', 'Gaj', 'Sinonim', 'Priroda', 'Srednje', 'Rijeci oznacavaju slican pojam.'),
('Brz', 'Spor', 'Antonim', 'Sport', 'Lako', 'Pogledaj da li su pojmovi suprotnosti.'),
('Pobjeda', 'Trijumf', 'Sinonim', 'Sport', 'Srednje', 'Oba pojma opisuju isti ishod.'),
('Lopta', 'Gol', 'Asocijacija', 'Sport', 'Lako', 'Pojmovi su povezani u istoj igri.'),
('Glumac', 'Uloga', 'Asocijacija', 'Film', 'Lako', 'Jedan pojam ide uz drugi u filmu.'),
('Glavni', 'Sporedni', 'Antonim', 'Film', 'Srednje', 'Pojmovi opisuju suprotne uloge.'),
('Mir', 'Rat', 'Antonim', 'Istorija', 'Lako', 'Pomisli na suprotnosti.'),
('Kruna', 'Prijesto', 'Asocijacija', 'Istorija', 'Srednje', 'Oba pojma prizivaju vladara i dvor.'),
('Kist', 'Platno', 'Asocijacija', 'Umjetnost', 'Lako', 'Pojmovi su prirodno povezani u stvaranju slike.'),
('Inspiracija', 'Ideja', 'Sinonim', 'Umjetnost', 'Srednje', 'Oba pojma ukazuju na pocetak stvaranja.'),
('Kod', 'Program', 'Asocijacija', 'Tehnologija', 'Lako', 'Jedan pojam je sastavni dio drugog.'),
('Siguran', 'Nesiguran', 'Antonim', 'Tehnologija', 'Srednje', 'Rijeci imaju suprotan smisao.'),
('Mapa', 'Karta', 'Sinonim', 'Geografija', 'Lako', 'Rijeci se koriste kao isto ili skoro isto.'),
('Sjever', 'Jug', 'Antonim', 'Geografija', 'Lako', 'Pojmovi pokazuju suprotne strane svijeta.'),
('Tacan', 'Precizan', 'Sinonim', 'Nauka', 'Lako', 'Obje rijeci opisuju visoku mjeru ispravnosti.'),
('Hipoteza', 'Teorija', 'Asocijacija', 'Nauka', 'Srednje', 'Pojmovi su blisko povezani u naucnom procesu.');

INSERT INTO game_submissions (user_label, game_type, content, points, time_seconds, status, is_daily, created_at) VALUES
('demo_mia', 'Asocijacija', 'Sunce -> sunce | More -> more | Vulkan -> vulkan', 240, 68, 'pending', 0, '2026-04-01 11:00:00'),
('demo_nikola', 'Logicki test', 'Teleskop, Planeta, Zvijezda -> Astronomija', 180, 54, 'approved', 0, '2026-04-02 12:00:00'),
('demo_lana', 'Ne pripada', 'Bor, Hrast, Jela, Tablet -> Tablet', 170, 49, 'flagged', 0, '2026-04-03 13:00:00'),
('gost_demo', 'Lanac rijeci', 'centar: more | talas | plaza | barka | dubina', 210, 77, 'pending', 0, '2026-04-04 14:00:00'),
('admin_seed', 'Dnevna asocijacija', 'Galaksija -> galaksija', 650, 21, 'approved', 1, '2026-04-05 15:00:00');

INSERT INTO game_history (
  user_id, game_type, score, base_score, earned_points, awarded_points, total, correct,
  accuracy, time_seconds, category, difficulty, hint_count, is_daily, daily_reward, created_at
) VALUES
((SELECT id FROM users WHERE username = 'demo_mia'), 'association', 1420, 1420, 220, 220, 3, 3, 100, 46, 'Priroda', 'Lako', 1, 0, 0, '2026-04-01 10:15:00'),
((SELECT id FROM users WHERE username = 'demo_mia'), 'logic', 1375, 1375, 175, 175, 4, 3, 75, 62, 'Nauka', 'Lako', 1, 0, 0, '2026-04-02 10:15:00'),
((SELECT id FROM users WHERE username = 'demo_mia'), 'relation', 1330, 1330, 130, 130, 4, 3, 75, 33, 'Sport', 'Lako', 0, 0, 0, '2026-04-04 10:15:00'),
((SELECT id FROM users WHERE username = 'demo_mia'), 'word-chain', 1210, 1210, 210, 210, 1, 1, 100, 71, 'Umjetnost', 'Srednje', 0, 0, 0, '2026-04-06 10:15:00'),
((SELECT id FROM users WHERE username = 'demo_nikola'), 'association', 1480, 1480, 280, 280, 3, 3, 100, 39, 'Nauka', 'Srednje', 0, 0, 0, '2026-03-31 12:00:00'),
((SELECT id FROM users WHERE username = 'demo_nikola'), 'logic-odd-one-out', 1405, 1405, 205, 205, 4, 4, 100, 41, 'Geografija', 'Tesko', 1, 0, 0, '2026-04-03 12:00:00'),
((SELECT id FROM users WHERE username = 'demo_nikola'), 'association', 1180, 1180, 180, 680, 1, 1, 100, 19, 'Nauka', 'Srednje', 1, 1, 500, '2026-04-07 09:00:00'),
((SELECT id FROM users WHERE username = 'demo_nikola'), 'word-chain', 1240, 1240, 240, 240, 1, 1, 100, 56, 'Tehnologija', 'Srednje', 0, 0, 0, '2026-04-07 20:00:00'),
((SELECT id FROM users WHERE username = 'demo_lana'), 'association', 1460, 1460, 260, 260, 3, 3, 100, 44, 'Film', 'Lako', 0, 0, 0, '2026-03-30 18:00:00'),
((SELECT id FROM users WHERE username = 'demo_lana'), 'logic', 1390, 1390, 190, 190, 4, 3, 75, 58, 'Umjetnost', 'Srednje', 1, 0, 0, '2026-04-01 18:00:00'),
((SELECT id FROM users WHERE username = 'demo_lana'), 'relation', 1360, 1360, 160, 160, 4, 4, 100, 28, 'Istorija', 'Srednje', 0, 0, 0, '2026-04-04 18:00:00'),
((SELECT id FROM users WHERE username = 'demo_lana'), 'word-chain', 1270, 1270, 270, 270, 1, 1, 100, 63, 'Geografija', 'Tesko', 0, 0, 0, '2026-04-05 18:00:00'),
((SELECT id FROM users WHERE username = 'demo_lana'), 'association', 1190, 1190, 90, 90, 3, 1, 33, 82, 'Istorija', 'Tesko', 3, 0, 0, '2026-04-07 06:00:00');

INSERT IGNORE INTO daily_challenge_overrides (challenge_date, content_type, content_id)
VALUES (CURDATE(), 'association', (SELECT id FROM association_words WHERE word = 'Galaksija' LIMIT 1));

INSERT IGNORE INTO daily_challenge_completions (user_id, challenge_date, content_type, content_id, reward, created_at)
VALUES (
  (SELECT id FROM users WHERE username = 'demo_nikola' LIMIT 1),
  CURDATE(),
  'association',
  (SELECT id FROM association_words WHERE word = 'Galaksija' LIMIT 1),
  500,
  NOW()
);

COMMIT;
