USE word_association_lab;
SET NAMES utf8mb4;

START TRANSACTION;

-- Mega seed generated automatically.
-- Associations: 94
-- Logic challenges: 133
-- Relation challenges: 130


INSERT INTO users (username, password_hash, role, points, level)
VALUES
  ('admin_seed', '$2b$10$OUGNqJyjODwfazder.4pq.7lMjUkTBMdsLO7H18nBU.4qxyBQvD1y', 'admin', 1500, 2),
  ('demo_mia', '$2b$10$govgupEAZNu4RZcrFx5WgOFB6x6AmX7X4lSAoAuwpajNT5l4HBx6C', 'user', 570, 1),
  ('demo_nikola', '$2b$10$nSHRoJsqEeyNWH9hdbIOM.DJm2aiCBzQzXEfBYepcWusrcv3XQKkq', 'user', 1210, 2),
  ('demo_lana', '$2b$10$EQWNA1fH/FG0OFwNu4hqe.dPXuXF2dLCy3nA/OX0or1J41EYp9kWK', 'user', 880, 1),
  ('demo_marko', '$2b$10$LIxTCF7cEucWE0cs3cICH.i6PUKCZ4wqo.yFhdgPsUUUxKd6iO6Fq', 'user', 1045, 2),
  ('demo_sara', '$2b$10$vxXVXsRjp4uwbtyki4p1TepLOmd0QvkZi4Kmg.qXohAZBqU0vYNmq', 'user', 690, 1)
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  points = VALUES(points),
  level = VALUES(level);


