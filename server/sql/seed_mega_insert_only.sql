USE word_association_lab;
SET NAMES utf8mb4;

START TRANSACTION;

-- Mega seed generated automatically.
-- Associations: 233
-- Logic challenges: 483
-- Relation challenges: 518


DELETE duplicate
FROM association_words duplicate
JOIN association_words existing
  ON LOWER(duplicate.word) = LOWER(existing.word)
 AND duplicate.id > existing.id;


DELETE duplicate
FROM logic_challenges duplicate
JOIN logic_challenges existing
  ON duplicate.mode = existing.mode
 AND LOWER(duplicate.answer) = LOWER(existing.answer)
 AND duplicate.category = existing.category
 AND duplicate.difficulty = existing.difficulty
 AND (
      duplicate.mode <> 'odd-one-out'
      OR CAST(duplicate.words_json AS CHAR(1000)) = CAST(existing.words_json AS CHAR(1000))
    )
 AND duplicate.id > existing.id;


DELETE duplicate
FROM relation_challenges duplicate
JOIN relation_challenges existing
  ON LOWER(duplicate.left_word) = LOWER(existing.left_word)
 AND LOWER(duplicate.right_word) = LOWER(existing.right_word)
 AND duplicate.relation = existing.relation
 AND duplicate.category = existing.category
 AND duplicate.difficulty = existing.difficulty
 AND duplicate.id > existing.id;


INSERT INTO users (username, password_hash, role, points, level)
VALUES
  ('admin_seed', '$2b$10$ETTSG52zolMaZI.3m58UJO9j8YPvzdZl/0oUhfy8hgV6LWm4ANOqq', 'admin', 1500, 2),
  ('demo_mia', '$2b$10$uuDlJLjvBR7/jqPqPJoxHeGBDcwKHcjj9KOY014Wl.JwJbuuN7cvS', 'user', 570, 1),
  ('demo_nikola', '$2b$10$AKeIraVXowas778ysps5Ae2PEYC9eCSIEVQAyP6POy4MordknBbqy', 'user', 1210, 2),
  ('demo_lana', '$2b$10$Fmew4.7/1JeuBQ3p54RjZOcsol0mkRTZSGBV6qkxEVti0vcUfCiQ.', 'user', 880, 1),
  ('demo_marko', '$2b$10$pAZI0wUGYBFUXEYUg.ziNuYYJP5.HRQUBFz56/s5jo1h1hFH0caji', 'user', 1045, 2),
  ('demo_sara', '$2b$10$TjHAR2k6MSPpQZQ//K.xDO9JsSuwGiYdmnobPOIGFfyU1rP31U4eG', 'user', 690, 1)
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  points = VALUES(points),
  level = VALUES(level);


INSERT INTO association_words (word, symbol, category, difficulty, clues_json, hint, accepted_answers_json)
SELECT seed.word, seed.symbol, seed.category, seed.difficulty, seed.clues_json, seed.hint, seed.accepted_answers_json
FROM (
  SELECT 'Atom' AS word, '⚛️' AS symbol, 'Nauka' AS category, 'Lako' AS difficulty, '["Jezgro","Elektron","Hemija","Čestica"]' AS clues_json, 'Osnovna jedinica materije.' AS hint, '["atom"]' AS accepted_answers_json
  UNION ALL SELECT 'Galaksija' AS word, '🌌' AS symbol, 'Nauka' AS category, 'Srednje' AS difficulty, '["Zvijezde","Svemir","Orbita","Mliječni put"]' AS clues_json, 'Ogromna grupa zvijezda i kosmickog materijala.' AS hint, '["galaksija"]' AS accepted_answers_json
  UNION ALL SELECT 'Gravitacija' AS word, '🧲' AS symbol, 'Nauka' AS category, 'Tesko' AS difficulty, '["Pad","Privlacnost","Masa","Njutn"]' AS clues_json, 'Sila koja privlaci tijela jedno drugom.' AS hint, '["gravitacija"]' AS accepted_answers_json
  UNION ALL SELECT 'Fudbal' AS word, '⚽' AS symbol, 'Sport' AS category, 'Lako' AS difficulty, '["Gol","Lopta","Stadion","Sudija"]' AS clues_json, 'Sport koji se igra najcesce nogom i loptom.' AS hint, '["fudbal"]' AS accepted_answers_json
  UNION ALL SELECT 'Maraton' AS word, '🏃' AS symbol, 'Sport' AS category, 'Srednje' AS difficulty, '["42 kilometra","Izdrzljivost","Staza","Trkač"]' AS clues_json, 'Dugacka trkacka disciplina.' AS hint, '["maraton"]' AS accepted_answers_json
  UNION ALL SELECT 'Gimnastika' AS word, '🤸' AS symbol, 'Sport' AS category, 'Tesko' AS difficulty, '["Greda","Parter","Salto","Ravnoteza"]' AS clues_json, 'Sport koji trazi koordinaciju i kontrolu tijela.' AS hint, '["gimnastika"]' AS accepted_answers_json
  UNION ALL SELECT 'Kamera' AS word, '🎬' AS symbol, 'Film' AS category, 'Lako' AS difficulty, '["Snimanje","Objektiv","Scena","Kadar"]' AS clues_json, 'Uredjaj bez kojeg nema snimanja filma.' AS hint, '["kamera"]' AS accepted_answers_json
  UNION ALL SELECT 'Scenario' AS word, '' AS symbol, 'Film' AS category, 'Srednje' AS difficulty, '["Dijalog","Likovi","Zaplet","Scenarista"]' AS clues_json, 'Pisani plan filma ili serije.' AS hint, '["scenario"]' AS accepted_answers_json
  UNION ALL SELECT 'Montaza' AS word, '' AS symbol, 'Film' AS category, 'Tesko' AS difficulty, '["Rez","Ritam","Postprodukcija","Kadrovi"]' AS clues_json, 'Spajanje i uredjivanje snimljenog materijala.' AS hint, '["montaza"]' AS accepted_answers_json
  UNION ALL SELECT 'Piramida' AS word, '🔺' AS symbol, 'Istorija' AS category, 'Lako' AS difficulty, '["Egipat","Faraon","Pustinja","Grobnica"]' AS clues_json, 'Gradjevina najpoznatija iz starog Egipta.' AS hint, '["piramida"]' AS accepted_answers_json
  UNION ALL SELECT 'Renesansa' AS word, '' AS symbol, 'Istorija' AS category, 'Srednje' AS difficulty, '["Leonardo","Humanizam","Firenca","Preporod"]' AS clues_json, 'Istorijski period preporoda umjetnosti i nauke.' AS hint, '["renesansa"]' AS accepted_answers_json
  UNION ALL SELECT 'Diplomatija' AS word, '' AS symbol, 'Istorija' AS category, 'Tesko' AS difficulty, '["Pregovori","Ambasada","Sporazum","Država"]' AS clues_json, 'Umijece vodjenja medjudrzavnih odnosa.' AS hint, '["diplomatija"]' AS accepted_answers_json
  UNION ALL SELECT 'Sunce' AS word, '☀️' AS symbol, 'Priroda' AS category, 'Lako' AS difficulty, '["Dan","Toplota","Svjetlost","Ljeto"]' AS clues_json, 'Nebesko tijelo koje nam daje svjetlost i toplotu.' AS hint, '["sunce"]' AS accepted_answers_json
  UNION ALL SELECT 'More' AS word, '🌊' AS symbol, 'Priroda' AS category, 'Srednje' AS difficulty, '["Talas","So","Plaža","Obala"]' AS clues_json, 'Velika slana vodena povrsina.' AS hint, '["more"]' AS accepted_answers_json
  UNION ALL SELECT 'Vulkan' AS word, '' AS symbol, 'Priroda' AS category, 'Tesko' AS difficulty, '["Lava","Krater","Erupcija","Pepeo"]' AS clues_json, 'Prirodna pojava povezana sa magmom i erupcijom.' AS hint, '["vulkan"]' AS accepted_answers_json
  UNION ALL SELECT 'Simfonija' AS word, '' AS symbol, 'Umjetnost' AS category, 'Lako' AS difficulty, '["Orkestar","Dirigent","Stav","Muzika"]' AS clues_json, 'Veliko muzicko djelo za orkestar.' AS hint, '["simfonija"]' AS accepted_answers_json
  UNION ALL SELECT 'Skulptura' AS word, '' AS symbol, 'Umjetnost' AS category, 'Srednje' AS difficulty, '["Klesanje","Mermer","Figura","Vajar"]' AS clues_json, 'Umjetnicko djelo oblikovano u prostoru.' AS hint, '["skulptura"]' AS accepted_answers_json
  UNION ALL SELECT 'Perspektiva' AS word, '' AS symbol, 'Umjetnost' AS category, 'Tesko' AS difficulty, '["Dubina","Linije","Prostor","Slikarstvo"]' AS clues_json, 'Likovni princip za prikaz prostora na ravnoj povrsini.' AS hint, '["perspektiva"]' AS accepted_answers_json
  UNION ALL SELECT 'Robot' AS word, '🤖' AS symbol, 'Tehnologija' AS category, 'Lako' AS difficulty, '["Mašina","Program","Senzor","Automatika"]' AS clues_json, 'Pametna masina koja moze izvrsavati zadatke.' AS hint, '["robot"]' AS accepted_answers_json
  UNION ALL SELECT 'Algoritam' AS word, '' AS symbol, 'Tehnologija' AS category, 'Srednje' AS difficulty, '["Koraci","Logika","Kod","Rjesenje"]' AS clues_json, 'Niz tacno odredjenih koraka za rjesavanje problema.' AS hint, '["algoritam"]' AS accepted_answers_json
  UNION ALL SELECT 'Mikrocip' AS word, '' AS symbol, 'Tehnologija' AS category, 'Tesko' AS difficulty, '["Procesor","Elektronika","Ploca","Tranzistor"]' AS clues_json, 'Mala komponenta sa integrisanim kolima.' AS hint, '["mikrocip","mikro cip"]' AS accepted_answers_json
  UNION ALL SELECT 'Atlas' AS word, '' AS symbol, 'Geografija' AS category, 'Lako' AS difficulty, '["Karta","Kontinent","Stranica","Planeta"]' AS clues_json, 'Zbirka geografskih karata.' AS hint, '["atlas"]' AS accepted_answers_json
  UNION ALL SELECT 'Arhipelag' AS word, '' AS symbol, 'Geografija' AS category, 'Srednje' AS difficulty, '["Ostrvo","Grupa","More","Obala"]' AS clues_json, 'Skup vise ostrva na istom prostoru.' AS hint, '["arhipelag"]' AS accepted_answers_json
  UNION ALL SELECT 'Meridijan' AS word, '' AS symbol, 'Geografija' AS category, 'Tesko' AS difficulty, '["Greenwich","Koordinate","Polovi","Duzina"]' AS clues_json, 'Zamisljena linija koja spaja polove Zemlje.' AS hint, '["meridijan"]' AS accepted_answers_json
  UNION ALL SELECT 'Ćelija' AS word, '' AS symbol, 'Nauka' AS category, 'Lako' AS difficulty, '["Membrana","Jezgro","Tkivo","Organizam"]' AS clues_json, 'Osnovna jedinica živih bića.' AS hint, '["ćelija","celija"]' AS accepted_answers_json
  UNION ALL SELECT 'Kiseonik' AS word, '' AS symbol, 'Nauka' AS category, 'Srednje' AS difficulty, '["Disanje","Gas","Vazduh","Element"]' AS clues_json, 'Hemijski element neophodan za disanje.' AS hint, '["kiseonik"]' AS accepted_answers_json
  UNION ALL SELECT 'Rukomet' AS word, '' AS symbol, 'Sport' AS category, 'Lako' AS difficulty, '["Gol","Dvorana","Sedmerac","Lopta"]' AS clues_json, 'Ekipni sport u kojem se lopta baca rukom.' AS hint, '["rukomet"]' AS accepted_answers_json
  UNION ALL SELECT 'Štafeta' AS word, '' AS symbol, 'Sport' AS category, 'Srednje' AS difficulty, '["Tim","Palica","Predaja","Trka"]' AS clues_json, 'Trka u kojoj članovi tima predaju palicu.' AS hint, '["štafeta","stafeta"]' AS accepted_answers_json
  UNION ALL SELECT 'Žanr' AS word, '' AS symbol, 'Film' AS category, 'Lako' AS difficulty, '["Drama","Komedija","Horor","Vrsta"]' AS clues_json, 'Vrsta filma ili književnog djela.' AS hint, '["žanr","zanr"]' AS accepted_answers_json
  UNION ALL SELECT 'Režija' AS word, '' AS symbol, 'Film' AS category, 'Tesko' AS difficulty, '["Vizija","Set","Kamera","Reditelj"]' AS clues_json, 'Vođenje i oblikovanje filmskog djela.' AS hint, '["režija","rezija"]' AS accepted_answers_json
  UNION ALL SELECT 'Ćirilica' AS word, '' AS symbol, 'Istorija' AS category, 'Srednje' AS difficulty, '["Slova","Pismo","Azbuka","Vuk"]' AS clues_json, 'Jedno od osnovnih slovenskih pisama.' AS hint, '["ćirilica","cirilica"]' AS accepted_answers_json
  UNION ALL SELECT 'Pećina' AS word, '' AS symbol, 'Priroda' AS category, 'Lako' AS difficulty, '["Stijena","Mrak","Podzemlje","Kapljice"]' AS clues_json, 'Prirodna šupljina u stijeni.' AS hint, '["pećina","pecina"]' AS accepted_answers_json
  UNION ALL SELECT 'Šuma' AS word, '' AS symbol, 'Priroda' AS category, 'Srednje' AS difficulty, '["Drveće","Lišće","Staza","Životinje"]' AS clues_json, 'Veliko područje obraslo drvećem.' AS hint, '["šuma","suma"]' AS accepted_answers_json
  UNION ALL SELECT 'Pozorište' AS word, '' AS symbol, 'Umjetnost' AS category, 'Lako' AS difficulty, '["Scena","Glumci","Publika","Predstava"]' AS clues_json, 'Mjesto i umjetnost izvođenja predstava.' AS hint, '["pozorište","pozoriste"]' AS accepted_answers_json
  UNION ALL SELECT 'Računar' AS word, '' AS symbol, 'Tehnologija' AS category, 'Lako' AS difficulty, '["Tastatura","Ekran","Procesor","Miš"]' AS clues_json, 'Elektronski uređaj za obradu podataka.' AS hint, '["računar","racunar","kompjuter"]' AS accepted_answers_json
  UNION ALL SELECT 'Mreža' AS word, '' AS symbol, 'Tehnologija' AS category, 'Srednje' AS difficulty, '["Internet","Signal","Povezivanje","Server"]' AS clues_json, 'Sistem povezanih uređaja i veza.' AS hint, '["mreža","mreza"]' AS accepted_answers_json
  UNION ALL SELECT 'Ušće' AS word, '' AS symbol, 'Geografija' AS category, 'Srednje' AS difficulty, '["Rijeka","More","Ulivanje","Delta"]' AS clues_json, 'Mjesto gdje se rijeka uliva u veću vodenu površinu.' AS hint, '["ušće","usce"]' AS accepted_answers_json
  UNION ALL SELECT 'Poluostrvo' AS word, '' AS symbol, 'Geografija' AS category, 'Tesko' AS difficulty, '["Kopno","More","Rt","Obala"]' AS clues_json, 'Kopno okruženo morem sa tri strane.' AS hint, '["poluostrvo"]' AS accepted_answers_json
  UNION ALL SELECT 'Neuron' AS word, '' AS symbol, 'Nauka' AS category, 'Lako' AS difficulty, '["Mozak","Signal","Sinapsa","Celija"]' AS clues_json, 'Specijalizovana nervna celija koja prenosi impulse.' AS hint, '["neuron"]' AS accepted_answers_json
  UNION ALL SELECT 'Formula' AS word, '' AS symbol, 'Nauka' AS category, 'Lako' AS difficulty, '["Simbol","Jednacina","Hemija","Broj"]' AS clues_json, 'Zapis koji predstavlja odnos ili sastav.' AS hint, '["formula"]' AS accepted_answers_json
  UNION ALL SELECT 'Teleskop' AS word, '' AS symbol, 'Nauka' AS category, 'Lako' AS difficulty, '["Svemir","Uvecanje","Zvijezde","Posmatranje"]' AS clues_json, 'Instrument za gledanje udaljenih nebeskih tijela.' AS hint, '["teleskop"]' AS accepted_answers_json
  UNION ALL SELECT 'Vakcina' AS word, '' AS symbol, 'Nauka' AS category, 'Srednje' AS difficulty, '["Imunitet","Doza","Zastita","Virus"]' AS clues_json, 'Preparat koji podstice razvoj zastite organizma.' AS hint, '["vakcina"]' AS accepted_answers_json
  UNION ALL SELECT 'Cestica' AS word, '' AS symbol, 'Nauka' AS category, 'Srednje' AS difficulty, '["Materija","Mikro","Fizika","Kretanje"]' AS clues_json, 'Vrlo mala jedinica materije.' AS hint, '["cestica"]' AS accepted_answers_json
  UNION ALL SELECT 'Laboratorija' AS word, '' AS symbol, 'Nauka' AS category, 'Srednje' AS difficulty, '["Eksperiment","Oprema","Ispitivanje","Naucnik"]' AS clues_json, 'Mjesto gdje se izvode naucna istrazivanja i testiranja.' AS hint, '["laboratorija"]' AS accepted_answers_json
  UNION ALL SELECT 'Spektar' AS word, '' AS symbol, 'Nauka' AS category, 'Tesko' AS difficulty, '["Boje","Talasi","Svjetlost","Analiza"]' AS clues_json, 'Raspored komponenti neke pojave, posebno svjetlosti.' AS hint, '["spektar"]' AS accepted_answers_json
  UNION ALL SELECT 'Evolucija' AS word, '' AS symbol, 'Nauka' AS category, 'Tesko' AS difficulty, '["Promjena","Vrsta","Vrijeme","Selekcija"]' AS clues_json, 'Postepeni razvoj zivih bica kroz vrijeme.' AS hint, '["evolucija"]' AS accepted_answers_json
  UNION ALL SELECT 'Katalizator' AS word, '' AS symbol, 'Nauka' AS category, 'Tesko' AS difficulty, '["Reakcija","Hemija","Ubrzanje","Proces"]' AS clues_json, 'Supstanca koja ubrzava hemijsku reakciju.' AS hint, '["katalizator"]' AS accepted_answers_json
  UNION ALL SELECT 'Kosarka' AS word, '' AS symbol, 'Sport' AS category, 'Lako' AS difficulty, '["Obruc","Dribling","Parket","Tim"]' AS clues_json, 'Sport u kojem se poeni osvajaju ubacivanjem lopte kroz obruc.' AS hint, '["kosarka"]' AS accepted_answers_json
  UNION ALL SELECT 'Plivanje' AS word, '' AS symbol, 'Sport' AS category, 'Lako' AS difficulty, '["Bazen","Voda","Staza","Zamah"]' AS clues_json, 'Sportska disciplina kretanja kroz vodu.' AS hint, '["plivanje"]' AS accepted_answers_json
  UNION ALL SELECT 'Reket' AS word, '' AS symbol, 'Sport' AS category, 'Lako' AS difficulty, '["Tenis","Mreza","Loptica","Udaranje"]' AS clues_json, 'Sportski rekvizit za udaranje loptice.' AS hint, '["reket"]' AS accepted_answers_json
  UNION ALL SELECT 'Trofej' AS word, '' AS symbol, 'Sport' AS category, 'Srednje' AS difficulty, '["Pehar","Finale","Pobjeda","Takmicenje"]' AS clues_json, 'Nagrada koja simbolizuje uspjeh na takmicenju.' AS hint, '["trofej"]' AS accepted_answers_json
  UNION ALL SELECT 'Kondicija' AS word, '' AS symbol, 'Sport' AS category, 'Srednje' AS difficulty, '["Forma","Izdrzljivost","Trening","Snaga"]' AS clues_json, 'Fizicka spremnost potrebna za dobar nastup.' AS hint, '["kondicija"]' AS accepted_answers_json
  UNION ALL SELECT 'Stadion' AS word, '' AS symbol, 'Sport' AS category, 'Srednje' AS difficulty, '["Tribine","Publika","Teren","Mec"]' AS clues_json, 'Veliki sportski objekat za utakmice i takmicenja.' AS hint, '["stadion"]' AS accepted_answers_json
  UNION ALL SELECT 'Triatlon' AS word, '' AS symbol, 'Sport' AS category, 'Tesko' AS difficulty, '["Plivanje","Biciklizam","Trcanje","Izdrzljivost"]' AS clues_json, 'Takmicenje koje spaja tri discipline.' AS hint, '["triatlon"]' AS accepted_answers_json
  UNION ALL SELECT 'Desetoboj' AS word, '' AS symbol, 'Sport' AS category, 'Tesko' AS difficulty, '["Atletika","Disciplina","Poeni","Deset"]' AS clues_json, 'Atletsko takmicenje sastavljeno od deset disciplina.' AS hint, '["desetoboj"]' AS accepted_answers_json
  UNION ALL SELECT 'Regata' AS word, '' AS symbol, 'Sport' AS category, 'Tesko' AS difficulty, '["Jedrenje","Voda","Trka","Brod"]' AS clues_json, 'Takmicenje jedrilica ili drugih plovila.' AS hint, '["regata"]' AS accepted_answers_json
  UNION ALL SELECT 'Reziser' AS word, '' AS symbol, 'Film' AS category, 'Lako' AS difficulty, '["Set","Vizija","Glumci","Snimanje"]' AS clues_json, 'Osoba koja vodi kreativni proces nastanka filma.' AS hint, '["reziser"]' AS accepted_answers_json
  UNION ALL SELECT 'Trejler' AS word, '' AS symbol, 'Film' AS category, 'Lako' AS difficulty, '["Najava","Kratko","Publika","Premijera"]' AS clues_json, 'Kratka najava filma namijenjena publici.' AS hint, '["trejler"]' AS accepted_answers_json
  UNION ALL SELECT 'Scena' AS word, '' AS symbol, 'Film' AS category, 'Lako' AS difficulty, '["Kadar","Glumci","Prizor","Radnja"]' AS clues_json, 'Jedan zaokruzen dio filmske radnje.' AS hint, '["scena"]' AS accepted_answers_json
  UNION ALL SELECT 'Kostim' AS word, '' AS symbol, 'Film' AS category, 'Srednje' AS difficulty, '["Lik","Odjeca","Scena","Dizajn"]' AS clues_json, 'Odjevna kombinacija koja pomaze oblikovanju filmskog lika.' AS hint, '["kostim"]' AS accepted_answers_json
) AS seed
LEFT JOIN association_words existing ON LOWER(existing.word) = LOWER(seed.word)
WHERE existing.id IS NULL;


