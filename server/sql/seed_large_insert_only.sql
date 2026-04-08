USE word_association_lab;
SET NAMES utf8mb4;

START TRANSACTION;

INSERT INTO users (username, password_hash, role, points, level)
VALUES
  ('admin_seed', '$2b$10$HjET1KVxoxyRTrrfjOi0teBDUWaLreZLUHKbu00/Ba6nrzTzuAY6i', 'admin', 1500, 2),
  ('demo_mia', '$2b$10$1Kjyt57ByRJ7EuuGDMToOOaUhk5fBfze3Ty1w.xcjjBEIk4X3ZXOq', 'user', 570, 1),
  ('demo_nikola', '$2b$10$0xlcTlqwvZBa.rZfjow7NeC2K3xm24Z9.WIvNNPYkUoS0YF0xJLiO', 'user', 1210, 2),
  ('demo_lana', '$2b$10$UJ7xnTA92t9wMWoNX9Vmg.GH9f6h/1jy.ryfEq/T7Ml0W68oNJkse', 'user', 880, 1),
  ('demo_marko', '$2b$10$1Kjyt57ByRJ7EuuGDMToOOaUhk5fBfze3Ty1w.xcjjBEIk4X3ZXOq', 'user', 1045, 2),
  ('demo_sara', '$2b$10$1Kjyt57ByRJ7EuuGDMToOOaUhk5fBfze3Ty1w.xcjjBEIk4X3ZXOq', 'user', 690, 1)
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  points = VALUES(points),
  level = VALUES(level);