INSERT INTO association_words (word, category, difficulty, clues_json, hint, accepted_answers_json)
SELECT seed.word, seed.category, seed.difficulty, seed.clues_json, seed.hint, seed.accepted_answers_json
FROM (
  SELECT 'Atom' AS word, 'Nauka' AS category, 'Lako' AS difficulty, '["Jezgro","Elektron","Hemija","Cestica"]' AS clues_json, 'Osnovna jedinica materije.' AS hint, '["atom"]' AS accepted_answers_json
  UNION ALL SELECT 'Galaksija' AS word, 'Nauka' AS category, 'Srednje' AS difficulty, '["Zvijezde","Svemir","Orbita","Mlijevni put"]' AS clues_json, 'Ogromna grupa zvijezda i kosmickog materijala.' AS hint, '["galaksija"]' AS accepted_answers_json
  UNION ALL SELECT 'Gravitacija' AS word, 'Nauka' AS category, 'Tesko' AS difficulty, '["Pad","Privlacnost","Masa","Njutn"]' AS clues_json, 'Sila koja privlaci tijela jedno drugom.' AS hint, '["gravitacija"]' AS accepted_answers_json
  UNION ALL SELECT 'Fudbal' AS word, 'Sport' AS category, 'Lako' AS difficulty, '["Gol","Lopta","Stadion","Sudija"]' AS clues_json, 'Sport koji se igra najcesce nogom i loptom.' AS hint, '["fudbal"]' AS accepted_answers_json
  UNION ALL SELECT 'Maraton' AS word, 'Sport' AS category, 'Srednje' AS difficulty, '["42 kilometra","Izdrzljivost","Staza","Trkac"]' AS clues_json, 'Dugacka trkacka disciplina.' AS hint, '["maraton"]' AS accepted_answers_json
  UNION ALL SELECT 'Gimnastika' AS word, 'Sport' AS category, 'Tesko' AS difficulty, '["Greda","Parter","Salto","Ravnoteza"]' AS clues_json, 'Sport koji trazi koordinaciju i kontrolu tijela.' AS hint, '["gimnastika"]' AS accepted_answers_json
  UNION ALL SELECT 'Kamera' AS word, 'Film' AS category, 'Lako' AS difficulty, '["Snimanje","Objektiv","Scena","Kadar"]' AS clues_json, 'Uredjaj bez kojeg nema snimanja filma.' AS hint, '["kamera"]' AS accepted_answers_json
  UNION ALL SELECT 'Scenario' AS word, 'Film' AS category, 'Srednje' AS difficulty, '["Dijalog","Likovi","Zaplet","Scenarista"]' AS clues_json, 'Pisani plan filma ili serije.' AS hint, '["scenario"]' AS accepted_answers_json
  UNION ALL SELECT 'Montaza' AS word, 'Film' AS category, 'Tesko' AS difficulty, '["Rez","Ritam","Postprodukcija","Kadrove"]' AS clues_json, 'Spajanje i uredjivanje snimljenog materijala.' AS hint, '["montaza"]' AS accepted_answers_json
  UNION ALL SELECT 'Piramida' AS word, 'Istorija' AS category, 'Lako' AS difficulty, '["Egipat","Faraon","Pustinja","Grobnica"]' AS clues_json, 'Gradjevina najpoznatija iz starog Egipta.' AS hint, '["piramida"]' AS accepted_answers_json
  UNION ALL SELECT 'Renesansa' AS word, 'Istorija' AS category, 'Srednje' AS difficulty, '["Leonardo","Humanizam","Firenca","Preporod"]' AS clues_json, 'Istorijski period preporoda umjetnosti i nauke.' AS hint, '["renesansa"]' AS accepted_answers_json
  UNION ALL SELECT 'Diplomatija' AS word, 'Istorija' AS category, 'Tesko' AS difficulty, '["Pregovori","Ambasada","Sporazum","Drzava"]' AS clues_json, 'Umijece vodjenja medjudrzavnih odnosa.' AS hint, '["diplomatija"]' AS accepted_answers_json
  UNION ALL SELECT 'Sunce' AS word, 'Priroda' AS category, 'Lako' AS difficulty, '["Dan","Toplota","Svjetlost","Ljeto"]' AS clues_json, 'Nebesko tijelo koje nam daje svjetlost i toplotu.' AS hint, '["sunce"]' AS accepted_answers_json
  UNION ALL SELECT 'More' AS word, 'Priroda' AS category, 'Srednje' AS difficulty, '["Talas","So","Plaza","Obala"]' AS clues_json, 'Velika slana vodena povrsina.' AS hint, '["more"]' AS accepted_answers_json
  UNION ALL SELECT 'Vulkan' AS word, 'Priroda' AS category, 'Tesko' AS difficulty, '["Lava","Krater","Erupcija","Pepeo"]' AS clues_json, 'Prirodna pojava povezana sa magmom i erupcijom.' AS hint, '["vulkan"]' AS accepted_answers_json
  UNION ALL SELECT 'Simfonija' AS word, 'Umjetnost' AS category, 'Lako' AS difficulty, '["Orkestar","Dirigent","Stav","Muzika"]' AS clues_json, 'Veliko muzicko djelo za orkestar.' AS hint, '["simfonija"]' AS accepted_answers_json
  UNION ALL SELECT 'Skulptura' AS word, 'Umjetnost' AS category, 'Srednje' AS difficulty, '["Klesanje","Mermer","Figura","Vajar"]' AS clues_json, 'Umjetnicko djelo oblikovano u prostoru.' AS hint, '["skulptura"]' AS accepted_answers_json
  UNION ALL SELECT 'Perspektiva' AS word, 'Umjetnost' AS category, 'Tesko' AS difficulty, '["Dubina","Linije","Prostor","Slikarstvo"]' AS clues_json, 'Likovni princip za prikaz prostora na ravnoj povrsini.' AS hint, '["perspektiva"]' AS accepted_answers_json
  UNION ALL SELECT 'Robot' AS word, 'Tehnologija' AS category, 'Lako' AS difficulty, '["Masina","Program","Senzor","Automatika"]' AS clues_json, 'Pametna masina koja moze izvrsavati zadatke.' AS hint, '["robot"]' AS accepted_answers_json
  UNION ALL SELECT 'Algoritam' AS word, 'Tehnologija' AS category, 'Srednje' AS difficulty, '["Koraci","Logika","Kod","Rjesenje"]' AS clues_json, 'Niz tacno odredjenih koraka za rjesavanje problema.' AS hint, '["algoritam"]' AS accepted_answers_json
  UNION ALL SELECT 'Mikrocip' AS word, 'Tehnologija' AS category, 'Tesko' AS difficulty, '["Procesor","Elektronika","Ploca","Tranzistor"]' AS clues_json, 'Mala komponenta sa integrisanim kolima.' AS hint, '["mikrocip","mikro cip"]' AS accepted_answers_json
  UNION ALL SELECT 'Atlas' AS word, 'Geografija' AS category, 'Lako' AS difficulty, '["Karta","Kontinent","Stranica","Planeta"]' AS clues_json, 'Zbirka geografskih karata.' AS hint, '["atlas"]' AS accepted_answers_json
  UNION ALL SELECT 'Arhipelag' AS word, 'Geografija' AS category, 'Srednje' AS difficulty, '["Ostrvo","Grupa","More","Obala"]' AS clues_json, 'Skup vise ostrva na istom prostoru.' AS hint, '["arhipelag"]' AS accepted_answers_json
  UNION ALL SELECT 'Meridijan' AS word, 'Geografija' AS category, 'Tesko' AS difficulty, '["Greenwich","Koordinate","Polovi","Duzina"]' AS clues_json, 'Zamisljena linija koja spaja polove Zemlje.' AS hint, '["meridijan"]' AS accepted_answers_json
  UNION ALL SELECT 'Neuron' AS word, 'Nauka' AS category, 'Lako' AS difficulty, '["Mozak","Signal","Sinapsa","Celija"]' AS clues_json, 'Specijalizovana nervna celija koja prenosi impulse.' AS hint, '["neuron"]' AS accepted_answers_json
  UNION ALL SELECT 'Formula' AS word, 'Nauka' AS category, 'Lako' AS difficulty, '["Simbol","Jednacina","Hemija","Broj"]' AS clues_json, 'Zapis koji predstavlja odnos ili sastav.' AS hint, '["formula"]' AS accepted_answers_json
  UNION ALL SELECT 'Teleskop' AS word, 'Nauka' AS category, 'Lako' AS difficulty, '["Svemir","Uvecanje","Zvijezde","Posmatranje"]' AS clues_json, 'Instrument za gledanje udaljenih nebeskih tijela.' AS hint, '["teleskop"]' AS accepted_answers_json
  UNION ALL SELECT 'Vakcina' AS word, 'Nauka' AS category, 'Srednje' AS difficulty, '["Imunitet","Doza","Zastita","Virus"]' AS clues_json, 'Preparat koji podstice razvoj zastite organizma.' AS hint, '["vakcina"]' AS accepted_answers_json
  UNION ALL SELECT 'Cestica' AS word, 'Nauka' AS category, 'Srednje' AS difficulty, '["Materija","Mikro","Fizika","Kretanje"]' AS clues_json, 'Vrlo mala jedinica materije.' AS hint, '["cestica"]' AS accepted_answers_json
  UNION ALL SELECT 'Laboratorija' AS word, 'Nauka' AS category, 'Srednje' AS difficulty, '["Eksperiment","Oprema","Ispitivanje","Naucnik"]' AS clues_json, 'Mjesto gdje se izvode naucna istrazivanja i testiranja.' AS hint, '["laboratorija"]' AS accepted_answers_json
  UNION ALL SELECT 'Spektar' AS word, 'Nauka' AS category, 'Tesko' AS difficulty, '["Boje","Talasi","Svjetlost","Analiza"]' AS clues_json, 'Raspored komponenti neke pojave, posebno svjetlosti.' AS hint, '["spektar"]' AS accepted_answers_json
  UNION ALL SELECT 'Evolucija' AS word, 'Nauka' AS category, 'Tesko' AS difficulty, '["Promjena","Vrsta","Vrijeme","Selekcija"]' AS clues_json, 'Postepeni razvoj zivih bica kroz vrijeme.' AS hint, '["evolucija"]' AS accepted_answers_json
  UNION ALL SELECT 'Katalizator' AS word, 'Nauka' AS category, 'Tesko' AS difficulty, '["Reakcija","Hemija","Ubrzanje","Proces"]' AS clues_json, 'Supstanca koja ubrzava hemijsku reakciju.' AS hint, '["katalizator"]' AS accepted_answers_json
  UNION ALL SELECT 'Kosarka' AS word, 'Sport' AS category, 'Lako' AS difficulty, '["Obruc","Dribling","Parket","Tim"]' AS clues_json, 'Sport u kojem se poeni osvajaju ubacivanjem lopte kroz obruc.' AS hint, '["kosarka"]' AS accepted_answers_json
  UNION ALL SELECT 'Plivanje' AS word, 'Sport' AS category, 'Lako' AS difficulty, '["Bazen","Voda","Staza","Zamah"]' AS clues_json, 'Sportska disciplina kretanja kroz vodu.' AS hint, '["plivanje"]' AS accepted_answers_json
  UNION ALL SELECT 'Reket' AS word, 'Sport' AS category, 'Lako' AS difficulty, '["Tenis","Mreza","Loptica","Udaranje"]' AS clues_json, 'Sportski rekvizit za udaranje loptice.' AS hint, '["reket"]' AS accepted_answers_json
  UNION ALL SELECT 'Trofej' AS word, 'Sport' AS category, 'Srednje' AS difficulty, '["Pehar","Finale","Pobjeda","Takmicenje"]' AS clues_json, 'Nagrada koja simbolizuje uspjeh na takmicenju.' AS hint, '["trofej"]' AS accepted_answers_json
  UNION ALL SELECT 'Kondicija' AS word, 'Sport' AS category, 'Srednje' AS difficulty, '["Forma","Izdrzljivost","Trening","Snaga"]' AS clues_json, 'Fizicka spremnost potrebna za dobar nastup.' AS hint, '["kondicija"]' AS accepted_answers_json
  UNION ALL SELECT 'Stadion' AS word, 'Sport' AS category, 'Srednje' AS difficulty, '["Tribine","Publika","Teren","Mec"]' AS clues_json, 'Veliki sportski objekat za utakmice i takmicenja.' AS hint, '["stadion"]' AS accepted_answers_json
  UNION ALL SELECT 'Triatlon' AS word, 'Sport' AS category, 'Tesko' AS difficulty, '["Plivanje","Biciklizam","Trcanje","Izdrzljivost"]' AS clues_json, 'Takmicenje koje spaja tri discipline.' AS hint, '["triatlon"]' AS accepted_answers_json
  UNION ALL SELECT 'Desetoboj' AS word, 'Sport' AS category, 'Tesko' AS difficulty, '["Atletika","Disciplina","Poeni","Deset"]' AS clues_json, 'Atletsko takmicenje sastavljeno od deset disciplina.' AS hint, '["desetoboj"]' AS accepted_answers_json
  UNION ALL SELECT 'Regata' AS word, 'Sport' AS category, 'Tesko' AS difficulty, '["Jedrenje","Voda","Trka","Brod"]' AS clues_json, 'Takmicenje jedrilica ili drugih plovila.' AS hint, '["regata"]' AS accepted_answers_json
  UNION ALL SELECT 'Reziser' AS word, 'Film' AS category, 'Lako' AS difficulty, '["Set","Vizija","Glumci","Snimanje"]' AS clues_json, 'Osoba koja vodi kreativni proces nastanka filma.' AS hint, '["reziser"]' AS accepted_answers_json
  UNION ALL SELECT 'Trejler' AS word, 'Film' AS category, 'Lako' AS difficulty, '["Najava","Kratko","Publika","Premijera"]' AS clues_json, 'Kratka najava filma namijenjena publici.' AS hint, '["trejler"]' AS accepted_answers_json
  UNION ALL SELECT 'Scena' AS word, 'Film' AS category, 'Lako' AS difficulty, '["Kadar","Glumci","Prizor","Radnja"]' AS clues_json, 'Jedan zaokruzen dio filmske radnje.' AS hint, '["scena"]' AS accepted_answers_json
  UNION ALL SELECT 'Kostim' AS word, 'Film' AS category, 'Srednje' AS difficulty, '["Lik","Odjeca","Scena","Dizajn"]' AS clues_json, 'Odjevna kombinacija koja pomaze oblikovanju filmskog lika.' AS hint, '["kostim"]' AS accepted_answers_json
  UNION ALL SELECT 'Kadrovanje' AS word, 'Film' AS category, 'Srednje' AS difficulty, '["Ugao","Kompozicija","Kamera","Prizor"]' AS clues_json, 'Nacin na koji je scena smjestena u kadar.' AS hint, '["kadrovanje"]' AS accepted_answers_json
  UNION ALL SELECT 'Premijera' AS word, 'Film' AS category, 'Srednje' AS difficulty, '["Crveni tepih","Publika","Prvo prikazivanje","Sala"]' AS clues_json, 'Prvo javno prikazivanje filma.' AS hint, '["premijera"]' AS accepted_answers_json
  UNION ALL SELECT 'Postprodukcija' AS word, 'Film' AS category, 'Tesko' AS difficulty, '["Montaza","Zvuk","Efekti","Finalna verzija"]' AS clues_json, 'Faza nakon snimanja u kojoj se film zavrsava.' AS hint, '["postprodukcija"]' AS accepted_answers_json
  UNION ALL SELECT 'Dokumentarac' AS word, 'Film' AS category, 'Tesko' AS difficulty, '["Cinjenice","Intervju","Naracija","Stvarnost"]' AS clues_json, 'Filmska forma zasnovana na stvarnim dogadjajima ili temama.' AS hint, '["dokumentarac"]' AS accepted_answers_json
  UNION ALL SELECT 'Kinematografija' AS word, 'Film' AS category, 'Tesko' AS difficulty, '["Svjetlo","Pokret","Kadar","Vizuelni stil"]' AS clues_json, 'Umijece stvaranja slike u filmu.' AS hint, '["kinematografija"]' AS accepted_answers_json
  UNION ALL SELECT 'Carstvo' AS word, 'Istorija' AS category, 'Lako' AS difficulty, '["Vladar","Granice","Narod","Moc"]' AS clues_json, 'Velika drzavna tvorevina pod jednom vlascu.' AS hint, '["carstvo"]' AS accepted_answers_json
  UNION ALL SELECT 'Bitka' AS word, 'Istorija' AS category, 'Lako' AS difficulty, '["Vojska","Sukob","Polje","Pobjeda"]' AS clues_json, 'Oruzani sukob dvije ili vise vojski.' AS hint, '["bitka"]' AS accepted_answers_json
  UNION ALL SELECT 'Spomenik' AS word, 'Istorija' AS category, 'Lako' AS difficulty, '["Proslo","Kamen","Sjecanje","Dogadjaj"]' AS clues_json, 'Obiljezje podignuto u cast necega iz proslosti.' AS hint, '["spomenik"]' AS accepted_answers_json
  UNION ALL SELECT 'Dinastija' AS word, 'Istorija' AS category, 'Srednje' AS difficulty, '["Porodica","Prijesto","Nasljedje","Vladari"]' AS clues_json, 'Niz vladara iz iste porodice.' AS hint, '["dinastija"]' AS accepted_answers_json
  UNION ALL SELECT 'Hronika' AS word, 'Istorija' AS category, 'Srednje' AS difficulty, '["Zapis","Godine","Dogadjaji","Proslo"]' AS clues_json, 'Redosljedni zapis vaznih dogadjaja.' AS hint, '["hronika"]' AS accepted_answers_json
  UNION ALL SELECT 'Arheologija' AS word, 'Istorija' AS category, 'Srednje' AS difficulty, '["Iskopavanje","Predmeti","Rusevine","Nalaziste"]' AS clues_json, 'Nauka o materijalnim ostacima proslih vremena.' AS hint, '["arheologija"]' AS accepted_answers_json
  UNION ALL SELECT 'Reforma' AS word, 'Istorija' AS category, 'Tesko' AS difficulty, '["Promjena","Drustvo","Institucije","Preuredjenje"]' AS clues_json, 'Velika promjena sistema ili pravila.' AS hint, '["reforma"]' AS accepted_answers_json
  UNION ALL SELECT 'Kolonizacija' AS word, 'Istorija' AS category, 'Tesko' AS difficulty, '["Naseljavanje","Osvajanje","More","Carstvo"]' AS clues_json, 'Proces osvajanja i naseljavanja novih teritorija.' AS hint, '["kolonizacija"]' AS accepted_answers_json
  UNION ALL SELECT 'Hronologija' AS word, 'Istorija' AS category, 'Tesko' AS difficulty, '["Vrijeme","Redosljed","Datumi","Dogadjaji"]' AS clues_json, 'Poredak dogadjaja prema vremenu desavanja.' AS hint, '["hronologija"]' AS accepted_answers_json
) AS seed
LEFT JOIN association_words existing ON LOWER(existing.word) = LOWER(seed.word)
WHERE existing.id IS NULL;