INSERT INTO association_words (word, symbol, category, difficulty, clues_json, hint, accepted_answers_json)
SELECT seed.word, seed.symbol, seed.category, seed.difficulty, seed.clues_json, seed.hint, seed.accepted_answers_json
FROM (
  SELECT 'Kadrovanje' AS word, '' AS symbol, 'Film' AS category, 'Srednje' AS difficulty, '["Ugao","Kompozicija","Kamera","Prizor"]' AS clues_json, 'Nacin na koji je scena smjestena u kadar.' AS hint, '["kadrovanje"]' AS accepted_answers_json
  UNION ALL SELECT 'Premijera' AS word, '' AS symbol, 'Film' AS category, 'Srednje' AS difficulty, '["Crveni tepih","Publika","Prvo prikazivanje","Sala"]' AS clues_json, 'Prvo javno prikazivanje filma.' AS hint, '["premijera"]' AS accepted_answers_json
  UNION ALL SELECT 'Postprodukcija' AS word, '' AS symbol, 'Film' AS category, 'Tesko' AS difficulty, '["Montaza","Zvuk","Efekti","Finalna verzija"]' AS clues_json, 'Faza nakon snimanja u kojoj se film zavrsava.' AS hint, '["postprodukcija"]' AS accepted_answers_json
  UNION ALL SELECT 'Dokumentarac' AS word, '' AS symbol, 'Film' AS category, 'Tesko' AS difficulty, '["Cinjenice","Intervju","Naracija","Stvarnost"]' AS clues_json, 'Filmska forma zasnovana na stvarnim dogadjajima ili temama.' AS hint, '["dokumentarac"]' AS accepted_answers_json
  UNION ALL SELECT 'Kinematografija' AS word, '' AS symbol, 'Film' AS category, 'Tesko' AS difficulty, '["Svjetlo","Pokret","Kadar","Vizuelni stil"]' AS clues_json, 'Umijece stvaranja slike u filmu.' AS hint, '["kinematografija"]' AS accepted_answers_json
  UNION ALL SELECT 'Carstvo' AS word, '' AS symbol, 'Istorija' AS category, 'Lako' AS difficulty, '["Vladar","Granice","Narod","Moc"]' AS clues_json, 'Velika drzavna tvorevina pod jednom vlascu.' AS hint, '["carstvo"]' AS accepted_answers_json
  UNION ALL SELECT 'Bitka' AS word, '' AS symbol, 'Istorija' AS category, 'Lako' AS difficulty, '["Vojska","Sukob","Polje","Pobjeda"]' AS clues_json, 'Oruzani sukob dvije ili vise vojski.' AS hint, '["bitka"]' AS accepted_answers_json
  UNION ALL SELECT 'Spomenik' AS word, '' AS symbol, 'Istorija' AS category, 'Lako' AS difficulty, '["Proslo","Kamen","Sjecanje","Dogadjaj"]' AS clues_json, 'Obiljezje podignuto u cast necega iz proslosti.' AS hint, '["spomenik"]' AS accepted_answers_json
  UNION ALL SELECT 'Dinastija' AS word, '' AS symbol, 'Istorija' AS category, 'Srednje' AS difficulty, '["Porodica","Prijesto","Nasljedje","Vladari"]' AS clues_json, 'Niz vladara iz iste porodice.' AS hint, '["dinastija"]' AS accepted_answers_json
  UNION ALL SELECT 'Hronika' AS word, '' AS symbol, 'Istorija' AS category, 'Srednje' AS difficulty, '["Zapis","Godine","Dogadjaji","Proslo"]' AS clues_json, 'Redosljedni zapis vaznih dogadjaja.' AS hint, '["hronika"]' AS accepted_answers_json
  UNION ALL SELECT 'Arheologija' AS word, '' AS symbol, 'Istorija' AS category, 'Srednje' AS difficulty, '["Iskopavanje","Predmeti","Rusevine","Nalaziste"]' AS clues_json, 'Nauka o materijalnim ostacima proslih vremena.' AS hint, '["arheologija"]' AS accepted_answers_json
  UNION ALL SELECT 'Reforma' AS word, '' AS symbol, 'Istorija' AS category, 'Tesko' AS difficulty, '["Promjena","Drustvo","Institucije","Preuredjenje"]' AS clues_json, 'Velika promjena sistema ili pravila.' AS hint, '["reforma"]' AS accepted_answers_json
  UNION ALL SELECT 'Kolonizacija' AS word, '' AS symbol, 'Istorija' AS category, 'Tesko' AS difficulty, '["Naseljavanje","Osvajanje","More","Carstvo"]' AS clues_json, 'Proces osvajanja i naseljavanja novih teritorija.' AS hint, '["kolonizacija"]' AS accepted_answers_json
  UNION ALL SELECT 'Hronologija' AS word, '' AS symbol, 'Istorija' AS category, 'Tesko' AS difficulty, '["Vrijeme","Redosljed","Datumi","Dogadjaji"]' AS clues_json, 'Poredak dogadjaja prema vremenu desavanja.' AS hint, '["hronologija"]' AS accepted_answers_json
  UNION ALL SELECT 'Kisa' AS word, '' AS symbol, 'Priroda' AS category, 'Lako' AS difficulty, '["Oblak","Kap","Vrijeme","Padavina"]' AS clues_json, 'Voda koja pada iz oblaka.' AS hint, '["kisa"]' AS accepted_answers_json
  UNION ALL SELECT 'Vjetar' AS word, '' AS symbol, 'Priroda' AS category, 'Lako' AS difficulty, '["Povjetarac","Smjer","Brzina","Vazduh"]' AS clues_json, 'Kretanje vazduha u atmosferi.' AS hint, '["vjetar"]' AS accepted_answers_json
  UNION ALL SELECT 'Jezero' AS word, '' AS symbol, 'Priroda' AS category, 'Lako' AS difficulty, '["Voda","Obala","Mirno","Dubina"]' AS clues_json, 'Veca stajaca vodena povrsina na kopnu.' AS hint, '["jezero"]' AS accepted_answers_json
  UNION ALL SELECT 'Planina' AS word, '' AS symbol, 'Priroda' AS category, 'Srednje' AS difficulty, '["Vrh","Uspon","Visina","Stijena"]' AS clues_json, 'Veliko uzvisenje sa izrazenim vrhovima.' AS hint, '["planina"]' AS accepted_answers_json
  UNION ALL SELECT 'Lednik' AS word, '' AS symbol, 'Priroda' AS category, 'Srednje' AS difficulty, '["Led","Hladnoca","Planina","Kretanje"]' AS clues_json, 'Velika masa leda koja se sporo pomjera.' AS hint, '["lednik"]' AS accepted_answers_json
  UNION ALL SELECT 'Delta' AS word, '' AS symbol, 'Priroda' AS category, 'Srednje' AS difficulty, '["Rijeka","Usce","Nanosi","Grananje"]' AS clues_json, 'Podrucje grananja rijeke pred usce.' AS hint, '["delta"]' AS accepted_answers_json
  UNION ALL SELECT 'Biosfera' AS word, '' AS symbol, 'Priroda' AS category, 'Tesko' AS difficulty, '["Zivot","Planeta","Sloj","Okolina"]' AS clues_json, 'Ukupan prostor Zemlje u kojem postoji zivot.' AS hint, '["biosfera"]' AS accepted_answers_json
  UNION ALL SELECT 'Atmosfera' AS word, '' AS symbol, 'Priroda' AS category, 'Tesko' AS difficulty, '["Vazduh","Sloj","Planeta","Pritisak"]' AS clues_json, 'Gasoviti omotac planete.' AS hint, '["atmosfera"]' AS accepted_answers_json
  UNION ALL SELECT 'Roman' AS word, '' AS symbol, 'Umjetnost' AS category, 'Lako' AS difficulty, '["Likovi","Poglavlje","Prica","Pisac"]' AS clues_json, 'Duze prozno knjizevno djelo.' AS hint, '["roman"]' AS accepted_answers_json
  UNION ALL SELECT 'Freska' AS word, '' AS symbol, 'Umjetnost' AS category, 'Lako' AS difficulty, '["Zid","Boja","Crkva","Malter"]' AS clues_json, 'Slikarsko djelo izvedeno na svjezem malteru.' AS hint, '["freska"]' AS accepted_answers_json
  UNION ALL SELECT 'Galerija' AS word, '' AS symbol, 'Umjetnost' AS category, 'Lako' AS difficulty, '["Izlozba","Slike","Posjetioci","Umjetnik"]' AS clues_json, 'Prostor za izlaganje umjetnickih djela.' AS hint, '["galerija"]' AS accepted_answers_json
  UNION ALL SELECT 'Portret' AS word, '' AS symbol, 'Umjetnost' AS category, 'Srednje' AS difficulty, '["Lice","Figura","Poza","Slikar"]' AS clues_json, 'Umjetnicki prikaz necijeg lika.' AS hint, '["portret"]' AS accepted_answers_json
  UNION ALL SELECT 'Koreografija' AS word, '' AS symbol, 'Umjetnost' AS category, 'Srednje' AS difficulty, '["Pokret","Ples","Ritam","Scena"]' AS clues_json, 'Osmisljeni raspored plesnih pokreta.' AS hint, '["koreografija"]' AS accepted_answers_json
  UNION ALL SELECT 'Drama' AS word, '' AS symbol, 'Umjetnost' AS category, 'Srednje' AS difficulty, '["Pozornica","Likovi","Sukob","Tekst"]' AS clues_json, 'Scensko ili knjizevno djelo zasnovano na radnji i konfliktu.' AS hint, '["drama"]' AS accepted_answers_json
  UNION ALL SELECT 'Instalacija' AS word, '' AS symbol, 'Umjetnost' AS category, 'Tesko' AS difficulty, '["Prostor","Objekti","Izlozba","Savremeno"]' AS clues_json, 'Savremeno umjetnicko djelo rasporedjeno u prostoru.' AS hint, '["instalacija"]' AS accepted_answers_json
  UNION ALL SELECT 'Ekspresionizam' AS word, '' AS symbol, 'Umjetnost' AS category, 'Tesko' AS difficulty, '["Emocija","Pravac","Boja","Deformacija"]' AS clues_json, 'Umjetnicki pravac naglasene ekspresije i unutrasnjeg dozivljaja.' AS hint, '["ekspresionizam"]' AS accepted_answers_json
  UNION ALL SELECT 'Kompozicija' AS word, '' AS symbol, 'Umjetnost' AS category, 'Tesko' AS difficulty, '["Raspored","Oblik","Balans","Cjelina"]' AS clues_json, 'Nacin organizovanja elemenata u umjetnickom djelu.' AS hint, '["kompozicija"]' AS accepted_answers_json
  UNION ALL SELECT 'Lozinka' AS word, '' AS symbol, 'Tehnologija' AS category, 'Lako' AS difficulty, '["Prijava","Sigurnost","Nalog","Karakteri"]' AS clues_json, 'Tajni niz znakova za pristup sistemu.' AS hint, '["lozinka"]' AS accepted_answers_json
  UNION ALL SELECT 'Dron' AS word, '' AS symbol, 'Tehnologija' AS category, 'Lako' AS difficulty, '["Leti","Kamera","Daljinski","Propeleri"]' AS clues_json, 'Letjelica kojom se upravlja na daljinu.' AS hint, '["dron"]' AS accepted_answers_json
  UNION ALL SELECT 'Mreza' AS word, '' AS symbol, 'Tehnologija' AS category, 'Lako' AS difficulty, '["Konekcija","Racunari","Internet","Prenos"]' AS clues_json, 'Povezan sistem uredjaja koji razmjenjuju podatke.' AS hint, '["mreza"]' AS accepted_answers_json
  UNION ALL SELECT 'Server' AS word, '' AS symbol, 'Tehnologija' AS category, 'Srednje' AS difficulty, '["Host","Zahtjev","Podaci","Mreza"]' AS clues_json, 'Racunar ili servis koji odgovara na zahtjeve drugih uredjaja.' AS hint, '["server"]' AS accepted_answers_json
  UNION ALL SELECT 'Interfejs' AS word, '' AS symbol, 'Tehnologija' AS category, 'Srednje' AS difficulty, '["Ekran","Dugme","Navigacija","Korisnik"]' AS clues_json, 'Sloj preko kojeg korisnik komunicira sa aplikacijom.' AS hint, '["interfejs"]' AS accepted_answers_json
  UNION ALL SELECT 'Baza podataka' AS word, '' AS symbol, 'Tehnologija' AS category, 'Srednje' AS difficulty, '["Tabela","Upit","Cuvanje","Podaci"]' AS clues_json, 'Organizovan sistem za cuvanje i pretragu informacija.' AS hint, '["baza podataka","baza"]' AS accepted_answers_json
  UNION ALL SELECT 'Enkripcija' AS word, '' AS symbol, 'Tehnologija' AS category, 'Tesko' AS difficulty, '["Sigurnost","Kodiranje","Kljuc","Zastita"]' AS clues_json, 'Proces pretvaranja podataka u zasticen oblik.' AS hint, '["enkripcija"]' AS accepted_answers_json
  UNION ALL SELECT 'Automatizacija' AS word, '' AS symbol, 'Tehnologija' AS category, 'Tesko' AS difficulty, '["Proces","Usteda vremena","Robot","Sistem"]' AS clues_json, 'Izvodjenje zadataka bez stalne ljudske intervencije.' AS hint, '["automatizacija"]' AS accepted_answers_json
  UNION ALL SELECT 'Kibernetika' AS word, '' AS symbol, 'Tehnologija' AS category, 'Tesko' AS difficulty, '["Kontrola","Sistem","Povratna sprega","Automatika"]' AS clues_json, 'Oblast koja proucava upravljanje i komunikaciju u sistemima.' AS hint, '["kibernetika"]' AS accepted_answers_json
  UNION ALL SELECT 'Ostrvo' AS word, '' AS symbol, 'Geografija' AS category, 'Lako' AS difficulty, '["More","Kopno","Obala","Izolovano"]' AS clues_json, 'Kopno okruzeno vodom sa svih strana.' AS hint, '["ostrvo"]' AS accepted_answers_json
  UNION ALL SELECT 'Kanjon' AS word, '' AS symbol, 'Geografija' AS category, 'Lako' AS difficulty, '["Rijeka","Stijene","Dubina","Usjek"]' AS clues_json, 'Duboka i uska dolina strmih strana.' AS hint, '["kanjon"]' AS accepted_answers_json
  UNION ALL SELECT 'Ravnica' AS word, '' AS symbol, 'Geografija' AS category, 'Lako' AS difficulty, '["Nizija","Ravno","Polje","Prostor"]' AS clues_json, 'Velika ravna povrsina na kopnu.' AS hint, '["ravnica"]' AS accepted_answers_json
  UNION ALL SELECT 'Granica' AS word, '' AS symbol, 'Geografija' AS category, 'Srednje' AS difficulty, '["Drzava","Linija","Prelaz","Mapa"]' AS clues_json, 'Linija koja razdvaja dvije teritorije.' AS hint, '["granica"]' AS accepted_answers_json
  UNION ALL SELECT 'Topografija' AS word, '' AS symbol, 'Geografija' AS category, 'Tesko' AS difficulty, '["Reljef","Visina","Teren","Mapa"]' AS clues_json, 'Opisivanje i prikazivanje oblika terena.' AS hint, '["topografija"]' AS accepted_answers_json
  UNION ALL SELECT 'Kartografija' AS word, '' AS symbol, 'Geografija' AS category, 'Tesko' AS difficulty, '["Mapa","Projekcija","Skala","Crtanje"]' AS clues_json, 'Nauka i vjestina izrade karata.' AS hint, '["kartografija"]' AS accepted_answers_json
  UNION ALL SELECT 'Geopolitika' AS word, '' AS symbol, 'Geografija' AS category, 'Tesko' AS difficulty, '["Drzave","Moc","Prostor","Uticaj"]' AS clues_json, 'Proucavanje odnosa politike i geografskog prostora.' AS hint, '["geopolitika"]' AS accepted_answers_json
  UNION ALL SELECT 'Čempres' AS word, '🌳' AS symbol, 'Priroda' AS category, 'Lako' AS difficulty, '["Drvo","Vitko","Mediteran","Četinari"]' AS clues_json, 'Visoko i usko drvo tamnozelenih grana.' AS hint, '["čempres","cempres"]' AS accepted_answers_json
  UNION ALL SELECT 'Čitač' AS word, '📟' AS symbol, 'Tehnologija' AS category, 'Srednje' AS difficulty, '["Kartica","Senzor","Ulaz","Uređaj"]' AS clues_json, 'Uređaj koji prepoznaje i očitava podatke.' AS hint, '["čitač","citac"]' AS accepted_answers_json
  UNION ALL SELECT 'Žubor' AS word, '💧' AS symbol, 'Priroda' AS category, 'Tesko' AS difficulty, '["Voda","Potok","Zvuk","Tok"]' AS clues_json, 'Blag i neprekidan zvuk tekuće vode.' AS hint, '["žubor","zubor"]' AS accepted_answers_json
  UNION ALL SELECT 'Molekul' AS word, '' AS symbol, 'Nauka' AS category, 'Lako' AS difficulty, '["Atomi","Veza","Hemija","Supstanca"]' AS clues_json, 'Skup povezanih atoma koji grade supstancu.' AS hint, '["molekul"]' AS accepted_answers_json
  UNION ALL SELECT 'Element' AS word, '' AS symbol, 'Nauka' AS category, 'Lako' AS difficulty, '["Periodni sistem","Hemija","Simbol","Supstanca"]' AS clues_json, 'Osnovna hemijska vrsta gradjena od iste vrste atoma.' AS hint, '["element"]' AS accepted_answers_json
  UNION ALL SELECT 'Genom' AS word, '' AS symbol, 'Nauka' AS category, 'Tesko' AS difficulty, '["DNK","Nasljedje","Informacija","Sekvenca"]' AS clues_json, 'Ukupan zapis genetske informacije jednog organizma.' AS hint, '["genom"]' AS accepted_answers_json
  UNION ALL SELECT 'Odbojka' AS word, '' AS symbol, 'Sport' AS category, 'Lako' AS difficulty, '["Mreza","Servis","Tim","Smech"]' AS clues_json, 'Ekipni sport u kojem se lopta prebacuje preko mreze.' AS hint, '["odbojka"]' AS accepted_answers_json
  UNION ALL SELECT 'Tenis' AS word, '' AS symbol, 'Sport' AS category, 'Lako' AS difficulty, '["Reket","Mreza","Servis","Set"]' AS clues_json, 'Sport sa reketom u kojem igraci prebacuju lopticu preko mreze.' AS hint, '["tenis"]' AS accepted_answers_json
  UNION ALL SELECT 'Hokej' AS word, '' AS symbol, 'Sport' AS category, 'Lako' AS difficulty, '["Pak","Led","Palica","Gol"]' AS clues_json, 'Brz ekipni sport koji se najcesce igra na ledu.' AS hint, '["hokej"]' AS accepted_answers_json
  UNION ALL SELECT 'Taktika' AS word, '' AS symbol, 'Sport' AS category, 'Tesko' AS difficulty, '["Plan","Protivnik","Strategija","Mec"]' AS clues_json, 'Promisljen nacin igre kojim se dolazi do prednosti.' AS hint, '["taktika"]' AS accepted_answers_json
  UNION ALL SELECT 'Formacija' AS word, '' AS symbol, 'Sport' AS category, 'Tesko' AS difficulty, '["Raspored","Tim","Teren","Trener"]' AS clues_json, 'Dogovoreni raspored igraca na terenu tokom meca.' AS hint, '["formacija"]' AS accepted_answers_json
  UNION ALL SELECT 'Bioskop' AS word, '' AS symbol, 'Film' AS category, 'Lako' AS difficulty, '["Platno","Sala","Projekcija","Publika"]' AS clues_json, 'Mjesto gdje se filmovi javno prikazuju publici.' AS hint, '["bioskop"]' AS accepted_answers_json
  UNION ALL SELECT 'Audicija' AS word, '' AS symbol, 'Film' AS category, 'Srednje' AS difficulty, '["Uloga","Izbor","Glumac","Proba"]' AS clues_json, 'Proces biranja glumaca za odredjene uloge.' AS hint, '["audicija"]' AS accepted_answers_json
) AS seed
LEFT JOIN association_words existing ON LOWER(existing.word) = LOWER(seed.word)
WHERE existing.id IS NULL;


