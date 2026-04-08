const association = (
  id,
  word,
  category,
  difficulty,
  clues,
  hint,
  acceptedAnswers = []
) => ({
  id,
  word,
  category,
  difficulty,
  clues,
  hint,
  acceptedAnswers,
})

const logic = (
  id,
  mode,
  words,
  answer,
  hint,
  category,
  difficulty,
  acceptedAnswers = []
) => ({
  id,
  mode,
  words,
  answer,
  hint,
  category,
  difficulty,
  acceptedAnswers,
})

const relation = (
  id,
  leftWord,
  rightWord,
  relationType,
  category,
  difficulty,
  hint
) => ({
  id,
  leftWord,
  rightWord,
  relation: relationType,
  category,
  difficulty,
  hint,
})

const chainPreset = (centerWord, starterNodes) => ({
  centerWord,
  starterNodes,
})

export const DEFAULT_ASSOCIATION_WORDS = [
  association(1, 'Atom', 'Nauka', 'Lako', ['Jezgro', 'Elektron', 'Hemija', 'Cestica'], 'Osnovna jedinica materije.', ['atom']),
  association(2, 'Galaksija', 'Nauka', 'Srednje', ['Zvijezde', 'Svemir', 'Orbita', 'Mlijevni put'], 'Ogromna grupa zvijezda i kosmickog materijala.', ['galaksija']),
  association(3, 'Gravitacija', 'Nauka', 'Tesko', ['Pad', 'Privlacnost', 'Masa', 'Njutn'], 'Sila koja privlaci tijela jedno drugom.', ['gravitacija']),
  association(4, 'Fudbal', 'Sport', 'Lako', ['Gol', 'Lopta', 'Stadion', 'Sudija'], 'Sport koji se igra najcesce nogom i loptom.', ['fudbal']),
  association(5, 'Maraton', 'Sport', 'Srednje', ['42 kilometra', 'Izdrzljivost', 'Staza', 'Trkac'], 'Dugacka trkacka disciplina.', ['maraton']),
  association(6, 'Gimnastika', 'Sport', 'Tesko', ['Greda', 'Parter', 'Salto', 'Ravnoteza'], 'Sport koji trazi koordinaciju i kontrolu tijela.', ['gimnastika']),
  association(7, 'Kamera', 'Film', 'Lako', ['Snimanje', 'Objektiv', 'Scena', 'Kadar'], 'Uredjaj bez kojeg nema snimanja filma.', ['kamera']),
  association(8, 'Scenario', 'Film', 'Srednje', ['Dijalog', 'Likovi', 'Zaplet', 'Scenarista'], 'Pisani plan filma ili serije.', ['scenario']),
  association(9, 'Montaza', 'Film', 'Tesko', ['Rez', 'Ritam', 'Postprodukcija', 'Kadrove'], 'Spajanje i uredjivanje snimljenog materijala.', ['montaza']),
  association(10, 'Piramida', 'Istorija', 'Lako', ['Egipat', 'Faraon', 'Pustinja', 'Grobnica'], 'Gradjevina najpoznatija iz starog Egipta.', ['piramida']),
  association(11, 'Renesansa', 'Istorija', 'Srednje', ['Leonardo', 'Humanizam', 'Firenca', 'Preporod'], 'Istorijski period preporoda umjetnosti i nauke.', ['renesansa']),
  association(12, 'Diplomatija', 'Istorija', 'Tesko', ['Pregovori', 'Ambasada', 'Sporazum', 'Drzava'], 'Umijece vodjenja medjudrzavnih odnosa.', ['diplomatija']),
  association(13, 'Sunce', 'Priroda', 'Lako', ['Dan', 'Toplota', 'Svjetlost', 'Ljeto'], 'Nebesko tijelo koje nam daje svjetlost i toplotu.', ['sunce']),
  association(14, 'More', 'Priroda', 'Srednje', ['Talas', 'So', 'Plaza', 'Obala'], 'Velika slana vodena povrsina.', ['more']),
  association(15, 'Vulkan', 'Priroda', 'Tesko', ['Lava', 'Krater', 'Erupcija', 'Pepeo'], 'Prirodna pojava povezana sa magmom i erupcijom.', ['vulkan']),
  association(16, 'Simfonija', 'Umjetnost', 'Lako', ['Orkestar', 'Dirigent', 'Stav', 'Muzika'], 'Veliko muzicko djelo za orkestar.', ['simfonija']),
  association(17, 'Skulptura', 'Umjetnost', 'Srednje', ['Klesanje', 'Mermer', 'Figura', 'Vajar'], 'Umjetnicko djelo oblikovano u prostoru.', ['skulptura']),
  association(18, 'Perspektiva', 'Umjetnost', 'Tesko', ['Dubina', 'Linije', 'Prostor', 'Slikarstvo'], 'Likovni princip za prikaz prostora na ravnoj povrsini.', ['perspektiva']),
  association(19, 'Robot', 'Tehnologija', 'Lako', ['Masina', 'Program', 'Senzor', 'Automatika'], 'Pametna masina koja moze izvrsavati zadatke.', ['robot']),
  association(20, 'Algoritam', 'Tehnologija', 'Srednje', ['Koraci', 'Logika', 'Kod', 'Rjesenje'], 'Niz tacno odredjenih koraka za rjesavanje problema.', ['algoritam']),
  association(21, 'Mikrocip', 'Tehnologija', 'Tesko', ['Procesor', 'Elektronika', 'Ploca', 'Tranzistor'], 'Mala komponenta sa integrisanim kolima.', ['mikrocip', 'mikro cip']),
  association(22, 'Atlas', 'Geografija', 'Lako', ['Karta', 'Kontinent', 'Stranica', 'Planeta'], 'Zbirka geografskih karata.', ['atlas']),
  association(23, 'Arhipelag', 'Geografija', 'Srednje', ['Ostrvo', 'Grupa', 'More', 'Obala'], 'Skup vise ostrva na istom prostoru.', ['arhipelag']),
  association(24, 'Meridijan', 'Geografija', 'Tesko', ['Greenwich', 'Koordinate', 'Polovi', 'Duzina'], 'Zamisljena linija koja spaja polove Zemlje.', ['meridijan']),
]

