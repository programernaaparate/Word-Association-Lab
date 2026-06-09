import {
  DEFAULT_ASSOCIATION_WORDS,
  DEFAULT_LOGIC_CHALLENGES,
  DEFAULT_RELATION_CHALLENGES,
  DEFAULT_WORD_CHAIN_PRESETS,
} from './defaultGameContent.js'

const LEGACY_TEXT_REPLACEMENTS = [
  ['â˜€ï¸', '☀️'],
  ['âš›ï¸', '⚛️'],
  ['âš½', '⚽'],
  ['ðŸŒŠ', '🌊'],
  ['ðŸŒŒ', '🌌'],
  ['ðŸ§²', '🧲'],
  ['ðŸƒ', '🏃'],
  ['ðŸ¤¸', '🤸'],
  ['ðŸŽ¬', '🎬'],
  ['ðŸ”º', '🔺'],
  ['ðŸ¤–', '🤖'],
  ['ðŸ“š', '📚'],
  ['ÄŒ', 'Č'],
  ['Ä', 'č'],
  ['Ä†', 'Ć'],
  ['Ä‡', 'ć'],
  ['Ä', 'Đ'],
  ['Ä‘', 'đ'],
  ['Å ', 'Š'],
  ['Å¡', 'š'],
  ['Å½', 'Ž'],
  ['Å¾', 'ž'],
]

const REGIONAL_TEXT_REPLACEMENTS = [
  ['đ', 'dj'],
  ['Đ', 'Dj'],
  ['č', 'c'],
  ['Č', 'C'],
  ['ć', 'c'],
  ['Ć', 'C'],
  ['ž', 'z'],
  ['Ž', 'Z'],
  ['š', 's'],
  ['Š', 'S'],
  ['а', 'a'],
  ['А', 'A'],
  ['б', 'b'],
  ['Б', 'B'],
  ['в', 'v'],
  ['В', 'V'],
  ['г', 'g'],
  ['Г', 'G'],
  ['д', 'd'],
  ['Д', 'D'],
  ['ђ', 'dj'],
  ['Ђ', 'Dj'],
  ['е', 'e'],
  ['Е', 'E'],
  ['ж', 'z'],
  ['Ж', 'Z'],
  ['з', 'z'],
  ['З', 'Z'],
  ['и', 'i'],
  ['И', 'I'],
  ['ј', 'j'],
  ['Ј', 'J'],
  ['к', 'k'],
  ['К', 'K'],
  ['л', 'l'],
  ['Л', 'L'],
  ['љ', 'lj'],
  ['Љ', 'Lj'],
  ['м', 'm'],
  ['М', 'M'],
  ['н', 'n'],
  ['Н', 'N'],
  ['њ', 'nj'],
  ['Њ', 'Nj'],
  ['о', 'o'],
  ['О', 'O'],
  ['п', 'p'],
  ['П', 'P'],
  ['р', 'r'],
  ['Р', 'R'],
  ['с', 's'],
  ['С', 'S'],
  ['т', 't'],
  ['Т', 'T'],
  ['ћ', 'c'],
  ['Ћ', 'C'],
  ['у', 'u'],
  ['У', 'U'],
  ['ф', 'f'],
  ['Ф', 'F'],
  ['х', 'h'],
  ['Х', 'H'],
  ['ц', 'c'],
  ['Ц', 'C'],
  ['ч', 'c'],
  ['Ч', 'C'],
  ['џ', 'dz'],
  ['Џ', 'Dz'],
  ['ш', 's'],
  ['Ш', 'S'],
]

const DISPLAY_TEXT_FIXUPS = [
  [/mlijevni put/gi, 'mlijecni put'],
  [/\?itanje/gi, 'citanje'],
  [/\bairilica\b/gi, 'cirilica'],
]

const applyCaseAwareReplacement = (replacement = '', originalMatch = '') => {
  if (!originalMatch) {
    return replacement
  }

  if (originalMatch === originalMatch.toUpperCase()) {
    return replacement.toUpperCase()
  }

  if (originalMatch[0] === originalMatch[0]?.toUpperCase()) {
    return `${replacement.charAt(0).toUpperCase()}${replacement.slice(1)}`
  }

  return replacement
}

export const repairLegacyText = (value = '') => {
  let nextValue = String(value || '')

  LEGACY_TEXT_REPLACEMENTS.forEach(([brokenValue, fixedValue]) => {
    nextValue = nextValue.split(brokenValue).join(fixedValue)
  })

  return nextValue
}

const transliterateRegionalText = (value = '') => {
  let nextValue = String(value || '')

  REGIONAL_TEXT_REPLACEMENTS.forEach(([source, target]) => {
    nextValue = nextValue.split(source).join(target)
  })

  return nextValue
}

const applyDisplayTextFixups = (value = '') => {
  let nextValue = String(value || '')

  DISPLAY_TEXT_FIXUPS.forEach(([pattern, replacement]) => {
    nextValue = nextValue.replace(pattern, (match) =>
      applyCaseAwareReplacement(replacement, match)
    )
  })

  return nextValue
}

export const normalizeRegionalDisplayText = (value = '') =>
  applyDisplayTextFixups(transliterateRegionalText(repairLegacyText(value)))

export const sanitizeGameSymbol = (value = '') => {
  const normalizedValue = normalizeRegionalDisplayText(value).trim()
  return /^\?+$/.test(normalizedValue) ? '' : normalizedValue
}