INSERT INTO association_words (word, symbol, category, difficulty, clues_json, hint, accepted_answers_json)
SELECT seed.word, seed.symbol, seed.category, seed.difficulty, seed.clues_json, seed.hint, seed.accepted_answers_json
FROM (
  SELECT 'Storyboard' AS word, '' AS symbol, 'Film' AS category, 'Srednje' AS difficulty, '["Kadar","Skica","Planiranje","Sekvenca"]' AS clues_json, 'Vizuelni plan scena prije samog snimanja filma.' AS hint, '["storyboard"]' AS accepted_answers_json
  UNION ALL SELECT 'Scenografija' AS word, '' AS symbol, 'Film' AS category, 'Tesko' AS difficulty, '["Dekor","Prostor","Set","Vizuelni izgled"]' AS clues_json, 'Oblikovanje prostora i vizuelnog okruzenja scene.' AS hint, '["scenografija"]' AS accepted_answers_json
  UNION ALL SELECT 'Tvrdjava' AS word, '' AS symbol, 'Istorija' AS category, 'Lako' AS difficulty, '["Zidine","Odbrana","Kula","Opsada"]' AS clues_json, 'Utvrdjeno mjesto gradjeno radi zastite i odbrane.' AS hint, '["tvrdjava"]' AS accepted_answers_json
  UNION ALL SELECT 'Kraljevina' AS word, '' AS symbol, 'Istorija' AS category, 'Lako' AS difficulty, '["Kruna","Vladar","Prijesto","Nasljedje"]' AS clues_json, 'Drzava ili oblast kojom upravlja kralj ili kraljica.' AS hint, '["kraljevina"]' AS accepted_answers_json
  UNION ALL SELECT 'Dekret' AS word, '' AS symbol, 'Istorija' AS category, 'Tesko' AS difficulty, '["Odluka","Vladar","Naredba","Dokument"]' AS clues_json, 'Svecana ili zvanicna odluka izdata autoritetom vlasti.' AS hint, '["dekret"]' AS accepted_answers_json
  UNION ALL SELECT 'Vodopad' AS word, '' AS symbol, 'Priroda' AS category, 'Srednje' AS difficulty, '["Rijeka","Visina","Pad","Pjena"]' AS clues_json, 'Mjesto gdje voda naglo pada preko stijena.' AS hint, '["vodopad"]' AS accepted_answers_json
  UNION ALL SELECT 'Livada' AS word, '' AS symbol, 'Priroda' AS category, 'Srednje' AS difficulty, '["Trava","Cvijece","Ravno","Otvoreno"]' AS clues_json, 'Otvoren travnati prostor bogat biljem i cvijecem.' AS hint, '["livada"]' AS accepted_answers_json
  UNION ALL SELECT 'Gejzir' AS word, '' AS symbol, 'Priroda' AS category, 'Tesko' AS difficulty, '["Para","Vrela voda","Pritisak","Izvor"]' AS clues_json, 'Izvor koji povremeno izbacuje vrelu vodu i paru.' AS hint, '["gejzir"]' AS accepted_answers_json
  UNION ALL SELECT 'Balet' AS word, '' AS symbol, 'Umjetnost' AS category, 'Lako' AS difficulty, '["Ples","Pozornica","Pokret","Ansambl"]' AS clues_json, 'Scenska umjetnost zasnovana na preciznom plesnom izrazu.' AS hint, '["balet"]' AS accepted_answers_json
  UNION ALL SELECT 'Basna' AS word, '' AS symbol, 'Umjetnost' AS category, 'Lako' AS difficulty, '["Pouka","Zivotinje","Prica","Likovi"]' AS clues_json, 'Kratka prica koja kroz alegoriju nosi pouku.' AS hint, '["basna"]' AS accepted_answers_json
  UNION ALL SELECT 'Mural' AS word, '' AS symbol, 'Umjetnost' AS category, 'Lako' AS difficulty, '["Zid","Boje","Velika slika","Ulica"]' AS clues_json, 'Velika slika oslikana direktno na zidu ili fasadi.' AS hint, '["mural"]' AS accepted_answers_json
  UNION ALL SELECT 'Alegorija' AS word, '' AS symbol, 'Umjetnost' AS category, 'Tesko' AS difficulty, '["Simbolika","Znacenje","Prica","Skrivena poruka"]' AS clues_json, 'Umjetnicki postupak u kojem slika ili prica nosi dublje znacenje.' AS hint, '["alegorija"]' AS accepted_answers_json
  UNION ALL SELECT 'Kontrast' AS word, '' AS symbol, 'Umjetnost' AS category, 'Tesko' AS difficulty, '["Suprotnost","Svjetlo","Boja","Isticanje"]' AS clues_json, 'Likovni ili vizuelni odnos jakih razlika radi naglasavanja.' AS hint, '["kontrast"]' AS accepted_answers_json
  UNION ALL SELECT 'Kursor' AS word, '' AS symbol, 'Tehnologija' AS category, 'Lako' AS difficulty, '["Mis","Ekran","Pokazivac","Klik"]' AS clues_json, 'Pokazivac kojim korisnik upravlja po ekranu.' AS hint, '["kursor"]' AS accepted_answers_json
  UNION ALL SELECT 'Pretrazivac' AS word, '' AS symbol, 'Tehnologija' AS category, 'Srednje' AS difficulty, '["Internet","Kartice","Adresa","Pretraga"]' AS clues_json, 'Program kojim se otvaraju i pretrazuju web stranice.' AS hint, '["pretrazivac"]' AS accepted_answers_json
  UNION ALL SELECT 'Virtuelizacija' AS word, '' AS symbol, 'Tehnologija' AS category, 'Tesko' AS difficulty, '["Server","Resursi","Okruzenje","Emulacija"]' AS clues_json, 'Pokretanje vise logicnih sistema na istom fizickom hardveru.' AS hint, '["virtuelizacija"]' AS accepted_answers_json
  UNION ALL SELECT 'Telemetrija' AS word, '' AS symbol, 'Tehnologija' AS category, 'Tesko' AS difficulty, '["Mjerenje","Senzori","Prenos","Podaci"]' AS clues_json, 'Daljinsko prikupljanje i slanje tehnickih podataka.' AS hint, '["telemetrija"]' AS accepted_answers_json
  UNION ALL SELECT 'Rt' AS word, '' AS symbol, 'Geografija' AS category, 'Lako' AS difficulty, '["Obala","More","Izbocenje","Kopno"]' AS clues_json, 'Istureni dio kopna koji zalazi u more ili jezero.' AS hint, '["rt"]' AS accepted_answers_json
  UNION ALL SELECT 'Globus' AS word, '' AS symbol, 'Geografija' AS category, 'Lako' AS difficulty, '["Zemlja","Model","Mapa","Sfera"]' AS clues_json, 'Umanjeni sferni prikaz planete Zemlje.' AS hint, '["globus"]' AS accepted_answers_json
  UNION ALL SELECT 'Kanal' AS word, '' AS symbol, 'Geografija' AS category, 'Tesko' AS difficulty, '["Voda","Prolaz","Povezivanje","Plovidba"]' AS clues_json, 'Vjestacki ili prirodni vodeni prolaz koji spaja povrsine.' AS hint, '["kanal"]' AS accepted_answers_json
  UNION ALL SELECT 'Platno' AS word, '' AS symbol, 'Film' AS category, 'Lako' AS difficulty, '["Projekcija","Bioskop","Slika","Ekran"]' AS clues_json, 'Velika povrsina na koju se prikazuje filmska slika.' AS hint, '["platno"]' AS accepted_answers_json
  UNION ALL SELECT 'Titl' AS word, '' AS symbol, 'Film' AS category, 'Lako' AS difficulty, '["Tekst","Prevod","Dijalog","Ekran"]' AS clues_json, 'Pisani prevod ili tekst koji prati govor u filmu.' AS hint, '["titl"]' AS accepted_answers_json
  UNION ALL SELECT 'Producent' AS word, '' AS symbol, 'Film' AS category, 'Srednje' AS difficulty, '["Budzet","Organizacija","Snimanje","Tim"]' AS clues_json, 'Osoba koja vodi produkciju i organizuje nastanak filma.' AS hint, '["producent"]' AS accepted_answers_json
  UNION ALL SELECT 'Kasting' AS word, '' AS symbol, 'Film' AS category, 'Srednje' AS difficulty, '["Uloga","Izbor","Glumci","Proba"]' AS clues_json, 'Proces biranja glumaca za odredjene uloge u filmu.' AS hint, '["kasting"]' AS accepted_answers_json
  UNION ALL SELECT 'Mizanscen' AS word, '' AS symbol, 'Film' AS category, 'Tesko' AS difficulty, '["Raspored","Scena","Pokret","Vizuelni plan"]' AS clues_json, 'Nacin na koji su likovi i elementi rasporedjeni unutar scene.' AS hint, '["mizanscen"]' AS accepted_answers_json
  UNION ALL SELECT 'Drzava' AS word, '' AS symbol, 'Geografija' AS category, 'Lako' AS difficulty, '["Granice","Gradjani","Mapa","Teritorija"]' AS clues_json, 'Organizovana teritorijalna zajednica sa svojim granicama.' AS hint, '["drzava"]' AS accepted_answers_json
  UNION ALL SELECT 'Okean' AS word, '' AS symbol, 'Geografija' AS category, 'Lako' AS difficulty, '["Voda","Talasi","Dubina","Prostranstvo"]' AS clues_json, 'Najveca slana vodena povrsina na Zemlji.' AS hint, '["okean"]' AS accepted_answers_json
  UNION ALL SELECT 'Klima' AS word, '' AS symbol, 'Geografija' AS category, 'Srednje' AS difficulty, '["Temperatura","Padavine","Podneblje","Vrijeme"]' AS clues_json, 'Dugorocan obrazac vremenskih prilika nekog podrucja.' AS hint, '["klima"]' AS accepted_answers_json
  UNION ALL SELECT 'Regija' AS word, '' AS symbol, 'Geografija' AS category, 'Srednje' AS difficulty, '["Oblast","Podrucje","Mapa","Granice"]' AS clues_json, 'Sira oblast koja dijeli neke zajednicke osobine.' AS hint, '["regija"]' AS accepted_answers_json
  UNION ALL SELECT 'Longituda' AS word, '' AS symbol, 'Geografija' AS category, 'Tesko' AS difficulty, '["Duzina","Koordinate","Meridijan","Pozicija"]' AS clues_json, 'Geografska duzina kojom se odredjuje polozaj istocno ili zapadno.' AS hint, '["longituda"]' AS accepted_answers_json
  UNION ALL SELECT 'Geomorfologija' AS word, '' AS symbol, 'Geografija' AS category, 'Tesko' AS difficulty, '["Reljef","Oblici tla","Teren","Nastanak"]' AS clues_json, 'Nauka o nastanku i oblicima Zemljine povrsine.' AS hint, '["geomorfologija"]' AS accepted_answers_json
  UNION ALL SELECT 'Vitez' AS word, '' AS symbol, 'Istorija' AS category, 'Lako' AS difficulty, '["Oklop","Mac","Konj","Dvor"]' AS clues_json, 'Ratnik iz srednjovjekovnog doba vezan za plemstvo i cast.' AS hint, '["vitez"]' AS accepted_answers_json
  UNION ALL SELECT 'Traktat' AS word, '' AS symbol, 'Istorija' AS category, 'Srednje' AS difficulty, '["Sporazum","Drzave","Potpis","Dogovor"]' AS clues_json, 'Svecani medjudrzavni ili istorijski sporazum u pisanom obliku.' AS hint, '["traktat"]' AS accepted_answers_json
  UNION ALL SELECT 'Manifest' AS word, '' AS symbol, 'Istorija' AS category, 'Tesko' AS difficulty, '["Ideje","Pokret","Program","Javna objava"]' AS clues_json, 'Javna objava stavova, namjera ili programa nekog pokreta.' AS hint, '["manifest"]' AS accepted_answers_json
  UNION ALL SELECT 'Magnet' AS word, '' AS symbol, 'Nauka' AS category, 'Lako' AS difficulty, '["Privlacenje","Metal","Polje","Polovi"]' AS clues_json, 'Predmet koji privlaci odredjene metale pomocu magnetnog polja.' AS hint, '["magnet"]' AS accepted_answers_json
  UNION ALL SELECT 'Epruveta' AS word, '' AS symbol, 'Nauka' AS category, 'Lako' AS difficulty, '["Staklo","Uzorak","Hemija","Laboratorija"]' AS clues_json, 'Uska laboratorijska posuda za male kolicine supstance.' AS hint, '["epruveta"]' AS accepted_answers_json
  UNION ALL SELECT 'Teorija' AS word, '' AS symbol, 'Nauka' AS category, 'Srednje' AS difficulty, '["Objasnjenje","Dokaz","Model","Proucavanje"]' AS clues_json, 'Sistem ideja kojim se objasnjava neka pojava ili skup pojava.' AS hint, '["teorija"]' AS accepted_answers_json
  UNION ALL SELECT 'Entropija' AS word, '' AS symbol, 'Nauka' AS category, 'Tesko' AS difficulty, '["Nered","Energija","Sistem","Fizika"]' AS clues_json, 'Mjera neuredjenosti ili rasipanja energije u sistemu.' AS hint, '["entropija"]' AS accepted_answers_json
  UNION ALL SELECT 'Izvor' AS word, '' AS symbol, 'Priroda' AS category, 'Srednje' AS difficulty, '["Voda","Pocetak toka","Stijena","Potok"]' AS clues_json, 'Mjesto gdje voda prirodno izbija na povrsinu.' AS hint, '["izvor"]' AS accepted_answers_json
  UNION ALL SELECT 'Koral' AS word, '' AS symbol, 'Priroda' AS category, 'Srednje' AS difficulty, '["More","Hrid","Kolonija","Organizam"]' AS clues_json, 'Morski organizam koji gradi grebene i zivi u kolonijama.' AS hint, '["koral"]' AS accepted_answers_json
  UNION ALL SELECT 'Erozija' AS word, '' AS symbol, 'Priroda' AS category, 'Tesko' AS difficulty, '["Tlo","Voda","Trošenje","Oblikovanje"]' AS clues_json, 'Postepeno trošenje i odnošenje zemljista ili stijena.' AS hint, '["erozija"]' AS accepted_answers_json
  UNION ALL SELECT 'Sediment' AS word, '' AS symbol, 'Priroda' AS category, 'Tesko' AS difficulty, '["Naslage","Cestice","Talozenje","Dno"]' AS clues_json, 'Materijal koji se talozi na dnu vode ili tla.' AS hint, '["sediment"]' AS accepted_answers_json
  UNION ALL SELECT 'Trening' AS word, '' AS symbol, 'Sport' AS category, 'Srednje' AS difficulty, '["Vjezba","Priprema","Forma","Napredak"]' AS clues_json, 'Plansko vjezbanje radi boljeg sportskog nastupa.' AS hint, '["trening"]' AS accepted_answers_json
  UNION ALL SELECT 'Ofsajd' AS word, '' AS symbol, 'Sport' AS category, 'Tesko' AS difficulty, '["Napad","Pravila","Fudbal","Pozicija"]' AS clues_json, 'Pravilo koje kaznjava nepravilno postavljanje napadaca.' AS hint, '["ofsajd"]' AS accepted_answers_json
  UNION ALL SELECT 'Penal' AS word, '' AS symbol, 'Sport' AS category, 'Tesko' AS difficulty, '["Kazna","Sut","Gol","Prekrsaj"]' AS clues_json, 'Kazneni udarac dosudjen poslije odredjenog prekrsaja.' AS hint, '["penal"]' AS accepted_answers_json
  UNION ALL SELECT 'Baterija' AS word, '' AS symbol, 'Tehnologija' AS category, 'Lako' AS difficulty, '["Energija","Punjenje","Uredjaj","Napajanje"]' AS clues_json, 'Izvor elektricne energije za uredjaje.' AS hint, '["baterija"]' AS accepted_answers_json
  UNION ALL SELECT 'Domen' AS word, '' AS symbol, 'Tehnologija' AS category, 'Srednje' AS difficulty, '["Web","Adresa","Internet","Sajt"]' AS clues_json, 'Tekstualna internet adresa koja vodi do sajta ili servisa.' AS hint, '["domen"]' AS accepted_answers_json
  UNION ALL SELECT 'Ruter' AS word, '' AS symbol, 'Tehnologija' AS category, 'Srednje' AS difficulty, '["Mreza","Signal","Internet","Povezivanje"]' AS clues_json, 'Uredjaj koji usmjerava internet saobracaj izmedju mreza.' AS hint, '["ruter"]' AS accepted_answers_json
  UNION ALL SELECT 'Latencija' AS word, '' AS symbol, 'Tehnologija' AS category, 'Tesko' AS difficulty, '["Kasnjenje","Mreza","Odgovor","Signal"]' AS clues_json, 'Vrijeme potrebno da odgovor ili podatak stigne od izvora do cilja.' AS hint, '["latencija"]' AS accepted_answers_json
  UNION ALL SELECT 'Strip' AS word, '' AS symbol, 'Umjetnost' AS category, 'Lako' AS difficulty, '["Kadrovi","Crtez","Oblacic","Prica"]' AS clues_json, 'Prica ispricana nizom crteza i kratkog teksta.' AS hint, '["strip"]' AS accepted_answers_json
  UNION ALL SELECT 'Maska' AS word, '' AS symbol, 'Umjetnost' AS category, 'Lako' AS difficulty, '["Lice","Pozornica","Lik","Kostim"]' AS clues_json, 'Predmet koji prekriva lice radi uloge ili umjetnickog izraza.' AS hint, '["maska"]' AS accepted_answers_json
  UNION ALL SELECT 'Recital' AS word, '' AS symbol, 'Umjetnost' AS category, 'Srednje' AS difficulty, '["Izvodjenje","Publika","Stihovi","Scena"]' AS clues_json, 'Javni nastup posvecen kazivanju ili muzickom izvodjenju.' AS hint, '["recital"]' AS accepted_answers_json
  UNION ALL SELECT 'Arija' AS word, '' AS symbol, 'Umjetnost' AS category, 'Srednje' AS difficulty, '["Opera","Solo","Glas","Melodija"]' AS clues_json, 'Solisticka muzicka numera, posebno poznata iz opere.' AS hint, '["arija"]' AS accepted_answers_json
  UNION ALL SELECT 'Minimalizam' AS word, '' AS symbol, 'Umjetnost' AS category, 'Tesko' AS difficulty, '["Svedeno","Forma","Manje je vise","Cistoca"]' AS clues_json, 'Umjetnicki pristup koji svodi izraz na mali broj elemenata.' AS hint, '["minimalizam"]' AS accepted_answers_json
  UNION ALL SELECT 'Impresionizam' AS word, '' AS symbol, 'Umjetnost' AS category, 'Tesko' AS difficulty, '["Svjetlo","Potezi","Boje","Utisak"]' AS clues_json, 'Umjetnicki pravac koji naglasava trenutni vizuelni utisak.' AS hint, '["impresionizam"]' AS accepted_answers_json
  UNION ALL SELECT 'Mikroskop' AS word, '' AS symbol, 'Nauka' AS category, 'Lako' AS difficulty, '["Socivo","Uvecanje","Uzorak","Detalj"]' AS clues_json, 'Instrument za posmatranje veoma sitnih objekata.' AS hint, '["mikroskop"]' AS accepted_answers_json
  UNION ALL SELECT 'Orbita' AS word, '' AS symbol, 'Nauka' AS category, 'Lako' AS difficulty, '["Planeta","Kretanje","Krug","Svemir"]' AS clues_json, 'Putanja kojom se tijelo krece oko drugog tijela.' AS hint, '["orbita"]' AS accepted_answers_json
  UNION ALL SELECT 'Genetika' AS word, '' AS symbol, 'Nauka' AS category, 'Srednje' AS difficulty, '["Nasljedje","DNK","Osobine","Geni"]' AS clues_json, 'Oblast koja proucava nasljedne osobine zivih bica.' AS hint, '["genetika"]' AS accepted_answers_json
  UNION ALL SELECT 'Fosil' AS word, '' AS symbol, 'Nauka' AS category, 'Srednje' AS difficulty, '["Kamen","Ostatak","Proslost","Nalaz"]' AS clues_json, 'Ocuvani ostatak ili trag davnog zivog bica.' AS hint, '["fosil"]' AS accepted_answers_json
  UNION ALL SELECT 'Hormon' AS word, '' AS symbol, 'Nauka' AS category, 'Tesko' AS difficulty, '["Organizam","Signal","Zlijezda","Ravnoteza"]' AS clues_json, 'Hemijski glasnik koji regulise mnoge procese u tijelu.' AS hint, '["hormon"]' AS accepted_answers_json
) AS seed
LEFT JOIN association_words existing ON LOWER(existing.word) = LOWER(seed.word)
WHERE existing.id IS NULL;


INSERT INTO association_words (word, symbol, category, difficulty, clues_json, hint, accepted_answers_json)
SELECT seed.word, seed.symbol, seed.category, seed.difficulty, seed.clues_json, seed.hint, seed.accepted_answers_json
FROM (
  SELECT 'Meteorologija' AS word, '' AS symbol, 'Nauka' AS category, 'Tesko' AS difficulty, '["Vrijeme","Prognoza","Oblaci","Padavine"]' AS clues_json, 'Nauka koja proucava vrijeme i atmosferu.' AS hint, '["meteorologija"]' AS accepted_answers_json
  UNION ALL SELECT 'Tektonika' AS word, '' AS symbol, 'Nauka' AS category, 'Tesko' AS difficulty, '["Ploce","Zemljotres","Pomjeranje","Kora"]' AS clues_json, 'Proucavanje kretanja i sudara velikih djelova Zemljine kore.' AS hint, '["tektonika"]' AS accepted_answers_json
  UNION ALL SELECT 'Boks' AS word, '' AS symbol, 'Sport' AS category, 'Lako' AS difficulty, '["Rukavice","Ring","Udarac","Runda"]' AS clues_json, 'Borilacki sport u kojem se protivnici nadmecu udarcima rukama.' AS hint, '["boks"]' AS accepted_answers_json
  UNION ALL SELECT 'Kajak' AS word, '' AS symbol, 'Sport' AS category, 'Lako' AS difficulty, '["Veslo","Rijeka","Camac","Staza"]' AS clues_json, 'Usko plovilo kojim se upravlja veslom.' AS hint, '["kajak"]' AS accepted_answers_json
  UNION ALL SELECT 'Sudija' AS word, '' AS symbol, 'Sport' AS category, 'Srednje' AS difficulty, '["Pistaljka","Pravila","Odluka","Mec"]' AS clues_json, 'Osoba koja sprovodi pravila tokom sportskog takmicenja.' AS hint, '["sudija"]' AS accepted_answers_json
  UNION ALL SELECT 'Sprint' AS word, '' AS symbol, 'Sport' AS category, 'Srednje' AS difficulty, '["Brzina","Staza","Start","Finis"]' AS clues_json, 'Kratka i veoma brza trka.' AS hint, '["sprint"]' AS accepted_answers_json
  UNION ALL SELECT 'Jedrenje' AS word, '' AS symbol, 'Sport' AS category, 'Srednje' AS difficulty, '["Vjetar","Jedro","More","Kurs"]' AS clues_json, 'Kretanje plovilom uz pomoc vjetra i jedra.' AS hint, '["jedrenje"]' AS accepted_answers_json
  UNION ALL SELECT 'Kapiten' AS word, '' AS symbol, 'Sport' AS category, 'Tesko' AS difficulty, '["Tim","Vodja","Traka","Odgovornost"]' AS clues_json, 'Igrac koji predvodi tim na terenu ili u igri.' AS hint, '["kapiten"]' AS accepted_answers_json
  UNION ALL SELECT 'Turnir' AS word, '' AS symbol, 'Sport' AS category, 'Tesko' AS difficulty, '["Parovi","Runda","Pobjednik","Takmicenje"]' AS clues_json, 'Takmicenje sastavljeno od vise meceva ili rundi.' AS hint, '["turnir"]' AS accepted_answers_json
  UNION ALL SELECT 'Finale' AS word, '' AS symbol, 'Sport' AS category, 'Tesko' AS difficulty, '["Zavrsnica","Pehar","Pobjednik","Navijaci"]' AS clues_json, 'Poslednji i odlucujuci mec na takmicenju.' AS hint, '["finale"]' AS accepted_answers_json
  UNION ALL SELECT 'Dubler' AS word, '' AS symbol, 'Film' AS category, 'Lako' AS difficulty, '["Zamjena","Glumac","Akcija","Rizik"]' AS clues_json, 'Osoba koja umjesto glumca izvodi zahtjevne ili opasne scene.' AS hint, '["dubler"]' AS accepted_answers_json
  UNION ALL SELECT 'Sinopsis' AS word, '' AS symbol, 'Film' AS category, 'Srednje' AS difficulty, '["Prica","Kratak opis","Radnja","Pregled"]' AS clues_json, 'Sazet prikaz sadrzaja filmske price.' AS hint, '["sinopsis"]' AS accepted_answers_json
  UNION ALL SELECT 'Festival' AS word, '' AS symbol, 'Film' AS category, 'Srednje' AS difficulty, '["Projekcije","Nagrade","Publika","Grad"]' AS clues_json, 'Dogadjaj na kojem se prikazuju i vrednuju filmovi.' AS hint, '["festival"]' AS accepted_answers_json
  UNION ALL SELECT 'Animacija' AS word, '' AS symbol, 'Film' AS category, 'Tesko' AS difficulty, '["Crtanje","Pokret","Frejmovi","Iluzija"]' AS clues_json, 'Tehnika stvaranja utiska pokreta od niza slika.' AS hint, '["animacija"]' AS accepted_answers_json
  UNION ALL SELECT 'Rasvjeta' AS word, '' AS symbol, 'Film' AS category, 'Tesko' AS difficulty, '["Svjetlo","Set","Sjena","Atmosfera"]' AS clues_json, 'Organizovanje svjetla da bi scena izgledala kako treba.' AS hint, '["rasvjeta"]' AS accepted_answers_json
  UNION ALL SELECT 'Trilogija' AS word, '' AS symbol, 'Film' AS category, 'Tesko' AS difficulty, '["Tri dijela","Nastavak","Prica","Serijal"]' AS clues_json, 'Prica ispricana kroz tri medjusobno povezana djela.' AS hint, '["trilogija"]' AS accepted_answers_json
  UNION ALL SELECT 'Povelja' AS word, '' AS symbol, 'Istorija' AS category, 'Lako' AS difficulty, '["Dokument","Pravo","Potpis","Vladar"]' AS clues_json, 'Svecani pisani akt sa pravilima, pravima ili odlukama.' AS hint, '["povelja"]' AS accepted_answers_json
  UNION ALL SELECT 'Ustanak' AS word, '' AS symbol, 'Istorija' AS category, 'Lako' AS difficulty, '["Pobuna","Narod","Otpor","Promjena"]' AS clues_json, 'Organizovano dizanje protiv vlasti ili okupatora.' AS hint, '["ustanak"]' AS accepted_answers_json
  UNION ALL SELECT 'Arhiv' AS word, '' AS symbol, 'Istorija' AS category, 'Srednje' AS difficulty, '["Dokumenti","Cuvanje","Proslo","Zapisi"]' AS clues_json, 'Mjesto gdje se trajno cuvaju vazni istorijski i pravni zapisi.' AS hint, '["arhiv"]' AS accepted_answers_json
  UNION ALL SELECT 'Opsada' AS word, '' AS symbol, 'Istorija' AS category, 'Srednje' AS difficulty, '["Grad","Vojska","Zidine","Okruzenje"]' AS clues_json, 'Vojna taktika okruzivanja i iscrpljivanja protivnika.' AS hint, '["opsada"]' AS accepted_answers_json
  UNION ALL SELECT 'Bastina' AS word, '' AS symbol, 'Istorija' AS category, 'Srednje' AS difficulty, '["Nasljedje","Spomenici","Kultura","Proslo"]' AS clues_json, 'Vrijednosti i tragovi koje nam je ostavila proslost.' AS hint, '["bastina"]' AS accepted_answers_json
  UNION ALL SELECT 'Imperator' AS word, '' AS symbol, 'Istorija' AS category, 'Tesko' AS difficulty, '["Carstvo","Vladar","Kruna","Moc"]' AS clues_json, 'Vladar ogromne drzave ili carstva.' AS hint, '["imperator"]' AS accepted_answers_json
  UNION ALL SELECT 'Republika' AS word, '' AS symbol, 'Istorija' AS category, 'Tesko' AS difficulty, '["Drzava","Gradjani","Ustav","Vlast"]' AS clues_json, 'Oblik drzavnog uredjenja bez monarha na celu.' AS hint, '["republika"]' AS accepted_answers_json
  UNION ALL SELECT 'Hronicar' AS word, '' AS symbol, 'Istorija' AS category, 'Tesko' AS difficulty, '["Zapisi","Svjedok","Proslo","Doba"]' AS clues_json, 'Osoba koja biljezi vazne dogadjaje svog vremena.' AS hint, '["hronicar"]' AS accepted_answers_json
  UNION ALL SELECT 'Potok' AS word, '' AS symbol, 'Priroda' AS category, 'Lako' AS difficulty, '["Voda","Tok","Obala","Sapat"]' AS clues_json, 'Manji prirodni vodeni tok.' AS hint, '["potok"]' AS accepted_answers_json
  UNION ALL SELECT 'Duga' AS word, '' AS symbol, 'Priroda' AS category, 'Lako' AS difficulty, '["Boje","Kisa","Nebo","Luk"]' AS clues_json, 'Pojava raznobojnog luka na nebu poslije kise.' AS hint, '["duga"]' AS accepted_answers_json
  UNION ALL SELECT 'Sjeme' AS word, '' AS symbol, 'Priroda' AS category, 'Lako' AS difficulty, '["Biljka","Rast","Klica","Plod"]' AS clues_json, 'Pocetak novog biljnog zivota iz kojeg nicu biljke.' AS hint, '["sjeme"]' AS accepted_answers_json
  UNION ALL SELECT 'Munja' AS word, '' AS symbol, 'Priroda' AS category, 'Srednje' AS difficulty, '["Oluja","Bljesak","Elektricitet","Nebo"]' AS clues_json, 'Jak elektricni prasak u atmosferi tokom nevremena.' AS hint, '["munja"]' AS accepted_answers_json
  UNION ALL SELECT 'Pustinja' AS word, '' AS symbol, 'Priroda' AS category, 'Srednje' AS difficulty, '["Pijesak","Susa","Toplota","Dine"]' AS clues_json, 'Vrlo suvo podrucje sa malo padavina i biljnog svijeta.' AS hint, '["pustinja"]' AS accepted_answers_json
  UNION ALL SELECT 'Uvala' AS word, '' AS symbol, 'Priroda' AS category, 'Srednje' AS difficulty, '["Obala","More","Zakrivljenje","Mirna voda"]' AS clues_json, 'Dio obale koji se blago uvukao u kopno.' AS hint, '["uvala"]' AS accepted_answers_json
  UNION ALL SELECT 'Mahovina' AS word, '' AS symbol, 'Priroda' AS category, 'Tesko' AS difficulty, '["Vlaga","Kamen","Zeleno","Sjena"]' AS clues_json, 'Niska biljka koja raste na vlaznim i sjenovitim mjestima.' AS hint, '["mahovina"]' AS accepted_answers_json
  UNION ALL SELECT 'Plima' AS word, '' AS symbol, 'Priroda' AS category, 'Tesko' AS difficulty, '["More","Mjesec","Rast nivoa","Obala"]' AS clues_json, 'Periodican porast nivoa morske vode.' AS hint, '["plima"]' AS accepted_answers_json
  UNION ALL SELECT 'Atelje' AS word, '' AS symbol, 'Umjetnost' AS category, 'Lako' AS difficulty, '["Platno","Boje","Prostor","Umjetnik"]' AS clues_json, 'Radni prostor slikara, vajara ili drugog umjetnika.' AS hint, '["atelje"]' AS accepted_answers_json
  UNION ALL SELECT 'Sonata' AS word, '' AS symbol, 'Umjetnost' AS category, 'Srednje' AS difficulty, '["Klavir","Stavovi","Muzika","Kompozitor"]' AS clues_json, 'Muzicko djelo sa vise povezanih djelova.' AS hint, '["sonata"]' AS accepted_answers_json
  UNION ALL SELECT 'Mozaik' AS word, '' AS symbol, 'Umjetnost' AS category, 'Srednje' AS difficulty, '["Kockice","Slika","Zid","Sastavljanje"]' AS clues_json, 'Slika ili ukras sastavljen od mnogo malih djelova.' AS hint, '["mozaik"]' AS accepted_answers_json
  UNION ALL SELECT 'Dirigent' AS word, '' AS symbol, 'Umjetnost' AS category, 'Srednje' AS difficulty, '["Orkestar","Palica","Tempo","Vodjenje"]' AS clues_json, 'Osoba koja vodi muzicko izvodjenje ansambla.' AS hint, '["dirigent"]' AS accepted_answers_json
  UNION ALL SELECT 'Gravura' AS word, '' AS symbol, 'Umjetnost' AS category, 'Tesko' AS difficulty, '["Metal","Otisak","Rezbarenje","Grafika"]' AS clues_json, 'Likovni postupak i djelo nastalo urezivanjem i otiskom.' AS hint, '["gravura"]' AS accepted_answers_json
  UNION ALL SELECT 'Procesor' AS word, '' AS symbol, 'Tehnologija' AS category, 'Lako' AS difficulty, '["Cip","Racunanje","Jezgro","Brzina"]' AS clues_json, 'Glavna racunarska komponenta koja obradjuje instrukcije.' AS hint, '["procesor"]' AS accepted_answers_json
  UNION ALL SELECT 'Senzor' AS word, '' AS symbol, 'Tehnologija' AS category, 'Lako' AS difficulty, '["Mjerenje","Signal","Detekcija","Uredjaj"]' AS clues_json, 'Komponenta koja registruje promjenu i pretvara je u podatak.' AS hint, '["senzor"]' AS accepted_answers_json
  UNION ALL SELECT 'Aplikacija' AS word, '' AS symbol, 'Tehnologija' AS category, 'Srednje' AS difficulty, '["Telefon","Program","Interfejs","Koristenje"]' AS clues_json, 'Softver namijenjen odredjenom zadatku korisnika.' AS hint, '["aplikacija"]' AS accepted_answers_json
  UNION ALL SELECT 'Protokol' AS word, '' AS symbol, 'Tehnologija' AS category, 'Srednje' AS difficulty, '["Pravila","Mreza","Razmjena","Standard"]' AS clues_json, 'Skup pravila po kojima uredjaji komuniciraju.' AS hint, '["protokol"]' AS accepted_answers_json
  UNION ALL SELECT 'Bekap' AS word, '' AS symbol, 'Tehnologija' AS category, 'Srednje' AS difficulty, '["Kopija","Sigurnost","Obnova","Podaci"]' AS clues_json, 'Rezervna kopija vaznih podataka za slucaj problema.' AS hint, '["bekap"]' AS accepted_answers_json
  UNION ALL SELECT 'Kompajler' AS word, '' AS symbol, 'Tehnologija' AS category, 'Tesko' AS difficulty, '["Kod","Prevodjenje","Programski jezik","Izvrsavanje"]' AS clues_json, 'Program koji prevodi izvorni kod u oblik razumljiv racunaru.' AS hint, '["kompajler"]' AS accepted_answers_json
  UNION ALL SELECT 'Robotika' AS word, '' AS symbol, 'Tehnologija' AS category, 'Tesko' AS difficulty, '["Masina","Automatika","Kretanje","Senzori"]' AS clues_json, 'Oblast koja razvija i upravlja robotima.' AS hint, '["robotika"]' AS accepted_answers_json
  UNION ALL SELECT 'Satelit' AS word, '' AS symbol, 'Tehnologija' AS category, 'Tesko' AS difficulty, '["Orbita","Signal","Antena","Prenos"]' AS clues_json, 'Uredjaj u svemiru koji prenosi ili prikuplja podatke.' AS hint, '["satelit"]' AS accepted_answers_json
  UNION ALL SELECT 'Zaliv' AS word, '' AS symbol, 'Geografija' AS category, 'Lako' AS difficulty, '["More","Obala","Uvlacenje","Voda"]' AS clues_json, 'Dio mora ili okeana uvucen u kopno.' AS hint, '["zaliv"]' AS accepted_answers_json
  UNION ALL SELECT 'Fjord' AS word, '' AS symbol, 'Geografija' AS category, 'Lako' AS difficulty, '["More","Planine","Uski zaliv","Lednik"]' AS clues_json, 'Dubok i uzak morski zaliv sa strmim obalama.' AS hint, '["fjord"]' AS accepted_answers_json
  UNION ALL SELECT 'Ekvator' AS word, '' AS symbol, 'Geografija' AS category, 'Srednje' AS difficulty, '["Zemlja","Sirina","Toplota","Nulta linija"]' AS clues_json, 'Zamisljena linija koja dijeli Zemlju na dvije polulopte.' AS hint, '["ekvator"]' AS accepted_answers_json
  UNION ALL SELECT 'Meridian' AS word, '' AS symbol, 'Geografija' AS category, 'Srednje' AS difficulty, '["Duzina","Mapa","Linija","Vrijeme"]' AS clues_json, 'Zamisljena linija koja povezuje polove na globusu.' AS hint, '["meridian"]' AS accepted_answers_json
  UNION ALL SELECT 'Laguna' AS word, '' AS symbol, 'Geografija' AS category, 'Srednje' AS difficulty, '["Plicak","More","Obala","Mirna voda"]' AS clues_json, 'Plitka vodena povrsina odvojena od otvorenog mora.' AS hint, '["laguna"]' AS accepted_answers_json
  UNION ALL SELECT 'Klisura' AS word, '' AS symbol, 'Geografija' AS category, 'Tesko' AS difficulty, '["Rijeka","Usjek","Stijene","Dubina"]' AS clues_json, 'Uska i duboka dolina strmih strana.' AS hint, '["klisura"]' AS accepted_answers_json
  UNION ALL SELECT 'Kontinent' AS word, '' AS symbol, 'Geografija' AS category, 'Tesko' AS difficulty, '["Kopno","Velicina","Granice","Planeta"]' AS clues_json, 'Velika cjelina kopna na Zemlji.' AS hint, '["kontinent"]' AS accepted_answers_json
  UNION ALL SELECT 'Tjesnac' AS word, '' AS symbol, 'Geografija' AS category, 'Tesko' AS difficulty, '["More","Prolaz","Uski put","Obala"]' AS clues_json, 'Uski morski prolaz izmedju dva kopna.' AS hint, '["tjesnac"]' AS accepted_answers_json
) AS seed
LEFT JOIN association_words existing ON LOWER(existing.word) = LOWER(seed.word)
WHERE existing.id IS NULL;