export const DEFAULT_LOGIC_CHALLENGES = [
  logic(1, 'concept', ['Teleskop', 'Planeta', 'Zvijezda'], 'Astronomija', 'Pomisli na nauku koja prouceva svemir.', 'Nauka', 'Lako', ['astronomija', 'nauka o svemiru']),
  logic(2, 'odd-one-out', ['Proton', 'Elektron', 'Neutron', 'Fjord'], 'Fjord', 'Tri pojma pripadaju atomu, jedan geografiji.', 'Nauka', 'Srednje'),
  logic(3, 'concept', ['Masa', 'Pad', 'Privlacnost'], 'Gravitacija', 'Rijesenje je sila koja djeluje izmedju tijela.', 'Nauka', 'Tesko', ['gravitacija']),
  logic(4, 'concept', ['Gol', 'Lopta', 'Sudija'], 'Fudbal', 'Rijesenje je popularan ekipni sport.', 'Sport', 'Lako', ['fudbal', 'nogomet']),
  logic(5, 'odd-one-out', ['Sprint', 'Maraton', 'Skok', 'Reziser'], 'Reziser', 'Tri pojma su sportske discipline.', 'Sport', 'Srednje'),
  logic(6, 'concept', ['Greda', 'Parter', 'Ravnoteza'], 'Gimnastika', 'Povezi pojmove sa jednim zahtjevnim sportom.', 'Sport', 'Tesko', ['gimnastika']),
  logic(7, 'concept', ['Glumac', 'Kadar', 'Scenarista'], 'Film', 'Povezi pojmove sa filmskom industrijom.', 'Film', 'Lako', ['film', 'kinematografija']),
  logic(8, 'odd-one-out', ['Kamera', 'Montaza', 'Mikrofon', 'Glacijal'], 'Glacijal', 'Tri pojma pripadaju filmskoj produkciji.', 'Film', 'Srednje'),
  logic(9, 'concept', ['Rez', 'Ritam', 'Postprodukcija'], 'Montaza', 'Rijesenje je dio filmskog procesa nakon snimanja.', 'Film', 'Tesko', ['montaza']),
  logic(10, 'concept', ['Faraon', 'Nil', 'Piramida'], 'Egipat', 'Rijesenje je drevna civilizacija ili drzava.', 'Istorija', 'Lako', ['egipat', 'stari egipat']),
  logic(11, 'odd-one-out', ['Piramida', 'Koloseum', 'Akvadukt', 'Baterija'], 'Baterija', 'Tri pojma su istorijske gradjevine ili ostaci.', 'Istorija', 'Srednje'),
  logic(12, 'concept', ['Pregovori', 'Ambasada', 'Sporazum'], 'Diplomatija', 'Rijesenje opisuje odnose izmedju drzava.', 'Istorija', 'Tesko', ['diplomatija']),
  logic(13, 'concept', ['Rijeka', 'Jezero', 'More'], 'Voda', 'Sve pojmove povezuje ista prirodna supstanca.', 'Priroda', 'Lako', ['voda']),
  logic(14, 'odd-one-out', ['Bor', 'Hrast', 'Jela', 'Tablet'], 'Tablet', 'Tri pojma su vrste drveca.', 'Priroda', 'Srednje'),
  logic(15, 'concept', ['Lava', 'Krater', 'Erupcija'], 'Vulkan', 'Povezi pojmove sa jednom prirodnom pojavom.', 'Priroda', 'Tesko', ['vulkan']),
  logic(16, 'concept', ['Dirigent', 'Orkestar', 'Stav'], 'Simfonija', 'Rijesenje je muzicko djelo za orkestar.', 'Umjetnost', 'Lako', ['simfonija']),
  logic(17, 'odd-one-out', ['Violina', 'Klavir', 'Gitara', 'Satelit'], 'Satelit', 'Tri pojma su muzicki instrumenti.', 'Umjetnost', 'Srednje'),
  logic(18, 'concept', ['Dubina', 'Linije', 'Prostor'], 'Perspektiva', 'Rijesenje je likovni princip.', 'Umjetnost', 'Tesko', ['perspektiva']),
  logic(19, 'concept', ['Kod', 'Program', 'Aplikacija'], 'Softver', 'Povezi pojmove sa digitalnim proizvodom.', 'Tehnologija', 'Lako', ['softver', 'software', 'program']),
  logic(20, 'odd-one-out', ['Procesor', 'Memorija', 'Ekran', 'Pjesma'], 'Pjesma', 'Tri pojma pripadaju tehnologiji ili racunaru.', 'Tehnologija', 'Srednje'),
  logic(21, 'concept', ['Automatika', 'Senzor', 'Masina'], 'Robotika', 'Rijesenje je tehnoloska oblast.', 'Tehnologija', 'Tesko', ['robotika']),
  logic(22, 'concept', ['Drzava', 'Granica', 'Kontinent'], 'Geografija', 'Povezi pojmove sa naukom o prostoru Zemlje.', 'Geografija', 'Lako', ['geografija']),
  logic(23, 'odd-one-out', ['Atlas', 'Meridijan', 'Ekvator', 'Scenario'], 'Scenario', 'Tri pojma se vezuju za geografiju.', 'Geografija', 'Srednje'),
  logic(24, 'concept', ['Greenwich', 'Koordinate', 'Polovi'], 'Meridijan', 'Rijesenje je geografski pojam za uzduzne linije.', 'Geografija', 'Tesko', ['meridijan', 'meridijani']),
]