const STATIC_TERM_ALIAS_GROUPS = [
  ['astronomija', 'nauka o svemiru', 'svemirska nauka'],
  ['gravitacija', 'sila teze'],
  ['fudbal', 'nogomet'],
  ['film', 'kinematografija', 'filmska umjetnost', 'filmska umetnost'],
  ['egipat', 'stari egipat', 'drevni egipat'],
  ['voda', 'h2o'],
  ['simfonija', 'orkestarsko djelo', 'orkestarsko delo'],
  ['softver', 'software', 'programska oprema'],
  ['geografija', 'nauka o zemlji'],
  ['celija', 'ćelija', 'bioloska celija', 'biološka ćelija', 'stanica'],
  ['zanr', 'žanr', 'vrsta filma', 'filmski zanr', 'filmski žanr'],
  ['pozoriste', 'pozorište', 'teatar'],
  ['racunar', 'računar', 'kompjuter', 'komputer'],
  ['mreza', 'mreža'],
  ['usce', 'ušće'],
  ['zivotinja', 'životinja', 'zivotinje', 'životinje'],
  ['planete', 'planeta', 'planeti'],
  ['meridijan', 'meridijani'],
  ['robotika', 'nauka o robotima', 'oblast robotike'],
  ['gimnastika', 'sportska gimnastika'],
  ['rukomet', 'handball'],
  ['montaza', 'montaža', 'filmska montaza', 'filmska montaža'],
  ['cirilica', 'ćirilica'],
  ['trijumf', 'pobjeda', 'uspeh', 'uspjeh'],
  ['trka', 'utrka', 'sportska trka', 'sportska utrka'],
  ['takmicenje', 'natjecanje', 'nadmetanje'],
  ['lik', 'junak', 'karakter', 'persona'],
  ['scena', 'prizor', 'kadar'],
  ['muzika', 'glazba'],
  ['suma', 'šuma', 'gaj'],
  ['toplota', 'toplina', 'vrucina', 'vrućina'],
  ['obala', 'primorje'],
  ['dubler', 'kaskader', 'stunt dubler'],
  ['pravac', 'smjer', 'smer', 'kurs'],
  ['mapa', 'karta'],
  ['eksplozija', 'detonacija'],
  ['lozinka', 'sifra', 'šifra', 'password'],
  ['reziser', 'režiser', 'reditelj'],
  ['bioskop', 'kino', 'kino sala'],
  ['kamera', 'filmska kamera'],
  ['scenario', 'scenarijo', 'filmski scenario'],
  ['montaza', 'montaža', 'obrada snimka', 'filmska montaza', 'filmska montaža'],
  ['diplomatija', 'medjudrzavni odnosi', 'međudržavni odnosi'],
  ['simfonija', 'orkestarska kompozicija', 'orkestarsko djelo', 'orkestarsko delo'],
  ['perspektiva', 'prostorni prikaz'],
  ['algoritam', 'postupak', 'niz koraka'],
  ['mikrocip', 'mikro cip', 'cip', 'čip', 'cipset'],
  ['atlas', 'zbirka karata'],
  ['arhipelag', 'skup ostrva', 'grupa ostrva'],
  ['poluostrvo', 'poluotok'],
  ['meridijan', 'meridian'],
  ['usce', 'ušće', 'rijecno usce', 'rečno ušće'],
  ['rezija', 'režija'],
  ['cirilica', 'ćirilica', 'azbuka'],
  ['suma', 'šuma', 'gaj'],
  ['pecina', 'pećina'],
  ['pozoriste', 'pozorište', 'teatar'],
  ['mreza', 'mreža', 'network', 'računarska mreža', 'racunarska mreza'],
  ['racunar', 'računar', 'kompjuter', 'komputer', 'pc'],
  ['kiseonik', 'oksigen'],
  ['vulkan', 'ognjena planina'],
  ['sunce', 'suncev disk', 'sunčev disk'],
  ['more', 'morska povrsina', 'morska površina'],
  ['roman', 'knjizevni roman', 'književni roman'],
  ['zanr', 'žanr', 'vrsta', 'kategorija djela', 'kategorija dela'],
  ['sifra', 'šifra', 'lozinka', 'password', 'passcode'],
  ['trofej', 'pehar', 'pokal'],
  ['medalja', 'odlikovanje', 'odlicje', 'odličje'],
  ['vjetar', 'vetar', 'povjetarac', 'povetarac'],
  ['kisa', 'kiša', 'padavina', 'pljusak'],
  ['planina', 'gora'],
  ['livada', 'poljana'],
  ['carstvo', 'imperija'],
  ['tvrdjava', 'tvrđava', 'utvrdjenje', 'utvrđenje'],
  ['ustanak', 'pobuna', 'buna'],
  ['bastina', 'baština', 'nasljedje', 'nasleđe'],
  ['dokumentarac', 'dokumentarni film'],
  ['trejler', 'najava filma', 'filmska najava'],
  ['enkripcija', 'sifrovanje', 'šifrovanje', 'kriptovanje'],
  ['pretrazivac', 'pretraživač', 'browser'],
  ['baza podataka', 'database', 'db'],
  ['dron', 'bespilotna letjelica', 'bespilotna letelica'],
  ['galerija', 'izlozbeni prostor', 'izložbeni prostor'],
  ['balet', 'plesna predstava'],
  ['titl', 'podnaslov', 'prevod na ekranu'],
  ['producent', 'filmski producent'],
  ['premijera', 'prvo prikazivanje'],
  ['kasting', 'izbor glumaca'],
  ['animacija', 'crtani film'],
  ['scenario', 'scenarij', 'filmski scenario', 'filmski scenarij'],
  ['sinopsis', 'kratak sadrzaj', 'kratki sadrzaj'],
  ['storyboard', 'knjiga snimanja', 'vizuelni plan'],
  ['scenografija', 'dekor scene', 'scenski dekor'],
  ['rasvjeta', 'osvjetljenje', 'osvetljenje'],
  ['kinematografija', 'filmska produkcija', 'filmsko stvaralastvo', 'filmsko stvaralaštvo'],
  ['trilogija', 'serijal od tri dijela', 'serijal od tri dela'],
  ['drzava', 'zemlja'],
  ['zaliv', 'zaljev'],
  ['regija', 'oblast', 'podrucje', 'područje'],
  ['klima', 'podneblje'],
  ['laguna', 'obalna laguna'],
  ['longituda', 'geografska duzina', 'geografska dužina'],
  ['kartografija', 'izrada karata', 'nauka o kartama'],
  ['topografija', 'opis terena', 'prikaz terena'],
  ['geomorfologija', 'nauka o reljefu'],
  ['geopolitika', 'politicka geografija', 'politička geografija'],
  ['tjesnac', 'moreuz'],
  ['bitka', 'boj'],
  ['spomenik', 'monument'],
  ['arhiv', 'arhiva'],
  ['dinastija', 'vladarska loza'],
  ['hronika', 'ljetopis', 'letopis'],
  ['hronicar', 'ljetopisac', 'letopisac'],
  ['imperator', 'car'],
  ['reforma', 'preuredjenje', 'preuređenje'],
  ['republika', 'drzava bez monarha', 'zemlja bez monarha'],
  ['povelja', 'svecana isprava', 'svečana isprava'],
  ['arheologija', 'nauka o starinama', 'nauka o starim civilizacijama'],
  ['epruveta', 'laboratorijska cjevcica', 'laboratorijska cevcica'],
  ['fosil', 'okamina'],
  ['vakcina', 'cjepivo', 'cepivo'],
  ['genetika', 'nauka o genima'],
  ['hormon', 'hemijski glasnik', 'hemijski signal'],
  ['meteorologija', 'nauka o vremenu', 'vremenska nauka'],
  ['spektar', 'opseg boja', 'raspon boja'],
  ['tektonika', 'pomjeranje ploca', 'pomeranje ploca'],
  ['duga', 'dugin luk'],
  ['jezero', 'stajaca voda', 'stajaća voda'],
  ['sjeme', 'seme'],
  ['koral', 'koralj'],
  ['lednik', 'glecer', 'glečer'],
  ['uvala', 'manji zaliv', 'manji zaljev'],
  ['atmosfera', 'vazdusni omotac', 'vazdušni omotač'],
  ['biosfera', 'zivi omotac zemlje', 'živi omotač zemlje'],
  ['ekosistem', 'zivotna zajednica', 'životna zajednica'],
  ['erozija', 'spiranje tla'],
  ['gejzir', 'vreli izvor'],
  ['mahovina', 'niska biljka'],
  ['plima', 'porast mora', 'rast nivoa mora'],
  ['sediment', 'talog'],
  ['kosarka', 'košarka'],
  ['odbojka', 'volejbol', 'volleyball'],
  ['plivanje', 'plivacka disciplina', 'plivačka disciplina'],
  ['stadion', 'sportska arena'],
  ['trening', 'vjezba', 'vežba'],
  ['kapiten', 'vodja tima', 'vođa tima'],
  ['ofsajd', 'zaledje', 'zaleđe'],
  ['penal', 'kazneni udarac'],
  ['turnir', 'takmicenje', 'takmičenje'],
  ['regata', 'jedrilicarska trka', 'jedriličarska trka'],
  ['desetoboj', 'deset disciplina'],
  ['aplikacija', 'app', 'program'],
  ['procesor', 'cpu'],
  ['server', 'posluzilac', 'poslužilac'],
  ['ruter', 'usmjerivac', 'usmerivač'],
  ['interfejs', 'korisnicki interfejs', 'korisnički interfejs'],
  ['protokol', 'skup pravila'],
  ['bekap', 'rezervna kopija', 'backup'],
  ['kompajler', 'prevodilac koda'],
  ['latencija', 'kasnjenje', 'kašnjenje'],
  ['satelit', 'vestacki satelit', 'veštački satelit'],
  ['virtuelizacija', 'virtualizacija'],
  ['basna', 'prica s poukom', 'priča s poukom'],
  ['strip', 'komiks'],
  ['portret', 'likovni prikaz osobe'],
  ['mural', 'zidna slika'],
  ['arija', 'operska solo dionica', 'operska solo deonica'],
  ['recital', 'javni nastup'],
  ['gravura', 'urezani otisak', 'urezani otisak'],
  ['instalacija', 'prostorna postavka'],
  ['kompozicija', 'raspored elemenata'],
  ['kontrast', 'suprotnost u prikazu'],
  ['minimalizam', 'svedeni stil'],
  ['impresionizam', 'slikarski pravac svjetlosti', 'slikarski pravac svetlosti'],
  ['ekspresionizam', 'umjetnost izraza', 'umetnost izraza'],
  ['monarhija', 'vladavina kralja', 'kraljevska vlast'],
  ['reljef', 'oblik terena', 'konfiguracija terena'],
  ['slikarstvo', 'likovna umjetnost', 'likovna umetnost', 'umjetnost slikanja', 'umetnost slikanja'],
  ['film', 'pokretne slike'],
  ['astronomija', 'proucavanje svemira', 'proučavanje svemira'],
  ['egipat', 'staroegipatska civilizacija'],
  ['zivotinja', 'zivo bice', 'živo biće'],
  ['voda', 'tecnost zivota', 'tečnost života'],
  ['softver', 'aplikativni program', 'digitalni program'],
  ['atelje', 'studio umjetnika', 'studio umetnika', 'slikarski studio'],
  ['audicija', 'probno snimanje', 'glumacka proba', 'glumačka proba'],
  ['automatizacija', 'automatika procesa', 'automatika'],
  ['avangarda', 'napredni pravac', 'radikalni pravac'],
  ['boks', 'borilacki sport', 'borilački sport'],
  ['civilizacija', 'razvijeno drustvo', 'razvijeno društvo'],
  ['delta', 'rijecna delta', 'rečna delta'],
  ['drama', 'dramsko djelo', 'dramsko delo'],
  ['element', 'hemijski element', 'kemijski element'],
  ['entropija', 'mjera nereda', 'mera nereda'],
  ['festival', 'smotra umjetnosti', 'smotra umetnosti'],
  ['finale', 'zavrsnica', 'završnica'],
  ['formula', 'jednacina', 'jednačina'],
  ['galaksija', 'zvjezdani sistem', 'zvezdani sistem'],
  ['globus', 'model zemlje', 'model Zemlje'],
  ['granica', 'medja', 'međa'],
  ['hokej', 'sport na ledu'],
  ['hronologija', 'redosljed dogadjaja', 'redosled događaja'],
  ['izvor', 'vrelo'],
  ['jedrenje', 'plovidba na jedra'],
  ['kadrovanje', 'kompozicija kadra'],
  ['kajak', 'mali camac', 'mali čamac'],
  ['kanal', 'vodeni prolaz'],
  ['kanjon', 'duboka klisura'],
  ['katalizator', 'ubrzivac reakcije', 'ubrzivač reakcije'],
  ['kibernetika', 'nauka o upravljanju sistemima'],
  ['kolonizacija', 'naseljavanje teritorija'],
  ['komedija', 'humoristicki film', 'humoristički film'],
  ['kondicija', 'fizicka sprema', 'fizička sprema'],
  ['koreografija', 'plesni raspored'],
  ['kostim', 'scenska odjeca', 'scenska odeća'],
  ['kraljevina', 'drzava kralja', 'država kralja'],
  ['kursor', 'pokazivac misa', 'pokazivač miša'],
  ['laboratorija', 'lab', 'naucna laboratorija', 'naučna laboratorija'],
  ['legija', 'vojna jedinica'],
  ['magnet', 'magnetni predmet'],
  ['manifest', 'programski tekst', 'javna izjava načela', 'javna izjava nacela'],
  ['maraton', 'duga trka', 'duga utrka'],
  ['maska', 'krinka'],
  ['mikroskop', 'povecalo za sitno', 'povećalo za sitno'],
  ['mizanscen', 'mizanscen scena', 'raspored na sceni'],
  ['molekul', 'skup atoma'],
  ['mozaik', 'slika od sitnih djelova', 'slika od sitnih delova'],
  ['munja', 'gromoviti bljesak', 'gromoviti bljesak'],
  ['neuron', 'nervna celija', 'nervna ćelija'],
  ['okean', 'svjetsko more', 'svetsko more'],
  ['opsada', 'okruzenje grada', 'okruženje grada'],
  ['orbita', 'putanja oko tijela', 'putanja oko tela'],
  ['piramida', 'egipatska grobnica', 'stepenasta gradjevina', 'stepenasta građevina'],
  ['platno', 'bioskopsko platno', 'slikarsko platno'],
  ['postprodukcija', 'zavrsna obrada filma', 'završna obrada filma'],
  ['potok', 'manji vodotok'],
  ['pustinja', 'suha oblast', 'suva oblast'],
  ['ravnica', 'ravan predio', 'ravan predeo'],
  ['reket', 'teniski reket'],
  ['renesansa', 'preporod'],
  ['revolucija', 'prevrat'],
  ['robot', 'automat'],
  ['rt', 'izbočina kopna', 'izbocina kopna'],
  ['senzor', 'detektor'],
  ['teorija', 'naucno objasnjenje', 'naučno objašnjenje'],
  ['vitez', 'srednjovjekovni ratnik', 'srednjovekovni ratnik'],
  ['vlaga', 'vlaznost', 'mokrota', 'orosenost', 'vlazno', 'mokro'],
  ['susa', 'suvoca', 'isusenost', 'suvo', 'suv', 'suhoca', 'suhost'],
  ['hladnoca', 'studen', 'led', 'hladno', 'hladan'],
  ['toplota', 'vrucina', 'vrelina', 'toplo', 'vruce', 'zagrijanost'],
  ['poraz', 'gubitak', 'neuspjeh', 'izgubljeno'],
  ['tisina', 'muk', 'cutanje', 'bezvucnost', 'tiho'],
  ['digitalno', 'elektronski', 'racunarski', 'kompjuterski'],
]