INSERT INTO logic_challenges (mode, words_json, answer, hint, category, difficulty)
SELECT seed.mode, seed.words_json, seed.answer, seed.hint, seed.category, seed.difficulty
FROM (
  SELECT 'concept' AS mode, '["Teleskop","Planeta","Zvijezda"]' AS words_json, 'Astronomija' AS answer, 'Pomisli na nauku koja prouceva svemir.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Proton","Elektron","Neutron","Fjord"]' AS words_json, 'Fjord' AS answer, 'Tri pojma pripadaju atomu, jedan geografiji.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Masa","Pad","Privlacnost"]' AS words_json, 'Gravitacija' AS answer, 'Rijesenje je sila koja djeluje izmedju tijela.' AS hint, 'Nauka' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Gol","Lopta","Sudija"]' AS words_json, 'Fudbal' AS answer, 'Rijesenje je popularan ekipni sport.' AS hint, 'Sport' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Sprint","Maraton","Skok","Reziser"]' AS words_json, 'Reziser' AS answer, 'Tri pojma su sportske discipline.' AS hint, 'Sport' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Greda","Parter","Ravnoteza"]' AS words_json, 'Gimnastika' AS answer, 'Povezi pojmove sa jednim zahtjevnim sportom.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Glumac","Kadar","Scenarista"]' AS words_json, 'Film' AS answer, 'Povezi pojmove sa filmskom industrijom.' AS hint, 'Film' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Kamera","Montaza","Mikrofon","Glacijal"]' AS words_json, 'Glacijal' AS answer, 'Tri pojma pripadaju filmskoj produkciji.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Rez","Ritam","Postprodukcija"]' AS words_json, 'Montaza' AS answer, 'Rijesenje je dio filmskog procesa nakon snimanja.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Faraon","Nil","Piramida"]' AS words_json, 'Egipat' AS answer, 'Rijesenje je drevna civilizacija ili drzava.' AS hint, 'Istorija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Piramida","Koloseum","Akvadukt","Baterija"]' AS words_json, 'Baterija' AS answer, 'Tri pojma su istorijske gradjevine ili ostaci.' AS hint, 'Istorija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Pregovori","Ambasada","Sporazum"]' AS words_json, 'Diplomatija' AS answer, 'Rijesenje opisuje odnose izmedju drzava.' AS hint, 'Istorija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Rijeka","Jezero","More"]' AS words_json, 'Voda' AS answer, 'Sve pojmove povezuje ista prirodna supstanca.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Bor","Hrast","Jela","Tablet"]' AS words_json, 'Tablet' AS answer, 'Tri pojma su vrste drveca.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Lava","Krater","Erupcija"]' AS words_json, 'Vulkan' AS answer, 'Povezi pojmove sa jednom prirodnom pojavom.' AS hint, 'Priroda' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Dirigent","Orkestar","Stav"]' AS words_json, 'Simfonija' AS answer, 'Rijesenje je muzicko djelo za orkestar.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Violina","Klavir","Gitara","Satelit"]' AS words_json, 'Satelit' AS answer, 'Tri pojma su muzicki instrumenti.' AS hint, 'Umjetnost' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Dubina","Linije","Prostor"]' AS words_json, 'Perspektiva' AS answer, 'Rijesenje je likovni princip.' AS hint, 'Umjetnost' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Kod","Program","Aplikacija"]' AS words_json, 'Softver' AS answer, 'Povezi pojmove sa digitalnim proizvodom.' AS hint, 'Tehnologija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Procesor","Memorija","Ekran","Pjesma"]' AS words_json, 'Pjesma' AS answer, 'Tri pojma pripadaju tehnologiji ili racunaru.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Automatika","Senzor","Mašina"]' AS words_json, 'Robotika' AS answer, 'Rijesenje je tehnoloska oblast.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Država","Granica","Kontinent"]' AS words_json, 'Geografija' AS answer, 'Povezi pojmove sa naukom o prostoru Zemlje.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Atlas","Meridijan","Ekvator","Scenario"]' AS words_json, 'Scenario' AS answer, 'Tri pojma se vezuju za geografiju.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Greenwich","Koordinate","Polovi"]' AS words_json, 'Meridijan' AS answer, 'Rijesenje je geografski pojam za uzduzne linije.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Membrana","Jezgro","Tkivo"]' AS words_json, 'Ćelija' AS answer, 'Poveži pojmove sa osnovnom jedinicom života.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Kiseonik","Azot","Vodonik","Pozorište"]' AS words_json, 'Pozorište' AS answer, 'Tri pojma su hemijski elementi ili gasovi.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Palica","Predaja","Tim"]' AS words_json, 'Štafeta' AS answer, 'Rješenje je trkačka disciplina sa više takmičara.' AS hint, 'Sport' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Sedmerac","Golman","Dvorana"]' AS words_json, 'Rukomet' AS answer, 'Rješenje je ekipni sport koji se igra rukama.' AS hint, 'Sport' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Drama","Komedija","Horor"]' AS words_json, 'Žanr' AS answer, 'Sve riječi predstavljaju vrste istog umjetničkog pojma.' AS hint, 'Film' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Kamera","Reditelj","Kadar","Čempres"]' AS words_json, 'Čempres' AS answer, 'Tri pojma pripadaju filmu, jedan prirodi.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Slova","Azbuka","Pismo"]' AS words_json, 'Ćirilica' AS answer, 'Rješenje je jedno pismo.' AS hint, 'Istorija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Šuma","Pećina","Planina","Lozinka"]' AS words_json, 'Lozinka' AS answer, 'Tri pojma pripadaju prirodi.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Scena","Glumci","Publika"]' AS words_json, 'Pozorište' AS answer, 'Rješenje povezuje izvođenje predstava.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Tastatura","Procesor","Miš"]' AS words_json, 'Računar' AS answer, 'Rješenje je uređaj kojem svi pojmovi pripadaju.' AS hint, 'Tehnologija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Internet","Signal","Povezivanje"]' AS words_json, 'Mreža' AS answer, 'Rješenje označava povezan sistem uređaja.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Rijeka","More","Ulivanje"]' AS words_json, 'Ušće' AS answer, 'Rješenje je geografski pojam za završetak toka rijeke.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Jezgro","Elektron","Hemija"]' AS words_json, 'Atom' AS answer, 'Osnovna jedinica materije.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Zvijezde","Svemir","Orbita"]' AS words_json, 'Galaksija' AS answer, 'Ogromna grupa zvijezda i kosmickog materijala.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["42 kilometra","Izdrzljivost","Staza"]' AS words_json, 'Maraton' AS answer, 'Dugacka trkacka disciplina.' AS hint, 'Sport' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Snimanje","Objektiv","Scena"]' AS words_json, 'Kamera' AS answer, 'Uredjaj bez kojeg nema snimanja filma.' AS hint, 'Film' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Dijalog","Likovi","Zaplet"]' AS words_json, 'Scenario' AS answer, 'Pisani plan filma ili serije.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Egipat","Faraon","Pustinja"]' AS words_json, 'Piramida' AS answer, 'Gradjevina najpoznatija iz starog Egipta.' AS hint, 'Istorija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Leonardo","Humanizam","Firenca"]' AS words_json, 'Renesansa' AS answer, 'Istorijski period preporoda umjetnosti i nauke.' AS hint, 'Istorija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Dan","Toplota","Svjetlost"]' AS words_json, 'Sunce' AS answer, 'Nebesko tijelo koje nam daje svjetlost i toplotu.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Talas","So","Plaža"]' AS words_json, 'More' AS answer, 'Velika slana vodena povrsina.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Klesanje","Mermer","Figura"]' AS words_json, 'Skulptura' AS answer, 'Umjetnicko djelo oblikovano u prostoru.' AS hint, 'Umjetnost' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Mašina","Program","Senzor"]' AS words_json, 'Robot' AS answer, 'Pametna masina koja moze izvrsavati zadatke.' AS hint, 'Tehnologija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Koraci","Logika","Kod"]' AS words_json, 'Algoritam' AS answer, 'Niz tacno odredjenih koraka za rjesavanje problema.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Procesor","Elektronika","Ploca"]' AS words_json, 'Mikrocip' AS answer, 'Mala komponenta sa integrisanim kolima.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Karta","Kontinent","Stranica"]' AS words_json, 'Atlas' AS answer, 'Zbirka geografskih karata.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Ostrvo","Grupa","More"]' AS words_json, 'Arhipelag' AS answer, 'Skup vise ostrva na istom prostoru.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Disanje","Gas","Vazduh"]' AS words_json, 'Kiseonik' AS answer, 'Hemijski element neophodan za disanje.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Vizija","Set","Kamera"]' AS words_json, 'Režija' AS answer, 'Vođenje i oblikovanje filmskog djela.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Stijena","Mrak","Podzemlje"]' AS words_json, 'Pećina' AS answer, 'Prirodna šupljina u stijeni.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Drveće","Lišće","Staza"]' AS words_json, 'Šuma' AS answer, 'Veliko područje obraslo drvećem.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Kopno","More","Rt"]' AS words_json, 'Poluostrvo' AS answer, 'Kopno okruženo morem sa tri strane.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Mozak","Signal","Sinapsa"]' AS words_json, 'Neuron' AS answer, 'Specijalizovana nervna celija koja prenosi impulse.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Simbol","Jednacina","Hemija"]' AS words_json, 'Formula' AS answer, 'Zapis koji predstavlja odnos ili sastav.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Svemir","Uvecanje","Zvijezde"]' AS words_json, 'Teleskop' AS answer, 'Instrument za gledanje udaljenih nebeskih tijela.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Imunitet","Doza","Zastita"]' AS words_json, 'Vakcina' AS answer, 'Preparat koji podstice razvoj zastite organizma.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
) AS seed
LEFT JOIN logic_challenges existing
  ON existing.mode = seed.mode
 AND LOWER(existing.answer) = LOWER(seed.answer)
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
 AND (
      seed.mode <> 'odd-one-out'
      OR CAST(existing.words_json AS CHAR(1000)) = seed.words_json
    )
WHERE existing.id IS NULL;


INSERT INTO logic_challenges (mode, words_json, answer, hint, category, difficulty)
SELECT seed.mode, seed.words_json, seed.answer, seed.hint, seed.category, seed.difficulty
FROM (
  SELECT 'concept' AS mode, '["Materija","Mikro","Fizika"]' AS words_json, 'Cestica' AS answer, 'Vrlo mala jedinica materije.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Eksperiment","Oprema","Ispitivanje"]' AS words_json, 'Laboratorija' AS answer, 'Mjesto gdje se izvode naucna istrazivanja i testiranja.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Boje","Talasi","Svjetlost"]' AS words_json, 'Spektar' AS answer, 'Raspored komponenti neke pojave, posebno svjetlosti.' AS hint, 'Nauka' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Promjena","Vrsta","Vrijeme"]' AS words_json, 'Evolucija' AS answer, 'Postepeni razvoj zivih bica kroz vrijeme.' AS hint, 'Nauka' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Reakcija","Hemija","Ubrzanje"]' AS words_json, 'Katalizator' AS answer, 'Supstanca koja ubrzava hemijsku reakciju.' AS hint, 'Nauka' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Obruc","Dribling","Parket"]' AS words_json, 'Kosarka' AS answer, 'Sport u kojem se poeni osvajaju ubacivanjem lopte kroz obruc.' AS hint, 'Sport' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Bazen","Voda","Staza"]' AS words_json, 'Plivanje' AS answer, 'Sportska disciplina kretanja kroz vodu.' AS hint, 'Sport' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Tenis","Mreza","Loptica"]' AS words_json, 'Reket' AS answer, 'Sportski rekvizit za udaranje loptice.' AS hint, 'Sport' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Pehar","Finale","Pobjeda"]' AS words_json, 'Trofej' AS answer, 'Nagrada koja simbolizuje uspjeh na takmicenju.' AS hint, 'Sport' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Forma","Izdrzljivost","Trening"]' AS words_json, 'Kondicija' AS answer, 'Fizicka spremnost potrebna za dobar nastup.' AS hint, 'Sport' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Tribine","Publika","Teren"]' AS words_json, 'Stadion' AS answer, 'Veliki sportski objekat za utakmice i takmicenja.' AS hint, 'Sport' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Plivanje","Biciklizam","Trcanje"]' AS words_json, 'Triatlon' AS answer, 'Takmicenje koje spaja tri discipline.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Atletika","Disciplina","Poeni"]' AS words_json, 'Desetoboj' AS answer, 'Atletsko takmicenje sastavljeno od deset disciplina.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Jedrenje","Voda","Trka"]' AS words_json, 'Regata' AS answer, 'Takmicenje jedrilica ili drugih plovila.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Set","Vizija","Glumci"]' AS words_json, 'Reziser' AS answer, 'Osoba koja vodi kreativni proces nastanka filma.' AS hint, 'Film' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Najava","Kratko","Publika"]' AS words_json, 'Trejler' AS answer, 'Kratka najava filma namijenjena publici.' AS hint, 'Film' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Kadar","Glumci","Prizor"]' AS words_json, 'Scena' AS answer, 'Jedan zaokruzen dio filmske radnje.' AS hint, 'Film' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Lik","Odjeca","Scena"]' AS words_json, 'Kostim' AS answer, 'Odjevna kombinacija koja pomaze oblikovanju filmskog lika.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Ugao","Kompozicija","Kamera"]' AS words_json, 'Kadrovanje' AS answer, 'Nacin na koji je scena smjestena u kadar.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Crveni tepih","Publika","Prvo prikazivanje"]' AS words_json, 'Premijera' AS answer, 'Prvo javno prikazivanje filma.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Montaza","Zvuk","Efekti"]' AS words_json, 'Postprodukcija' AS answer, 'Faza nakon snimanja u kojoj se film zavrsava.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Cinjenice","Intervju","Naracija"]' AS words_json, 'Dokumentarac' AS answer, 'Filmska forma zasnovana na stvarnim dogadjajima ili temama.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Svjetlo","Pokret","Kadar"]' AS words_json, 'Kinematografija' AS answer, 'Umijece stvaranja slike u filmu.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Vladar","Granice","Narod"]' AS words_json, 'Carstvo' AS answer, 'Velika drzavna tvorevina pod jednom vlascu.' AS hint, 'Istorija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Vojska","Sukob","Polje"]' AS words_json, 'Bitka' AS answer, 'Oruzani sukob dvije ili vise vojski.' AS hint, 'Istorija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Proslo","Kamen","Sjecanje"]' AS words_json, 'Spomenik' AS answer, 'Obiljezje podignuto u cast necega iz proslosti.' AS hint, 'Istorija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Porodica","Prijesto","Nasljedje"]' AS words_json, 'Dinastija' AS answer, 'Niz vladara iz iste porodice.' AS hint, 'Istorija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Zapis","Godine","Dogadjaji"]' AS words_json, 'Hronika' AS answer, 'Redosljedni zapis vaznih dogadjaja.' AS hint, 'Istorija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Iskopavanje","Predmeti","Rusevine"]' AS words_json, 'Arheologija' AS answer, 'Nauka o materijalnim ostacima proslih vremena.' AS hint, 'Istorija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Promjena","Drustvo","Institucije"]' AS words_json, 'Reforma' AS answer, 'Velika promjena sistema ili pravila.' AS hint, 'Istorija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Naseljavanje","Osvajanje","More"]' AS words_json, 'Kolonizacija' AS answer, 'Proces osvajanja i naseljavanja novih teritorija.' AS hint, 'Istorija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Vrijeme","Redosljed","Datumi"]' AS words_json, 'Hronologija' AS answer, 'Poredak dogadjaja prema vremenu desavanja.' AS hint, 'Istorija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Oblak","Kap","Vrijeme"]' AS words_json, 'Kisa' AS answer, 'Voda koja pada iz oblaka.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Povjetarac","Smjer","Brzina"]' AS words_json, 'Vjetar' AS answer, 'Kretanje vazduha u atmosferi.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Voda","Obala","Mirno"]' AS words_json, 'Jezero' AS answer, 'Veca stajaca vodena povrsina na kopnu.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Vrh","Uspon","Visina"]' AS words_json, 'Planina' AS answer, 'Veliko uzvisenje sa izrazenim vrhovima.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Led","Hladnoca","Planina"]' AS words_json, 'Lednik' AS answer, 'Velika masa leda koja se sporo pomjera.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Rijeka","Usce","Nanosi"]' AS words_json, 'Delta' AS answer, 'Podrucje grananja rijeke pred usce.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Zivot","Planeta","Sloj"]' AS words_json, 'Biosfera' AS answer, 'Ukupan prostor Zemlje u kojem postoji zivot.' AS hint, 'Priroda' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Vazduh","Sloj","Planeta"]' AS words_json, 'Atmosfera' AS answer, 'Gasoviti omotac planete.' AS hint, 'Priroda' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Likovi","Poglavlje","Prica"]' AS words_json, 'Roman' AS answer, 'Duze prozno knjizevno djelo.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Zid","Boja","Crkva"]' AS words_json, 'Freska' AS answer, 'Slikarsko djelo izvedeno na svjezem malteru.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Izlozba","Slike","Posjetioci"]' AS words_json, 'Galerija' AS answer, 'Prostor za izlaganje umjetnickih djela.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Lice","Figura","Poza"]' AS words_json, 'Portret' AS answer, 'Umjetnicki prikaz necijeg lika.' AS hint, 'Umjetnost' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Pokret","Ples","Ritam"]' AS words_json, 'Koreografija' AS answer, 'Osmisljeni raspored plesnih pokreta.' AS hint, 'Umjetnost' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Pozornica","Likovi","Sukob"]' AS words_json, 'Drama' AS answer, 'Scensko ili knjizevno djelo zasnovano na radnji i konfliktu.' AS hint, 'Umjetnost' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Prostor","Objekti","Izlozba"]' AS words_json, 'Instalacija' AS answer, 'Savremeno umjetnicko djelo rasporedjeno u prostoru.' AS hint, 'Umjetnost' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Emocija","Pravac","Boja"]' AS words_json, 'Ekspresionizam' AS answer, 'Umjetnicki pravac naglasene ekspresije i unutrasnjeg dozivljaja.' AS hint, 'Umjetnost' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Raspored","Oblik","Balans"]' AS words_json, 'Kompozicija' AS answer, 'Nacin organizovanja elemenata u umjetnickom djelu.' AS hint, 'Umjetnost' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Prijava","Sigurnost","Nalog"]' AS words_json, 'Lozinka' AS answer, 'Tajni niz znakova za pristup sistemu.' AS hint, 'Tehnologija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Leti","Kamera","Daljinski"]' AS words_json, 'Dron' AS answer, 'Letjelica kojom se upravlja na daljinu.' AS hint, 'Tehnologija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Konekcija","Racunari","Internet"]' AS words_json, 'Mreza' AS answer, 'Povezan sistem uredjaja koji razmjenjuju podatke.' AS hint, 'Tehnologija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Host","Zahtjev","Podaci"]' AS words_json, 'Server' AS answer, 'Racunar ili servis koji odgovara na zahtjeve drugih uredjaja.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Ekran","Dugme","Navigacija"]' AS words_json, 'Interfejs' AS answer, 'Sloj preko kojeg korisnik komunicira sa aplikacijom.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Tabela","Upit","Cuvanje"]' AS words_json, 'Baza podataka' AS answer, 'Organizovan sistem za cuvanje i pretragu informacija.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Sigurnost","Kodiranje","Kljuc"]' AS words_json, 'Enkripcija' AS answer, 'Proces pretvaranja podataka u zasticen oblik.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Proces","Usteda vremena","Robot"]' AS words_json, 'Automatizacija' AS answer, 'Izvodjenje zadataka bez stalne ljudske intervencije.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Kontrola","Sistem","Povratna sprega"]' AS words_json, 'Kibernetika' AS answer, 'Oblast koja proucava upravljanje i komunikaciju u sistemima.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["More","Kopno","Obala"]' AS words_json, 'Ostrvo' AS answer, 'Kopno okruzeno vodom sa svih strana.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Rijeka","Stijene","Dubina"]' AS words_json, 'Kanjon' AS answer, 'Duboka i uska dolina strmih strana.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
) AS seed
LEFT JOIN logic_challenges existing
  ON existing.mode = seed.mode
 AND LOWER(existing.answer) = LOWER(seed.answer)
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
 AND (
      seed.mode <> 'odd-one-out'
      OR CAST(existing.words_json AS CHAR(1000)) = seed.words_json
    )
WHERE existing.id IS NULL;