export const DEFAULT_RELATION_CHALLENGES = [
  relation(1, 'Tacan', 'Precizan', 'Sinonim', 'Nauka', 'Lako', 'Obje rijeci opisuju visoku mjeru ispravnosti.'),
  relation(2, 'Hipoteza', 'Teorija', 'Asocijacija', 'Nauka', 'Srednje', 'Pojmovi su blisko povezani u naucnom procesu.'),
  relation(3, 'Stabilan', 'Nestabilan', 'Antonim', 'Nauka', 'Tesko', 'Jedna rijec negira osobinu druge.'),
  relation(4, 'Brz', 'Spor', 'Antonim', 'Sport', 'Lako', 'Pogledaj da li su pojmovi suprotnosti.'),
  relation(5, 'Pobjeda', 'Trijumf', 'Sinonim', 'Sport', 'Srednje', 'Oba pojma opisuju isti ishod.'),
  relation(6, 'Lopta', 'Gol', 'Asocijacija', 'Sport', 'Tesko', 'Pojmovi su povezani u istoj igri.'),
  relation(7, 'Glumac', 'Uloga', 'Asocijacija', 'Film', 'Lako', 'Jedan pojam gotovo uvijek ide uz drugi u filmu.'),
  relation(8, 'Glavni', 'Sporedni', 'Antonim', 'Film', 'Srednje', 'Pojmovi opisuju suprotne uloge ili planove.'),
  relation(9, 'Kadar', 'Scena', 'Asocijacija', 'Film', 'Tesko', 'Povezanost je filmska, ne znacenjska.'),
  relation(10, 'Mir', 'Rat', 'Antonim', 'Istorija', 'Lako', 'Pomisli na suprotnosti.'),
  relation(11, 'Staro', 'Drevno', 'Sinonim', 'Istorija', 'Srednje', 'Rijeci su gotovo isto znacenje.'),
  relation(12, 'Kruna', 'Prijesto', 'Asocijacija', 'Istorija', 'Tesko', 'Oba pojma prizivaju vladara i dvor.'),
  relation(13, 'Topao', 'Hladan', 'Antonim', 'Priroda', 'Lako', 'Rijeci imaju suprotno znacenje.'),
  relation(14, 'Talas', 'More', 'Asocijacija', 'Priroda', 'Srednje', 'Jedan pojam prirodno priziva drugi.'),
  relation(15, 'Suma', 'Gaj', 'Sinonim', 'Priroda', 'Tesko', 'Rijeci oznacavaju vrlo slican pojam.'),
  relation(16, 'Tisina', 'Buka', 'Antonim', 'Umjetnost', 'Lako', 'Jedna rijec iskljucuje drugu.'),
  relation(17, 'Kist', 'Platno', 'Asocijacija', 'Umjetnost', 'Srednje', 'Pojmovi su prirodno povezani u stvaranju slike.'),
  relation(18, 'Inspiracija', 'Ideja', 'Sinonim', 'Umjetnost', 'Tesko', 'Oba pojma ukazuju na pocetak stvaranja.'),
  relation(19, 'Kod', 'Program', 'Asocijacija', 'Tehnologija', 'Lako', 'Jedan pojam je sastavni dio drugog.'),
  relation(20, 'Siguran', 'Nesiguran', 'Antonim', 'Tehnologija', 'Srednje', 'Rijeci imaju suprotan smisao.'),
  relation(21, 'Mikrocip', 'Procesor', 'Asocijacija', 'Tehnologija', 'Tesko', 'Pojmovi su povezani sa racunarskim hardverom.'),
  relation(22, 'Mapa', 'Karta', 'Sinonim', 'Geografija', 'Lako', 'Rijeci se koriste kao isto ili skoro isto.'),
  relation(23, 'Sjever', 'Jug', 'Antonim', 'Geografija', 'Srednje', 'Pojmovi pokazuju suprotne strane svijeta.'),
  relation(24, 'Kompas', 'Pravac', 'Asocijacija', 'Geografija', 'Tesko', 'Jedan pojam sluzi da odredi drugi.'),
]