const STATIC_RELATED_CONCEPT_GROUPS = [
  [
    'film',
    'kinematografija',
    'filmska umjetnost',
    'pozoriste',
    'pozorište',
    'teatar',
    'glumac',
    'glumci',
    'gluma',
    'scena',
    'prizor',
    'kadar',
    'rezija',
    'režija',
    'predstava',
  ],
  ['astronomija', 'svemir', 'kosmos', 'galaksija', 'orbita', 'planeta', 'zvijezda'],
  ['geografija', 'atlas', 'mapa', 'karta', 'meridijan', 'koordinate', 'kontinent'],
  ['tehnologija', 'softver', 'software', 'program', 'algoritam', 'racunar', 'računar', 'kompjuter'],
  ['sport', 'fudbal', 'nogomet', 'rukomet', 'gimnastika', 'maraton', 'trka', 'štafeta', 'stafeta'],
  [
    'trka',
    'utrka',
    'brzina',
    'tempo',
    'sprint',
    'staza',
    'start',
    'cilj',
    'finis',
    'maraton',
    'atletika',
    'nadmetanje',
    'takmicenje',
  ],
  [
    'takmicenje',
    'nadmetanje',
    'trka',
    'utrka',
    'rezultat',
    'protivnik',
    'pobjeda',
    'poraz',
    'medalja',
    'arena',
    'sudija',
  ],
  ['brzina', 'tempo', 'sprint', 'ubrzanje', 'kretanje', 'pokret', 'trka'],
  ['priroda', 'voda', 'more', 'rijeka', 'šuma', 'suma', 'sunce', 'vulkan', 'planina'],
  [
    'eksplozija',
    'detonacija',
    'eksploziv',
    'dinamit',
    'petarda',
    'vatromet',
    'bomba',
    'udarni talas',
    'krater',
    'pepeo',
    'vulkan',
    'lava',
  ],
  ['toplota', 'toplina', 'vrucina', 'vrućina', 'vrelina', 'temperatura', 'sunce', 'ljeto', 'vatra', 'energija'],
  ['umjetnost', 'muzika', 'simfonija', 'pozoriste', 'pozorište', 'teatar', 'skulptura', 'perspektiva'],
  ['vlaga', 'vlaznost', 'mokrota', 'orosenost', 'voda', 'kisa', 'rosa', 'magla', 'oblak', 'para', 'kondenzacija'],
  ['vlaga', 'vlaznost', 'mokrota', 'voda', 'kisa', 'rosa', 'magla', 'oblak', 'para', 'kondenzacija', 'kapljica'],
  ['toplota', 'vrucina', 'vrelina', 'zagrijanost', 'temperatura', 'sunce', 'ljeto', 'vatra', 'plamen'],
  ['muzika', 'melodija', 'harmonija', 'simfonija', 'nota', 'orkestar', 'ritam', 'zvuk'],
  ['atmosfera', 'ozon', 'vazduh', 'zrak', 'nebo', 'oblak', 'vjetar', 'vrijeme', 'prognoza'],
  ['bitka', 'boj', 'vojska', 'rat', 'front', 'oruzje', 'vojnik', 'sukob'],
  ['bioskop', 'kino', 'film', 'projekcija', 'platno', 'kamera', 'scena', 'kokice'],
  ['eksplozija', 'detonacija', 'prasak', 'dinamit', 'petarda', 'bomba', 'vatromet', 'udar', 'krater', 'erupcija'],
  ['figura', 'oblik', 'silueta', 'forma', 'skulptura', 'crtez', 'kontura', 'vajar'],
  ['dubina', 'prostornost', 'slojevitost', 'perspektiva', 'prostor', 'udaljenost', 'horizont', 'linije'],
  ['program', 'softver', 'sistem', 'aplikacija', 'algoritam', 'kod', 'racunar', 'robot', 'automatizacija'],
  ['logika', 'analiza', 'zakljucivanje', 'racunanje', 'algoritam', 'koraci', 'program'],
  ['digitalno', 'elektronski', 'racunarski', 'mikrocip', 'procesor', 'podaci', 'signal'],
  ['ostrvo', 'ada', 'ostrvce', 'arhipelag', 'more', 'obala', 'luka', 'kopno'],
  ['pravac', 'smjer', 'kurs', 'kompas', 'orijentacija', 'koordinate', 'meridijan', 'putanja'],
  ['kralj', 'vladar', 'monarh', 'kruna', 'dvor', 'prijesto', 'kraljevina'],
  ['drevno', 'staro', 'antika', 'renesansa', 'civilizacija', 'istorija', 'spomenik'],
  ['sporazum', 'dogovor', 'savez', 'pregovori', 'ambasada', 'ugovor', 'diplomatija'],
]