INSERT INTO logic_challenges (mode, words_json, answer, hint, category, difficulty)
SELECT seed.mode, seed.words_json, seed.answer, seed.hint, seed.category, seed.difficulty
FROM (
  SELECT 'concept' AS mode, '["Nizija","Ravno","Polje"]' AS words_json, 'Ravnica' AS answer, 'Velika ravna povrsina na kopnu.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Drzava","Linija","Prelaz"]' AS words_json, 'Granica' AS answer, 'Linija koja razdvaja dvije teritorije.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Reljef","Visina","Teren"]' AS words_json, 'Topografija' AS answer, 'Opisivanje i prikazivanje oblika terena.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Mapa","Projekcija","Skala"]' AS words_json, 'Kartografija' AS answer, 'Nauka i vjestina izrade karata.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Drzave","Moc","Prostor"]' AS words_json, 'Geopolitika' AS answer, 'Proucavanje odnosa politike i geografskog prostora.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Drvo","Vitko","Mediteran"]' AS words_json, 'Čempres' AS answer, 'Visoko i usko drvo tamnozelenih grana.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Kartica","Senzor","Ulaz"]' AS words_json, 'Čitač' AS answer, 'Uređaj koji prepoznaje i očitava podatke.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Voda","Potok","Zvuk"]' AS words_json, 'Žubor' AS answer, 'Blag i neprekidan zvuk tekuće vode.' AS hint, 'Priroda' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Atomi","Veza","Hemija"]' AS words_json, 'Molekul' AS answer, 'Skup povezanih atoma koji grade supstancu.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Periodni sistem","Hemija","Simbol"]' AS words_json, 'Element' AS answer, 'Osnovna hemijska vrsta gradjena od iste vrste atoma.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["DNK","Nasljedje","Informacija"]' AS words_json, 'Genom' AS answer, 'Ukupan zapis genetske informacije jednog organizma.' AS hint, 'Nauka' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Mreza","Servis","Tim"]' AS words_json, 'Odbojka' AS answer, 'Ekipni sport u kojem se lopta prebacuje preko mreze.' AS hint, 'Sport' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Reket","Mreza","Servis"]' AS words_json, 'Tenis' AS answer, 'Sport sa reketom u kojem igraci prebacuju lopticu preko mreze.' AS hint, 'Sport' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Pak","Led","Palica"]' AS words_json, 'Hokej' AS answer, 'Brz ekipni sport koji se najcesce igra na ledu.' AS hint, 'Sport' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Plan","Protivnik","Strategija"]' AS words_json, 'Taktika' AS answer, 'Promisljen nacin igre kojim se dolazi do prednosti.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Raspored","Tim","Teren"]' AS words_json, 'Formacija' AS answer, 'Dogovoreni raspored igraca na terenu tokom meca.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Platno","Sala","Projekcija"]' AS words_json, 'Bioskop' AS answer, 'Mjesto gdje se filmovi javno prikazuju publici.' AS hint, 'Film' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Uloga","Izbor","Glumac"]' AS words_json, 'Audicija' AS answer, 'Proces biranja glumaca za odredjene uloge.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Kadar","Skica","Planiranje"]' AS words_json, 'Storyboard' AS answer, 'Vizuelni plan scena prije samog snimanja filma.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Dekor","Prostor","Set"]' AS words_json, 'Scenografija' AS answer, 'Oblikovanje prostora i vizuelnog okruzenja scene.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Zidine","Odbrana","Kula"]' AS words_json, 'Tvrdjava' AS answer, 'Utvrdjeno mjesto gradjeno radi zastite i odbrane.' AS hint, 'Istorija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Kruna","Vladar","Prijesto"]' AS words_json, 'Kraljevina' AS answer, 'Drzava ili oblast kojom upravlja kralj ili kraljica.' AS hint, 'Istorija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Odluka","Vladar","Naredba"]' AS words_json, 'Dekret' AS answer, 'Svecana ili zvanicna odluka izdata autoritetom vlasti.' AS hint, 'Istorija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Rijeka","Visina","Pad"]' AS words_json, 'Vodopad' AS answer, 'Mjesto gdje voda naglo pada preko stijena.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Trava","Cvijece","Ravno"]' AS words_json, 'Livada' AS answer, 'Otvoren travnati prostor bogat biljem i cvijecem.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Para","Vrela voda","Pritisak"]' AS words_json, 'Gejzir' AS answer, 'Izvor koji povremeno izbacuje vrelu vodu i paru.' AS hint, 'Priroda' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Ples","Pozornica","Pokret"]' AS words_json, 'Balet' AS answer, 'Scenska umjetnost zasnovana na preciznom plesnom izrazu.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Pouka","Zivotinje","Prica"]' AS words_json, 'Basna' AS answer, 'Kratka prica koja kroz alegoriju nosi pouku.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Zid","Boje","Velika slika"]' AS words_json, 'Mural' AS answer, 'Velika slika oslikana direktno na zidu ili fasadi.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Simbolika","Znacenje","Prica"]' AS words_json, 'Alegorija' AS answer, 'Umjetnicki postupak u kojem slika ili prica nosi dublje znacenje.' AS hint, 'Umjetnost' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Suprotnost","Svjetlo","Boja"]' AS words_json, 'Kontrast' AS answer, 'Likovni ili vizuelni odnos jakih razlika radi naglasavanja.' AS hint, 'Umjetnost' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Mis","Ekran","Pokazivac"]' AS words_json, 'Kursor' AS answer, 'Pokazivac kojim korisnik upravlja po ekranu.' AS hint, 'Tehnologija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Internet","Kartice","Adresa"]' AS words_json, 'Pretrazivac' AS answer, 'Program kojim se otvaraju i pretrazuju web stranice.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Server","Resursi","Okruzenje"]' AS words_json, 'Virtuelizacija' AS answer, 'Pokretanje vise logicnih sistema na istom fizickom hardveru.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Mjerenje","Senzori","Prenos"]' AS words_json, 'Telemetrija' AS answer, 'Daljinsko prikupljanje i slanje tehnickih podataka.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Obala","More","Izbocenje"]' AS words_json, 'Rt' AS answer, 'Istureni dio kopna koji zalazi u more ili jezero.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Zemlja","Model","Mapa"]' AS words_json, 'Globus' AS answer, 'Umanjeni sferni prikaz planete Zemlje.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Voda","Prolaz","Povezivanje"]' AS words_json, 'Kanal' AS answer, 'Vjestacki ili prirodni vodeni prolaz koji spaja povrsine.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Projekcija","Bioskop","Slika"]' AS words_json, 'Platno' AS answer, 'Velika povrsina na koju se prikazuje filmska slika.' AS hint, 'Film' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Tekst","Prevod","Dijalog"]' AS words_json, 'Titl' AS answer, 'Pisani prevod ili tekst koji prati govor u filmu.' AS hint, 'Film' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Budzet","Organizacija","Snimanje"]' AS words_json, 'Producent' AS answer, 'Osoba koja vodi produkciju i organizuje nastanak filma.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Uloga","Izbor","Glumci"]' AS words_json, 'Kasting' AS answer, 'Proces biranja glumaca za odredjene uloge u filmu.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Raspored","Scena","Pokret"]' AS words_json, 'Mizanscen' AS answer, 'Nacin na koji su likovi i elementi rasporedjeni unutar scene.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Granice","Gradjani","Mapa"]' AS words_json, 'Drzava' AS answer, 'Organizovana teritorijalna zajednica sa svojim granicama.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Voda","Talasi","Dubina"]' AS words_json, 'Okean' AS answer, 'Najveca slana vodena povrsina na Zemlji.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Temperatura","Padavine","Podneblje"]' AS words_json, 'Klima' AS answer, 'Dugorocan obrazac vremenskih prilika nekog podrucja.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Oblast","Podrucje","Mapa"]' AS words_json, 'Regija' AS answer, 'Sira oblast koja dijeli neke zajednicke osobine.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Duzina","Koordinate","Meridijan"]' AS words_json, 'Longituda' AS answer, 'Geografska duzina kojom se odredjuje polozaj istocno ili zapadno.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Reljef","Oblici tla","Teren"]' AS words_json, 'Geomorfologija' AS answer, 'Nauka o nastanku i oblicima Zemljine povrsine.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Oklop","Mac","Konj"]' AS words_json, 'Vitez' AS answer, 'Ratnik iz srednjovjekovnog doba vezan za plemstvo i cast.' AS hint, 'Istorija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Sporazum","Drzave","Potpis"]' AS words_json, 'Traktat' AS answer, 'Svecani medjudrzavni ili istorijski sporazum u pisanom obliku.' AS hint, 'Istorija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Ideje","Pokret","Program"]' AS words_json, 'Manifest' AS answer, 'Javna objava stavova, namjera ili programa nekog pokreta.' AS hint, 'Istorija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Privlacenje","Metal","Polje"]' AS words_json, 'Magnet' AS answer, 'Predmet koji privlaci odredjene metale pomocu magnetnog polja.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Staklo","Uzorak","Hemija"]' AS words_json, 'Epruveta' AS answer, 'Uska laboratorijska posuda za male kolicine supstance.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Objasnjenje","Dokaz","Model"]' AS words_json, 'Teorija' AS answer, 'Sistem ideja kojim se objasnjava neka pojava ili skup pojava.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Nered","Energija","Sistem"]' AS words_json, 'Entropija' AS answer, 'Mjera neuredjenosti ili rasipanja energije u sistemu.' AS hint, 'Nauka' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Voda","Pocetak toka","Stijena"]' AS words_json, 'Izvor' AS answer, 'Mjesto gdje voda prirodno izbija na povrsinu.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["More","Hrid","Kolonija"]' AS words_json, 'Koral' AS answer, 'Morski organizam koji gradi grebene i zivi u kolonijama.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Tlo","Voda","Trošenje"]' AS words_json, 'Erozija' AS answer, 'Postepeno trošenje i odnošenje zemljista ili stijena.' AS hint, 'Priroda' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Naslage","Cestice","Talozenje"]' AS words_json, 'Sediment' AS answer, 'Materijal koji se talozi na dnu vode ili tla.' AS hint, 'Priroda' AS category, 'Tesko' AS difficulty
) AS seed
LEFT JOIN logic_challenges existing
  ON existing.mode = seed.mode
 AND LOWER(existing.answer) = LOWER(seed.answer)
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
 AND (
      seed.mode <> 'odd-one-out'
      OR CAST(existing.words_json AS CHAR(1000)) = seed.words_json
    )
WHERE existing.id IS NULL;


INSERT INTO logic_challenges (mode, words_json, answer, hint, category, difficulty)
SELECT seed.mode, seed.words_json, seed.answer, seed.hint, seed.category, seed.difficulty
FROM (
  SELECT 'concept' AS mode, '["Vjezba","Priprema","Forma"]' AS words_json, 'Trening' AS answer, 'Plansko vjezbanje radi boljeg sportskog nastupa.' AS hint, 'Sport' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Napad","Pravila","Fudbal"]' AS words_json, 'Ofsajd' AS answer, 'Pravilo koje kaznjava nepravilno postavljanje napadaca.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Kazna","Sut","Gol"]' AS words_json, 'Penal' AS answer, 'Kazneni udarac dosudjen poslije odredjenog prekrsaja.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Energija","Punjenje","Uredjaj"]' AS words_json, 'Baterija' AS answer, 'Izvor elektricne energije za uredjaje.' AS hint, 'Tehnologija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Web","Adresa","Internet"]' AS words_json, 'Domen' AS answer, 'Tekstualna internet adresa koja vodi do sajta ili servisa.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Mreza","Signal","Internet"]' AS words_json, 'Ruter' AS answer, 'Uredjaj koji usmjerava internet saobracaj izmedju mreza.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Kasnjenje","Mreza","Odgovor"]' AS words_json, 'Latencija' AS answer, 'Vrijeme potrebno da odgovor ili podatak stigne od izvora do cilja.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Kadrovi","Crtez","Oblacic"]' AS words_json, 'Strip' AS answer, 'Prica ispricana nizom crteza i kratkog teksta.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Lice","Pozornica","Lik"]' AS words_json, 'Maska' AS answer, 'Predmet koji prekriva lice radi uloge ili umjetnickog izraza.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Izvodjenje","Publika","Stihovi"]' AS words_json, 'Recital' AS answer, 'Javni nastup posvecen kazivanju ili muzickom izvodjenju.' AS hint, 'Umjetnost' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Opera","Solo","Glas"]' AS words_json, 'Arija' AS answer, 'Solisticka muzicka numera, posebno poznata iz opere.' AS hint, 'Umjetnost' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Svedeno","Forma","Manje je vise"]' AS words_json, 'Minimalizam' AS answer, 'Umjetnicki pristup koji svodi izraz na mali broj elemenata.' AS hint, 'Umjetnost' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Svjetlo","Potezi","Boje"]' AS words_json, 'Impresionizam' AS answer, 'Umjetnicki pravac koji naglasava trenutni vizuelni utisak.' AS hint, 'Umjetnost' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Socivo","Uvecanje","Uzorak"]' AS words_json, 'Mikroskop' AS answer, 'Instrument za posmatranje veoma sitnih objekata.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Planeta","Kretanje","Krug"]' AS words_json, 'Orbita' AS answer, 'Putanja kojom se tijelo krece oko drugog tijela.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Nasljedje","DNK","Osobine"]' AS words_json, 'Genetika' AS answer, 'Oblast koja proucava nasljedne osobine zivih bica.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Kamen","Ostatak","Proslost"]' AS words_json, 'Fosil' AS answer, 'Ocuvani ostatak ili trag davnog zivog bica.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Organizam","Signal","Zlijezda"]' AS words_json, 'Hormon' AS answer, 'Hemijski glasnik koji regulise mnoge procese u tijelu.' AS hint, 'Nauka' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Vrijeme","Prognoza","Oblaci"]' AS words_json, 'Meteorologija' AS answer, 'Nauka koja proucava vrijeme i atmosferu.' AS hint, 'Nauka' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Ploce","Zemljotres","Pomjeranje"]' AS words_json, 'Tektonika' AS answer, 'Proucavanje kretanja i sudara velikih djelova Zemljine kore.' AS hint, 'Nauka' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Rukavice","Ring","Udarac"]' AS words_json, 'Boks' AS answer, 'Borilacki sport u kojem se protivnici nadmecu udarcima rukama.' AS hint, 'Sport' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Veslo","Rijeka","Camac"]' AS words_json, 'Kajak' AS answer, 'Usko plovilo kojim se upravlja veslom.' AS hint, 'Sport' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Pistaljka","Pravila","Odluka"]' AS words_json, 'Sudija' AS answer, 'Osoba koja sprovodi pravila tokom sportskog takmicenja.' AS hint, 'Sport' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Brzina","Staza","Start"]' AS words_json, 'Sprint' AS answer, 'Kratka i veoma brza trka.' AS hint, 'Sport' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Vjetar","Jedro","More"]' AS words_json, 'Jedrenje' AS answer, 'Kretanje plovilom uz pomoc vjetra i jedra.' AS hint, 'Sport' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Tim","Vodja","Traka"]' AS words_json, 'Kapiten' AS answer, 'Igrac koji predvodi tim na terenu ili u igri.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Parovi","Runda","Pobjednik"]' AS words_json, 'Turnir' AS answer, 'Takmicenje sastavljeno od vise meceva ili rundi.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Zavrsnica","Pehar","Pobjednik"]' AS words_json, 'Finale' AS answer, 'Poslednji i odlucujuci mec na takmicenju.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Zamjena","Glumac","Akcija"]' AS words_json, 'Dubler' AS answer, 'Osoba koja umjesto glumca izvodi zahtjevne ili opasne scene.' AS hint, 'Film' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Prica","Kratak opis","Radnja"]' AS words_json, 'Sinopsis' AS answer, 'Sazet prikaz sadrzaja filmske price.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Projekcije","Nagrade","Publika"]' AS words_json, 'Festival' AS answer, 'Dogadjaj na kojem se prikazuju i vrednuju filmovi.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Crtanje","Pokret","Frejmovi"]' AS words_json, 'Animacija' AS answer, 'Tehnika stvaranja utiska pokreta od niza slika.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Svjetlo","Set","Sjena"]' AS words_json, 'Rasvjeta' AS answer, 'Organizovanje svjetla da bi scena izgledala kako treba.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Tri dijela","Nastavak","Prica"]' AS words_json, 'Trilogija' AS answer, 'Prica ispricana kroz tri medjusobno povezana djela.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Dokument","Pravo","Potpis"]' AS words_json, 'Povelja' AS answer, 'Svecani pisani akt sa pravilima, pravima ili odlukama.' AS hint, 'Istorija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Pobuna","Narod","Otpor"]' AS words_json, 'Ustanak' AS answer, 'Organizovano dizanje protiv vlasti ili okupatora.' AS hint, 'Istorija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Dokumenti","Cuvanje","Proslo"]' AS words_json, 'Arhiv' AS answer, 'Mjesto gdje se trajno cuvaju vazni istorijski i pravni zapisi.' AS hint, 'Istorija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Grad","Vojska","Zidine"]' AS words_json, 'Opsada' AS answer, 'Vojna taktika okruzivanja i iscrpljivanja protivnika.' AS hint, 'Istorija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Nasljedje","Spomenici","Kultura"]' AS words_json, 'Bastina' AS answer, 'Vrijednosti i tragovi koje nam je ostavila proslost.' AS hint, 'Istorija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Carstvo","Vladar","Kruna"]' AS words_json, 'Imperator' AS answer, 'Vladar ogromne drzave ili carstva.' AS hint, 'Istorija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Drzava","Gradjani","Ustav"]' AS words_json, 'Republika' AS answer, 'Oblik drzavnog uredjenja bez monarha na celu.' AS hint, 'Istorija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Zapisi","Svjedok","Proslo"]' AS words_json, 'Hronicar' AS answer, 'Osoba koja biljezi vazne dogadjaje svog vremena.' AS hint, 'Istorija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Voda","Tok","Obala"]' AS words_json, 'Potok' AS answer, 'Manji prirodni vodeni tok.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Boje","Kisa","Nebo"]' AS words_json, 'Duga' AS answer, 'Pojava raznobojnog luka na nebu poslije kise.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Biljka","Rast","Klica"]' AS words_json, 'Sjeme' AS answer, 'Pocetak novog biljnog zivota iz kojeg nicu biljke.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Oluja","Bljesak","Elektricitet"]' AS words_json, 'Munja' AS answer, 'Jak elektricni prasak u atmosferi tokom nevremena.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Pijesak","Susa","Toplota"]' AS words_json, 'Pustinja' AS answer, 'Vrlo suvo podrucje sa malo padavina i biljnog svijeta.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Obala","More","Zakrivljenje"]' AS words_json, 'Uvala' AS answer, 'Dio obale koji se blago uvukao u kopno.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Vlaga","Kamen","Zeleno"]' AS words_json, 'Mahovina' AS answer, 'Niska biljka koja raste na vlaznim i sjenovitim mjestima.' AS hint, 'Priroda' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["More","Mjesec","Rast nivoa"]' AS words_json, 'Plima' AS answer, 'Periodican porast nivoa morske vode.' AS hint, 'Priroda' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Platno","Boje","Prostor"]' AS words_json, 'Atelje' AS answer, 'Radni prostor slikara, vajara ili drugog umjetnika.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Klavir","Stavovi","Muzika"]' AS words_json, 'Sonata' AS answer, 'Muzicko djelo sa vise povezanih djelova.' AS hint, 'Umjetnost' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Kockice","Slika","Zid"]' AS words_json, 'Mozaik' AS answer, 'Slika ili ukras sastavljen od mnogo malih djelova.' AS hint, 'Umjetnost' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Orkestar","Palica","Tempo"]' AS words_json, 'Dirigent' AS answer, 'Osoba koja vodi muzicko izvodjenje ansambla.' AS hint, 'Umjetnost' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Metal","Otisak","Rezbarenje"]' AS words_json, 'Gravura' AS answer, 'Likovni postupak i djelo nastalo urezivanjem i otiskom.' AS hint, 'Umjetnost' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Cip","Racunanje","Jezgro"]' AS words_json, 'Procesor' AS answer, 'Glavna racunarska komponenta koja obradjuje instrukcije.' AS hint, 'Tehnologija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Mjerenje","Signal","Detekcija"]' AS words_json, 'Senzor' AS answer, 'Komponenta koja registruje promjenu i pretvara je u podatak.' AS hint, 'Tehnologija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Telefon","Program","Interfejs"]' AS words_json, 'Aplikacija' AS answer, 'Softver namijenjen odredjenom zadatku korisnika.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Pravila","Mreza","Razmjena"]' AS words_json, 'Protokol' AS answer, 'Skup pravila po kojima uredjaji komuniciraju.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Kopija","Sigurnost","Obnova"]' AS words_json, 'Bekap' AS answer, 'Rezervna kopija vaznih podataka za slucaj problema.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
) AS seed
LEFT JOIN logic_challenges existing
  ON existing.mode = seed.mode
 AND LOWER(existing.answer) = LOWER(seed.answer)
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
 AND (
      seed.mode <> 'odd-one-out'
      OR CAST(existing.words_json AS CHAR(1000)) = seed.words_json
    )
WHERE existing.id IS NULL;


INSERT INTO logic_challenges (mode, words_json, answer, hint, category, difficulty)
SELECT seed.mode, seed.words_json, seed.answer, seed.hint, seed.category, seed.difficulty
FROM (
  SELECT 'concept' AS mode, '["Kod","Prevodjenje","Programski jezik"]' AS words_json, 'Kompajler' AS answer, 'Program koji prevodi izvorni kod u oblik razumljiv racunaru.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Orbita","Signal","Antena"]' AS words_json, 'Satelit' AS answer, 'Uredjaj u svemiru koji prenosi ili prikuplja podatke.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["More","Obala","Uvlacenje"]' AS words_json, 'Zaliv' AS answer, 'Dio mora ili okeana uvucen u kopno.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["More","Planine","Uski zaliv"]' AS words_json, 'Fjord' AS answer, 'Dubok i uzak morski zaliv sa strmim obalama.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Zemlja","Sirina","Toplota"]' AS words_json, 'Ekvator' AS answer, 'Zamisljena linija koja dijeli Zemlju na dvije polulopte.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Duzina","Mapa","Linija"]' AS words_json, 'Meridian' AS answer, 'Zamisljena linija koja povezuje polove na globusu.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Plicak","More","Obala"]' AS words_json, 'Laguna' AS answer, 'Plitka vodena povrsina odvojena od otvorenog mora.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Rijeka","Usjek","Stijene"]' AS words_json, 'Klisura' AS answer, 'Uska i duboka dolina strmih strana.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Kopno","Velicina","Granice"]' AS words_json, 'Kontinent' AS answer, 'Velika cjelina kopna na Zemlji.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["More","Prolaz","Uski put"]' AS words_json, 'Tjesnac' AS answer, 'Uski morski prolaz izmedju dva kopna.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Jezgro","Elektron","Hemija","Fudbal"]' AS words_json, 'Fudbal' AS answer, 'Tri pojma vode ka "Atom", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Zvijezde","Svemir","Orbita","Maraton"]' AS words_json, 'Maraton' AS answer, 'Tri pojma vode ka "Galaksija", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Pad","Privlacnost","Masa","Gimnastika"]' AS words_json, 'Gimnastika' AS answer, 'Tri pojma vode ka "Gravitacija", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Gol","Lopta","Stadion","Kamera"]' AS words_json, 'Kamera' AS answer, 'Tri pojma vode ka "Fudbal", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["42 kilometra","Izdrzljivost","Staza","Scenario"]' AS words_json, 'Scenario' AS answer, 'Tri pojma vode ka "Maraton", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Greda","Parter","Salto","Montaza"]' AS words_json, 'Montaza' AS answer, 'Tri pojma vode ka "Gimnastika", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Snimanje","Objektiv","Scena","Piramida"]' AS words_json, 'Piramida' AS answer, 'Tri pojma vode ka "Kamera", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Dijalog","Likovi","Zaplet","Renesansa"]' AS words_json, 'Renesansa' AS answer, 'Tri pojma vode ka "Scenario", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Rez","Ritam","Postprodukcija","Diplomatija"]' AS words_json, 'Diplomatija' AS answer, 'Tri pojma vode ka "Montaza", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Egipat","Faraon","Pustinja","Sunce"]' AS words_json, 'Sunce' AS answer, 'Tri pojma vode ka "Piramida", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Leonardo","Humanizam","Firenca","More"]' AS words_json, 'More' AS answer, 'Tri pojma vode ka "Renesansa", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Pregovori","Ambasada","Sporazum","Vulkan"]' AS words_json, 'Vulkan' AS answer, 'Tri pojma vode ka "Diplomatija", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Dan","Toplota","Svjetlost","Simfonija"]' AS words_json, 'Simfonija' AS answer, 'Tri pojma vode ka "Sunce", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Talas","So","Plaža","Skulptura"]' AS words_json, 'Skulptura' AS answer, 'Tri pojma vode ka "More", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Lava","Krater","Erupcija","Perspektiva"]' AS words_json, 'Perspektiva' AS answer, 'Tri pojma vode ka "Vulkan", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Orkestar","Dirigent","Stav","Robot"]' AS words_json, 'Robot' AS answer, 'Tri pojma vode ka "Simfonija", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Klesanje","Mermer","Figura","Algoritam"]' AS words_json, 'Algoritam' AS answer, 'Tri pojma vode ka "Skulptura", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Dubina","Linije","Prostor","Mikrocip"]' AS words_json, 'Mikrocip' AS answer, 'Tri pojma vode ka "Perspektiva", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Mašina","Program","Senzor","Atlas"]' AS words_json, 'Atlas' AS answer, 'Tri pojma vode ka "Robot", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Koraci","Logika","Kod","Arhipelag"]' AS words_json, 'Arhipelag' AS answer, 'Tri pojma vode ka "Algoritam", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Procesor","Elektronika","Ploca","Meridijan"]' AS words_json, 'Meridijan' AS answer, 'Tri pojma vode ka "Mikrocip", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Karta","Kontinent","Stranica","Ćelija"]' AS words_json, 'Ćelija' AS answer, 'Tri pojma vode ka "Atlas", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Ostrvo","Grupa","More","Rukomet"]' AS words_json, 'Rukomet' AS answer, 'Tri pojma vode ka "Arhipelag", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Greenwich","Koordinate","Polovi","Rukomet"]' AS words_json, 'Rukomet' AS answer, 'Tri pojma vode ka "Meridijan", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Membrana","Jezgro","Tkivo","Režija"]' AS words_json, 'Režija' AS answer, 'Tri pojma vode ka "Ćelija", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Disanje","Gas","Vazduh","Ćirilica"]' AS words_json, 'Ćirilica' AS answer, 'Tri pojma vode ka "Kiseonik", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Gol","Dvorana","Sedmerac","Pećina"]' AS words_json, 'Pećina' AS answer, 'Tri pojma vode ka "Rukomet", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Tim","Palica","Predaja","Šuma"]' AS words_json, 'Šuma' AS answer, 'Tri pojma vode ka "Štafeta", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Drama","Komedija","Horor","Pozorište"]' AS words_json, 'Pozorište' AS answer, 'Tri pojma vode ka "Žanr", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Vizija","Set","Kamera","Računar"]' AS words_json, 'Računar' AS answer, 'Tri pojma vode ka "Režija", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Slova","Pismo","Azbuka","Računar"]' AS words_json, 'Računar' AS answer, 'Tri pojma vode ka "Ćirilica", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Stijena","Mrak","Podzemlje","Ušće"]' AS words_json, 'Ušće' AS answer, 'Tri pojma vode ka "Pećina", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Drveće","Lišće","Staza","Poluostrvo"]' AS words_json, 'Poluostrvo' AS answer, 'Tri pojma vode ka "Šuma", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Scena","Glumci","Publika","Poluostrvo"]' AS words_json, 'Poluostrvo' AS answer, 'Tri pojma vode ka "Pozorište", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Tastatura","Ekran","Procesor","Formula"]' AS words_json, 'Formula' AS answer, 'Tri pojma vode ka "Računar", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Internet","Signal","Povezivanje","Teleskop"]' AS words_json, 'Teleskop' AS answer, 'Tri pojma vode ka "Mreža", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Rijeka","More","Ulivanje","Cestica"]' AS words_json, 'Cestica' AS answer, 'Tri pojma vode ka "Ušće", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Kopno","More","Rt","Laboratorija"]' AS words_json, 'Laboratorija' AS answer, 'Tri pojma vode ka "Poluostrvo", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Mozak","Signal","Sinapsa","Stadion"]' AS words_json, 'Stadion' AS answer, 'Tri pojma vode ka "Neuron", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Simbol","Jednacina","Hemija","Triatlon"]' AS words_json, 'Triatlon' AS answer, 'Tri pojma vode ka "Formula", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Svemir","Uvecanje","Zvijezde","Desetoboj"]' AS words_json, 'Desetoboj' AS answer, 'Tri pojma vode ka "Teleskop", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Imunitet","Doza","Zastita","Regata"]' AS words_json, 'Regata' AS answer, 'Tri pojma vode ka "Vakcina", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Materija","Mikro","Fizika","Reziser"]' AS words_json, 'Reziser' AS answer, 'Tri pojma vode ka "Cestica", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Eksperiment","Oprema","Ispitivanje","Trejler"]' AS words_json, 'Trejler' AS answer, 'Tri pojma vode ka "Laboratorija", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Boje","Talasi","Svjetlost","Scena"]' AS words_json, 'Scena' AS answer, 'Tri pojma vode ka "Spektar", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Promjena","Vrsta","Vrijeme","Kostim"]' AS words_json, 'Kostim' AS answer, 'Tri pojma vode ka "Evolucija", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Reakcija","Hemija","Ubrzanje","Kadrovanje"]' AS words_json, 'Kadrovanje' AS answer, 'Tri pojma vode ka "Katalizator", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Obruc","Dribling","Parket","Premijera"]' AS words_json, 'Premijera' AS answer, 'Tri pojma vode ka "Kosarka", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Bazen","Voda","Staza","Postprodukcija"]' AS words_json, 'Postprodukcija' AS answer, 'Tri pojma vode ka "Plivanje", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Tenis","Mreza","Loptica","Dokumentarac"]' AS words_json, 'Dokumentarac' AS answer, 'Tri pojma vode ka "Reket", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Lako' AS difficulty
) AS seed
LEFT JOIN logic_challenges existing
  ON existing.mode = seed.mode
 AND LOWER(existing.answer) = LOWER(seed.answer)
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
 AND (
      seed.mode <> 'odd-one-out'
      OR CAST(existing.words_json AS CHAR(1000)) = seed.words_json
    )