INSERT INTO association_words (word, category, difficulty, clues_json, hint, accepted_answers_json)
SELECT seed.word, seed.category, seed.difficulty, seed.clues_json, seed.hint, seed.accepted_answers_json
FROM (
  SELECT 'Kisa' AS word, 'Priroda' AS category, 'Lako' AS difficulty, '["Oblak","Kap","Vrijeme","Padavina"]' AS clues_json, 'Voda koja pada iz oblaka.' AS hint, '["kisa"]' AS accepted_answers_json
  UNION ALL SELECT 'Vjetar' AS word, 'Priroda' AS category, 'Lako' AS difficulty, '["Povjetarac","Smjer","Brzina","Vazduh"]' AS clues_json, 'Kretanje vazduha u atmosferi.' AS hint, '["vjetar"]' AS accepted_answers_json
  UNION ALL SELECT 'Jezero' AS word, 'Priroda' AS category, 'Lako' AS difficulty, '["Voda","Obala","Mirno","Dubina"]' AS clues_json, 'Veca stajaca vodena povrsina na kopnu.' AS hint, '["jezero"]' AS accepted_answers_json
  UNION ALL SELECT 'Planina' AS word, 'Priroda' AS category, 'Srednje' AS difficulty, '["Vrh","Uspon","Visina","Stijena"]' AS clues_json, 'Veliko uzvisenje sa izrazenim vrhovima.' AS hint, '["planina"]' AS accepted_answers_json
  UNION ALL SELECT 'Lednik' AS word, 'Priroda' AS category, 'Srednje' AS difficulty, '["Led","Hladnoca","Planina","Kretanje"]' AS clues_json, 'Velika masa leda koja se sporo pomjera.' AS hint, '["lednik"]' AS accepted_answers_json
  UNION ALL SELECT 'Delta' AS word, 'Priroda' AS category, 'Srednje' AS difficulty, '["Rijeka","Usce","Nanosi","Grananje"]' AS clues_json, 'Podrucje grananja rijeke pred usce.' AS hint, '["delta"]' AS accepted_answers_json
  UNION ALL SELECT 'Biosfera' AS word, 'Priroda' AS category, 'Tesko' AS difficulty, '["Zivot","Planeta","Sloj","Okolina"]' AS clues_json, 'Ukupan prostor Zemlje u kojem postoji zivot.' AS hint, '["biosfera"]' AS accepted_answers_json
  UNION ALL SELECT 'Atmosfera' AS word, 'Priroda' AS category, 'Tesko' AS difficulty, '["Vazduh","Sloj","Planeta","Pritisak"]' AS clues_json, 'Gasoviti omotac planete.' AS hint, '["atmosfera"]' AS accepted_answers_json
  UNION ALL SELECT 'Roman' AS word, 'Umjetnost' AS category, 'Lako' AS difficulty, '["Likovi","Poglavlje","Prica","Pisac"]' AS clues_json, 'Duze prozno knjizevno djelo.' AS hint, '["roman"]' AS accepted_answers_json
  UNION ALL SELECT 'Freska' AS word, 'Umjetnost' AS category, 'Lako' AS difficulty, '["Zid","Boja","Crkva","Malter"]' AS clues_json, 'Slikarsko djelo izvedeno na svjezem malteru.' AS hint, '["freska"]' AS accepted_answers_json
  UNION ALL SELECT 'Galerija' AS word, 'Umjetnost' AS category, 'Lako' AS difficulty, '["Izlozba","Slike","Posjetioci","Umjetnik"]' AS clues_json, 'Prostor za izlaganje umjetnickih djela.' AS hint, '["galerija"]' AS accepted_answers_json
  UNION ALL SELECT 'Portret' AS word, 'Umjetnost' AS category, 'Srednje' AS difficulty, '["Lice","Figura","Poza","Slikar"]' AS clues_json, 'Umjetnicki prikaz necijeg lika.' AS hint, '["portret"]' AS accepted_answers_json
  UNION ALL SELECT 'Koreografija' AS word, 'Umjetnost' AS category, 'Srednje' AS difficulty, '["Pokret","Ples","Ritam","Scena"]' AS clues_json, 'Osmisljeni raspored plesnih pokreta.' AS hint, '["koreografija"]' AS accepted_answers_json
  UNION ALL SELECT 'Drama' AS word, 'Umjetnost' AS category, 'Srednje' AS difficulty, '["Pozornica","Likovi","Sukob","Tekst"]' AS clues_json, 'Scensko ili knjizevno djelo zasnovano na radnji i konfliktu.' AS hint, '["drama"]' AS accepted_answers_json
  UNION ALL SELECT 'Instalacija' AS word, 'Umjetnost' AS category, 'Tesko' AS difficulty, '["Prostor","Objekti","Izlozba","Savremeno"]' AS clues_json, 'Savremeno umjetnicko djelo rasporedjeno u prostoru.' AS hint, '["instalacija"]' AS accepted_answers_json
  UNION ALL SELECT 'Ekspresionizam' AS word, 'Umjetnost' AS category, 'Tesko' AS difficulty, '["Emocija","Pravac","Boja","Deformacija"]' AS clues_json, 'Umjetnicki pravac naglasene ekspresije i unutrasnjeg dozivljaja.' AS hint, '["ekspresionizam"]' AS accepted_answers_json
  UNION ALL SELECT 'Kompozicija' AS word, 'Umjetnost' AS category, 'Tesko' AS difficulty, '["Raspored","Oblik","Balans","Cjelina"]' AS clues_json, 'Nacin organizovanja elemenata u umjetnickom djelu.' AS hint, '["kompozicija"]' AS accepted_answers_json
  UNION ALL SELECT 'Lozinka' AS word, 'Tehnologija' AS category, 'Lako' AS difficulty, '["Prijava","Sigurnost","Nalog","Karakteri"]' AS clues_json, 'Tajni niz znakova za pristup sistemu.' AS hint, '["lozinka"]' AS accepted_answers_json
  UNION ALL SELECT 'Dron' AS word, 'Tehnologija' AS category, 'Lako' AS difficulty, '["Leti","Kamera","Daljinski","Propeleri"]' AS clues_json, 'Letjelica kojom se upravlja na daljinu.' AS hint, '["dron"]' AS accepted_answers_json
  UNION ALL SELECT 'Mreza' AS word, 'Tehnologija' AS category, 'Lako' AS difficulty, '["Konekcija","Racunari","Internet","Prenos"]' AS clues_json, 'Povezan sistem uredjaja koji razmjenjuju podatke.' AS hint, '["mreza"]' AS accepted_answers_json
  UNION ALL SELECT 'Server' AS word, 'Tehnologija' AS category, 'Srednje' AS difficulty, '["Host","Zahtjev","Podaci","Mreza"]' AS clues_json, 'Racunar ili servis koji odgovara na zahtjeve drugih uredjaja.' AS hint, '["server"]' AS accepted_answers_json
  UNION ALL SELECT 'Interfejs' AS word, 'Tehnologija' AS category, 'Srednje' AS difficulty, '["Ekran","Dugme","Navigacija","Korisnik"]' AS clues_json, 'Sloj preko kojeg korisnik komunicira sa aplikacijom.' AS hint, '["interfejs"]' AS accepted_answers_json
  UNION ALL SELECT 'Baza podataka' AS word, 'Tehnologija' AS category, 'Srednje' AS difficulty, '["Tabela","Upit","Cuvanje","Podaci"]' AS clues_json, 'Organizovan sistem za cuvanje i pretragu informacija.' AS hint, '["baza podataka","baza"]' AS accepted_answers_json
  UNION ALL SELECT 'Enkripcija' AS word, 'Tehnologija' AS category, 'Tesko' AS difficulty, '["Sigurnost","Kodiranje","Kljuc","Zastita"]' AS clues_json, 'Proces pretvaranja podataka u zasticen oblik.' AS hint, '["enkripcija"]' AS accepted_answers_json
  UNION ALL SELECT 'Automatizacija' AS word, 'Tehnologija' AS category, 'Tesko' AS difficulty, '["Proces","Usteda vremena","Robot","Sistem"]' AS clues_json, 'Izvodjenje zadataka bez stalne ljudske intervencije.' AS hint, '["automatizacija"]' AS accepted_answers_json
  UNION ALL SELECT 'Kibernetika' AS word, 'Tehnologija' AS category, 'Tesko' AS difficulty, '["Kontrola","Sistem","Povratna sprega","Automatika"]' AS clues_json, 'Oblast koja proucava upravljanje i komunikaciju u sistemima.' AS hint, '["kibernetika"]' AS accepted_answers_json
  UNION ALL SELECT 'Ostrvo' AS word, 'Geografija' AS category, 'Lako' AS difficulty, '["More","Kopno","Obala","Izolovano"]' AS clues_json, 'Kopno okruzeno vodom sa svih strana.' AS hint, '["ostrvo"]' AS accepted_answers_json
  UNION ALL SELECT 'Kanjon' AS word, 'Geografija' AS category, 'Lako' AS difficulty, '["Rijeka","Stijene","Dubina","Usjek"]' AS clues_json, 'Duboka i uska dolina strmih strana.' AS hint, '["kanjon"]' AS accepted_answers_json
  UNION ALL SELECT 'Ravnica' AS word, 'Geografija' AS category, 'Lako' AS difficulty, '["Nizija","Ravno","Polje","Prostor"]' AS clues_json, 'Velika ravna povrsina na kopnu.' AS hint, '["ravnica"]' AS accepted_answers_json
  UNION ALL SELECT 'Granica' AS word, 'Geografija' AS category, 'Srednje' AS difficulty, '["Drzava","Linija","Prelaz","Mapa"]' AS clues_json, 'Linija koja razdvaja dvije teritorije.' AS hint, '["granica"]' AS accepted_answers_json
  UNION ALL SELECT 'Poluostrvo' AS word, 'Geografija' AS category, 'Srednje' AS difficulty, '["Kopno","More","Rt","Obala"]' AS clues_json, 'Kopno gotovo sa svih strana okruzeno morem.' AS hint, '["poluostrvo"]' AS accepted_answers_json
  UNION ALL SELECT 'Topografija' AS word, 'Geografija' AS category, 'Tesko' AS difficulty, '["Reljef","Visina","Teren","Mapa"]' AS clues_json, 'Opisivanje i prikazivanje oblika terena.' AS hint, '["topografija"]' AS accepted_answers_json
  UNION ALL SELECT 'Kartografija' AS word, 'Geografija' AS category, 'Tesko' AS difficulty, '["Mapa","Projekcija","Skala","Crtanje"]' AS clues_json, 'Nauka i vjestina izrade karata.' AS hint, '["kartografija"]' AS accepted_answers_json
  UNION ALL SELECT 'Geopolitika' AS word, 'Geografija' AS category, 'Tesko' AS difficulty, '["Drzave","Moc","Prostor","Uticaj"]' AS clues_json, 'Proucavanje odnosa politike i geografskog prostora.' AS hint, '["geopolitika"]' AS accepted_answers_json
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
  UNION ALL SELECT 'concept' AS mode, '["Automatika","Senzor","Masina"]' AS words_json, 'Robotika' AS answer, 'Rijesenje je tehnoloska oblast.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Drzava","Granica","Kontinent"]' AS words_json, 'Geografija' AS answer, 'Povezi pojmove sa naukom o prostoru Zemlje.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Atlas","Meridijan","Ekvator","Scenario"]' AS words_json, 'Scenario' AS answer, 'Tri pojma se vezuju za geografiju.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Greenwich","Koordinate","Polovi"]' AS words_json, 'Meridijan' AS answer, 'Rijesenje je geografski pojam za uzduzne linije.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Jezgro","Elektron","Hemija"]' AS words_json, 'Atom' AS answer, 'Osnovna jedinica materije.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Zvijezde","Svemir","Orbita"]' AS words_json, 'Galaksija' AS answer, 'Ogromna grupa zvijezda i kosmickog materijala.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["42 kilometra","Izdrzljivost","Staza"]' AS words_json, 'Maraton' AS answer, 'Dugacka trkacka disciplina.' AS hint, 'Sport' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Snimanje","Objektiv","Scena"]' AS words_json, 'Kamera' AS answer, 'Uredjaj bez kojeg nema snimanja filma.' AS hint, 'Film' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Dijalog","Likovi","Zaplet"]' AS words_json, 'Scenario' AS answer, 'Pisani plan filma ili serije.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Egipat","Faraon","Pustinja"]' AS words_json, 'Piramida' AS answer, 'Gradjevina najpoznatija iz starog Egipta.' AS hint, 'Istorija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Leonardo","Humanizam","Firenca"]' AS words_json, 'Renesansa' AS answer, 'Istorijski period preporoda umjetnosti i nauke.' AS hint, 'Istorija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Dan","Toplota","Svjetlost"]' AS words_json, 'Sunce' AS answer, 'Nebesko tijelo koje nam daje svjetlost i toplotu.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Talas","So","Plaza"]' AS words_json, 'More' AS answer, 'Velika slana vodena povrsina.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Klesanje","Mermer","Figura"]' AS words_json, 'Skulptura' AS answer, 'Umjetnicko djelo oblikovano u prostoru.' AS hint, 'Umjetnost' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Masina","Program","Senzor"]' AS words_json, 'Robot' AS answer, 'Pametna masina koja moze izvrsavati zadatke.' AS hint, 'Tehnologija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Koraci","Logika","Kod"]' AS words_json, 'Algoritam' AS answer, 'Niz tacno odredjenih koraka za rjesavanje problema.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Procesor","Elektronika","Ploca"]' AS words_json, 'Mikrocip' AS answer, 'Mala komponenta sa integrisanim kolima.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Karta","Kontinent","Stranica"]' AS words_json, 'Atlas' AS answer, 'Zbirka geografskih karata.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Ostrvo","Grupa","More"]' AS words_json, 'Arhipelag' AS answer, 'Skup vise ostrva na istom prostoru.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Mozak","Signal","Sinapsa"]' AS words_json, 'Neuron' AS answer, 'Specijalizovana nervna celija koja prenosi impulse.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Simbol","Jednacina","Hemija"]' AS words_json, 'Formula' AS answer, 'Zapis koji predstavlja odnos ili sastav.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Svemir","Uvecanje","Zvijezde"]' AS words_json, 'Teleskop' AS answer, 'Instrument za gledanje udaljenih nebeskih tijela.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Imunitet","Doza","Zastita"]' AS words_json, 'Vakcina' AS answer, 'Preparat koji podstice razvoj zastite organizma.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Materija","Mikro","Fizika"]' AS words_json, 'Cestica' AS answer, 'Vrlo mala jedinica materije.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
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
) AS seed
LEFT JOIN logic_challenges existing
  ON existing.mode = seed.mode
 AND LOWER(existing.answer) = LOWER(seed.answer)
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
WHERE existing.id IS NULL;