const buildGroupsFromAcceptedAnswers = () => {
  const groups = []

  DEFAULT_ASSOCIATION_WORDS.forEach((item) => {
    const group = [item.word, ...(item.acceptedAnswers || [])].filter(Boolean)
    if (group.length > 1) {
      groups.push(group)
    }
  })

  DEFAULT_LOGIC_CHALLENGES.forEach((item) => {
    if (item.mode !== 'concept') {
      return
    }

    const group = [item.answer, ...(item.acceptedAnswers || [])].filter(Boolean)
    if (group.length > 1) {
      groups.push(group)
    }
  })

  return groups
}

const buildGroupsFromRelations = (relationType) =>
  DEFAULT_RELATION_CHALLENGES.filter((item) => item.relation === relationType).map((item) => [
    item.leftWord,
    item.rightWord,
  ])

const buildGroupsFromWordChainPresets = (relationType) =>
  Object.values(DEFAULT_WORD_CHAIN_PRESETS).flatMap((presets) =>
    presets
      .map((preset) => [
        preset.centerWord,
        ...preset.starterNodes
          .filter((node) => node.relation === relationType)
          .map((node) => node.word),
      ])
      .filter((group) => group.length > 1)
  )

const buildGroupsFromWordChainCenterFamilies = () =>
  Object.values(DEFAULT_WORD_CHAIN_PRESETS)
    .map((presets) => presets.map((preset) => preset.centerWord).filter(Boolean))
    .filter((group) => group.length > 1)