WHERE existing.id IS NULL;


INSERT INTO logic_challenges (mode, words_json, answer, hint, category, difficulty)
SELECT seed.mode, seed.words_json, seed.answer, seed.hint, seed.category, seed.difficulty
FROM (
  SELECT 'odd-one-out' AS mode, '["Pehar","Finale","Pobjeda","Kinematografija"]' AS words_json, 'Kinematografija' AS answer, 'Tri pojma vode ka "Trofej", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Forma","Izdrzljivost","Trening","Carstvo"]' AS words_json, 'Carstvo' AS answer, 'Tri pojma vode ka "Kondicija", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Tribine","Publika","Teren","Bitka"]' AS words_json, 'Bitka' AS answer, 'Tri pojma vode ka "Stadion", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Plivanje","Biciklizam","Trcanje","Spomenik"]' AS words_json, 'Spomenik' AS answer, 'Tri pojma vode ka "Triatlon", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Atletika","Disciplina","Poeni","Dinastija"]' AS words_json, 'Dinastija' AS answer, 'Tri pojma vode ka "Desetoboj", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Jedrenje","Voda","Trka","Hronika"]' AS words_json, 'Hronika' AS answer, 'Tri pojma vode ka "Regata", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Set","Vizija","Glumci","Arheologija"]' AS words_json, 'Arheologija' AS answer, 'Tri pojma vode ka "Reziser", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Najava","Kratko","Publika","Reforma"]' AS words_json, 'Reforma' AS answer, 'Tri pojma vode ka "Trejler", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Kadar","Glumci","Prizor","Kolonizacija"]' AS words_json, 'Kolonizacija' AS answer, 'Tri pojma vode ka "Scena", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Lik","Odjeca","Scena","Hronologija"]' AS words_json, 'Hronologija' AS answer, 'Tri pojma vode ka "Kostim", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Ugao","Kompozicija","Kamera","Kisa"]' AS words_json, 'Kisa' AS answer, 'Tri pojma vode ka "Kadrovanje", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Crveni tepih","Publika","Prvo prikazivanje","Vjetar"]' AS words_json, 'Vjetar' AS answer, 'Tri pojma vode ka "Premijera", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Montaza","Zvuk","Efekti","Jezero"]' AS words_json, 'Jezero' AS answer, 'Tri pojma vode ka "Postprodukcija", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Cinjenice","Intervju","Naracija","Planina"]' AS words_json, 'Planina' AS answer, 'Tri pojma vode ka "Dokumentarac", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Svjetlo","Pokret","Kadar","Lednik"]' AS words_json, 'Lednik' AS answer, 'Tri pojma vode ka "Kinematografija", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Vladar","Granice","Narod","Lednik"]' AS words_json, 'Lednik' AS answer, 'Tri pojma vode ka "Carstvo", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Vojska","Sukob","Polje","Delta"]' AS words_json, 'Delta' AS answer, 'Tri pojma vode ka "Bitka", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Proslo","Kamen","Sjecanje","Biosfera"]' AS words_json, 'Biosfera' AS answer, 'Tri pojma vode ka "Spomenik", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Porodica","Prijesto","Nasljedje","Atmosfera"]' AS words_json, 'Atmosfera' AS answer, 'Tri pojma vode ka "Dinastija", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Zapis","Godine","Dogadjaji","Roman"]' AS words_json, 'Roman' AS answer, 'Tri pojma vode ka "Hronika", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Iskopavanje","Predmeti","Rusevine","Freska"]' AS words_json, 'Freska' AS answer, 'Tri pojma vode ka "Arheologija", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Promjena","Drustvo","Institucije","Galerija"]' AS words_json, 'Galerija' AS answer, 'Tri pojma vode ka "Reforma", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Naseljavanje","Osvajanje","More","Koreografija"]' AS words_json, 'Koreografija' AS answer, 'Tri pojma vode ka "Kolonizacija", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Vrijeme","Redosljed","Datumi","Koreografija"]' AS words_json, 'Koreografija' AS answer, 'Tri pojma vode ka "Hronologija", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Oblak","Kap","Vrijeme","Drama"]' AS words_json, 'Drama' AS answer, 'Tri pojma vode ka "Kisa", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Povjetarac","Smjer","Brzina","Instalacija"]' AS words_json, 'Instalacija' AS answer, 'Tri pojma vode ka "Vjetar", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Voda","Obala","Mirno","Ekspresionizam"]' AS words_json, 'Ekspresionizam' AS answer, 'Tri pojma vode ka "Jezero", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Vrh","Uspon","Visina","Kompozicija"]' AS words_json, 'Kompozicija' AS answer, 'Tri pojma vode ka "Planina", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Led","Hladnoca","Planina","Lozinka"]' AS words_json, 'Lozinka' AS answer, 'Tri pojma vode ka "Lednik", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Rijeka","Usce","Nanosi","Dron"]' AS words_json, 'Dron' AS answer, 'Tri pojma vode ka "Delta", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Zivot","Planeta","Sloj","Mreza"]' AS words_json, 'Mreza' AS answer, 'Tri pojma vode ka "Biosfera", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Vazduh","Sloj","Planeta","Server"]' AS words_json, 'Server' AS answer, 'Tri pojma vode ka "Atmosfera", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Likovi","Poglavlje","Prica","Interfejs"]' AS words_json, 'Interfejs' AS answer, 'Tri pojma vode ka "Roman", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Zid","Boja","Crkva","Baza podataka"]' AS words_json, 'Baza podataka' AS answer, 'Tri pojma vode ka "Freska", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Izlozba","Slike","Posjetioci","Enkripcija"]' AS words_json, 'Enkripcija' AS answer, 'Tri pojma vode ka "Galerija", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Lice","Figura","Poza","Automatizacija"]' AS words_json, 'Automatizacija' AS answer, 'Tri pojma vode ka "Portret", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Pokret","Ples","Ritam","Ostrvo"]' AS words_json, 'Ostrvo' AS answer, 'Tri pojma vode ka "Koreografija", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Pozornica","Likovi","Sukob","Ostrvo"]' AS words_json, 'Ostrvo' AS answer, 'Tri pojma vode ka "Drama", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Prostor","Objekti","Izlozba","Kanjon"]' AS words_json, 'Kanjon' AS answer, 'Tri pojma vode ka "Instalacija", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Emocija","Pravac","Boja","Ravnica"]' AS words_json, 'Ravnica' AS answer, 'Tri pojma vode ka "Ekspresionizam", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Raspored","Oblik","Balans","Granica"]' AS words_json, 'Granica' AS answer, 'Tri pojma vode ka "Kompozicija", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Prijava","Sigurnost","Nalog","Kartografija"]' AS words_json, 'Kartografija' AS answer, 'Tri pojma vode ka "Lozinka", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Leti","Kamera","Daljinski","Čempres"]' AS words_json, 'Čempres' AS answer, 'Tri pojma vode ka "Dron", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Konekcija","Racunari","Internet","Čempres"]' AS words_json, 'Čempres' AS answer, 'Tri pojma vode ka "Mreza", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Host","Zahtjev","Podaci","Žubor"]' AS words_json, 'Žubor' AS answer, 'Tri pojma vode ka "Server", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Ekran","Dugme","Navigacija","Molekul"]' AS words_json, 'Molekul' AS answer, 'Tri pojma vode ka "Interfejs", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Tabela","Upit","Cuvanje","Element"]' AS words_json, 'Element' AS answer, 'Tri pojma vode ka "Baza podataka", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Sigurnost","Kodiranje","Kljuc","Genom"]' AS words_json, 'Genom' AS answer, 'Tri pojma vode ka "Enkripcija", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Proces","Usteda vremena","Robot","Odbojka"]' AS words_json, 'Odbojka' AS answer, 'Tri pojma vode ka "Automatizacija", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Kontrola","Sistem","Povratna sprega","Tenis"]' AS words_json, 'Tenis' AS answer, 'Tri pojma vode ka "Kibernetika", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["More","Kopno","Obala","Odbojka"]' AS words_json, 'Odbojka' AS answer, 'Tri pojma vode ka "Ostrvo", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Rijeka","Stijene","Dubina","Odbojka"]' AS words_json, 'Odbojka' AS answer, 'Tri pojma vode ka "Kanjon", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Nizija","Ravno","Polje","Tenis"]' AS words_json, 'Tenis' AS answer, 'Tri pojma vode ka "Ravnica", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Drzava","Linija","Prelaz","Hokej"]' AS words_json, 'Hokej' AS answer, 'Tri pojma vode ka "Granica", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Reljef","Visina","Teren","Taktika"]' AS words_json, 'Taktika' AS answer, 'Tri pojma vode ka "Topografija", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Mapa","Projekcija","Skala","Formacija"]' AS words_json, 'Formacija' AS answer, 'Tri pojma vode ka "Kartografija", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Drzave","Moc","Prostor","Bioskop"]' AS words_json, 'Bioskop' AS answer, 'Tri pojma vode ka "Geopolitika", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Drvo","Vitko","Mediteran","Tvrdjava"]' AS words_json, 'Tvrdjava' AS answer, 'Tri pojma vode ka "Čempres", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Kartica","Senzor","Ulaz","Kraljevina"]' AS words_json, 'Kraljevina' AS answer, 'Tri pojma vode ka "Čitač", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Voda","Potok","Zvuk","Dekret"]' AS words_json, 'Dekret' AS answer, 'Tri pojma vode ka "Žubor", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Tesko' AS difficulty
) AS seed
LEFT JOIN logic_challenges existing
  ON existing.mode = seed.mode
 AND LOWER(existing.answer) = LOWER(seed.answer)
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
 AND (
      seed.mode <> 'odd-one-out'
      OR CAST(existing.words_json AS CHAR(1000)) = seed.words_json
    )
WHERE existing.id IS NULL;


INSERT INTO logic_challenges (mode, words_json, answer, hint, category, difficulty)
SELECT seed.mode, seed.words_json, seed.answer, seed.hint, seed.category, seed.difficulty
FROM (
  SELECT 'odd-one-out' AS mode, '["Atomi","Veza","Hemija","Gejzir"]' AS words_json, 'Gejzir' AS answer, 'Tri pojma vode ka "Molekul", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Periodni sistem","Hemija","Simbol","Balet"]' AS words_json, 'Balet' AS answer, 'Tri pojma vode ka "Element", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["DNK","Nasljedje","Informacija","Basna"]' AS words_json, 'Basna' AS answer, 'Tri pojma vode ka "Genom", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Mreza","Servis","Tim","Kursor"]' AS words_json, 'Kursor' AS answer, 'Tri pojma vode ka "Odbojka", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Reket","Mreza","Servis","Pretrazivac"]' AS words_json, 'Pretrazivac' AS answer, 'Tri pojma vode ka "Tenis", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Pak","Led","Palica","Pretrazivac"]' AS words_json, 'Pretrazivac' AS answer, 'Tri pojma vode ka "Hokej", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Plan","Protivnik","Strategija","Virtuelizacija"]' AS words_json, 'Virtuelizacija' AS answer, 'Tri pojma vode ka "Taktika", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Raspored","Tim","Teren","Telemetrija"]' AS words_json, 'Telemetrija' AS answer, 'Tri pojma vode ka "Formacija", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Platno","Sala","Projekcija","Telemetrija"]' AS words_json, 'Telemetrija' AS answer, 'Tri pojma vode ka "Bioskop", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Uloga","Izbor","Glumac","Rt"]' AS words_json, 'Rt' AS answer, 'Tri pojma vode ka "Audicija", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Kadar","Skica","Planiranje","Globus"]' AS words_json, 'Globus' AS answer, 'Tri pojma vode ka "Storyboard", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Dekor","Prostor","Set","Kanal"]' AS words_json, 'Kanal' AS answer, 'Tri pojma vode ka "Scenografija", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Zidine","Odbrana","Kula","Globus"]' AS words_json, 'Globus' AS answer, 'Tri pojma vode ka "Tvrdjava", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Kruna","Vladar","Prijesto","Kanal"]' AS words_json, 'Kanal' AS answer, 'Tri pojma vode ka "Kraljevina", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Odluka","Vladar","Naredba","Platno"]' AS words_json, 'Platno' AS answer, 'Tri pojma vode ka "Dekret", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Rijeka","Visina","Pad","Kasting"]' AS words_json, 'Kasting' AS answer, 'Tri pojma vode ka "Vodopad", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Trava","Cvijece","Ravno","Mizanscen"]' AS words_json, 'Mizanscen' AS answer, 'Tri pojma vode ka "Livada", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Para","Vrela voda","Pritisak","Drzava"]' AS words_json, 'Drzava' AS answer, 'Tri pojma vode ka "Gejzir", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Ples","Pozornica","Pokret","Okean"]' AS words_json, 'Okean' AS answer, 'Tri pojma vode ka "Balet", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Pouka","Zivotinje","Prica","Klima"]' AS words_json, 'Klima' AS answer, 'Tri pojma vode ka "Basna", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Zid","Boje","Velika slika","Regija"]' AS words_json, 'Regija' AS answer, 'Tri pojma vode ka "Mural", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Simbolika","Znacenje","Prica","Longituda"]' AS words_json, 'Longituda' AS answer, 'Tri pojma vode ka "Alegorija", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Suprotnost","Svjetlo","Boja","Geomorfologija"]' AS words_json, 'Geomorfologija' AS answer, 'Tri pojma vode ka "Kontrast", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Mis","Ekran","Pokazivac","Traktat"]' AS words_json, 'Traktat' AS answer, 'Tri pojma vode ka "Kursor", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Internet","Kartice","Adresa","Manifest"]' AS words_json, 'Manifest' AS answer, 'Tri pojma vode ka "Pretrazivac", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Server","Resursi","Okruzenje","Magnet"]' AS words_json, 'Magnet' AS answer, 'Tri pojma vode ka "Virtuelizacija", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Mjerenje","Senzori","Prenos","Epruveta"]' AS words_json, 'Epruveta' AS answer, 'Tri pojma vode ka "Telemetrija", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Obala","More","Izbocenje","Koral"]' AS words_json, 'Koral' AS answer, 'Tri pojma vode ka "Rt", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Zemlja","Model","Mapa","Koral"]' AS words_json, 'Koral' AS answer, 'Tri pojma vode ka "Globus", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Voda","Prolaz","Povezivanje","Erozija"]' AS words_json, 'Erozija' AS answer, 'Tri pojma vode ka "Kanal", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Projekcija","Bioskop","Slika","Ofsajd"]' AS words_json, 'Ofsajd' AS answer, 'Tri pojma vode ka "Platno", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Tekst","Prevod","Dijalog","Penal"]' AS words_json, 'Penal' AS answer, 'Tri pojma vode ka "Titl", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Budzet","Organizacija","Snimanje","Baterija"]' AS words_json, 'Baterija' AS answer, 'Tri pojma vode ka "Producent", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Uloga","Izbor","Glumci","Domen"]' AS words_json, 'Domen' AS answer, 'Tri pojma vode ka "Kasting", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Raspored","Scena","Pokret","Ruter"]' AS words_json, 'Ruter' AS answer, 'Tri pojma vode ka "Mizanscen", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Granice","Gradjani","Mapa","Domen"]' AS words_json, 'Domen' AS answer, 'Tri pojma vode ka "Drzava", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Voda","Talasi","Dubina","Ruter"]' AS words_json, 'Ruter' AS answer, 'Tri pojma vode ka "Okean", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Temperatura","Padavine","Podneblje","Latencija"]' AS words_json, 'Latencija' AS answer, 'Tri pojma vode ka "Klima", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Oblast","Podrucje","Mapa","Strip"]' AS words_json, 'Strip' AS answer, 'Tri pojma vode ka "Regija", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Duzina","Koordinate","Meridijan","Maska"]' AS words_json, 'Maska' AS answer, 'Tri pojma vode ka "Longituda", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Reljef","Oblici tla","Teren","Recital"]' AS words_json, 'Recital' AS answer, 'Tri pojma vode ka "Geomorfologija", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Oklop","Mac","Konj","Maska"]' AS words_json, 'Maska' AS answer, 'Tri pojma vode ka "Vitez", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Sporazum","Drzave","Potpis","Recital"]' AS words_json, 'Recital' AS answer, 'Tri pojma vode ka "Traktat", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Ideje","Pokret","Program","Arija"]' AS words_json, 'Arija' AS answer, 'Tri pojma vode ka "Manifest", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Privlacenje","Metal","Polje","Boks"]' AS words_json, 'Boks' AS answer, 'Tri pojma vode ka "Magnet", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Staklo","Uzorak","Hemija","Kajak"]' AS words_json, 'Kajak' AS answer, 'Tri pojma vode ka "Epruveta", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Objasnjenje","Dokaz","Model","Sudija"]' AS words_json, 'Sudija' AS answer, 'Tri pojma vode ka "Teorija", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Nered","Energija","Sistem","Sprint"]' AS words_json, 'Sprint' AS answer, 'Tri pojma vode ka "Entropija", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Voda","Pocetak toka","Stijena","Meteorologija"]' AS words_json, 'Meteorologija' AS answer, 'Tri pojma vode ka "Izvor", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["More","Hrid","Kolonija","Tektonika"]' AS words_json, 'Tektonika' AS answer, 'Tri pojma vode ka "Koral", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Tlo","Voda","Trošenje","Boks"]' AS words_json, 'Boks' AS answer, 'Tri pojma vode ka "Erozija", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Naslage","Cestice","Talozenje","Kajak"]' AS words_json, 'Kajak' AS answer, 'Tri pojma vode ka "Sediment", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Vjezba","Priprema","Forma","Festival"]' AS words_json, 'Festival' AS answer, 'Tri pojma vode ka "Trening", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Napad","Pravila","Fudbal","Animacija"]' AS words_json, 'Animacija' AS answer, 'Tri pojma vode ka "Ofsajd", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Kazna","Sut","Gol","Rasvjeta"]' AS words_json, 'Rasvjeta' AS answer, 'Tri pojma vode ka "Penal", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Energija","Punjenje","Uredjaj","Turnir"]' AS words_json, 'Turnir' AS answer, 'Tri pojma vode ka "Baterija", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Web","Adresa","Internet","Finale"]' AS words_json, 'Finale' AS answer, 'Tri pojma vode ka "Domen", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Mreza","Signal","Internet","Dubler"]' AS words_json, 'Dubler' AS answer, 'Tri pojma vode ka "Ruter", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Kasnjenje","Mreza","Odgovor","Sinopsis"]' AS words_json, 'Sinopsis' AS answer, 'Tri pojma vode ka "Latencija", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Kadrovi","Crtez","Oblacic","Animacija"]' AS words_json, 'Animacija' AS answer, 'Tri pojma vode ka "Strip", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
) AS seed
LEFT JOIN logic_challenges existing
  ON existing.mode = seed.mode
 AND LOWER(existing.answer) = LOWER(seed.answer)
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
 AND (
      seed.mode <> 'odd-one-out'
      OR CAST(existing.words_json AS CHAR(1000)) = seed.words_json
    )
WHERE existing.id IS NULL;


INSERT INTO logic_challenges (mode, words_json, answer, hint, category, difficulty)
SELECT seed.mode, seed.words_json, seed.answer, seed.hint, seed.category, seed.difficulty
FROM (
  SELECT 'odd-one-out' AS mode, '["Lice","Pozornica","Lik","Trilogija"]' AS words_json, 'Trilogija' AS answer, 'Tri pojma vode ka "Maska", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Izvodjenje","Publika","Stihovi","Povelja"]' AS words_json, 'Povelja' AS answer, 'Tri pojma vode ka "Recital", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Opera","Solo","Glas","Povelja"]' AS words_json, 'Povelja' AS answer, 'Tri pojma vode ka "Arija", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Svedeno","Forma","Manje je vise","Ustanak"]' AS words_json, 'Ustanak' AS answer, 'Tri pojma vode ka "Minimalizam", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Svjetlo","Potezi","Boje","Arhiv"]' AS words_json, 'Arhiv' AS answer, 'Tri pojma vode ka "Impresionizam", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Socivo","Uvecanje","Uzorak","Hronicar"]' AS words_json, 'Hronicar' AS answer, 'Tri pojma vode ka "Mikroskop", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Planeta","Kretanje","Krug","Potok"]' AS words_json, 'Potok' AS answer, 'Tri pojma vode ka "Orbita", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Nasljedje","DNK","Osobine","Duga"]' AS words_json, 'Duga' AS answer, 'Tri pojma vode ka "Genetika", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Kamen","Ostatak","Proslost","Sjeme"]' AS words_json, 'Sjeme' AS answer, 'Tri pojma vode ka "Fosil", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Organizam","Signal","Zlijezda","Munja"]' AS words_json, 'Munja' AS answer, 'Tri pojma vode ka "Hormon", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Vrijeme","Prognoza","Oblaci","Pustinja"]' AS words_json, 'Pustinja' AS answer, 'Tri pojma vode ka "Meteorologija", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Ploce","Zemljotres","Pomjeranje","Uvala"]' AS words_json, 'Uvala' AS answer, 'Tri pojma vode ka "Tektonika", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Rukavice","Ring","Udarac","Atelje"]' AS words_json, 'Atelje' AS answer, 'Tri pojma vode ka "Boks", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Veslo","Rijeka","Camac","Sonata"]' AS words_json, 'Sonata' AS answer, 'Tri pojma vode ka "Kajak", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Pistaljka","Pravila","Odluka","Mozaik"]' AS words_json, 'Mozaik' AS answer, 'Tri pojma vode ka "Sudija", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Brzina","Staza","Start","Dirigent"]' AS words_json, 'Dirigent' AS answer, 'Tri pojma vode ka "Sprint", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Vjetar","Jedro","More","Senzor"]' AS words_json, 'Senzor' AS answer, 'Tri pojma vode ka "Jedrenje", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Tim","Vodja","Traka","Procesor"]' AS words_json, 'Procesor' AS answer, 'Tri pojma vode ka "Kapiten", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Parovi","Runda","Pobjednik","Senzor"]' AS words_json, 'Senzor' AS answer, 'Tri pojma vode ka "Turnir", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Zavrsnica","Pehar","Pobjednik","Aplikacija"]' AS words_json, 'Aplikacija' AS answer, 'Tri pojma vode ka "Finale", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Zamjena","Glumac","Akcija","Aplikacija"]' AS words_json, 'Aplikacija' AS answer, 'Tri pojma vode ka "Dubler", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Prica","Kratak opis","Radnja","Protokol"]' AS words_json, 'Protokol' AS answer, 'Tri pojma vode ka "Sinopsis", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Projekcije","Nagrade","Publika","Bekap"]' AS words_json, 'Bekap' AS answer, 'Tri pojma vode ka "Festival", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Crtanje","Pokret","Frejmovi","Kompajler"]' AS words_json, 'Kompajler' AS answer, 'Tri pojma vode ka "Animacija", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Svjetlo","Set","Sjena","Satelit"]' AS words_json, 'Satelit' AS answer, 'Tri pojma vode ka "Rasvjeta", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Tri dijela","Nastavak","Prica","Satelit"]' AS words_json, 'Satelit' AS answer, 'Tri pojma vode ka "Trilogija", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Dokument","Pravo","Potpis","Robotika"]' AS words_json, 'Robotika' AS answer, 'Tri pojma vode ka "Povelja", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Pobuna","Narod","Otpor","Satelit"]' AS words_json, 'Satelit' AS answer, 'Tri pojma vode ka "Ustanak", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Dokumenti","Cuvanje","Proslo","Zaliv"]' AS words_json, 'Zaliv' AS answer, 'Tri pojma vode ka "Arhiv", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Grad","Vojska","Zidine","Fjord"]' AS words_json, 'Fjord' AS answer, 'Tri pojma vode ka "Opsada", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Nasljedje","Spomenici","Kultura","Ekvator"]' AS words_json, 'Ekvator' AS answer, 'Tri pojma vode ka "Bastina", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Carstvo","Vladar","Kruna","Meridian"]' AS words_json, 'Meridian' AS answer, 'Tri pojma vode ka "Imperator", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Drzava","Gradjani","Ustav","Klisura"]' AS words_json, 'Klisura' AS answer, 'Tri pojma vode ka "Republika", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Zapisi","Svjedok","Proslo","Klisura"]' AS words_json, 'Klisura' AS answer, 'Tri pojma vode ka "Hronicar", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Voda","Tok","Obala","Galaksija"]' AS words_json, 'Galaksija' AS answer, 'Tri pojma vode ka "Potok", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Boje","Kisa","Nebo","Gravitacija"]' AS words_json, 'Gravitacija' AS answer, 'Tri pojma vode ka "Duga", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Biljka","Rast","Klica","Fudbal"]' AS words_json, 'Fudbal' AS answer, 'Tri pojma vode ka "Sjeme", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Oluja","Bljesak","Elektricitet","Maraton"]' AS words_json, 'Maraton' AS answer, 'Tri pojma vode ka "Munja", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Pijesak","Susa","Toplota","Gimnastika"]' AS words_json, 'Gimnastika' AS answer, 'Tri pojma vode ka "Pustinja", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Obala","More","Zakrivljenje","Kamera"]' AS words_json, 'Kamera' AS answer, 'Tri pojma vode ka "Uvala", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Vlaga","Kamen","Zeleno","Scenario"]' AS words_json, 'Scenario' AS answer, 'Tri pojma vode ka "Mahovina", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["More","Mjesec","Rast nivoa","Montaza"]' AS words_json, 'Montaza' AS answer, 'Tri pojma vode ka "Plima", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Platno","Boje","Prostor","Piramida"]' AS words_json, 'Piramida' AS answer, 'Tri pojma vode ka "Atelje", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Klavir","Stavovi","Muzika","Piramida"]' AS words_json, 'Piramida' AS answer, 'Tri pojma vode ka "Sonata", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Kockice","Slika","Zid","Renesansa"]' AS words_json, 'Renesansa' AS answer, 'Tri pojma vode ka "Mozaik", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Orkestar","Palica","Tempo","Diplomatija"]' AS words_json, 'Diplomatija' AS answer, 'Tri pojma vode ka "Dirigent", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Metal","Otisak","Rezbarenje","Sunce"]' AS words_json, 'Sunce' AS answer, 'Tri pojma vode ka "Gravura", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Cip","Racunanje","Jezgro","Simfonija"]' AS words_json, 'Simfonija' AS answer, 'Tri pojma vode ka "Procesor", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Mjerenje","Signal","Detekcija","Skulptura"]' AS words_json, 'Skulptura' AS answer, 'Tri pojma vode ka "Senzor", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Telefon","Program","Interfejs","Perspektiva"]' AS words_json, 'Perspektiva' AS answer, 'Tri pojma vode ka "Aplikacija", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Pravila","Mreza","Razmjena","Atlas"]' AS words_json, 'Atlas' AS answer, 'Tri pojma vode ka "Protokol", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Kopija","Sigurnost","Obnova","Arhipelag"]' AS words_json, 'Arhipelag' AS answer, 'Tri pojma vode ka "Bekap", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Kod","Prevodjenje","Programski jezik","Meridijan"]' AS words_json, 'Meridijan' AS answer, 'Tri pojma vode ka "Kompajler", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Masina","Automatika","Kretanje","Ćelija"]' AS words_json, 'Ćelija' AS answer, 'Tri pojma vode ka "Robotika", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Orbita","Signal","Antena","Rukomet"]' AS words_json, 'Rukomet' AS answer, 'Tri pojma vode ka "Satelit", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["More","Obala","Uvlacenje","Rukomet"]' AS words_json, 'Rukomet' AS answer, 'Tri pojma vode ka "Zaliv", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["More","Planine","Uski zaliv","Žanr"]' AS words_json, 'Žanr' AS answer, 'Tri pojma vode ka "Fjord", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Zemlja","Sirina","Toplota","Rukomet"]' AS words_json, 'Rukomet' AS answer, 'Tri pojma vode ka "Ekvator", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Duzina","Mapa","Linija","Štafeta"]' AS words_json, 'Štafeta' AS answer, 'Tri pojma vode ka "Meridian", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Plicak","More","Obala","Ćirilica"]' AS words_json, 'Ćirilica' AS answer, 'Tri pojma vode ka "Laguna", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
) AS seed
LEFT JOIN logic_challenges existing
  ON existing.mode = seed.mode
 AND LOWER(existing.answer) = LOWER(seed.answer)
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
 AND (
      seed.mode <> 'odd-one-out'
      OR CAST(existing.words_json AS CHAR(1000)) = seed.words_json
    )