INSERT INTO association_words (word, category, difficulty, clues_json, hint, accepted_answers_json)
SELECT seed.word, seed.category, seed.difficulty, seed.clues_json, seed.hint, seed.accepted_answers_json
FROM (
  SELECT 'Atom' AS word, 'Nauka' AS category, 'Lako' AS difficulty, '["Jezgro","Elektron","Hemija","Cestica"]' AS clues_json, 'Osnovna jedinica materije.' AS hint, '["atom"]' AS accepted_answers_json
  UNION ALL SELECT 'Mikroskop','Nauka','Lako','["Leca","Laboratorija","Uvecanje","Biologija"]','Uredjaj za posmatranje veoma sitnih struktura.','["mikroskop"]'
  UNION ALL SELECT 'Galaksija','Nauka','Srednje','["Zvijezde","Svemir","Orbita","Mlijevni put"]','Ogromna grupa zvijezda i kosmickog materijala.','["galaksija"]'
  UNION ALL SELECT 'Molekul','Nauka','Srednje','["Veza","Atom","Hemija","Supstanca"]','Skup povezanih atoma.','["molekul"]'
  UNION ALL SELECT 'Gravitacija','Nauka','Tesko','["Pad","Privlacnost","Masa","Njutn"]','Sila koja privlaci tijela jedno drugom.','["gravitacija"]'
  UNION ALL SELECT 'Genetika','Nauka','Tesko','["Nasljedje","DNK","Hromozom","Osobine"]','Oblast koja proucava nasljedjivanje osobina.','["genetika"]'
  UNION ALL SELECT 'Fudbal','Sport','Lako','["Gol","Lopta","Stadion","Sudija"]','Sport koji se igra najcesce nogom i loptom.','["fudbal"]'
  UNION ALL SELECT 'Tenis','Sport','Lako','["Reket","Mreza","Servis","Loptica"]','Sport koji se igra reketom preko mreze.','["tenis"]'
  UNION ALL SELECT 'Maraton','Sport','Srednje','["42 kilometra","Izdrzljivost","Staza","Trkac"]','Dugacka trkacka disciplina.','["maraton"]'
  UNION ALL SELECT 'Taktika','Sport','Srednje','["Plan","Tim","Strategija","Potez"]','Pametno organizovanje igre radi pobjede.','["taktika"]'
  UNION ALL SELECT 'Gimnastika','Sport','Tesko','["Greda","Parter","Salto","Ravnoteza"]','Sport koji trazi koordinaciju i kontrolu tijela.','["gimnastika"]'
  UNION ALL SELECT 'Triatlon','Sport','Tesko','["Plivanje","Biciklizam","Trcanje","Izdrzljivost"]','Takmicenje koje spaja tri discipline.','["triatlon"]'
  UNION ALL SELECT 'Kamera','Film','Lako','["Snimanje","Objektiv","Scena","Kadar"]','Uredjaj bez kojeg nema snimanja filma.','["kamera"]'
  UNION ALL SELECT 'Komedija','Film','Lako','["Smijeh","Humor","Film","Sala"]','Filmski zanr koji zeli da nas nasmije.','["komedija"]'
  UNION ALL SELECT 'Scenario','Film','Srednje','["Dijalog","Likovi","Zaplet","Scenarista"]','Pisani plan filma ili serije.','["scenario"]'
  UNION ALL SELECT 'Premijera','Film','Srednje','["Prikazivanje","Crveni tepih","Publika","Prvi put"]','Prvo javno prikazivanje filma.','["premijera"]'
  UNION ALL SELECT 'Montaza','Film','Tesko','["Rez","Ritam","Postprodukcija","Kadrove"]','Spajanje i uredjivanje snimljenog materijala.','["montaza"]'
  UNION ALL SELECT 'Kinematografija','Film','Tesko','["Svjetlo","Kadar","Pokret","Vizuelni stil"]','Umijece stvaranja slike u filmu.','["kinematografija"]'
  UNION ALL SELECT 'Piramida','Istorija','Lako','["Egipat","Faraon","Pustinja","Grobnica"]','Gradjevina najpoznatija iz starog Egipta.','["piramida"]'
  UNION ALL SELECT 'Legija','Istorija','Lako','["Rim","Vojska","Stit","Carstvo"]','Poznata vojna jedinica starog Rima.','["legija"]'
  UNION ALL SELECT 'Renesansa','Istorija','Srednje','["Leonardo","Humanizam","Firenca","Preporod"]','Istorijski period preporoda umjetnosti i nauke.','["renesansa"]'
  UNION ALL SELECT 'Revolucija','Istorija','Srednje','["Promjena","Pobuna","Narod","Preokret"]','Nagla i velika drustvena ili politicka promjena.','["revolucija"]'
  UNION ALL SELECT 'Diplomatija','Istorija','Tesko','["Pregovori","Ambasada","Sporazum","Drzava"]','Umijece vodjenja medjudrzavnih odnosa.','["diplomatija"]'
  UNION ALL SELECT 'Civilizacija','Istorija','Tesko','["Gradovi","Pismo","Kultura","Drzava"]','Razvijeno ljudsko drustvo sa slozenom organizacijom.','["civilizacija"]'
  UNION ALL SELECT 'Sunce','Priroda','Lako','["Dan","Toplota","Svjetlost","Ljeto"]','Nebesko tijelo koje nam daje svjetlost i toplotu.','["sunce"]'
  UNION ALL SELECT 'Suma','Priroda','Lako','["Drvece","Lisce","Zivotinje","Staza"]','Veliki prostor obrastao drvecem.','["suma"]'
  UNION ALL SELECT 'More','Priroda','Srednje','["Talas","So","Plaza","Obala"]','Velika slana vodena povrsina.','["more"]'
  UNION ALL SELECT 'Planina','Priroda','Srednje','["Vrh","Visina","Stijena","Uspon"]','Visoko uzvisenje na Zemljinoj povrsini.','["planina"]'
  UNION ALL SELECT 'Vulkan','Priroda','Tesko','["Lava","Krater","Erupcija","Pepeo"]','Prirodna pojava povezana sa magmom i erupcijom.','["vulkan"]'
  UNION ALL SELECT 'Ekosistem','Priroda','Tesko','["Ravnoteza","Biljke","Zivotinje","Sredina"]','Zajednica zivih bica i okoline u kojoj zive.','["ekosistem"]'
  UNION ALL SELECT 'Simfonija','Umjetnost','Lako','["Orkestar","Dirigent","Stav","Muzika"]','Veliko muzicko djelo za orkestar.','["simfonija"]'
  UNION ALL SELECT 'Balet','Umjetnost','Lako','["Ples","Scena","Pokret","Muzika"]','Umjetnicka forma koja spaja ples i muziku.','["balet"]'
  UNION ALL SELECT 'Skulptura','Umjetnost','Srednje','["Klesanje","Mermer","Figura","Vajar"]','Umjetnicko djelo oblikovano u prostoru.','["skulptura"]'
  UNION ALL SELECT 'Galerija','Umjetnost','Srednje','["Slike","Izlozba","Umjetnik","Posjetioci"]','Mjesto gdje se izlažu umjetnicka djela.','["galerija"]'
  UNION ALL SELECT 'Perspektiva','Umjetnost','Tesko','["Dubina","Linije","Prostor","Slikarstvo"]','Likovni princip za prikaz prostora na ravnoj povrsini.','["perspektiva"]'
  UNION ALL SELECT 'Avangarda','Umjetnost','Tesko','["Eksperiment","Pravac","Novina","Umjetnost"]','Pravac koji pomjera granice tradicionalne umjetnosti.','["avangarda"]'
  UNION ALL SELECT 'Robot','Tehnologija','Lako','["Masina","Program","Senzor","Automatika"]','Pametna masina koja moze izvrsavati zadatke.','["robot"]'
  UNION ALL SELECT 'Aplikacija','Tehnologija','Lako','["Telefon","Program","Korisnik","Ekran"]','Softverski alat za odredjenu namjenu.','["aplikacija"]'
  UNION ALL SELECT 'Algoritam','Tehnologija','Srednje','["Koraci","Logika","Kod","Rjesenje"]','Niz tacno odredjenih koraka za rjesavanje problema.','["algoritam"]'
  UNION ALL SELECT 'Baza podataka','Tehnologija','Srednje','["Tabela","Upit","Cuvanje","Podaci"]','Organizovan sistem za cuvanje informacija.','["baza podataka","baza"]'
  UNION ALL SELECT 'Mikrocip','Tehnologija','Tesko','["Procesor","Elektronika","Ploca","Tranzistor"]','Mala komponenta sa integrisanim kolima.','["mikrocip","mikro cip"]'
  UNION ALL SELECT 'Kibernetika','Tehnologija','Tesko','["Kontrola","Sistem","Povratna sprega","Automatika"]','Oblast koja proucava upravljanje i komunikaciju u sistemima.','["kibernetika"]'
  UNION ALL SELECT 'Atlas','Geografija','Lako','["Karta","Kontinent","Stranica","Planeta"]','Zbirka geografskih karata.','["atlas"]'
  UNION ALL SELECT 'Ravnica','Geografija','Lako','["Nizija","Polje","Ravno","Prostor"]','Velika ravna povrsina na kopnu.','["ravnica"]'
  UNION ALL SELECT 'Arhipelag','Geografija','Srednje','["Ostrvo","Grupa","More","Obala"]','Skup vise ostrva na istom prostoru.','["arhipelag"]'
  UNION ALL SELECT 'Delta','Geografija','Srednje','["Rijeka","Usce","Nanosi","More"]','Grananje rijeke pred usce.','["delta"]'
  UNION ALL SELECT 'Meridijan','Geografija','Tesko','["Greenwich","Koordinate","Polovi","Duzina"]','Zamisljena linija koja spaja polove Zemlje.','["meridijan"]'
  UNION ALL SELECT 'Geopolitika','Geografija','Tesko','["Drzave","Moc","Prostor","Uticaj"]','Proucavanje odnosa politike i geografskog prostora.','["geopolitika"]'
) AS seed
LEFT JOIN association_words existing ON existing.word = seed.word
WHERE existing.id IS NULL;