const buildGroupsFromWordChainRelationFamilies = (relationType) =>
  Object.values(DEFAULT_WORD_CHAIN_PRESETS)
    .map((presets) =>
      presets
        .flatMap((preset) =>
          (preset.starterNodes || [])
            .filter((node) => node.relation === relationType)
            .map((node) => node.word)
        )
        .filter(Boolean)
    )
    .filter((group) => group.length > 1)

const buildGroupsFromAssociationClues = () =>
  DEFAULT_ASSOCIATION_WORDS.map((item) => [item.word, ...(item.clues || [])]).filter(
    (group) => group.length > 1
  )

const buildGroupsFromLogicChallengeWords = () =>
  DEFAULT_LOGIC_CHALLENGES.filter((item) => item.mode === 'concept').map((item) => [
    item.answer,
    ...(item.words || []),
    ...(item.acceptedAnswers || []),
  ])

const COMMON_ANSWER_PREFIXES = [
  'to je',
  'ovo je',
  'odgovor je',
  'tacan odgovor je',
  'mislim da je',
  'ja mislim da je',
  'rekao bih da je',
  'rekao bih',
  'mozda je',
  'pojam je',
]

const normalizeBaseText = (value = '') =>
  transliterateRegionalText(repairLegacyText(value))
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const collapseRepeatedCharacters = (value = '') =>
  repairLegacyText(value).replace(/([a-z0-9])\1{2,}/g, '$1')