WHERE existing.id IS NULL;


INSERT INTO logic_challenges (mode, words_json, answer, hint, category, difficulty)
SELECT seed.mode, seed.words_json, seed.answer, seed.hint, seed.category, seed.difficulty
FROM (
  SELECT 'odd-one-out' AS mode, '["Rijeka","Usjek","Stijene","Režija"]' AS words_json, 'Režija' AS answer, 'Tri pojma vode ka "Klisura", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Kopno","Velicina","Granice","Ćirilica"]' AS words_json, 'Ćirilica' AS answer, 'Tri pojma vode ka "Kontinent", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["More","Prolaz","Uski put","Pozorište"]' AS words_json, 'Pozorište' AS answer, 'Tri pojma vode ka "Tjesnac", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
) AS seed
LEFT JOIN logic_challenges existing
  ON existing.mode = seed.mode
 AND LOWER(existing.answer) = LOWER(seed.answer)
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
 AND (
      seed.mode <> 'odd-one-out'
      OR CAST(existing.words_json AS CHAR(1000)) = seed.words_json
    )
WHERE existing.id IS NULL;


INSERT INTO relation_challenges (left_word, right_word, relation, category, difficulty, hint)
SELECT seed.left_word, seed.right_word, seed.relation, seed.category, seed.difficulty, seed.hint
FROM (
  SELECT 'Tacan' AS left_word, 'Precizan' AS right_word, 'Sinonim' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Obje rijeci opisuju visoku mjeru ispravnosti.' AS hint
  UNION ALL SELECT 'Hipoteza' AS left_word, 'Teorija' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Pojmovi su blisko povezani u naucnom procesu.' AS hint
  UNION ALL SELECT 'Stabilan' AS left_word, 'Nestabilan' AS right_word, 'Antonim' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Jedna rijec negira osobinu druge.' AS hint
  UNION ALL SELECT 'Brz' AS left_word, 'Spor' AS right_word, 'Antonim' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Pogledaj da li su pojmovi suprotnosti.' AS hint
  UNION ALL SELECT 'Pobjeda' AS left_word, 'Trijumf' AS right_word, 'Sinonim' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Oba pojma opisuju isti ishod.' AS hint
  UNION ALL SELECT 'Lopta' AS left_word, 'Gol' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Pojmovi su povezani u istoj igri.' AS hint
  UNION ALL SELECT 'Glumac' AS left_word, 'Uloga' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Jedan pojam gotovo uvijek ide uz drugi u filmu.' AS hint
  UNION ALL SELECT 'Glavni' AS left_word, 'Sporedni' AS right_word, 'Antonim' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Pojmovi opisuju suprotne uloge ili planove.' AS hint
  UNION ALL SELECT 'Kadar' AS left_word, 'Scena' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezanost je filmska, ne znacenjska.' AS hint
  UNION ALL SELECT 'Mir' AS left_word, 'Rat' AS right_word, 'Antonim' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Pomisli na suprotnosti.' AS hint
  UNION ALL SELECT 'Staro' AS left_word, 'Drevno' AS right_word, 'Sinonim' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Rijeci su gotovo isto znacenje.' AS hint
  UNION ALL SELECT 'Kruna' AS left_word, 'Prijesto' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Oba pojma prizivaju vladara i dvor.' AS hint
  UNION ALL SELECT 'Topao' AS left_word, 'Hladan' AS right_word, 'Antonim' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Rijeci imaju suprotno znacenje.' AS hint
  UNION ALL SELECT 'Talas' AS left_word, 'More' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Jedan pojam prirodno priziva drugi.' AS hint
  UNION ALL SELECT 'Suma' AS left_word, 'Gaj' AS right_word, 'Sinonim' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Rijeci oznacavaju vrlo slican pojam.' AS hint
  UNION ALL SELECT 'Tisina' AS left_word, 'Buka' AS right_word, 'Antonim' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Jedna rijec iskljucuje drugu.' AS hint
  UNION ALL SELECT 'Kist' AS left_word, 'Platno' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Pojmovi su prirodno povezani u stvaranju slike.' AS hint
  UNION ALL SELECT 'Inspiracija' AS left_word, 'Ideja' AS right_word, 'Sinonim' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Oba pojma ukazuju na pocetak stvaranja.' AS hint
  UNION ALL SELECT 'Kod' AS left_word, 'Program' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Jedan pojam je sastavni dio drugog.' AS hint
  UNION ALL SELECT 'Siguran' AS left_word, 'Nesiguran' AS right_word, 'Antonim' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Rijeci imaju suprotan smisao.' AS hint
  UNION ALL SELECT 'Mikrocip' AS left_word, 'Procesor' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Pojmovi su povezani sa racunarskim hardverom.' AS hint
  UNION ALL SELECT 'Mapa' AS left_word, 'Karta' AS right_word, 'Sinonim' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Rijeci se koriste kao isto ili skoro isto.' AS hint
  UNION ALL SELECT 'Sjever' AS left_word, 'Jug' AS right_word, 'Antonim' AS relation, 'Geografija' AS category, 'Srednje' AS difficulty, 'Pojmovi pokazuju suprotne strane svijeta.' AS hint
  UNION ALL SELECT 'Kompas' AS left_word, 'Pravac' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Jedan pojam sluzi da odredi drugi.' AS hint
  UNION ALL SELECT 'Tačnost' AS left_word, 'Preciznost' AS right_word, 'Sinonim' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Riječi opisuju vrlo sličnu osobinu mjerenja ili rada.' AS hint
  UNION ALL SELECT 'Živ' AS left_word, 'Mrtav' AS right_word, 'Antonim' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Pojmovi imaju potpuno suprotno značenje.' AS hint
  UNION ALL SELECT 'Ćelija' AS left_word, 'Tkivo' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Jedan pojam je sastavni dio drugog.' AS hint
  UNION ALL SELECT 'Štafeta' AS left_word, 'Palica' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Bez jednog pojma drugi teško može da se zamisli u trci.' AS hint
  UNION ALL SELECT 'Rukomet' AS left_word, 'Dvorana' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Pojmovi se prirodno vezuju za isti sport.' AS hint
  UNION ALL SELECT 'Žanr' AS left_word, 'Vrsta' AS right_word, 'Sinonim' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'U ovom kontekstu riječi znače skoro isto.' AS hint
  UNION ALL SELECT 'Tišina' AS left_word, 'Galama' AS right_word, 'Antonim' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Jedan pojam isključuje drugi.' AS hint
  UNION ALL SELECT 'Pozorište' AS left_word, 'Predstava' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Jedan pojam se izvodi u drugom.' AS hint
  UNION ALL SELECT 'Računar' AS left_word, 'Kompjuter' AS right_word, 'Sinonim' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Oba pojma označavaju isti uređaj.' AS hint
  UNION ALL SELECT 'Šifra' AS left_word, 'Lozinka' AS right_word, 'Sinonim' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Riječi se koriste za sličan zaštitni pojam.' AS hint
  UNION ALL SELECT 'Ušće' AS left_word, 'Delta' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Pojmovi su povezani sa završetkom riječnog toka.' AS hint
  UNION ALL SELECT 'Zivo' AS left_word, 'Nezivo' AS right_word, 'Antonim' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Pomisli na suprotne osobine.' AS hint
  UNION ALL SELECT 'Laboratorija' AS left_word, 'Eksperiment' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Jedan pojam prirodno ide uz drugi u nauci.' AS hint
  UNION ALL SELECT 'Jak' AS left_word, 'Snazan' AS right_word, 'Sinonim' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Rijeci opisuju slicnu fizicku osobinu.' AS hint
  UNION ALL SELECT 'Pobjeda' AS left_word, 'Poraz' AS right_word, 'Antonim' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Rezultati su suprotni.' AS hint
  UNION ALL SELECT 'Trka' AS left_word, 'Staza' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Jedan pojam se odvija na drugom.' AS hint
  UNION ALL SELECT 'Scena' AS left_word, 'Prizor' AS right_word, 'Sinonim' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Rijeci se koriste za slican dio prikaza.' AS hint
  UNION ALL SELECT 'Junak' AS left_word, 'Negativac' AS right_word, 'Antonim' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Pomisli na suprotne uloge u prici.' AS hint
  UNION ALL SELECT 'Kamera' AS left_word, 'Objektiv' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Jedan pojam je vazan dio drugog.' AS hint
  UNION ALL SELECT 'Drevno' AS left_word, 'Staro' AS right_word, 'Sinonim' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Znacenje je veoma slicno.' AS hint
  UNION ALL SELECT 'Mir' AS left_word, 'Sukob' AS right_word, 'Antonim' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Pojmovi oznacavaju suprotna stanja.' AS hint
  UNION ALL SELECT 'Tiho' AS left_word, 'Mirno' AS right_word, 'Sinonim' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Obje rijeci opisuju gotovo isto stanje.' AS hint
  UNION ALL SELECT 'Topao' AS left_word, 'Hladan' AS right_word, 'Antonim' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Rijeci imaju suprotno znacenje.' AS hint
  UNION ALL SELECT 'Oblak' AS left_word, 'Kisa' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Jedna pojava cesto vodi ka drugoj.' AS hint
  UNION ALL SELECT 'Nadahnuce' AS left_word, 'Inspiracija' AS right_word, 'Sinonim' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Oba pojma opisuju isti unutrasnji podsticaj.' AS hint
  UNION ALL SELECT 'Tisina' AS left_word, 'Buka' AS right_word, 'Antonim' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Pomisli na dvije suprotnosti.' AS hint
  UNION ALL SELECT 'Kist' AS left_word, 'Platno' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Pojmovi su prirodno povezani u slikanju.' AS hint
  UNION ALL SELECT 'Brz' AS left_word, 'Ubrzan' AS right_word, 'Sinonim' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Rijeci opisuju slicnu osobinu rada.' AS hint
  UNION ALL SELECT 'Kod' AS left_word, 'Program' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Jedan pojam gradi drugi.' AS hint
  UNION ALL SELECT 'Atom' AS left_word, 'Jezgro' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Atom" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Atom' AS left_word, 'Elektron' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Atom" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Galaksija' AS left_word, 'Zvijezde' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Galaksija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Galaksija' AS left_word, 'Svemir' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Galaksija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Gravitacija' AS left_word, 'Pad' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Gravitacija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Gravitacija' AS left_word, 'Privlacnost' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Gravitacija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Fudbal' AS left_word, 'Gol' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Fudbal" sa jednim od njegovih tragova.' AS hint
) AS seed
LEFT JOIN relation_challenges existing
  ON LOWER(existing.left_word) = LOWER(seed.left_word)
 AND LOWER(existing.right_word) = LOWER(seed.right_word)
 AND existing.relation = seed.relation
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
WHERE existing.id IS NULL;


INSERT INTO relation_challenges (left_word, right_word, relation, category, difficulty, hint)
SELECT seed.left_word, seed.right_word, seed.relation, seed.category, seed.difficulty, seed.hint
FROM (
  SELECT 'Fudbal' AS left_word, 'Lopta' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Fudbal" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Maraton' AS left_word, '42 kilometra' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Maraton" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Maraton' AS left_word, 'Izdrzljivost' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Maraton" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Gimnastika' AS left_word, 'Greda' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Gimnastika" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Gimnastika' AS left_word, 'Parter' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Gimnastika" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kamera' AS left_word, 'Snimanje' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Kamera" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kamera' AS left_word, 'Objektiv' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Kamera" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Scenario' AS left_word, 'Dijalog' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Scenario" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Scenario' AS left_word, 'Likovi' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Scenario" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Montaza' AS left_word, 'Rez' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Montaza" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Montaza' AS left_word, 'Ritam' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Montaza" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Piramida' AS left_word, 'Egipat' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Piramida" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Piramida' AS left_word, 'Faraon' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Piramida" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Renesansa' AS left_word, 'Leonardo' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Renesansa" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Renesansa' AS left_word, 'Humanizam' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Renesansa" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Diplomatija' AS left_word, 'Pregovori' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Diplomatija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Diplomatija' AS left_word, 'Ambasada' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Diplomatija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Sunce' AS left_word, 'Dan' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Sunce" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Sunce' AS left_word, 'Toplota' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Sunce" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'More' AS left_word, 'Talas' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "More" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'More' AS left_word, 'So' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "More" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Vulkan' AS left_word, 'Lava' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Vulkan" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Vulkan' AS left_word, 'Krater' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Vulkan" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Simfonija' AS left_word, 'Orkestar' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Simfonija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Simfonija' AS left_word, 'Dirigent' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Simfonija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Skulptura' AS left_word, 'Klesanje' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Skulptura" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Skulptura' AS left_word, 'Mermer' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Skulptura" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Perspektiva' AS left_word, 'Dubina' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Perspektiva" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Perspektiva' AS left_word, 'Linije' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Perspektiva" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Robot' AS left_word, 'Mašina' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Robot" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Robot' AS left_word, 'Program' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Robot" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Algoritam' AS left_word, 'Koraci' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Algoritam" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Algoritam' AS left_word, 'Logika' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Algoritam" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Mikrocip' AS left_word, 'Elektronika' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Mikrocip" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Atlas' AS left_word, 'Karta' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Atlas" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Atlas' AS left_word, 'Kontinent' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Atlas" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Arhipelag' AS left_word, 'Ostrvo' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Arhipelag" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Arhipelag' AS left_word, 'Grupa' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Arhipelag" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Meridijan' AS left_word, 'Greenwich' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Meridijan" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Meridijan' AS left_word, 'Koordinate' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Meridijan" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ćelija' AS left_word, 'Membrana' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Ćelija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ćelija' AS left_word, 'Jezgro' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Ćelija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kiseonik' AS left_word, 'Disanje' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Kiseonik" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kiseonik' AS left_word, 'Gas' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Kiseonik" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Rukomet' AS left_word, 'Gol' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Rukomet" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Rukomet' AS left_word, 'Dvorana' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Rukomet" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Štafeta' AS left_word, 'Tim' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Štafeta" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Štafeta' AS left_word, 'Palica' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Štafeta" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Žanr' AS left_word, 'Drama' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Žanr" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Žanr' AS left_word, 'Komedija' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Žanr" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Režija' AS left_word, 'Vizija' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Režija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Režija' AS left_word, 'Set' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Režija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ćirilica' AS left_word, 'Slova' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Ćirilica" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ćirilica' AS left_word, 'Pismo' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Ćirilica" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Pećina' AS left_word, 'Stijena' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Pećina" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Pećina' AS left_word, 'Mrak' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Pećina" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Šuma' AS left_word, 'Drveće' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Šuma" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Šuma' AS left_word, 'Lišće' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Šuma" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Pozorište' AS left_word, 'Scena' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Pozorište" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Pozorište' AS left_word, 'Glumci' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Pozorište" sa jednim od njegovih tragova.' AS hint
) AS seed
LEFT JOIN relation_challenges existing
  ON LOWER(existing.left_word) = LOWER(seed.left_word)
 AND LOWER(existing.right_word) = LOWER(seed.right_word)
 AND existing.relation = seed.relation
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
WHERE existing.id IS NULL;


INSERT INTO relation_challenges (left_word, right_word, relation, category, difficulty, hint)
SELECT seed.left_word, seed.right_word, seed.relation, seed.category, seed.difficulty, seed.hint
FROM (
  SELECT 'Računar' AS left_word, 'Tastatura' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Računar" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Računar' AS left_word, 'Ekran' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Računar" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Mreža' AS left_word, 'Internet' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Mreža" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Mreža' AS left_word, 'Signal' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Mreža" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ušće' AS left_word, 'Rijeka' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Ušće" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ušće' AS left_word, 'More' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Ušće" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Poluostrvo' AS left_word, 'Kopno' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Poluostrvo" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Poluostrvo' AS left_word, 'More' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Poluostrvo" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Neuron' AS left_word, 'Mozak' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Neuron" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Neuron' AS left_word, 'Signal' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Neuron" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Formula' AS left_word, 'Simbol' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Formula" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Formula' AS left_word, 'Jednacina' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Formula" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Teleskop' AS left_word, 'Svemir' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Teleskop" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Teleskop' AS left_word, 'Uvecanje' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Teleskop" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Vakcina' AS left_word, 'Imunitet' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Vakcina" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Vakcina' AS left_word, 'Doza' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Vakcina" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Cestica' AS left_word, 'Materija' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Cestica" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Cestica' AS left_word, 'Mikro' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Cestica" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Laboratorija' AS left_word, 'Eksperiment' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Laboratorija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Laboratorija' AS left_word, 'Oprema' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Laboratorija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Spektar' AS left_word, 'Boje' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Spektar" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Spektar' AS left_word, 'Talasi' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Spektar" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Evolucija' AS left_word, 'Promjena' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Evolucija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Evolucija' AS left_word, 'Vrsta' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Evolucija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Katalizator' AS left_word, 'Reakcija' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Katalizator" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Katalizator' AS left_word, 'Hemija' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Katalizator" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kosarka' AS left_word, 'Obruc' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Kosarka" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kosarka' AS left_word, 'Dribling' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Kosarka" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Plivanje' AS left_word, 'Bazen' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Plivanje" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Plivanje' AS left_word, 'Voda' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Plivanje" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Reket' AS left_word, 'Tenis' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Reket" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Reket' AS left_word, 'Mreza' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Reket" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Trofej' AS left_word, 'Pehar' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Trofej" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Trofej' AS left_word, 'Finale' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Trofej" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kondicija' AS left_word, 'Forma' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Kondicija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kondicija' AS left_word, 'Izdrzljivost' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Kondicija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Stadion' AS left_word, 'Tribine' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Stadion" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Stadion' AS left_word, 'Publika' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Stadion" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Triatlon' AS left_word, 'Plivanje' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Triatlon" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Triatlon' AS left_word, 'Biciklizam' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Triatlon" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Desetoboj' AS left_word, 'Atletika' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Desetoboj" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Desetoboj' AS left_word, 'Disciplina' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Desetoboj" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Regata' AS left_word, 'Jedrenje' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Regata" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Regata' AS left_word, 'Voda' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Regata" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Reziser' AS left_word, 'Set' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Reziser" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Reziser' AS left_word, 'Vizija' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Reziser" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Trejler' AS left_word, 'Najava' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Trejler" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Trejler' AS left_word, 'Kratko' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Trejler" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Scena' AS left_word, 'Kadar' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Scena" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Scena' AS left_word, 'Glumci' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Scena" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kostim' AS left_word, 'Lik' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Kostim" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kostim' AS left_word, 'Odjeca' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Kostim" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kadrovanje' AS left_word, 'Ugao' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Kadrovanje" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kadrovanje' AS left_word, 'Kompozicija' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Kadrovanje" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Premijera' AS left_word, 'Crveni tepih' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Premijera" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Premijera' AS left_word, 'Publika' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Premijera" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Postprodukcija' AS left_word, 'Montaza' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Postprodukcija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Postprodukcija' AS left_word, 'Zvuk' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Postprodukcija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Dokumentarac' AS left_word, 'Cinjenice' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Dokumentarac" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Dokumentarac' AS left_word, 'Intervju' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Dokumentarac" sa jednim od njegovih tragova.' AS hint
) AS seed
LEFT JOIN relation_challenges existing
  ON LOWER(existing.left_word) = LOWER(seed.left_word)
 AND LOWER(existing.right_word) = LOWER(seed.right_word)
 AND existing.relation = seed.relation
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
WHERE existing.id IS NULL;


INSERT INTO relation_challenges (left_word, right_word, relation, category, difficulty, hint)
SELECT seed.left_word, seed.right_word, seed.relation, seed.category, seed.difficulty, seed.hint
FROM (
  SELECT 'Kinematografija' AS left_word, 'Svjetlo' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kinematografija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kinematografija' AS left_word, 'Pokret' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kinematografija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Carstvo' AS left_word, 'Vladar' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Carstvo" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Carstvo' AS left_word, 'Granice' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Carstvo" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Bitka' AS left_word, 'Vojska' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Bitka" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Bitka' AS left_word, 'Sukob' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Bitka" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Spomenik' AS left_word, 'Proslo' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Spomenik" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Spomenik' AS left_word, 'Kamen' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Spomenik" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Dinastija' AS left_word, 'Porodica' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Dinastija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Dinastija' AS left_word, 'Prijesto' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Dinastija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Hronika' AS left_word, 'Zapis' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Hronika" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Hronika' AS left_word, 'Godine' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Hronika" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Arheologija' AS left_word, 'Iskopavanje' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Arheologija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Arheologija' AS left_word, 'Predmeti' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Arheologija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Reforma' AS left_word, 'Promjena' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Reforma" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Reforma' AS left_word, 'Drustvo' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Reforma" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kolonizacija' AS left_word, 'Naseljavanje' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kolonizacija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kolonizacija' AS left_word, 'Osvajanje' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kolonizacija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Hronologija' AS left_word, 'Vrijeme' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Hronologija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Hronologija' AS left_word, 'Redosljed' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Hronologija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kisa' AS left_word, 'Oblak' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Kisa" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kisa' AS left_word, 'Kap' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Kisa" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Vjetar' AS left_word, 'Povjetarac' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Vjetar" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Vjetar' AS left_word, 'Smjer' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Vjetar" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Jezero' AS left_word, 'Voda' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Jezero" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Jezero' AS left_word, 'Obala' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Jezero" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Planina' AS left_word, 'Vrh' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Planina" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Planina' AS left_word, 'Uspon' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Planina" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Lednik' AS left_word, 'Led' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Lednik" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Lednik' AS left_word, 'Hladnoca' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Lednik" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Delta' AS left_word, 'Rijeka' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Delta" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Delta' AS left_word, 'Usce' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Delta" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Biosfera' AS left_word, 'Zivot' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Biosfera" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Biosfera' AS left_word, 'Planeta' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Biosfera" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Atmosfera' AS left_word, 'Vazduh' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Atmosfera" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Atmosfera' AS left_word, 'Sloj' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Atmosfera" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Roman' AS left_word, 'Likovi' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Roman" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Roman' AS left_word, 'Poglavlje' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Roman" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Freska' AS left_word, 'Zid' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Freska" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Freska' AS left_word, 'Boja' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Freska" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Galerija' AS left_word, 'Izlozba' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Galerija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Galerija' AS left_word, 'Slike' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Galerija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Portret' AS left_word, 'Lice' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Portret" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Portret' AS left_word, 'Figura' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Portret" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Koreografija' AS left_word, 'Pokret' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Koreografija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Koreografija' AS left_word, 'Ples' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Koreografija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Drama' AS left_word, 'Pozornica' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Drama" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Drama' AS left_word, 'Likovi' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Drama" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Instalacija' AS left_word, 'Prostor' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Instalacija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Instalacija' AS left_word, 'Objekti' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Instalacija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ekspresionizam' AS left_word, 'Emocija' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Ekspresionizam" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ekspresionizam' AS left_word, 'Pravac' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Ekspresionizam" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kompozicija' AS left_word, 'Raspored' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kompozicija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kompozicija' AS left_word, 'Oblik' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kompozicija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Lozinka' AS left_word, 'Prijava' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Lozinka" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Lozinka' AS left_word, 'Sigurnost' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Lozinka" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Dron' AS left_word, 'Leti' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Dron" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Dron' AS left_word, 'Kamera' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Dron" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Mreza' AS left_word, 'Konekcija' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Mreza" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Mreza' AS left_word, 'Racunari' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Mreza" sa jednim od njegovih tragova.' AS hint
) AS seed
LEFT JOIN relation_challenges existing
  ON LOWER(existing.left_word) = LOWER(seed.left_word)
 AND LOWER(existing.right_word) = LOWER(seed.right_word)
 AND existing.relation = seed.relation
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
WHERE existing.id IS NULL;