INSERT INTO logic_challenges (mode, words_json, answer, hint, category, difficulty)
SELECT seed.mode, seed.words_json, seed.answer, seed.hint, seed.category, seed.difficulty
FROM (
  SELECT 'concept' AS mode, '["Lik","Odjeca","Scena"]' AS words_json, 'Kostim' AS answer, 'Odjevna kombinacija koja pomaze oblikovanju filmskog lika.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
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
  UNION ALL SELECT 'concept' AS mode, '["Nizija","Ravno","Polje"]' AS words_json, 'Ravnica' AS answer, 'Velika ravna povrsina na kopnu.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Drzava","Linija","Prelaz"]' AS words_json, 'Granica' AS answer, 'Linija koja razdvaja dvije teritorije.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Kopno","More","Rt"]' AS words_json, 'Poluostrvo' AS answer, 'Kopno gotovo sa svih strana okruzeno morem.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Reljef","Visina","Teren"]' AS words_json, 'Topografija' AS answer, 'Opisivanje i prikazivanje oblika terena.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Mapa","Projekcija","Skala"]' AS words_json, 'Kartografija' AS answer, 'Nauka i vjestina izrade karata.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'concept' AS mode, '["Drzave","Moc","Prostor"]' AS words_json, 'Geopolitika' AS answer, 'Proucavanje odnosa politike i geografskog prostora.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Jezgro","Elektron","Hemija","Gol"]' AS words_json, 'Gol' AS answer, 'Tri pojma vode ka "Atom", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Zvijezde","Svemir","Orbita","Gol"]' AS words_json, 'Gol' AS answer, 'Tri pojma vode ka "Galaksija", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Pad","Privlacnost","Masa","Gol"]' AS words_json, 'Gol' AS answer, 'Tri pojma vode ka "Gravitacija", a jedan ne pripada toj grupi.' AS hint, 'Nauka' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Gol","Lopta","Stadion","Jezgro"]' AS words_json, 'Jezgro' AS answer, 'Tri pojma vode ka "Fudbal", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["42 kilometra","Izdrzljivost","Staza","Jezgro"]' AS words_json, 'Jezgro' AS answer, 'Tri pojma vode ka "Maraton", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Greda","Parter","Salto","Jezgro"]' AS words_json, 'Jezgro' AS answer, 'Tri pojma vode ka "Gimnastika", a jedan ne pripada toj grupi.' AS hint, 'Sport' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Snimanje","Objektiv","Scena","Jezgro"]' AS words_json, 'Jezgro' AS answer, 'Tri pojma vode ka "Kamera", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Dijalog","Likovi","Zaplet","Jezgro"]' AS words_json, 'Jezgro' AS answer, 'Tri pojma vode ka "Scenario", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Rez","Ritam","Postprodukcija","Jezgro"]' AS words_json, 'Jezgro' AS answer, 'Tri pojma vode ka "Montaza", a jedan ne pripada toj grupi.' AS hint, 'Film' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Egipat","Faraon","Pustinja","Jezgro"]' AS words_json, 'Jezgro' AS answer, 'Tri pojma vode ka "Piramida", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Leonardo","Humanizam","Firenca","Jezgro"]' AS words_json, 'Jezgro' AS answer, 'Tri pojma vode ka "Renesansa", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Srednje' AS difficulty
) AS seed
LEFT JOIN logic_challenges existing
  ON existing.mode = seed.mode
 AND LOWER(existing.answer) = LOWER(seed.answer)
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
WHERE existing.id IS NULL;