const toCompactText = (value = '') => normalizeBaseText(value).replace(/\s+/g, '')

const toCollapsedCompactText = (value = '') =>
  toCompactText(collapseRepeatedCharacters(value))

const tokenize = (value = '') => normalizeBaseText(value).split(' ').filter(Boolean)

const buildNormalizedComponentLookup = (groups = []) => {
  const adjacency = new Map()

  groups.forEach((group) => {
    const normalizedGroup = [...new Set(group.map(normalizeBaseText).filter(Boolean))]

    normalizedGroup.forEach((term) => {
      if (!adjacency.has(term)) {
        adjacency.set(term, new Set())
      }
    })

    normalizedGroup.forEach((term) => {
      const neighbors = adjacency.get(term)
      normalizedGroup.forEach((neighbor) => {
        if (neighbor !== term) {
          neighbors.add(neighbor)
        }
      })
    })
  })

  const componentLookup = new Map()
  const visited = new Set()

  adjacency.forEach((_neighbors, startTerm) => {
    if (visited.has(startTerm)) {
      return
    }

    const stack = [startTerm]
    const component = []
    visited.add(startTerm)

    while (stack.length) {
      const current = stack.pop()
      component.push(current)

      ;(adjacency.get(current) || []).forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          stack.push(neighbor)
        }
      })
    }

    const uniqueComponent = [...new Set(component)].sort()
    uniqueComponent.forEach((term) => {
      componentLookup.set(term, uniqueComponent)
    })
  })

  return componentLookup
}

const buildNormalizedUnionLookup = (groups = []) => {
  const lookup = new Map()

  groups.forEach((group) => {
    const normalizedGroup = [...new Set(group.map(normalizeBaseText).filter(Boolean))]

    normalizedGroup.forEach((term) => {
      if (!lookup.has(term)) {
        lookup.set(term, new Set())
      }

      const currentSet = lookup.get(term)
      normalizedGroup.forEach((item) => {
        currentSet.add(item)
      })
    })
  })

  return new Map(
    Array.from(lookup.entries()).map(([term, values]) => [term, [...values].sort()])
  )
}

const stripAnswerFraming = (value = '') => {
  const normalizedValue = normalizeBaseText(value)

  if (!normalizedValue) {
    return ''
  }

  const matchedPrefix = COMMON_ANSWER_PREFIXES.find(
    (prefix) => normalizedValue === prefix || normalizedValue.startsWith(`${prefix} `)
  )

  if (!matchedPrefix) {
    return normalizedValue
  }

  return normalizedValue.slice(matchedPrefix.length).trim()
}

const getLevenshteinDistance = (leftValue = '', rightValue = '') => {
  const left = String(leftValue || '')
  const right = String(rightValue || '')

  if (!left.length) return right.length
  if (!right.length) return left.length

  const matrix = Array.from({ length: left.length + 1 }, (_, rowIndex) =>
    Array.from({ length: right.length + 1 }, (_, columnIndex) =>
      rowIndex === 0 ? columnIndex : columnIndex === 0 ? rowIndex : 0
    )
  )

  for (let rowIndex = 1; rowIndex <= left.length; rowIndex += 1) {
    for (let columnIndex = 1; columnIndex <= right.length; columnIndex += 1) {
      const cost = left[rowIndex - 1] === right[columnIndex - 1] ? 0 : 1

      matrix[rowIndex][columnIndex] = Math.min(
        matrix[rowIndex - 1][columnIndex] + 1,
        matrix[rowIndex][columnIndex - 1] + 1,
        matrix[rowIndex - 1][columnIndex - 1] + cost
      )
    }
  }

  return matrix[left.length][right.length]
}

const isSmallTypoMatch = (leftValue = '', rightValue = '') => {
  const left = toCollapsedCompactText(leftValue)
  const right = toCollapsedCompactText(rightValue)

  if (!left || !right || left === right) {
    return Boolean(left && right && left === right)
  }

  const maxLength = Math.max(left.length, right.length)
  const lengthDifference = Math.abs(left.length - right.length)

  if (maxLength <= 4 || lengthDifference > 2 || left[0] !== right[0]) {
    return false
  }

  const distance = getLevenshteinDistance(left, right)

  if (maxLength <= 6) {
    return distance <= 1
  }

  if (maxLength <= 10) {
    return distance <= 2
  }

  return distance <= 2
}

const LINKING_TOKENS = new Set(['o', 'u', 'i', 'na', 'sa', 'za', 'od', 'do', 'po', 'ka', 'ko'])