export const DEFAULT_WORD_CHAIN_PRESETS = {
  'Nauka-Lako': chainPreset('Tacnost', [
    { id: 'nauka-lako-1', word: 'Preciznost', relation: 'Sinonim' },
    { id: 'nauka-lako-2', word: 'Greska', relation: 'Antonim' },
    { id: 'nauka-lako-3', word: 'Eksperiment', relation: 'Asocijacija' },
  ]),
  'Nauka-Srednje': chainPreset('Svemir', [
    { id: 'nauka-srednje-1', word: 'Kosmos', relation: 'Sinonim' },
    { id: 'nauka-srednje-2', word: 'Zemlja', relation: 'Antonim' },
    { id: 'nauka-srednje-3', word: 'Galaksija', relation: 'Asocijacija' },
  ]),
  'Nauka-Tesko': chainPreset('Gravitacija', [
    { id: 'nauka-tesko-1', word: 'Privlacnost', relation: 'Sinonim' },
    { id: 'nauka-tesko-2', word: 'Bestezinsko', relation: 'Antonim' },
    { id: 'nauka-tesko-3', word: 'Masa', relation: 'Asocijacija' },
  ]),
  'Sport-Lako': chainPreset('Pobjeda', [
    { id: 'sport-lako-1', word: 'Trijumf', relation: 'Sinonim' },
    { id: 'sport-lako-2', word: 'Poraz', relation: 'Antonim' },
    { id: 'sport-lako-3', word: 'Medalja', relation: 'Asocijacija' },
  ]),
  'Sport-Srednje': chainPreset('Trka', [
    { id: 'sport-srednje-1', word: 'Nadmetanje', relation: 'Sinonim' },
    { id: 'sport-srednje-2', word: 'Mirovanje', relation: 'Antonim' },
    { id: 'sport-srednje-3', word: 'Maraton', relation: 'Asocijacija' },
  ]),
  'Sport-Tesko': chainPreset('Disciplina', [
    { id: 'sport-tesko-1', word: 'Red', relation: 'Sinonim' },
    { id: 'sport-tesko-2', word: 'Nered', relation: 'Antonim' },
    { id: 'sport-tesko-3', word: 'Gimnastika', relation: 'Asocijacija' },
  ]),
  'Film-Lako': chainPreset('Scena', [
    { id: 'film-lako-1', word: 'Prizor', relation: 'Sinonim' },
    { id: 'film-lako-2', word: 'Pauza', relation: 'Antonim' },
    { id: 'film-lako-3', word: 'Kamera', relation: 'Asocijacija' },
  ]),
  'Film-Srednje': chainPreset('Lik', [
    { id: 'film-srednje-1', word: 'Junak', relation: 'Sinonim' },
    { id: 'film-srednje-2', word: 'Publika', relation: 'Antonim' },
    { id: 'film-srednje-3', word: 'Scenario', relation: 'Asocijacija' },
  ]),
  'Film-Tesko': chainPreset('Montaza', [
    { id: 'film-tesko-1', word: 'Sklapanje', relation: 'Sinonim' },
    { id: 'film-tesko-2', word: 'Rasipanje', relation: 'Antonim' },
    { id: 'film-tesko-3', word: 'Rez', relation: 'Asocijacija' },
  ]),
  'Istorija-Lako': chainPreset('Kralj', [
    { id: 'istorija-lako-1', word: 'Vladar', relation: 'Sinonim' },
    { id: 'istorija-lako-2', word: 'Podanik', relation: 'Antonim' },
    { id: 'istorija-lako-3', word: 'Kruna', relation: 'Asocijacija' },
  ]),
  'Istorija-Srednje': chainPreset('Drevno', [
    { id: 'istorija-srednje-1', word: 'Staro', relation: 'Sinonim' },
    { id: 'istorija-srednje-2', word: 'Savremeno', relation: 'Antonim' },
    { id: 'istorija-srednje-3', word: 'Renesansa', relation: 'Asocijacija' },
  ]),
  'Istorija-Tesko': chainPreset('Sporazum', [
    { id: 'istorija-tesko-1', word: 'Dogovor', relation: 'Sinonim' },
    { id: 'istorija-tesko-2', word: 'Sukob', relation: 'Antonim' },
    { id: 'istorija-tesko-3', word: 'Diplomatija', relation: 'Asocijacija' },
  ]),
  'Priroda-Lako': chainPreset('Toplota', [
    { id: 'priroda-lako-1', word: 'Vrucina', relation: 'Sinonim' },
    { id: 'priroda-lako-2', word: 'Hladnoca', relation: 'Antonim' },
    { id: 'priroda-lako-3', word: 'Sunce', relation: 'Asocijacija' },
  ]),
  'Priroda-Srednje': chainPreset('Obala', [
    { id: 'priroda-srednje-1', word: 'Primorje', relation: 'Sinonim' },
    { id: 'priroda-srednje-2', word: 'Pucina', relation: 'Antonim' },
    { id: 'priroda-srednje-3', word: 'More', relation: 'Asocijacija' },
  ]),
  'Priroda-Tesko': chainPreset('Erupcija', [
    { id: 'priroda-tesko-1', word: 'Izlivanje', relation: 'Sinonim' },
    { id: 'priroda-tesko-2', word: 'Mirovanje', relation: 'Antonim' },
    { id: 'priroda-tesko-3', word: 'Vulkan', relation: 'Asocijacija' },
  ]),
  'Umjetnost-Lako': chainPreset('Muzika', [
    { id: 'umjetnost-lako-1', word: 'Melodija', relation: 'Sinonim' },
    { id: 'umjetnost-lako-2', word: 'Tisina', relation: 'Antonim' },
    { id: 'umjetnost-lako-3', word: 'Simfonija', relation: 'Asocijacija' },
  ]),
  'Umjetnost-Srednje': chainPreset('Figura', [
    { id: 'umjetnost-srednje-1', word: 'Oblik', relation: 'Sinonim' },
    { id: 'umjetnost-srednje-2', word: 'Praznina', relation: 'Antonim' },
    { id: 'umjetnost-srednje-3', word: 'Skulptura', relation: 'Asocijacija' },
  ]),
  'Umjetnost-Tesko': chainPreset('Dubina', [
    { id: 'umjetnost-tesko-1', word: 'Prostornost', relation: 'Sinonim' },
    { id: 'umjetnost-tesko-2', word: 'Plitkost', relation: 'Antonim' },
    { id: 'umjetnost-tesko-3', word: 'Perspektiva', relation: 'Asocijacija' },
  ]),
  'Tehnologija-Lako': chainPreset('Program', [
    { id: 'tehnologija-lako-1', word: 'Softver', relation: 'Sinonim' },
    { id: 'tehnologija-lako-2', word: 'Kvar', relation: 'Antonim' },
    { id: 'tehnologija-lako-3', word: 'Robot', relation: 'Asocijacija' },
  ]),
  'Tehnologija-Srednje': chainPreset('Logika', [
    { id: 'tehnologija-srednje-1', word: 'Racunanje', relation: 'Sinonim' },
    { id: 'tehnologija-srednje-2', word: 'Haos', relation: 'Antonim' },
    { id: 'tehnologija-srednje-3', word: 'Algoritam', relation: 'Asocijacija' },
  ]),
  'Tehnologija-Tesko': chainPreset('Procesor', [
    { id: 'tehnologija-tesko-1', word: 'Jezgro', relation: 'Sinonim' },
    { id: 'tehnologija-tesko-2', word: 'Rucni rad', relation: 'Antonim' },
    { id: 'tehnologija-tesko-3', word: 'Mikrocip', relation: 'Asocijacija' },
  ]),
  'Geografija-Lako': chainPreset('Karta', [
    { id: 'geografija-lako-1', word: 'Mapa', relation: 'Sinonim' },
    { id: 'geografija-lako-2', word: 'Nepoznat teren', relation: 'Antonim' },
    { id: 'geografija-lako-3', word: 'Atlas', relation: 'Asocijacija' },
  ]),
  'Geografija-Srednje': chainPreset('Ostrvo', [
    { id: 'geografija-srednje-1', word: 'Ada', relation: 'Sinonim' },
    { id: 'geografija-srednje-2', word: 'Kopno', relation: 'Antonim' },
    { id: 'geografija-srednje-3', word: 'Arhipelag', relation: 'Asocijacija' },
  ]),
  'Geografija-Tesko': chainPreset('Pravac', [
    { id: 'geografija-tesko-1', word: 'Smjer', relation: 'Sinonim' },
    { id: 'geografija-tesko-2', word: 'Lutanje', relation: 'Antonim' },
    { id: 'geografija-tesko-3', word: 'Meridijan', relation: 'Asocijacija' },
  ]),
}