INSERT INTO logic_challenges (mode, words_json, answer, hint, category, difficulty)
SELECT seed.mode, seed.words_json, seed.answer, seed.hint, seed.category, seed.difficulty
FROM (
  SELECT 'odd-one-out' AS mode, '["Pregovori","Ambasada","Sporazum","Jezgro"]' AS words_json, 'Jezgro' AS answer, 'Tri pojma vode ka "Diplomatija", a jedan ne pripada toj grupi.' AS hint, 'Istorija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Dan","Toplota","Svjetlost","Jezgro"]' AS words_json, 'Jezgro' AS answer, 'Tri pojma vode ka "Sunce", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Talas","So","Plaza","Jezgro"]' AS words_json, 'Jezgro' AS answer, 'Tri pojma vode ka "More", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Lava","Krater","Erupcija","Jezgro"]' AS words_json, 'Jezgro' AS answer, 'Tri pojma vode ka "Vulkan", a jedan ne pripada toj grupi.' AS hint, 'Priroda' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Orkestar","Dirigent","Stav","Jezgro"]' AS words_json, 'Jezgro' AS answer, 'Tri pojma vode ka "Simfonija", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Klesanje","Mermer","Figura","Jezgro"]' AS words_json, 'Jezgro' AS answer, 'Tri pojma vode ka "Skulptura", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Dubina","Linije","Prostor","Jezgro"]' AS words_json, 'Jezgro' AS answer, 'Tri pojma vode ka "Perspektiva", a jedan ne pripada toj grupi.' AS hint, 'Umjetnost' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Masina","Program","Senzor","Jezgro"]' AS words_json, 'Jezgro' AS answer, 'Tri pojma vode ka "Robot", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Koraci","Logika","Kod","Jezgro"]' AS words_json, 'Jezgro' AS answer, 'Tri pojma vode ka "Algoritam", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Procesor","Elektronika","Ploca","Jezgro"]' AS words_json, 'Jezgro' AS answer, 'Tri pojma vode ka "Mikrocip", a jedan ne pripada toj grupi.' AS hint, 'Tehnologija' AS category, 'Tesko' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Karta","Kontinent","Stranica","Jezgro"]' AS words_json, 'Jezgro' AS answer, 'Tri pojma vode ka "Atlas", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Lako' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Ostrvo","Grupa","More","Jezgro"]' AS words_json, 'Jezgro' AS answer, 'Tri pojma vode ka "Arhipelag", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Srednje' AS difficulty
  UNION ALL SELECT 'odd-one-out' AS mode, '["Greenwich","Koordinate","Polovi","Jezgro"]' AS words_json, 'Jezgro' AS answer, 'Tri pojma vode ka "Meridijan", a jedan ne pripada toj grupi.' AS hint, 'Geografija' AS category, 'Tesko' AS difficulty
) AS seed
LEFT JOIN logic_challenges existing
  ON existing.mode = seed.mode
 AND LOWER(existing.answer) = LOWER(seed.answer)
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
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
  UNION ALL SELECT 'Oblak' AS left_word, 'Kisa' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Jedna pojava cesto vodi ka drugoj.' AS hint
  UNION ALL SELECT 'Nadahnuce' AS left_word, 'Inspiracija' AS right_word, 'Sinonim' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Oba pojma opisuju isti unutrasnji podsticaj.' AS hint
  UNION ALL SELECT 'Brz' AS left_word, 'Ubrzan' AS right_word, 'Sinonim' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Rijeci opisuju slicnu osobinu rada.' AS hint
  UNION ALL SELECT 'Atom' AS left_word, 'Jezgro' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Atom" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Galaksija' AS left_word, 'Zvijezde' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Galaksija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Gravitacija' AS left_word, 'Pad' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Gravitacija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Fudbal' AS left_word, 'Gol' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Fudbal" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Maraton' AS left_word, '42 kilometra' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Maraton" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Gimnastika' AS left_word, 'Greda' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Gimnastika" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kamera' AS left_word, 'Snimanje' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Kamera" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Scenario' AS left_word, 'Dijalog' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Scenario" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Montaza' AS left_word, 'Rez' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Montaza" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Piramida' AS left_word, 'Egipat' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Piramida" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Renesansa' AS left_word, 'Leonardo' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Renesansa" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Diplomatija' AS left_word, 'Pregovori' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Diplomatija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Sunce' AS left_word, 'Dan' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Sunce" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'More' AS left_word, 'Talas' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "More" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Vulkan' AS left_word, 'Lava' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Vulkan" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Simfonija' AS left_word, 'Orkestar' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Simfonija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Skulptura' AS left_word, 'Klesanje' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Skulptura" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Perspektiva' AS left_word, 'Dubina' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Perspektiva" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Robot' AS left_word, 'Masina' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Robot" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Algoritam' AS left_word, 'Koraci' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Algoritam" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Atlas' AS left_word, 'Karta' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Atlas" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Arhipelag' AS left_word, 'Ostrvo' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Arhipelag" sa jednim od njegovih tragova.' AS hint
) AS seed
LEFT JOIN relation_challenges existing
  ON LOWER(existing.left_word) = LOWER(seed.left_word)
 AND LOWER(existing.right_word) = LOWER(seed.right_word)
 AND existing.relation = seed.relation