INSERT INTO logic_challenges (mode, words_json, answer, hint, category, difficulty)
SELECT seed.mode, seed.words_json, seed.answer, seed.hint, seed.category, seed.difficulty
FROM (
  SELECT 'concept' AS mode, '["Teleskop","Planeta","Zvijezda"]' AS words_json, 'Astronomija' AS answer, 'Pomisli na nauku koja prouceva svemir.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out','["Proton","Elektron","Neutron","Fjord"]','Fjord','Tri pojma pripadaju atomu, jedan geografiji.','Nauka','Srednje'
  UNION ALL SELECT 'concept','["DNK","Nasljedje","Hromozom"]','Genetika','Rjesenje je naucna oblast koja proučava nasljedjivanje.','Nauka','Tesko'
  UNION ALL SELECT 'concept','["Gol","Lopta","Sudija"]','Fudbal','Rijesenje je popularan ekipni sport.','Sport','Lako'
  UNION ALL SELECT 'odd-one-out','["Sprint","Maraton","Skok","Reziser"]','Reziser','Tri pojma su sportske discipline.','Sport','Srednje'
  UNION ALL SELECT 'concept','["Plivanje","Biciklizam","Trcanje"]','Triatlon','Povezi tri discipline u jedan sport.','Sport','Tesko'
  UNION ALL SELECT 'concept','["Glumac","Kadar","Scenarista"]','Film','Povezi pojmove sa filmskom industrijom.','Film','Lako'
  UNION ALL SELECT 'odd-one-out','["Kamera","Montaza","Mikrofon","Glacijal"]','Glacijal','Tri pojma pripadaju filmskoj produkciji.','Film','Srednje'
  UNION ALL SELECT 'concept','["Rez","Ritam","Postprodukcija"]','Montaza','Rijesenje je dio filmskog procesa nakon snimanja.','Film','Tesko'
  UNION ALL SELECT 'concept','["Faraon","Nil","Piramida"]','Egipat','Rijesenje je drevna civilizacija ili drzava.','Istorija','Lako'
  UNION ALL SELECT 'odd-one-out','["Piramida","Koloseum","Akvadukt","Baterija"]','Baterija','Tri pojma su istorijske gradjevine ili ostaci.','Istorija','Srednje'
  UNION ALL SELECT 'concept','["Pregovori","Ambasada","Sporazum"]','Diplomatija','Rijesenje opisuje odnose izmedju drzava.','Istorija','Tesko'
  UNION ALL SELECT 'concept','["Rijeka","Jezero","More"]','Voda','Sve pojmove povezuje ista prirodna supstanca.','Priroda','Lako'
  UNION ALL SELECT 'odd-one-out','["Bor","Hrast","Jela","Tablet"]','Tablet','Tri pojma su vrste drveca.','Priroda','Srednje'
  UNION ALL SELECT 'concept','["Lava","Krater","Erupcija"]','Vulkan','Povezi pojmove sa jednom prirodnom pojavom.','Priroda','Tesko'
  UNION ALL SELECT 'concept','["Dirigent","Orkestar","Stav"]','Simfonija','Rijesenje je muzicko djelo za orkestar.','Umjetnost','Lako'
  UNION ALL SELECT 'odd-one-out','["Violina","Klavir","Gitara","Satelit"]','Satelit','Tri pojma su muzicki instrumenti.','Umjetnost','Srednje'
  UNION ALL SELECT 'concept','["Dubina","Linije","Prostor"]','Perspektiva','Rijesenje je likovni princip.','Umjetnost','Tesko'
  UNION ALL SELECT 'concept','["Kod","Program","Aplikacija"]','Softver','Povezi pojmove sa digitalnim proizvodom.','Tehnologija','Lako'
  UNION ALL SELECT 'odd-one-out','["Procesor","Memorija","Ekran","Pjesma"]','Pjesma','Tri pojma pripadaju tehnologiji ili racunaru.','Tehnologija','Srednje'
  UNION ALL SELECT 'concept','["Kontrola","Sistem","Automatika"]','Kibernetika','Rijesenje je tehnoloska i naucna oblast.','Tehnologija','Tesko'
  UNION ALL SELECT 'concept','["Drzava","Granica","Kontinent"]','Geografija','Povezi pojmove sa naukom o prostoru Zemlje.','Geografija','Lako'
  UNION ALL SELECT 'odd-one-out','["Atlas","Meridijan","Ekvator","Scenario"]','Scenario','Tri pojma se vezuju za geografiju.','Geografija','Srednje'
  UNION ALL SELECT 'concept','["Greenwich","Koordinate","Polovi"]','Meridijan','Rijesenje je geografski pojam za uzduzne linije.','Geografija','Tesko'
) AS seed
LEFT JOIN logic_challenges existing
  ON existing.mode = seed.mode
 AND existing.answer = seed.answer
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
WHERE existing.id IS NULL;