const isLikelyBrokenSplitVariant = (value = '', referenceAliases = []) => {
  const normalizedValue = normalizeBaseText(value)

  if (!normalizedValue.includes(' ')) {
    return false
  }

  const tokens = tokenize(normalizedValue)

  if (!tokens.length || tokens.some((token) => LINKING_TOKENS.has(token))) {
    return false
  }

  const compactValue = normalizedValue.replace(/\s+/g, '')

  return (referenceAliases || []).some((alias) => {
    const compactAlias = normalizeBaseText(alias).replace(/\s+/g, '')

    if (!compactAlias || compactAlias === compactValue) {
      return false
    }

    return isSmallTypoMatch(compactValue, compactAlias)
  })
}

const TERM_ALIAS_GROUPS = [
  ...STATIC_TERM_ALIAS_GROUPS,
  ...buildGroupsFromAcceptedAnswers(),
  ...buildGroupsFromWordChainCenterFamilies(),
  ...buildGroupsFromWordChainRelationFamilies('Sinonim'),
  ...buildGroupsFromWordChainRelationFamilies('Antonim'),
  ...buildGroupsFromRelations('Sinonim'),
  ...buildGroupsFromWordChainPresets('Sinonim'),
]

const RELATED_CONCEPT_GROUPS = [
  ...STATIC_RELATED_CONCEPT_GROUPS,
  ...buildGroupsFromLogicChallengeWords(),
  ...buildGroupsFromRelations('Asocijacija'),
  ...buildGroupsFromWordChainRelationFamilies('Asocijacija'),
  ...buildGroupsFromWordChainPresets('Asocijacija'),
  ...buildGroupsFromAssociationClues(),
]

const ALIAS_LOOKUP = buildNormalizedComponentLookup(TERM_ALIAS_GROUPS)
const RELATED_LOOKUP = buildNormalizedUnionLookup(RELATED_CONCEPT_GROUPS)

const expandAliases = (value = '') => {
  const normalizedValue = normalizeBaseText(value)
  if (!normalizedValue) {
    return []
  }

  return ALIAS_LOOKUP.get(normalizedValue) || [normalizedValue]
}

const buildStoredAnswerVariants = (value = '') => {
  const repairedValue = repairLegacyText(value).trim()
  const normalizedValue = normalizeBaseText(repairedValue)
  const lowercaseValue = repairedValue.toLowerCase()
  const compactValue = repairedValue.replace(/\s+/g, ' ').trim()

  return [...new Set([repairedValue, compactValue, lowercaseValue, normalizedValue].filter(Boolean))]
}

export const expandAcceptedAnswersForValue = (canonicalValue = '', acceptedAnswers = []) => {
  const allCandidates = [canonicalValue, ...(acceptedAnswers || [])].filter(Boolean)
  const canonicalAliases = expandAliases(canonicalValue)
  const normalizedKeys = new Set()
  const expandedAnswers = []

  allCandidates.forEach((candidate) => {
    if (candidate !== canonicalValue && isLikelyBrokenSplitVariant(candidate, canonicalAliases)) {
      return
    }

    expandAliases(candidate).forEach((alias) => {
      buildStoredAnswerVariants(alias).forEach((variant) => {
        const normalizedKey = normalizeBaseText(variant)

        if (!normalizedKey || normalizedKeys.has(normalizedKey)) {
          return
        }

        normalizedKeys.add(normalizedKey)
        expandedAnswers.push(variant)
      })
    })
  })

  return expandedAnswers
}

const buildComparableVariants = (value = '') => {
  const normalizedValue = normalizeBaseText(value)
  if (!normalizedValue) {
    return []
  }

  const collapsedValue = normalizeBaseText(collapseRepeatedCharacters(normalizedValue))
  const compactValue = normalizedValue.replace(/\s+/g, '')
  const collapsedCompactValue = collapsedValue.replace(/\s+/g, '')
  const sortedTokensValue = tokenize(normalizedValue).sort().join(' ')

  return [
    normalizedValue,
    collapsedValue,
    compactValue,
    collapsedCompactValue,
    sortedTokensValue,
  ].filter(Boolean)
}

const buildAnswerVariants = (value = '') => {
  const strippedValue = stripAnswerFraming(value)

  return [
    ...new Set([
      ...buildComparableVariants(value),
      ...(strippedValue ? buildComparableVariants(strippedValue) : []),
    ]),
  ]
}

const getExpandedAlternatives = (values = []) => {
  const alternatives = new Set()

  ;(values || []).forEach((value) => {
    expandAliases(value).forEach((alias) => {
      buildComparableVariants(alias).forEach((variant) => {
        alternatives.add(variant)
      })
    })
  })

  return [...alternatives]
}

const getRelatedConcepts = (values = []) => {
  const relatedConcepts = new Set()

  ;(values || []).forEach((value) => {
    const candidateVariants = [value, ...expandAliases(value)]

    candidateVariants.forEach((variant) => {
      const normalizedValue = normalizeBaseText(variant)
      const group = RELATED_LOOKUP.get(normalizedValue) || []
      group.forEach((item) => {
        relatedConcepts.add(item)
      })
    })
  })

  return [...relatedConcepts]
}

const findVariantMatch = (actualVariants = [], expectedVariants = []) => {
  for (const actualVariant of actualVariants) {
    for (const expectedVariant of expectedVariants) {
      if (actualVariant === expectedVariant) {
        return expectedVariant
      }

      if (isSmallTypoMatch(actualVariant, expectedVariant)) {
        return expectedVariant
      }
    }
  }

  return null
}