WHERE existing.id IS NULL;


INSERT INTO relation_challenges (left_word, right_word, relation, category, difficulty, hint)
SELECT seed.left_word, seed.right_word, seed.relation, seed.category, seed.difficulty, seed.hint
FROM (
  SELECT 'Meridijan' AS left_word, 'Greenwich' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Meridijan" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Neuron' AS left_word, 'Mozak' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Neuron" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Formula' AS left_word, 'Simbol' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Formula" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Teleskop' AS left_word, 'Svemir' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Lako' AS difficulty, 'Povezi pojam "Teleskop" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Vakcina' AS left_word, 'Imunitet' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Vakcina" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Cestica' AS left_word, 'Materija' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Cestica" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Spektar' AS left_word, 'Boje' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Spektar" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Evolucija' AS left_word, 'Promjena' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Evolucija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Katalizator' AS left_word, 'Reakcija' AS right_word, 'Asocijacija' AS relation, 'Nauka' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Katalizator" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kosarka' AS left_word, 'Obruc' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Kosarka" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Plivanje' AS left_word, 'Bazen' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Plivanje" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Reket' AS left_word, 'Tenis' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Lako' AS difficulty, 'Povezi pojam "Reket" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Trofej' AS left_word, 'Pehar' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Trofej" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kondicija' AS left_word, 'Forma' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Kondicija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Stadion' AS left_word, 'Tribine' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Stadion" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Triatlon' AS left_word, 'Plivanje' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Triatlon" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Desetoboj' AS left_word, 'Atletika' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Desetoboj" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Regata' AS left_word, 'Jedrenje' AS right_word, 'Asocijacija' AS relation, 'Sport' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Regata" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Reziser' AS left_word, 'Set' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Reziser" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Trejler' AS left_word, 'Najava' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Trejler" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Scena' AS left_word, 'Kadar' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Lako' AS difficulty, 'Povezi pojam "Scena" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kostim' AS left_word, 'Lik' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Kostim" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kadrovanje' AS left_word, 'Ugao' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Kadrovanje" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Premijera' AS left_word, 'Crveni tepih' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Premijera" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Postprodukcija' AS left_word, 'Montaza' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Postprodukcija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Dokumentarac' AS left_word, 'Cinjenice' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Dokumentarac" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kinematografija' AS left_word, 'Svjetlo' AS right_word, 'Asocijacija' AS relation, 'Film' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kinematografija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Carstvo' AS left_word, 'Vladar' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Carstvo" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Bitka' AS left_word, 'Vojska' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Bitka" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Spomenik' AS left_word, 'Proslo' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Spomenik" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Dinastija' AS left_word, 'Porodica' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Dinastija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Hronika' AS left_word, 'Zapis' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Hronika" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Arheologija' AS left_word, 'Iskopavanje' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Arheologija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Reforma' AS left_word, 'Promjena' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Reforma" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kolonizacija' AS left_word, 'Naseljavanje' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kolonizacija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Hronologija' AS left_word, 'Vrijeme' AS right_word, 'Asocijacija' AS relation, 'Istorija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Hronologija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kisa' AS left_word, 'Oblak' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Kisa" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Vjetar' AS left_word, 'Povjetarac' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Vjetar" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Jezero' AS left_word, 'Voda' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Lako' AS difficulty, 'Povezi pojam "Jezero" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Planina' AS left_word, 'Vrh' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Planina" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Lednik' AS left_word, 'Led' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Lednik" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Delta' AS left_word, 'Rijeka' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Delta" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Biosfera' AS left_word, 'Zivot' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Biosfera" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Atmosfera' AS left_word, 'Vazduh' AS right_word, 'Asocijacija' AS relation, 'Priroda' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Atmosfera" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Roman' AS left_word, 'Likovi' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Roman" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Freska' AS left_word, 'Zid' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Freska" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Galerija' AS left_word, 'Izlozba' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Lako' AS difficulty, 'Povezi pojam "Galerija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Portret' AS left_word, 'Lice' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Portret" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Koreografija' AS left_word, 'Pokret' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Koreografija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Drama' AS left_word, 'Pozornica' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Drama" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Instalacija' AS left_word, 'Prostor' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Instalacija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ekspresionizam' AS left_word, 'Emocija' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Ekspresionizam" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kompozicija' AS left_word, 'Raspored' AS right_word, 'Asocijacija' AS relation, 'Umjetnost' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kompozicija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Lozinka' AS left_word, 'Prijava' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Lozinka" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Dron' AS left_word, 'Leti' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Dron" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Mreza' AS left_word, 'Konekcija' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Mreza" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Server' AS left_word, 'Host' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Server" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Interfejs' AS left_word, 'Ekran' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Interfejs" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Baza podataka' AS left_word, 'Tabela' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Baza podataka" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Enkripcija' AS left_word, 'Sigurnost' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Enkripcija" sa jednim od njegovih tragova.' AS hint
) AS seed
LEFT JOIN relation_challenges existing
  ON LOWER(existing.left_word) = LOWER(seed.left_word)
 AND LOWER(existing.right_word) = LOWER(seed.right_word)
 AND existing.relation = seed.relation