INSERT INTO relation_challenges (left_word, right_word, relation, category, difficulty, hint)
SELECT seed.left_word, seed.right_word, seed.relation, seed.category, seed.difficulty, seed.hint
FROM (
  SELECT 'Tacan' AS left_word, 'Precizan' AS right_word, 'Sinonim' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Obje rijeci opisuju visoku mjeru ispravnosti.' AS hint
  UNION ALL SELECT 'Hipoteza','Teorija','Asocijacija','Nauka','Srednje','Pojmovi su blisko povezani u naucnom procesu.'
  UNION ALL SELECT 'Stabilan','Nestabilan','Antonim','Nauka','Tesko','Jedna rijec negira osobinu druge.'
  UNION ALL SELECT 'Mikroskop','Leca','Asocijacija','Nauka','Tesko','Jedan pojam je vazan dio drugog.'
  UNION ALL SELECT 'Brz','Spor','Antonim','Sport','Lako','Pogledaj da li su pojmovi suprotnosti.'
  UNION ALL SELECT 'Pobjeda','Trijumf','Sinonim','Sport','Srednje','Oba pojma opisuju isti ishod.'
  UNION ALL SELECT 'Lopta','Gol','Asocijacija','Sport','Tesko','Pojmovi su povezani u istoj igri.'
  UNION ALL SELECT 'Trening','Napredak','Asocijacija','Sport','Tesko','Jedan pojam cesto vodi ka drugom.'
  UNION ALL SELECT 'Glumac','Uloga','Asocijacija','Film','Lako','Jedan pojam gotovo uvijek ide uz drugi u filmu.'
  UNION ALL SELECT 'Glavni','Sporedni','Antonim','Film','Srednje','Pojmovi opisuju suprotne uloge ili planove.'
  UNION ALL SELECT 'Kadar','Scena','Asocijacija','Film','Tesko','Povezanost je filmska, ne znacenjska.'
  UNION ALL SELECT 'Komedija','Humor','Asocijacija','Film','Srednje','Jedan pojam prirodno priziva drugi.'
  UNION ALL SELECT 'Mir','Rat','Antonim','Istorija','Lako','Pomisli na suprotnosti.'
  UNION ALL SELECT 'Staro','Drevno','Sinonim','Istorija','Srednje','Rijeci su gotovo isto znacenje.'
  UNION ALL SELECT 'Kruna','Prijesto','Asocijacija','Istorija','Tesko','Oba pojma prizivaju vladara i dvor.'
  UNION ALL SELECT 'Ugovor','Sporazum','Sinonim','Istorija','Tesko','Oba pojma ukazuju na dogovor.'
  UNION ALL SELECT 'Topao','Hladan','Antonim','Priroda','Lako','Rijeci imaju suprotno znacenje.'
  UNION ALL SELECT 'Talas','More','Asocijacija','Priroda','Srednje','Jedan pojam prirodno priziva drugi.'
  UNION ALL SELECT 'Suma','Gaj','Sinonim','Priroda','Tesko','Rijeci oznacavaju vrlo slican pojam.'
  UNION ALL SELECT 'Oblak','Kisa','Asocijacija','Priroda','Srednje','Jedan pojam vodi ka drugom u prirodi.'
  UNION ALL SELECT 'Tisina','Buka','Antonim','Umjetnost','Lako','Jedna rijec iskljucuje drugu.'
  UNION ALL SELECT 'Kist','Platno','Asocijacija','Umjetnost','Srednje','Pojmovi su prirodno povezani u stvaranju slike.'
  UNION ALL SELECT 'Inspiracija','Ideja','Sinonim','Umjetnost','Tesko','Oba pojma ukazuju na pocetak stvaranja.'
  UNION ALL SELECT 'Balet','Pokret','Asocijacija','Umjetnost','Srednje','Jedan pojam se gradi kroz drugi.'
  UNION ALL SELECT 'Kod','Program','Asocijacija','Tehnologija','Lako','Jedan pojam je sastavni dio drugog.'
  UNION ALL SELECT 'Siguran','Nesiguran','Antonim','Tehnologija','Srednje','Rijeci imaju suprotan smisao.'
  UNION ALL SELECT 'Mikrocip','Procesor','Asocijacija','Tehnologija','Tesko','Pojmovi su povezani sa racunarskim hardverom.'
  UNION ALL SELECT 'Mreza','Sistem','Asocijacija','Tehnologija','Srednje','Jedan pojam cesto postoji unutar drugog.'
  UNION ALL SELECT 'Mapa','Karta','Sinonim','Geografija','Lako','Rijeci se koriste kao isto ili skoro isto.'
  UNION ALL SELECT 'Sjever','Jug','Antonim','Geografija','Srednje','Pojmovi pokazuju suprotne strane svijeta.'
  UNION ALL SELECT 'Kompas','Pravac','Asocijacija','Geografija','Tesko','Jedan pojam sluzi da odredi drugi.'
  UNION ALL SELECT 'Delta','Usce','Asocijacija','Geografija','Srednje','Jedan pojam prirodno vodi ka drugom.'
) AS seed
LEFT JOIN relation_challenges existing
  ON existing.left_word = seed.left_word
 AND existing.right_word = seed.right_word
 AND existing.relation = seed.relation