export const evaluateSmartConceptAnswer = (challenge = {}, actualAnswer = '') => {
  const actualVariants = buildAnswerVariants(actualAnswer)

  if (!actualVariants.length) {
    return { accepted: false, partialAccepted: false, matchedAnswer: null, scoreWeight: 0 }
  }

  const acceptedCandidates = [
    challenge?.answer || '',
    ...(challenge?.acceptedAnswers || []),
  ].filter(Boolean)

  const expandedExpectedVariants = getExpandedAlternatives(acceptedCandidates)
  const directMatch = findVariantMatch(actualVariants, expandedExpectedVariants)

  if (directMatch) {
    return {
      accepted: true,
      partialAccepted: false,
      matchedAnswer: directMatch,
      scoreWeight: 1,
    }
  }

  const actualTokens = new Set(tokenize(actualAnswer))
  const acceptedPhraseMatch = acceptedCandidates.find((candidate) => {
    const candidateTokens = tokenize(candidate)

    if (!candidateTokens.length || candidateTokens.length !== actualTokens.size) {
      return false
    }

    return candidateTokens.every((token) => actualTokens.has(token))
  })

  if (acceptedPhraseMatch) {
    return {
      accepted: true,
      partialAccepted: false,
      matchedAnswer: normalizeBaseText(acceptedPhraseMatch),
      scoreWeight: 1,
    }
  }

  const actualRelatedConcepts = new Set(getRelatedConcepts([actualAnswer]))
  const expectedAndPromptConcepts = getRelatedConcepts([
    ...acceptedCandidates,
    ...(challenge?.words || []),
  ])
  const partialMatch = expectedAndPromptConcepts.find((item) => actualRelatedConcepts.has(item))

  if (partialMatch) {
    return {
      accepted: false,
      partialAccepted: true,
      matchedAnswer: partialMatch,
      scoreWeight: 0.5,
      reason: 'Odgovor je povezan sa pojmovima, ali nije najprecizniji zajednicki pojam.',
    }
  }

  return {
    accepted: false,
    partialAccepted: false,
    matchedAnswer: null,
    scoreWeight: 0,
  }
}

export const evaluateSmartAssociationAnswer = (wordItem = {}, actualAnswer = '') => {
  const actualVariants = buildAnswerVariants(actualAnswer)

  if (!actualVariants.length) {
    return { accepted: false, matchedAnswer: null, partialAccepted: false }
  }

  const acceptedCandidates = [
    wordItem?.word || '',
    ...(wordItem?.acceptedAnswers || []),
  ].filter(Boolean)

  const expandedExpectedVariants = getExpandedAlternatives(acceptedCandidates)
  const directMatch = findVariantMatch(actualVariants, expandedExpectedVariants)

  if (directMatch) {
    return {
      accepted: true,
      partialAccepted: false,
      matchedAnswer: directMatch,
    }
  }

  const normalizedActual = stripAnswerFraming(actualAnswer)
  const actualTokens = tokenize(normalizedActual)
  const actualTokenSet = new Set(actualTokens)
  const acceptedPhraseMatch = acceptedCandidates.find((candidate) => {
    const candidateTokens = tokenize(candidate)

    if (!candidateTokens.length || candidateTokens.length !== actualTokens.length) {
      return false
    }

    return candidateTokens.every((token) => actualTokenSet.has(token))
  })

  if (acceptedPhraseMatch) {
    return {
      accepted: true,
      partialAccepted: false,
      matchedAnswer: normalizeBaseText(acceptedPhraseMatch),
    }
  }

  return {
    accepted: false,
    partialAccepted: false,
    matchedAnswer: null,
  }
}

export const evaluateSmartWordChainCandidate = ({
  candidateWord = '',
  allowedWords = [],
  relation = '',
  centerWord = '',
} = {}) => {
  const actualVariants = buildAnswerVariants(candidateWord)

  if (!actualVariants.length) {
    return { accepted: false, matchedWord: null }
  }

  for (const allowedWord of allowedWords || []) {
    const directExpectedVariants = buildComparableVariants(allowedWord)
    const directMatch = findVariantMatch(actualVariants, directExpectedVariants)

    if (directMatch) {
      return {
        accepted: true,
        matchedWord: allowedWord,
        reason:
          normalizeBaseText(candidateWord) === normalizeBaseText(allowedWord)
            ? `Prepoznata dobra veza sa pojmom "${allowedWord}".`
            : `Prepoznato kao razumna varijacija za "${allowedWord}".`,
      }
    }

  }

  for (const allowedWord of allowedWords || []) {
    const expectedVariants = getExpandedAlternatives([allowedWord])
    const matchedVariant = findVariantMatch(actualVariants, expectedVariants)

    if (matchedVariant) {
      return {
        accepted: true,
        matchedWord: allowedWord,
        reason: `Prepoznato kao razumna varijacija za "${allowedWord}".`,
      }
    }
  }

  if (relation === 'Asocijacija') {
    const actualRelatedConcepts = new Set(getRelatedConcepts([candidateWord]))
    const allowedRelatedConcepts = getRelatedConcepts(allowedWords)
    const relatedMatch = allowedRelatedConcepts.find((item) => actualRelatedConcepts.has(item))

    if (relatedMatch) {
      return {
        accepted: true,
        matchedWord: relatedMatch,
        reason: 'Prepoznata je prirodna asocijativna veza za ovu rundu.',
      }
    }

    const centerRelatedConcepts = getRelatedConcepts([centerWord])
    const centerMatch = centerRelatedConcepts.find((item) => actualRelatedConcepts.has(item))

    if (centerMatch) {
      return {
        accepted: true,
        matchedWord: centerWord,
        reason: 'Prepoznata je prirodna asocijacija sa centralnim pojmom.',
      }
    }
  }

  return {
    accepted: false,
    matchedWord: null,
    reason: 'Veza nije dovoljno bliska dozvoljenim pojmovima za ovu rundu.',
  }
}

export const normalizeLooseText = normalizeBaseText