WHERE existing.id IS NULL;


INSERT INTO relation_challenges (left_word, right_word, relation, category, difficulty, hint)
SELECT seed.left_word, seed.right_word, seed.relation, seed.category, seed.difficulty, seed.hint
FROM (
  SELECT 'Automatizacija' AS left_word, 'Proces' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Automatizacija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kibernetika' AS left_word, 'Kontrola' AS right_word, 'Asocijacija' AS relation, 'Tehnologija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kibernetika" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ostrvo' AS left_word, 'More' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Ostrvo" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kanjon' AS left_word, 'Rijeka' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Kanjon" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Ravnica' AS left_word, 'Nizija' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Lako' AS difficulty, 'Povezi pojam "Ravnica" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Granica' AS left_word, 'Drzava' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Granica" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Poluostrvo' AS left_word, 'Kopno' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Srednje' AS difficulty, 'Povezi pojam "Poluostrvo" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Topografija' AS left_word, 'Reljef' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Topografija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Kartografija' AS left_word, 'Mapa' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Kartografija" sa jednim od njegovih tragova.' AS hint
  UNION ALL SELECT 'Geopolitika' AS left_word, 'Drzave' AS right_word, 'Asocijacija' AS relation, 'Geografija' AS category, 'Tesko' AS difficulty, 'Povezi pojam "Geopolitika" sa jednim od njegovih tragova.' AS hint
) AS seed
LEFT JOIN relation_challenges existing
  ON LOWER(existing.left_word) = LOWER(seed.left_word)
 AND LOWER(existing.right_word) = LOWER(seed.right_word)
 AND existing.relation = seed.relation
WHERE existing.id IS NULL;


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