INSERT INTO relation_challenges (left_word, right_word, relation, category, difficulty, hint)
SELECT seed.left_word, seed.right_word, seed.relation, seed.category, seed.difficulty, seed.hint
FROM (
  SELECT 'Server' AS left_word, 'Host' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Server" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Server' AS left_word, 'Zahtjev' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Server" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Interfejs' AS left_word, 'Ekran' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Interfejs" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Interfejs' AS left_word, 'Dugme' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Interfejs" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Baza podataka' AS left_word, 'Tabela' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Baza podataka" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Baza podataka' AS left_word, 'Upit' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Baza podataka" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Enkripcija' AS left_word, 'Sigurnost' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Enkripcija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Enkripcija' AS left_word, 'Kodiranje' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Enkripcija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Automatizacija' AS left_word, 'Proces' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Automatizacija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Automatizacija' AS left_word, 'Usteda vremena' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Automatizacija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kibernetika' AS left_word, 'Kontrola' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kibernetika" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kibernetika' AS left_word, 'Sistem' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kibernetika" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ostrvo' AS left_word, 'More' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Ostrvo" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ostrvo' AS left_word, 'Kopno' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Ostrvo" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kanjon' AS left_word, 'Rijeka' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Kanjon" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kanjon' AS left_word, 'Stijene' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Kanjon" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ravnica' AS left_word, 'Nizija' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Ravnica" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ravnica' AS left_word, 'Ravno' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Ravnica" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Granica' AS left_word, 'Drzava' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Granica" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Granica' AS left_word, 'Linija' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Granica" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Topografija' AS left_word, 'Reljef' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Topografija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Topografija' AS left_word, 'Visina' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Topografija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kartografija' AS left_word, 'Mapa' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kartografija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kartografija' AS left_word, 'Projekcija' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kartografija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Geopolitika' AS left_word, 'Drzave' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Geopolitika" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Geopolitika' AS left_word, 'Moc' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Geopolitika" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Čempres' AS left_word, 'Drvo' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Čempres" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Čempres' AS left_word, 'Vitko' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Čempres" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Čitač' AS left_word, 'Kartica' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Čitač" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Čitač' AS left_word, 'Senzor' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Čitač" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Žubor' AS left_word, 'Voda' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Žubor" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Žubor' AS left_word, 'Potok' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Žubor" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Molekul' AS left_word, 'Atomi' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Molekul" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Molekul' AS left_word, 'Veza' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Molekul" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Element' AS left_word, 'Periodni sistem' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Element" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Element' AS left_word, 'Hemija' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Element" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Genom' AS left_word, 'DNK' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Genom" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Genom' AS left_word, 'Nasljedje' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Genom" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Odbojka' AS left_word, 'Mreza' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Odbojka" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Odbojka' AS left_word, 'Servis' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Odbojka" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Tenis' AS left_word, 'Reket' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Tenis" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Tenis' AS left_word, 'Mreza' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Tenis" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Hokej' AS left_word, 'Pak' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Hokej" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Hokej' AS left_word, 'Led' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Hokej" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Taktika' AS left_word, 'Plan' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Taktika" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Taktika' AS left_word, 'Protivnik' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Taktika" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Formacija' AS left_word, 'Raspored' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Formacija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Formacija' AS left_word, 'Tim' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Formacija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Bioskop' AS left_word, 'Platno' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Bioskop" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Bioskop' AS left_word, 'Sala' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Bioskop" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Audicija' AS left_word, 'Uloga' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Audicija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Audicija' AS left_word, 'Izbor' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Audicija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Storyboard' AS left_word, 'Kadar' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Storyboard" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Storyboard' AS left_word, 'Skica' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Storyboard" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Scenografija' AS left_word, 'Dekor' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Scenografija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Scenografija' AS left_word, 'Prostor' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Scenografija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Tvrdjava' AS left_word, 'Zidine' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Tvrdjava" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Tvrdjava' AS left_word, 'Odbrana' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Tvrdjava" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kraljevina' AS left_word, 'Kruna' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Kraljevina" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kraljevina' AS left_word, 'Vladar' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Kraljevina" sa jednim od njegovih tragova.' AS hint
) AS seed
LEFT JOIN relation_challenges existing
  ON LOWER(existing.left_word) = LOWER(seed.left_word)
 AND LOWER(existing.right_word) = LOWER(seed.right_word)
 AND existing.relation = seed.relation
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
WHERE existing.id IS NULL;


INSERT INTO relation_challenges (left_word, right_word, relation, category, difficulty, hint)
SELECT seed.left_word, seed.right_word, seed.relation, seed.category, seed.difficulty, seed.hint
FROM (
  SELECT 'Dekret' AS left_word, 'Odluka' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Dekret" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Dekret' AS left_word, 'Vladar' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Dekret" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Vodopad' AS left_word, 'Rijeka' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Vodopad" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Vodopad' AS left_word, 'Visina' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Vodopad" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Livada' AS left_word, 'Trava' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Livada" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Livada' AS left_word, 'Cvijece' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Livada" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Gejzir' AS left_word, 'Para' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Gejzir" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Gejzir' AS left_word, 'Vrela voda' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Gejzir" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Balet' AS left_word, 'Ples' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Balet" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Balet' AS left_word, 'Pozornica' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Balet" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Basna' AS left_word, 'Pouka' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Basna" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Basna' AS left_word, 'Zivotinje' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Basna" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Mural' AS left_word, 'Zid' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Mural" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Mural' AS left_word, 'Boje' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Mural" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Alegorija' AS left_word, 'Simbolika' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Alegorija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Alegorija' AS left_word, 'Znacenje' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Alegorija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kontrast' AS left_word, 'Suprotnost' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kontrast" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kontrast' AS left_word, 'Svjetlo' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kontrast" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kursor' AS left_word, 'Mis' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Kursor" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kursor' AS left_word, 'Ekran' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Kursor" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Pretrazivac' AS left_word, 'Internet' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Pretrazivac" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Pretrazivac' AS left_word, 'Kartice' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Pretrazivac" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Virtuelizacija' AS left_word, 'Server' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Virtuelizacija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Virtuelizacija' AS left_word, 'Resursi' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Virtuelizacija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Telemetrija' AS left_word, 'Mjerenje' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Telemetrija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Telemetrija' AS left_word, 'Senzori' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Telemetrija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Rt' AS left_word, 'Obala' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Rt" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Rt' AS left_word, 'More' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Rt" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Globus' AS left_word, 'Zemlja' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Globus" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Globus' AS left_word, 'Model' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Globus" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kanal' AS left_word, 'Voda' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kanal" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kanal' AS left_word, 'Prolaz' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kanal" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Platno' AS left_word, 'Projekcija' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Platno" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Platno' AS left_word, 'Bioskop' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Platno" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Titl' AS left_word, 'Tekst' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Titl" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Titl' AS left_word, 'Prevod' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Titl" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Producent' AS left_word, 'Budzet' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Producent" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Producent' AS left_word, 'Organizacija' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Producent" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kasting' AS left_word, 'Uloga' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Kasting" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kasting' AS left_word, 'Izbor' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Kasting" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Mizanscen' AS left_word, 'Raspored' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Mizanscen" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Mizanscen' AS left_word, 'Scena' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Mizanscen" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Drzava' AS left_word, 'Granice' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Drzava" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Drzava' AS left_word, 'Gradjani' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Drzava" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Okean' AS left_word, 'Voda' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Okean" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Okean' AS left_word, 'Talasi' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Okean" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Klima' AS left_word, 'Temperatura' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Klima" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Klima' AS left_word, 'Padavine' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Klima" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Regija' AS left_word, 'Oblast' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Regija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Regija' AS left_word, 'Podrucje' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Regija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Longituda' AS left_word, 'Duzina' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Longituda" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Longituda' AS left_word, 'Koordinate' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Longituda" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Geomorfologija' AS left_word, 'Reljef' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Geomorfologija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Geomorfologija' AS left_word, 'Oblici tla' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Geomorfologija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Vitez' AS left_word, 'Oklop' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Vitez" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Vitez' AS left_word, 'Mac' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Vitez" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Traktat' AS left_word, 'Sporazum' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Traktat" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Traktat' AS left_word, 'Drzave' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Traktat" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Manifest' AS left_word, 'Ideje' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Manifest" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Manifest' AS left_word, 'Pokret' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Manifest" sa jednim od njegovih tragova.' AS hint
) AS seed
LEFT JOIN relation_challenges existing
  ON LOWER(existing.left_word) = LOWER(seed.left_word)
 AND LOWER(existing.right_word) = LOWER(seed.right_word)
 AND existing.relation = seed.relation
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
WHERE existing.id IS NULL;


INSERT INTO relation_challenges (left_word, right_word, relation, category, difficulty, hint)
SELECT seed.left_word, seed.right_word, seed.relation, seed.category, seed.difficulty, seed.hint
FROM (
  SELECT 'Magnet' AS left_word, 'Privlacenje' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Magnet" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Magnet' AS left_word, 'Metal' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Magnet" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Epruveta' AS left_word, 'Staklo' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Epruveta" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Epruveta' AS left_word, 'Uzorak' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Epruveta" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Teorija' AS left_word, 'Objasnjenje' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Teorija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Teorija' AS left_word, 'Dokaz' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Teorija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Entropija' AS left_word, 'Nered' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Entropija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Entropija' AS left_word, 'Energija' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Entropija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Izvor' AS left_word, 'Voda' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Izvor" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Izvor' AS left_word, 'Pocetak toka' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Izvor" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Koral' AS left_word, 'More' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Koral" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Koral' AS left_word, 'Hrid' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Koral" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Erozija' AS left_word, 'Tlo' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Erozija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Erozija' AS left_word, 'Voda' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Erozija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Sediment' AS left_word, 'Naslage' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Sediment" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Sediment' AS left_word, 'Cestice' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Sediment" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Trening' AS left_word, 'Vjezba' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Trening" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Trening' AS left_word, 'Priprema' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Trening" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ofsajd' AS left_word, 'Napad' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Ofsajd" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ofsajd' AS left_word, 'Pravila' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Ofsajd" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Penal' AS left_word, 'Kazna' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Penal" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Penal' AS left_word, 'Sut' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Penal" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Baterija' AS left_word, 'Energija' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Baterija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Baterija' AS left_word, 'Punjenje' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Baterija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Domen' AS left_word, 'Web' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Domen" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Domen' AS left_word, 'Adresa' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Domen" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ruter' AS left_word, 'Mreza' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Ruter" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ruter' AS left_word, 'Signal' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Ruter" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Latencija' AS left_word, 'Kasnjenje' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Latencija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Latencija' AS left_word, 'Mreza' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Latencija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Strip' AS left_word, 'Kadrovi' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Strip" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Strip' AS left_word, 'Crtez' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Strip" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Maska' AS left_word, 'Lice' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Maska" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Maska' AS left_word, 'Pozornica' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Maska" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Recital' AS left_word, 'Izvodjenje' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Recital" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Recital' AS left_word, 'Publika' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Recital" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Arija' AS left_word, 'Opera' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Arija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Arija' AS left_word, 'Solo' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Arija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Minimalizam' AS left_word, 'Svedeno' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Minimalizam" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Minimalizam' AS left_word, 'Forma' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Minimalizam" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Impresionizam' AS left_word, 'Svjetlo' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Impresionizam" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Impresionizam' AS left_word, 'Potezi' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Impresionizam" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Mikroskop' AS left_word, 'Socivo' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Mikroskop" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Mikroskop' AS left_word, 'Uvecanje' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Mikroskop" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Orbita' AS left_word, 'Planeta' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Orbita" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Orbita' AS left_word, 'Kretanje' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Orbita" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Genetika' AS left_word, 'Nasljedje' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Genetika" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Genetika' AS left_word, 'DNK' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Genetika" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Fosil' AS left_word, 'Kamen' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Fosil" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Fosil' AS left_word, 'Ostatak' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Fosil" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Hormon' AS left_word, 'Organizam' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Hormon" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Hormon' AS left_word, 'Signal' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Hormon" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Meteorologija' AS left_word, 'Vrijeme' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Meteorologija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Meteorologija' AS left_word, 'Prognoza' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Meteorologija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Tektonika' AS left_word, 'Ploce' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Tektonika" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Tektonika' AS left_word, 'Zemljotres' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Tektonika" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Boks' AS left_word, 'Rukavice' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Boks" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Boks' AS left_word, 'Ring' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Boks" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kajak' AS left_word, 'Veslo' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Kajak" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kajak' AS left_word, 'Rijeka' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Kajak" sa jednim od njegovih tragova.' AS hint
) AS seed
LEFT JOIN relation_challenges existing
  ON LOWER(existing.left_word) = LOWER(seed.left_word)
 AND LOWER(existing.right_word) = LOWER(seed.right_word)
 AND existing.relation = seed.relation
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
WHERE existing.id IS NULL;


INSERT INTO relation_challenges (left_word, right_word, relation, category, difficulty, hint)
SELECT seed.left_word, seed.right_word, seed.relation, seed.category, seed.difficulty, seed.hint
FROM (
  SELECT 'Sudija' AS left_word, 'Pistaljka' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Sudija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Sudija' AS left_word, 'Pravila' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Sudija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Sprint' AS left_word, 'Brzina' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Sprint" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Sprint' AS left_word, 'Staza' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Sprint" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Jedrenje' AS left_word, 'Vjetar' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Jedrenje" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Jedrenje' AS left_word, 'Jedro' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Jedrenje" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kapiten' AS left_word, 'Tim' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kapiten" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kapiten' AS left_word, 'Vodja' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kapiten" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Turnir' AS left_word, 'Parovi' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Turnir" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Turnir' AS left_word, 'Runda' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Turnir" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Finale' AS left_word, 'Zavrsnica' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Finale" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Finale' AS left_word, 'Pehar' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Finale" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Dubler' AS left_word, 'Zamjena' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Dubler" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Dubler' AS left_word, 'Glumac' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Dubler" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Sinopsis' AS left_word, 'Prica' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Sinopsis" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Sinopsis' AS left_word, 'Kratak opis' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Sinopsis" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Festival' AS left_word, 'Projekcije' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Festival" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Festival' AS left_word, 'Nagrade' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Festival" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Animacija' AS left_word, 'Crtanje' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Animacija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Animacija' AS left_word, 'Pokret' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Animacija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Rasvjeta' AS left_word, 'Svjetlo' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Rasvjeta" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Rasvjeta' AS left_word, 'Set' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Rasvjeta" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Trilogija' AS left_word, 'Tri dijela' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Trilogija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Trilogija' AS left_word, 'Nastavak' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Trilogija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Povelja' AS left_word, 'Dokument' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Povelja" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Povelja' AS left_word, 'Pravo' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Povelja" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ustanak' AS left_word, 'Pobuna' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Ustanak" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ustanak' AS left_word, 'Narod' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Ustanak" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Arhiv' AS left_word, 'Dokumenti' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Arhiv" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Arhiv' AS left_word, 'Cuvanje' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Arhiv" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Opsada' AS left_word, 'Grad' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Opsada" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Opsada' AS left_word, 'Vojska' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Opsada" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Bastina' AS left_word, 'Nasljedje' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Bastina" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Bastina' AS left_word, 'Spomenici' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Bastina" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Imperator' AS left_word, 'Carstvo' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Imperator" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Imperator' AS left_word, 'Vladar' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Imperator" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Republika' AS left_word, 'Drzava' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Republika" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Republika' AS left_word, 'Gradjani' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Republika" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Hronicar' AS left_word, 'Zapisi' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Hronicar" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Hronicar' AS left_word, 'Svjedok' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Hronicar" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Potok' AS left_word, 'Voda' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Potok" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Potok' AS left_word, 'Tok' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Potok" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Duga' AS left_word, 'Boje' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Duga" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Duga' AS left_word, 'Kisa' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Duga" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Sjeme' AS left_word, 'Biljka' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Sjeme" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Sjeme' AS left_word, 'Rast' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Sjeme" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Munja' AS left_word, 'Oluja' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Munja" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Munja' AS left_word, 'Bljesak' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Munja" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Pustinja' AS left_word, 'Pijesak' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Pustinja" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Pustinja' AS left_word, 'Susa' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Pustinja" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Uvala' AS left_word, 'Obala' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Uvala" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Uvala' AS left_word, 'More' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Uvala" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Mahovina' AS left_word, 'Vlaga' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Mahovina" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Mahovina' AS left_word, 'Kamen' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Mahovina" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Plima' AS left_word, 'More' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Plima" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Plima' AS left_word, 'Mjesec' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Plima" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Atelje' AS left_word, 'Platno' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Atelje" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Atelje' AS left_word, 'Boje' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Atelje" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Sonata' AS left_word, 'Klavir' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Sonata" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Sonata' AS left_word, 'Stavovi' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Sonata" sa jednim od njegovih tragova.' AS hint
) AS seed
LEFT JOIN relation_challenges existing
  ON LOWER(existing.left_word) = LOWER(seed.left_word)
 AND LOWER(existing.right_word) = LOWER(seed.right_word)
 AND existing.relation = seed.relation
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
WHERE existing.id IS NULL;


INSERT INTO relation_challenges (left_word, right_word, relation, category, difficulty, hint)
SELECT seed.left_word, seed.right_word, seed.relation, seed.category, seed.difficulty, seed.hint
FROM (
  SELECT 'Mozaik' AS left_word, 'Kockice' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Mozaik" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Mozaik' AS left_word, 'Slika' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Mozaik" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Dirigent' AS left_word, 'Orkestar' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Dirigent" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Dirigent' AS left_word, 'Palica' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Dirigent" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Gravura' AS left_word, 'Metal' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Gravura" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Gravura' AS left_word, 'Otisak' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Gravura" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Procesor' AS left_word, 'Cip' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Procesor" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Procesor' AS left_word, 'Racunanje' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Procesor" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Senzor' AS left_word, 'Mjerenje' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Senzor" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Senzor' AS left_word, 'Signal' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Senzor" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Aplikacija' AS left_word, 'Telefon' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Aplikacija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Aplikacija' AS left_word, 'Program' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Aplikacija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Protokol' AS left_word, 'Pravila' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Protokol" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Protokol' AS left_word, 'Mreza' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Protokol" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Bekap' AS left_word, 'Kopija' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Bekap" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Bekap' AS left_word, 'Sigurnost' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Bekap" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kompajler' AS left_word, 'Kod' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kompajler" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kompajler' AS left_word, 'Prevodjenje' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kompajler" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Robotika' AS left_word, 'Masina' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Robotika" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Robotika' AS left_word, 'Automatika' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Robotika" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Satelit' AS left_word, 'Orbita' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Satelit" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Satelit' AS left_word, 'Signal' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Satelit" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Zaliv' AS left_word, 'More' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Zaliv" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Zaliv' AS left_word, 'Obala' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Zaliv" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Fjord' AS left_word, 'More' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Fjord" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Fjord' AS left_word, 'Planine' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Fjord" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ekvator' AS left_word, 'Zemlja' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Ekvator" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ekvator' AS left_word, 'Sirina' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Ekvator" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Meridian' AS left_word, 'Duzina' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Meridian" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Meridian' AS left_word, 'Mapa' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Meridian" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Laguna' AS left_word, 'Plicak' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Laguna" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Laguna' AS left_word, 'More' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Laguna" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Klisura' AS left_word, 'Rijeka' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Klisura" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Klisura' AS left_word, 'Usjek' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Klisura" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kontinent' AS left_word, 'Kopno' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kontinent" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kontinent' AS left_word, 'Velicina' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kontinent" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Tjesnac' AS left_word, 'More' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Tjesnac" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Tjesnac' AS left_word, 'Prolaz' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Tjesnac" sa jednim od njegovih tragova.' AS hint
) AS seed
LEFT JOIN relation_challenges existing
  ON LOWER(existing.left_word) = LOWER(seed.left_word)
 AND LOWER(existing.right_word) = LOWER(seed.right_word)
 AND existing.relation = seed.relation
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
WHERE existing.id IS NULL;


DELETE duplicate
FROM association_words duplicate
JOIN association_words existing
  ON LOWER(duplicate.word) = LOWER(existing.word)
 AND duplicate.id > existing.id;


DELETE duplicate
FROM logic_challenges duplicate
JOIN logic_challenges existing
  ON duplicate.mode = existing.mode
 AND LOWER(duplicate.answer) = LOWER(existing.answer)
 AND duplicate.category = existing.category
 AND duplicate.difficulty = existing.difficulty
 AND (
      duplicate.mode <> 'odd-one-out'
      OR CAST(duplicate.words_json AS CHAR(1000)) = CAST(existing.words_json AS CHAR(1000))
    )
 AND duplicate.id > existing.id;


DELETE duplicate
FROM relation_challenges duplicate
JOIN relation_challenges existing
  ON LOWER(duplicate.left_word) = LOWER(existing.left_word)
 AND LOWER(duplicate.right_word) = LOWER(existing.right_word)
 AND duplicate.relation = existing.relation
 AND duplicate.category = existing.category
 AND duplicate.difficulty = existing.difficulty
 AND duplicate.id > existing.id;

UPDATE association_words
SET clues_json = CAST('["More","Hrid","Kolonija","Organizam"]' AS JSON)
WHERE word = 'Koral';


INSERT INTO game_submissions (user_label, game_type, content, points, time_seconds, status, is_daily, created_at)
SELECT seed.user_label, seed.game_type, seed.content, seed.points, seed.time_seconds, seed.status, seed.is_daily, seed.created_at
FROM (
  SELECT 'demo_mia' AS user_label, 'Asocijacija' AS game_type, 'Atom -> atom | Galaksija -> galaksija | More -> more' AS content, 260 AS points, 74 AS time_seconds, 'pending' AS status, 0 AS is_daily, '2026-04-01 11:00:00' AS created_at
  UNION ALL SELECT 'demo_nikola' AS user_label, 'Logicki test' AS game_type, 'Teleskop, Planeta, Zvijezda -> Astronomija' AS content, 220 AS points, 55 AS time_seconds, 'approved' AS status, 0 AS is_daily, '2026-04-02 12:00:00' AS created_at
  UNION ALL SELECT 'demo_lana' AS user_label, 'Ne pripada' AS game_type, 'Bor, Hrast, Jela, Tablet -> Tablet' AS content, 180 AS points, 48 AS time_seconds, 'flagged' AS status, 0 AS is_daily, '2026-04-03 13:00:00' AS created_at
  UNION ALL SELECT 'demo_marko' AS user_label, 'Lanac rijeci' AS game_type, 'centar: program | softver | kvar | robot | algoritam' AS content, 245 AS points, 81 AS time_seconds, 'pending' AS status, 0 AS is_daily, '2026-04-04 14:00:00' AS created_at
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
  UNION ALL SELECT 'demo_nikola' AS username, 'association' AS game_type, 1880 AS score, 1380 AS base_score, 180 AS earned_points, 680 AS awarded_points, 1 AS total, 1 AS correct, 100 AS accuracy, 19 AS time_seconds, 'Nauka' AS category, 'Srednje' AS difficulty, 1 AS hint_count, 1 AS is_daily, 500 AS daily_reward, '2026-04-07 09:00:00' AS created_at
  UNION ALL SELECT 'demo_lana' AS username, 'word-chain' AS game_type, 1540 AS score, 1540 AS base_score, 270 AS earned_points, 270 AS awarded_points, 5 AS total, 5 AS correct, 100 AS accuracy, 63 AS time_seconds, 'Geografija' AS category, 'Tesko' AS difficulty, 0 AS hint_count, 0 AS is_daily, 0 AS daily_reward, '2026-04-05 18:00:00' AS created_at
  UNION ALL SELECT 'demo_marko' AS username, 'logic' AS game_type, 1470 AS score, 1440 AS base_score, 200 AS earned_points, 200 AS awarded_points, 4 AS total, 4 AS correct, 100 AS accuracy, 47 AS time_seconds, 'Sport' AS category, 'Tesko' AS difficulty, 0 AS hint_count, 0 AS is_daily, 0 AS daily_reward, '2026-04-07 20:00:00' AS created_at
  UNION ALL SELECT 'demo_sara' AS username, 'relation' AS game_type, 1490 AS score, 1460 AS base_score, 190 AS earned_points, 190 AS awarded_points, 4 AS total, 4 AS correct, 100 AS accuracy, 24 AS time_seconds, 'Priroda' AS category, 'Lako' AS difficulty, 0 AS hint_count, 0 AS is_daily, 0 AS daily_reward, '2026-04-05 15:10:00' AS created_at
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
WHERE LOWER(a.word) = 'galaksija' AND existing.id IS NULL
LIMIT 1;

INSERT INTO daily_challenge_completions (user_id, challenge_date, content_type, content_id, reward, created_at)
SELECT u.id, CURDATE(), 'association', a.id, 500, NOW()
FROM users u
JOIN association_words a ON LOWER(a.word) = 'galaksija'
LEFT JOIN daily_challenge_completions existing
  ON existing.user_id = u.id
 AND existing.challenge_date = CURDATE()
WHERE u.username = 'demo_nikola'
  AND existing.id IS NULL
LIMIT 1;

COMMIT;