WHERE existing.id IS NULL;

INSERT INTO game_submissions (user_label, game_type, content, points, time_seconds, status, is_daily, created_at)
SELECT seed.user_label, seed.game_type, seed.content, seed.points, seed.time_seconds, seed.status, seed.is_daily, seed.created_at
FROM (
  SELECT 'demo_mia' AS user_label, 'Asocijacija' AS game_type, 'Atom -> atom | Galaksija -> galaksija | More -> more' AS content, 260 AS points, 74 AS time_seconds, 'pending' AS status, 0 AS is_daily, '2026-04-01 11:00:00' AS created_at
  UNION ALL SELECT 'demo_nikola','Logicki test','Teleskop, Planeta, Zvijezda -> Astronomija',220,55,'approved',0,'2026-04-02 12:00:00'
  UNION ALL SELECT 'demo_lana','Ne pripada','Violina, Klavir, Gitara, Satelit -> Satelit',180,48,'flagged',0,'2026-04-03 13:00:00'
  UNION ALL SELECT 'demo_marko','Lanac rijeci','centar: program | softver | kvar | robot | algoritam',245,81,'pending',0,'2026-04-04 14:00:00'
  UNION ALL SELECT 'demo_sara','Sinonim / Antonim','Topao / Hladan -> Antonim',190,24,'approved',0,'2026-04-05 15:00:00'
  UNION ALL SELECT 'admin_seed','Dnevna asocijacija','Galaksija -> galaksija',690,20,'approved',1,'2026-04-06 16:00:00'
  UNION ALL SELECT 'demo_mia','Lanac rijeci','centar: muzika | melodija | tisina | simfonija | orkestar',230,69,'pending',0,'2026-04-07 17:00:00'
  UNION ALL SELECT 'demo_lana','Asocijacija','Simfonija -> simfonija | Balet -> balet',210,52,'flagged',0,'2026-04-07 19:00:00'
) AS seed
LEFT JOIN game_submissions existing
  ON existing.user_label = seed.user_label
 AND existing.game_type = seed.game_type
 AND existing.created_at = seed.created_at
WHERE existing.id IS NULL;

INSERT INTO game_history (
  user_id, game_type, score, base_score, earned_points, awarded_points, total, correct,
  accuracy, time_seconds, category, difficulty, hint_count, is_daily, daily_reward, created_at
)
SELECT u.id, seed.game_type, seed.score, seed.base_score, seed.earned_points, seed.awarded_points,
       seed.total, seed.correct, seed.accuracy, seed.time_seconds, seed.category, seed.difficulty,
       seed.hint_count, seed.is_daily, seed.daily_reward, seed.created_at
FROM (
  SELECT 'demo_mia' AS username, 'association' AS game_type, 1460 AS score, 1430 AS base_score, 260 AS earned_points, 260 AS awarded_points, 3 AS total, 3 AS correct, 100 AS accuracy, 46 AS time_seconds, 'Priroda' AS category, 'Lako' AS difficulty, 1 AS hint_count, 0 AS is_daily, 0 AS daily_reward, '2026-04-01 10:15:00' AS created_at
  UNION ALL SELECT 'demo_mia','logic',1410,1380,180,180,4,3,75,62,'Nauka','Srednje',1,0,0,'2026-04-02 10:15:00'
  UNION ALL SELECT 'demo_mia','relation',1390,1360,130,130,4,3,75,33,'Sport','Srednje',0,0,0,'2026-04-04 10:15:00'
  UNION ALL SELECT 'demo_nikola','association',1520,1490,320,320,3,3,100,39,'Nauka','Tesko',0,0,0,'2026-03-31 12:00:00'
  UNION ALL SELECT 'demo_nikola','logic-odd-one-out',1460,1430,210,210,4,4,100,41,'Geografija','Tesko',1,0,0,'2026-04-03 12:00:00'
  UNION ALL SELECT 'demo_nikola','association',1880,1380,180,680,1,1,100,19,'Nauka','Srednje',1,1,500,'2026-04-07 09:00:00'
  UNION ALL SELECT 'demo_lana','association',1460,1430,260,260,3,3,100,44,'Film','Lako',0,0,0,'2026-03-30 18:00:00'
  UNION ALL SELECT 'demo_lana','logic',1430,1400,190,190,4,3,75,58,'Umjetnost','Srednje',1,0,0,'2026-04-01 18:00:00'
  UNION ALL SELECT 'demo_lana','relation',1420,1390,160,160,4,4,100,28,'Istorija','Tesko',0,0,0,'2026-04-04 18:00:00'
  UNION ALL SELECT 'demo_lana','word-chain',1540,1540,270,270,5,5,100,63,'Geografija','Tesko',0,0,0,'2026-04-05 18:00:00'
  UNION ALL SELECT 'demo_marko','word-chain',1645,1645,245,245,5,4,80,71,'Tehnologija','Tesko',0,0,0,'2026-04-06 18:00:00'
  UNION ALL SELECT 'demo_marko','relation',1400,1370,130,130,4,3,75,37,'Tehnologija','Srednje',1,0,0,'2026-04-07 11:00:00'
  UNION ALL SELECT 'demo_marko','logic',1470,1440,200,200,4,4,100,47,'Sport','Tesko',0,0,0,'2026-04-07 20:00:00'
  UNION ALL SELECT 'demo_sara','association',1410,1380,210,210,3,2,67,54,'Umjetnost','Srednje',1,0,0,'2026-04-02 09:30:00'
  UNION ALL SELECT 'demo_sara','relation',1490,1460,190,190,4,4,100,24,'Priroda','Lako',0,0,0,'2026-04-05 15:10:00'
  UNION ALL SELECT 'demo_sara','logic',1490,1460,290,290,4,4,100,36,'Istorija','Tesko',0,0,0,'2026-04-06 19:45:00'
  UNION ALL SELECT 'admin_seed','association',2700,2200,1000,1500,3,3,100,25,'Nauka','Tesko',0,1,500,'2026-04-08 08:00:00'
) AS seed
JOIN users u ON u.username = seed.username
LEFT JOIN game_history existing
  ON existing.user_id = u.id
 AND existing.game_type = seed.game_type
 AND existing.created_at = seed.created_at
WHERE existing.id IS NULL;

INSERT INTO daily_challenge_overrides (challenge_date, content_type, content_id)
SELECT CURDATE(), 'association', a.id
FROM association_words a
LEFT JOIN daily_challenge_overrides existing ON existing.challenge_date = CURDATE()
WHERE a.word = 'Galaksija' AND existing.id IS NULL
LIMIT 1;

INSERT INTO daily_challenge_completions (user_id, challenge_date, content_type, content_id, reward, created_at)
SELECT u.id, CURDATE(), 'association', a.id, 500, NOW()
FROM users u
JOIN association_words a ON a.word = 'Galaksija'
LEFT JOIN daily_challenge_completions existing
  ON existing.user_id = u.id
 AND existing.challenge_date = CURDATE()
WHERE u.username = 'demo_nikola'
  AND existing.id IS NULL
LIMIT 1;

COMMIT;
