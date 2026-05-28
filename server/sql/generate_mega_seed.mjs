import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcryptjs'
import {
  DEFAULT_ASSOCIATION_WORDS,
  DEFAULT_LOGIC_CHALLENGES,
  DEFAULT_RELATION_CHALLENGES,
} from '../../src/utils/defaultGameContent.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const outputPath = path.join(__dirname, 'seed_mega_insert_only.sql')

const sqlString = (value) => `'${String(value ?? '').replace(/\\/g, '\\\\').replace(/'/g, "''")}'`
const sqlJson = (value) => sqlString(JSON.stringify(value))
const lower = (value) => String(value || '').trim().toLowerCase()
const unique = (items) => [...new Set(items.filter(Boolean))]
const logicIdentityWords = (words = []) => words.map((item) => lower(item)).join('|')
const buildLogicIdentityKey = (item = {}) =>
  [
    item.mode || 'concept',
    lower(item.answer),
    item.category,
    item.difficulty,
    item.mode === 'odd-one-out' ? logicIdentityWords(item.words) : '',
  ].join('|')
const chunk = (items, size) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size)
  )

const createAssociation = (
  word,
  category,
  difficulty,
  clues,
  hint,
  acceptedAnswers = [],
  symbol = ''
) => ({
  word,
  symbol,
  category,
  difficulty,
  clues,
  hint,
  acceptedAnswers: unique([lower(word), ...acceptedAnswers.map(lower)]),
})

const extraAssociations = [
  createAssociation('Neuron', 'Nauka', 'Lako', ['Mozak', 'Signal', 'Sinapsa', 'Celija'], 'Specijalizovana nervna celija koja prenosi impulse.'),
  createAssociation('Formula', 'Nauka', 'Lako', ['Simbol', 'Jednacina', 'Hemija', 'Broj'], 'Zapis koji predstavlja odnos ili sastav.'),
  createAssociation('Teleskop', 'Nauka', 'Lako', ['Svemir', 'Uvecanje', 'Zvijezde', 'Posmatranje'], 'Instrument za gledanje udaljenih nebeskih tijela.'),
  createAssociation('Vakcina', 'Nauka', 'Srednje', ['Imunitet', 'Doza', 'Zastita', 'Virus'], 'Preparat koji podstice razvoj zastite organizma.'),
  createAssociation('Cestica', 'Nauka', 'Srednje', ['Materija', 'Mikro', 'Fizika', 'Kretanje'], 'Vrlo mala jedinica materije.'),
  createAssociation('Laboratorija', 'Nauka', 'Srednje', ['Eksperiment', 'Oprema', 'Ispitivanje', 'Naucnik'], 'Mjesto gdje se izvode naucna istrazivanja i testiranja.'),
  createAssociation('Spektar', 'Nauka', 'Tesko', ['Boje', 'Talasi', 'Svjetlost', 'Analiza'], 'Raspored komponenti neke pojave, posebno svjetlosti.'),
  createAssociation('Evolucija', 'Nauka', 'Tesko', ['Promjena', 'Vrsta', 'Vrijeme', 'Selekcija'], 'Postepeni razvoj zivih bica kroz vrijeme.'),
  createAssociation('Katalizator', 'Nauka', 'Tesko', ['Reakcija', 'Hemija', 'Ubrzanje', 'Proces'], 'Supstanca koja ubrzava hemijsku reakciju.'),

  createAssociation('Kosarka', 'Sport', 'Lako', ['Obruc', 'Dribling', 'Parket', 'Tim'], 'Sport u kojem se poeni osvajaju ubacivanjem lopte kroz obruc.'),
  createAssociation('Plivanje', 'Sport', 'Lako', ['Bazen', 'Voda', 'Staza', 'Zamah'], 'Sportska disciplina kretanja kroz vodu.'),
  createAssociation('Reket', 'Sport', 'Lako', ['Tenis', 'Mreza', 'Loptica', 'Udaranje'], 'Sportski rekvizit za udaranje loptice.'),
  createAssociation('Trofej', 'Sport', 'Srednje', ['Pehar', 'Finale', 'Pobjeda', 'Takmicenje'], 'Nagrada koja simbolizuje uspjeh na takmicenju.'),
  createAssociation('Kondicija', 'Sport', 'Srednje', ['Forma', 'Izdrzljivost', 'Trening', 'Snaga'], 'Fizicka spremnost potrebna za dobar nastup.'),
  createAssociation('Stadion', 'Sport', 'Srednje', ['Tribine', 'Publika', 'Teren', 'Mec'], 'Veliki sportski objekat za utakmice i takmicenja.'),
  createAssociation('Triatlon', 'Sport', 'Tesko', ['Plivanje', 'Biciklizam', 'Trcanje', 'Izdrzljivost'], 'Takmicenje koje spaja tri discipline.'),
  createAssociation('Desetoboj', 'Sport', 'Tesko', ['Atletika', 'Disciplina', 'Poeni', 'Deset'], 'Atletsko takmicenje sastavljeno od deset disciplina.'),
  createAssociation('Regata', 'Sport', 'Tesko', ['Jedrenje', 'Voda', 'Trka', 'Brod'], 'Takmicenje jedrilica ili drugih plovila.'),

  createAssociation('Reziser', 'Film', 'Lako', ['Set', 'Vizija', 'Glumci', 'Snimanje'], 'Osoba koja vodi kreativni proces nastanka filma.'),
  createAssociation('Trejler', 'Film', 'Lako', ['Najava', 'Kratko', 'Publika', 'Premijera'], 'Kratka najava filma namijenjena publici.'),
  createAssociation('Scena', 'Film', 'Lako', ['Kadar', 'Glumci', 'Prizor', 'Radnja'], 'Jedan zaokruzen dio filmske radnje.'),
  createAssociation('Kostim', 'Film', 'Srednje', ['Lik', 'Odjeca', 'Scena', 'Dizajn'], 'Odjevna kombinacija koja pomaze oblikovanju filmskog lika.'),
  createAssociation('Kadrovanje', 'Film', 'Srednje', ['Ugao', 'Kompozicija', 'Kamera', 'Prizor'], 'Nacin na koji je scena smjestena u kadar.'),
  createAssociation('Premijera', 'Film', 'Srednje', ['Crveni tepih', 'Publika', 'Prvo prikazivanje', 'Sala'], 'Prvo javno prikazivanje filma.'),
  createAssociation('Postprodukcija', 'Film', 'Tesko', ['Montaza', 'Zvuk', 'Efekti', 'Finalna verzija'], 'Faza nakon snimanja u kojoj se film zavrsava.'),
  createAssociation('Dokumentarac', 'Film', 'Tesko', ['Cinjenice', 'Intervju', 'Naracija', 'Stvarnost'], 'Filmska forma zasnovana na stvarnim dogadjajima ili temama.'),
  createAssociation('Kinematografija', 'Film', 'Tesko', ['Svjetlo', 'Pokret', 'Kadar', 'Vizuelni stil'], 'Umijece stvaranja slike u filmu.'),

  createAssociation('Carstvo', 'Istorija', 'Lako', ['Vladar', 'Granice', 'Narod', 'Moc'], 'Velika drzavna tvorevina pod jednom vlascu.'),
  createAssociation('Bitka', 'Istorija', 'Lako', ['Vojska', 'Sukob', 'Polje', 'Pobjeda'], 'Oruzani sukob dvije ili vise vojski.'),
  createAssociation('Spomenik', 'Istorija', 'Lako', ['Proslo', 'Kamen', 'Sjecanje', 'Dogadjaj'], 'Obiljezje podignuto u cast necega iz proslosti.'),
  createAssociation('Dinastija', 'Istorija', 'Srednje', ['Porodica', 'Prijesto', 'Nasljedje', 'Vladari'], 'Niz vladara iz iste porodice.'),
  createAssociation('Hronika', 'Istorija', 'Srednje', ['Zapis', 'Godine', 'Dogadjaji', 'Proslo'], 'Redosljedni zapis vaznih dogadjaja.'),
  createAssociation('Arheologija', 'Istorija', 'Srednje', ['Iskopavanje', 'Predmeti', 'Rusevine', 'Nalaziste'], 'Nauka o materijalnim ostacima proslih vremena.'),
  createAssociation('Reforma', 'Istorija', 'Tesko', ['Promjena', 'Drustvo', 'Institucije', 'Preuredjenje'], 'Velika promjena sistema ili pravila.'),
  createAssociation('Kolonizacija', 'Istorija', 'Tesko', ['Naseljavanje', 'Osvajanje', 'More', 'Carstvo'], 'Proces osvajanja i naseljavanja novih teritorija.'),
  createAssociation('Hronologija', 'Istorija', 'Tesko', ['Vrijeme', 'Redosljed', 'Datumi', 'Dogadjaji'], 'Poredak dogadjaja prema vremenu desavanja.'),

  createAssociation('Kisa', 'Priroda', 'Lako', ['Oblak', 'Kap', 'Vrijeme', 'Padavina'], 'Voda koja pada iz oblaka.'),
  createAssociation('Vjetar', 'Priroda', 'Lako', ['Povjetarac', 'Smjer', 'Brzina', 'Vazduh'], 'Kretanje vazduha u atmosferi.'),
  createAssociation('Jezero', 'Priroda', 'Lako', ['Voda', 'Obala', 'Mirno', 'Dubina'], 'Veca stajaca vodena povrsina na kopnu.'),
  createAssociation('Planina', 'Priroda', 'Srednje', ['Vrh', 'Uspon', 'Visina', 'Stijena'], 'Veliko uzvisenje sa izrazenim vrhovima.'),
  createAssociation('Lednik', 'Priroda', 'Srednje', ['Led', 'Hladnoca', 'Planina', 'Kretanje'], 'Velika masa leda koja se sporo pomjera.'),
  createAssociation('Delta', 'Priroda', 'Srednje', ['Rijeka', 'Usce', 'Nanosi', 'Grananje'], 'Podrucje grananja rijeke pred usce.'),
  createAssociation('Vulkan', 'Priroda', 'Tesko', ['Lava', 'Krater', 'Erupcija', 'Pepeo'], 'Prirodna pojava povezana sa magmom i erupcijom.'),
  createAssociation('Biosfera', 'Priroda', 'Tesko', ['Zivot', 'Planeta', 'Sloj', 'Okolina'], 'Ukupan prostor Zemlje u kojem postoji zivot.'),
  createAssociation('Atmosfera', 'Priroda', 'Tesko', ['Vazduh', 'Sloj', 'Planeta', 'Pritisak'], 'Gasoviti omotac planete.'),

  createAssociation('Roman', 'Umjetnost', 'Lako', ['Likovi', 'Poglavlje', 'Prica', 'Pisac'], 'Duze prozno knjizevno djelo.'),
  createAssociation('Freska', 'Umjetnost', 'Lako', ['Zid', 'Boja', 'Crkva', 'Malter'], 'Slikarsko djelo izvedeno na svjezem malteru.'),
  createAssociation('Galerija', 'Umjetnost', 'Lako', ['Izlozba', 'Slike', 'Posjetioci', 'Umjetnik'], 'Prostor za izlaganje umjetnickih djela.'),
  createAssociation('Portret', 'Umjetnost', 'Srednje', ['Lice', 'Figura', 'Poza', 'Slikar'], 'Umjetnicki prikaz necijeg lika.'),
  createAssociation('Koreografija', 'Umjetnost', 'Srednje', ['Pokret', 'Ples', 'Ritam', 'Scena'], 'Osmisljeni raspored plesnih pokreta.'),
  createAssociation('Drama', 'Umjetnost', 'Srednje', ['Pozornica', 'Likovi', 'Sukob', 'Tekst'], 'Scensko ili knjizevno djelo zasnovano na radnji i konfliktu.'),
  createAssociation('Instalacija', 'Umjetnost', 'Tesko', ['Prostor', 'Objekti', 'Izlozba', 'Savremeno'], 'Savremeno umjetnicko djelo rasporedjeno u prostoru.'),
  createAssociation('Ekspresionizam', 'Umjetnost', 'Tesko', ['Emocija', 'Pravac', 'Boja', 'Deformacija'], 'Umjetnicki pravac naglasene ekspresije i unutrasnjeg dozivljaja.'),
  createAssociation('Kompozicija', 'Umjetnost', 'Tesko', ['Raspored', 'Oblik', 'Balans', 'Cjelina'], 'Nacin organizovanja elemenata u umjetnickom djelu.'),

  createAssociation('Lozinka', 'Tehnologija', 'Lako', ['Prijava', 'Sigurnost', 'Nalog', 'Karakteri'], 'Tajni niz znakova za pristup sistemu.'),
  createAssociation('Dron', 'Tehnologija', 'Lako', ['Leti', 'Kamera', 'Daljinski', 'Propeleri'], 'Letjelica kojom se upravlja na daljinu.'),
  createAssociation('Mreza', 'Tehnologija', 'Lako', ['Konekcija', 'Racunari', 'Internet', 'Prenos'], 'Povezan sistem uredjaja koji razmjenjuju podatke.'),
  createAssociation('Server', 'Tehnologija', 'Srednje', ['Host', 'Zahtjev', 'Podaci', 'Mreza'], 'Racunar ili servis koji odgovara na zahtjeve drugih uredjaja.'),
  createAssociation('Interfejs', 'Tehnologija', 'Srednje', ['Ekran', 'Dugme', 'Navigacija', 'Korisnik'], 'Sloj preko kojeg korisnik komunicira sa aplikacijom.'),
  createAssociation('Baza podataka', 'Tehnologija', 'Srednje', ['Tabela', 'Upit', 'Cuvanje', 'Podaci'], 'Organizovan sistem za cuvanje i pretragu informacija.', ['baza', 'baza podataka']),
  createAssociation('Enkripcija', 'Tehnologija', 'Tesko', ['Sigurnost', 'Kodiranje', 'Kljuc', 'Zastita'], 'Proces pretvaranja podataka u zasticen oblik.'),
  createAssociation('Automatizacija', 'Tehnologija', 'Tesko', ['Proces', 'Usteda vremena', 'Robot', 'Sistem'], 'Izvodjenje zadataka bez stalne ljudske intervencije.'),
  createAssociation('Kibernetika', 'Tehnologija', 'Tesko', ['Kontrola', 'Sistem', 'Povratna sprega', 'Automatika'], 'Oblast koja proucava upravljanje i komunikaciju u sistemima.'),

  createAssociation('Ostrvo', 'Geografija', 'Lako', ['More', 'Kopno', 'Obala', 'Izolovano'], 'Kopno okruzeno vodom sa svih strana.'),
  createAssociation('Kanjon', 'Geografija', 'Lako', ['Rijeka', 'Stijene', 'Dubina', 'Usjek'], 'Duboka i uska dolina strmih strana.'),
  createAssociation('Ravnica', 'Geografija', 'Lako', ['Nizija', 'Ravno', 'Polje', 'Prostor'], 'Velika ravna povrsina na kopnu.'),
  createAssociation('Granica', 'Geografija', 'Srednje', ['Drzava', 'Linija', 'Prelaz', 'Mapa'], 'Linija koja razdvaja dvije teritorije.'),
  createAssociation('Poluostrvo', 'Geografija', 'Srednje', ['Kopno', 'More', 'Rt', 'Obala'], 'Kopno gotovo sa svih strana okruzeno morem.'),
  createAssociation('Arhipelag', 'Geografija', 'Srednje', ['Ostrva', 'Grupa', 'More', 'Obala'], 'Skup vise ostrva na istom prostoru.'),
  createAssociation('Topografija', 'Geografija', 'Tesko', ['Reljef', 'Visina', 'Teren', 'Mapa'], 'Opisivanje i prikazivanje oblika terena.'),
  createAssociation('Kartografija', 'Geografija', 'Tesko', ['Mapa', 'Projekcija', 'Skala', 'Crtanje'], 'Nauka i vjestina izrade karata.'),
  createAssociation('Geopolitika', 'Geografija', 'Tesko', ['Drzave', 'Moc', 'Prostor', 'Uticaj'], 'Proucavanje odnosa politike i geografskog prostora.'),
]

const extraAssociationsLocal = [
  createAssociation('Ćelija', 'Nauka', 'Lako', ['Membrana', 'Jezgro', 'Tkivo', 'Organizam'], 'Osnovna jedinica živih bića.', ['ćelija', 'celija'], '🧫'),
  createAssociation('Kiseonik', 'Nauka', 'Srednje', ['Disanje', 'Gas', 'Vazduh', 'Element'], 'Hemijski element neophodan za disanje.', ['kiseonik'], '🫧'),
  createAssociation('Rukomet', 'Sport', 'Lako', ['Gol', 'Dvorana', 'Sedmerac', 'Lopta'], 'Ekipni sport u kojem se lopta baca rukom.', ['rukomet'], '🤾'),
  createAssociation('Štafeta', 'Sport', 'Srednje', ['Tim', 'Palica', 'Predaja', 'Trka'], 'Trka u kojoj članovi tima predaju palicu.', ['štafeta', 'stafeta'], '🏁'),
  createAssociation('Žanr', 'Film', 'Lako', ['Drama', 'Komedija', 'Horor', 'Vrsta'], 'Vrsta filma ili književnog djela.', ['žanr', 'zanr'], '🎞️'),
  createAssociation('Režija', 'Film', 'Tesko', ['Vizija', 'Set', 'Kamera', 'Reditelj'], 'Vođenje i oblikovanje filmskog djela.', ['režija', 'rezija'], '🎥'),
  createAssociation('Ćirilica', 'Istorija', 'Srednje', ['Slova', 'Pismo', 'Azbuka', 'Vuk'], 'Jedno od osnovnih slovenskih pisama.', ['ćirilica', 'cirilica'], '🔤'),
  createAssociation('Pećina', 'Priroda', 'Lako', ['Stijena', 'Mrak', 'Podzemlje', 'Kapljice'], 'Prirodna šupljina u stijeni.', ['pećina', 'pecina'], '🪨'),
  createAssociation('Šuma', 'Priroda', 'Srednje', ['Drveće', 'Lišće', 'Staza', 'Životinje'], 'Veliko područje obraslo drvećem.', ['šuma', 'suma'], '🌲'),
  createAssociation('Pozorište', 'Umjetnost', 'Lako', ['Scena', 'Glumci', 'Publika', 'Predstava'], 'Mjesto i umjetnost izvođenja predstava.', ['pozorište', 'pozoriste'], '🎭'),
  createAssociation('Računar', 'Tehnologija', 'Lako', ['Tastatura', 'Ekran', 'Procesor', 'Miš'], 'Elektronski uređaj za obradu podataka.', ['računar', 'racunar', 'kompjuter'], '💻'),
  createAssociation('Mreža', 'Tehnologija', 'Srednje', ['Internet', 'Signal', 'Povezivanje', 'Server'], 'Sistem povezanih uređaja i veza.', ['mreža', 'mreza'], '🕸️'),
  createAssociation('Ušće', 'Geografija', 'Srednje', ['Rijeka', 'More', 'Ulivanje', 'Delta'], 'Mjesto gdje se rijeka uliva u veću vodenu površinu.', ['ušće', 'usce'], '🌊'),
  createAssociation('Poluostrvo', 'Geografija', 'Tesko', ['Kopno', 'More', 'Rt', 'Obala'], 'Kopno okruženo morem sa tri strane.', ['poluostrvo'], '🗺️'),
  createAssociation('Čempres', 'Priroda', 'Lako', ['Drvo', 'Vitko', 'Mediteran', 'Četinari'], 'Visoko i usko drvo tamnozelenih grana.', ['čempres', 'cempres'], '🌳'),
  createAssociation('Lozinka', 'Tehnologija', 'Lako', ['Prijava', 'Sigurnost', 'Šifra', 'Nalog'], 'Tajni niz znakova za pristup sistemu.', ['lozinka', 'šifra', 'sifra'], '🔐'),
  createAssociation('Čitač', 'Tehnologija', 'Srednje', ['Kartica', 'Senzor', 'Ulaz', 'Uređaj'], 'Uređaj koji prepoznaje i očitava podatke.', ['čitač', 'citac'], '📟'),
  createAssociation('Žubor', 'Priroda', 'Tesko', ['Voda', 'Potok', 'Zvuk', 'Tok'], 'Blag i neprekidan zvuk tekuće vode.', ['žubor', 'zubor'], '💧'),
]

const associationBoosts = [
  createAssociation('Molekul', 'Nauka', 'Lako', ['Atomi', 'Veza', 'Hemija', 'Supstanca'], 'Skup povezanih atoma koji grade supstancu.'),
  createAssociation('Element', 'Nauka', 'Lako', ['Periodni sistem', 'Hemija', 'Simbol', 'Supstanca'], 'Osnovna hemijska vrsta gradjena od iste vrste atoma.'),
  createAssociation('Genom', 'Nauka', 'Tesko', ['DNK', 'Nasljedje', 'Informacija', 'Sekvenca'], 'Ukupan zapis genetske informacije jednog organizma.'),
  createAssociation('Odbojka', 'Sport', 'Lako', ['Mreza', 'Servis', 'Tim', 'Smech'], 'Ekipni sport u kojem se lopta prebacuje preko mreze.'),
  createAssociation('Tenis', 'Sport', 'Lako', ['Reket', 'Mreza', 'Servis', 'Set'], 'Sport sa reketom u kojem igraci prebacuju lopticu preko mreze.'),
  createAssociation('Hokej', 'Sport', 'Lako', ['Pak', 'Led', 'Palica', 'Gol'], 'Brz ekipni sport koji se najcesce igra na ledu.'),
  createAssociation('Taktika', 'Sport', 'Tesko', ['Plan', 'Protivnik', 'Strategija', 'Mec'], 'Promisljen nacin igre kojim se dolazi do prednosti.'),
  createAssociation('Formacija', 'Sport', 'Tesko', ['Raspored', 'Tim', 'Teren', 'Trener'], 'Dogovoreni raspored igraca na terenu tokom meca.'),
  createAssociation('Bioskop', 'Film', 'Lako', ['Platno', 'Sala', 'Projekcija', 'Publika'], 'Mjesto gdje se filmovi javno prikazuju publici.'),
  createAssociation('Audicija', 'Film', 'Srednje', ['Uloga', 'Izbor', 'Glumac', 'Proba'], 'Proces biranja glumaca za odredjene uloge.'),
  createAssociation('Storyboard', 'Film', 'Srednje', ['Kadar', 'Skica', 'Planiranje', 'Sekvenca'], 'Vizuelni plan scena prije samog snimanja filma.'),
  createAssociation('Scenografija', 'Film', 'Tesko', ['Dekor', 'Prostor', 'Set', 'Vizuelni izgled'], 'Oblikovanje prostora i vizuelnog okruzenja scene.'),
  createAssociation('Tvrdjava', 'Istorija', 'Lako', ['Zidine', 'Odbrana', 'Kula', 'Opsada'], 'Utvrdjeno mjesto gradjeno radi zastite i odbrane.'),
  createAssociation('Kraljevina', 'Istorija', 'Lako', ['Kruna', 'Vladar', 'Prijesto', 'Nasljedje'], 'Drzava ili oblast kojom upravlja kralj ili kraljica.'),
  createAssociation('Dekret', 'Istorija', 'Tesko', ['Odluka', 'Vladar', 'Naredba', 'Dokument'], 'Svecana ili zvanicna odluka izdata autoritetom vlasti.'),
  createAssociation('Vodopad', 'Priroda', 'Srednje', ['Rijeka', 'Visina', 'Pad', 'Pjena'], 'Mjesto gdje voda naglo pada preko stijena.'),
  createAssociation('Livada', 'Priroda', 'Srednje', ['Trava', 'Cvijece', 'Ravno', 'Otvoreno'], 'Otvoren travnati prostor bogat biljem i cvijecem.'),
  createAssociation('Gejzir', 'Priroda', 'Tesko', ['Para', 'Vrela voda', 'Pritisak', 'Izvor'], 'Izvor koji povremeno izbacuje vrelu vodu i paru.'),
  createAssociation('Balet', 'Umjetnost', 'Lako', ['Ples', 'Pozornica', 'Pokret', 'Ansambl'], 'Scenska umjetnost zasnovana na preciznom plesnom izrazu.'),
  createAssociation('Basna', 'Umjetnost', 'Lako', ['Pouka', 'Zivotinje', 'Prica', 'Likovi'], 'Kratka prica koja kroz alegoriju nosi pouku.'),
  createAssociation('Mural', 'Umjetnost', 'Lako', ['Zid', 'Boje', 'Velika slika', 'Ulica'], 'Velika slika oslikana direktno na zidu ili fasadi.'),
  createAssociation('Alegorija', 'Umjetnost', 'Tesko', ['Simbolika', 'Znacenje', 'Prica', 'Skrivena poruka'], 'Umjetnicki postupak u kojem slika ili prica nosi dublje znacenje.'),
  createAssociation('Kontrast', 'Umjetnost', 'Tesko', ['Suprotnost', 'Svjetlo', 'Boja', 'Isticanje'], 'Likovni ili vizuelni odnos jakih razlika radi naglasavanja.'),
  createAssociation('Kursor', 'Tehnologija', 'Lako', ['Mis', 'Ekran', 'Pokazivac', 'Klik'], 'Pokazivac kojim korisnik upravlja po ekranu.'),
  createAssociation('Pretrazivac', 'Tehnologija', 'Srednje', ['Internet', 'Kartice', 'Adresa', 'Pretraga'], 'Program kojim se otvaraju i pretrazuju web stranice.'),
  createAssociation('Virtuelizacija', 'Tehnologija', 'Tesko', ['Server', 'Resursi', 'Okruzenje', 'Emulacija'], 'Pokretanje vise logicnih sistema na istom fizickom hardveru.'),
  createAssociation('Telemetrija', 'Tehnologija', 'Tesko', ['Mjerenje', 'Senzori', 'Prenos', 'Podaci'], 'Daljinsko prikupljanje i slanje tehnickih podataka.'),
  createAssociation('Rt', 'Geografija', 'Lako', ['Obala', 'More', 'Izbocenje', 'Kopno'], 'Istureni dio kopna koji zalazi u more ili jezero.'),
  createAssociation('Globus', 'Geografija', 'Lako', ['Zemlja', 'Model', 'Mapa', 'Sfera'], 'Umanjeni sferni prikaz planete Zemlje.'),
  createAssociation('Kanal', 'Geografija', 'Tesko', ['Voda', 'Prolaz', 'Povezivanje', 'Plovidba'], 'Vjestacki ili prirodni vodeni prolaz koji spaja povrsine.'),
]

const associationTopUps = [
  createAssociation('Platno', 'Film', 'Lako', ['Projekcija', 'Bioskop', 'Slika', 'Ekran'], 'Velika povrsina na koju se prikazuje filmska slika.'),
  createAssociation('Titl', 'Film', 'Lako', ['Tekst', 'Prevod', 'Dijalog', 'Ekran'], 'Pisani prevod ili tekst koji prati govor u filmu.'),
  createAssociation('Producent', 'Film', 'Srednje', ['Budzet', 'Organizacija', 'Snimanje', 'Tim'], 'Osoba koja vodi produkciju i organizuje nastanak filma.'),
  createAssociation('Kasting', 'Film', 'Srednje', ['Uloga', 'Izbor', 'Glumci', 'Proba'], 'Proces biranja glumaca za odredjene uloge u filmu.'),
  createAssociation('Mizanscen', 'Film', 'Tesko', ['Raspored', 'Scena', 'Pokret', 'Vizuelni plan'], 'Nacin na koji su likovi i elementi rasporedjeni unutar scene.'),

  createAssociation('Drzava', 'Geografija', 'Lako', ['Granice', 'Gradjani', 'Mapa', 'Teritorija'], 'Organizovana teritorijalna zajednica sa svojim granicama.'),
  createAssociation('Okean', 'Geografija', 'Lako', ['Voda', 'Talasi', 'Dubina', 'Prostranstvo'], 'Najveca slana vodena povrsina na Zemlji.'),
  createAssociation('Klima', 'Geografija', 'Srednje', ['Temperatura', 'Padavine', 'Podneblje', 'Vrijeme'], 'Dugorocan obrazac vremenskih prilika nekog podrucja.'),
  createAssociation('Regija', 'Geografija', 'Srednje', ['Oblast', 'Podrucje', 'Mapa', 'Granice'], 'Sira oblast koja dijeli neke zajednicke osobine.'),
  createAssociation('Longituda', 'Geografija', 'Tesko', ['Duzina', 'Koordinate', 'Meridijan', 'Pozicija'], 'Geografska duzina kojom se odredjuje polozaj istocno ili zapadno.'),
  createAssociation('Geomorfologija', 'Geografija', 'Tesko', ['Reljef', 'Oblici tla', 'Teren', 'Nastanak'], 'Nauka o nastanku i oblicima Zemljine povrsine.'),

  createAssociation('Vitez', 'Istorija', 'Lako', ['Oklop', 'Mac', 'Konj', 'Dvor'], 'Ratnik iz srednjovjekovnog doba vezan za plemstvo i cast.'),
  createAssociation('Traktat', 'Istorija', 'Srednje', ['Sporazum', 'Drzave', 'Potpis', 'Dogovor'], 'Svecani medjudrzavni ili istorijski sporazum u pisanom obliku.'),
  createAssociation('Manifest', 'Istorija', 'Tesko', ['Ideje', 'Pokret', 'Program', 'Javna objava'], 'Javna objava stavova, namjera ili programa nekog pokreta.'),

  createAssociation('Magnet', 'Nauka', 'Lako', ['Privlacenje', 'Metal', 'Polje', 'Polovi'], 'Predmet koji privlaci odredjene metale pomocu magnetnog polja.'),
  createAssociation('Epruveta', 'Nauka', 'Lako', ['Staklo', 'Uzorak', 'Hemija', 'Laboratorija'], 'Uska laboratorijska posuda za male kolicine supstance.'),
  createAssociation('Teorija', 'Nauka', 'Srednje', ['Objasnjenje', 'Dokaz', 'Model', 'Proucavanje'], 'Sistem ideja kojim se objasnjava neka pojava ili skup pojava.'),
  createAssociation('Entropija', 'Nauka', 'Tesko', ['Nered', 'Energija', 'Sistem', 'Fizika'], 'Mjera neuredjenosti ili rasipanja energije u sistemu.'),

  createAssociation('Izvor', 'Priroda', 'Srednje', ['Voda', 'Pocetak toka', 'Stijena', 'Potok'], 'Mjesto gdje voda prirodno izbija na povrsinu.'),
  createAssociation('Koral', 'Priroda', 'Srednje', ['More', 'Hrid', 'Kolonija', 'Organizam'], 'Morski organizam koji gradi grebene i zivi u kolonijama.'),
  createAssociation('Erozija', 'Priroda', 'Tesko', ['Tlo', 'Voda', 'Trošenje', 'Oblikovanje'], 'Postepeno trošenje i odnošenje zemljista ili stijena.'),
  createAssociation('Sediment', 'Priroda', 'Tesko', ['Naslage', 'Cestice', 'Talozenje', 'Dno'], 'Materijal koji se talozi na dnu vode ili tla.'),

  createAssociation('Trening', 'Sport', 'Srednje', ['Vjezba', 'Priprema', 'Forma', 'Napredak'], 'Plansko vjezbanje radi boljeg sportskog nastupa.'),
  createAssociation('Ofsajd', 'Sport', 'Tesko', ['Napad', 'Pravila', 'Fudbal', 'Pozicija'], 'Pravilo koje kaznjava nepravilno postavljanje napadaca.'),
  createAssociation('Penal', 'Sport', 'Tesko', ['Kazna', 'Sut', 'Gol', 'Prekrsaj'], 'Kazneni udarac dosudjen poslije odredjenog prekrsaja.'),

  createAssociation('Baterija', 'Tehnologija', 'Lako', ['Energija', 'Punjenje', 'Uredjaj', 'Napajanje'], 'Izvor elektricne energije za uredjaje.'),
  createAssociation('Domen', 'Tehnologija', 'Srednje', ['Web', 'Adresa', 'Internet', 'Sajt'], 'Tekstualna internet adresa koja vodi do sajta ili servisa.'),
  createAssociation('Ruter', 'Tehnologija', 'Srednje', ['Mreza', 'Signal', 'Internet', 'Povezivanje'], 'Uredjaj koji usmjerava internet saobracaj izmedju mreza.'),
  createAssociation('Latencija', 'Tehnologija', 'Tesko', ['Kasnjenje', 'Mreza', 'Odgovor', 'Signal'], 'Vrijeme potrebno da odgovor ili podatak stigne od izvora do cilja.'),

  createAssociation('Strip', 'Umjetnost', 'Lako', ['Kadrovi', 'Crtez', 'Oblacic', 'Prica'], 'Prica ispricana nizom crteza i kratkog teksta.'),
  createAssociation('Maska', 'Umjetnost', 'Lako', ['Lice', 'Pozornica', 'Lik', 'Kostim'], 'Predmet koji prekriva lice radi uloge ili umjetnickog izraza.'),
  createAssociation('Recital', 'Umjetnost', 'Srednje', ['Izvodjenje', 'Publika', 'Stihovi', 'Scena'], 'Javni nastup posvecen kazivanju ili muzickom izvodjenju.'),
  createAssociation('Arija', 'Umjetnost', 'Srednje', ['Opera', 'Solo', 'Glas', 'Melodija'], 'Solisticka muzicka numera, posebno poznata iz opere.'),
  createAssociation('Minimalizam', 'Umjetnost', 'Tesko', ['Svedeno', 'Forma', 'Manje je vise', 'Cistoca'], 'Umjetnicki pristup koji svodi izraz na mali broj elemenata.'),
  createAssociation('Impresionizam', 'Umjetnost', 'Tesko', ['Svjetlo', 'Potezi', 'Boje', 'Utisak'], 'Umjetnicki pravac koji naglasava trenutni vizuelni utisak.'),
]

const generatedAssociationBlueprints = {
  Nauka: [
    ['Mikroskop', 'Lako', ['Socivo', 'Uvecanje', 'Uzorak', 'Detalj'], 'Instrument za posmatranje veoma sitnih objekata.'],
    ['Orbita', 'Lako', ['Planeta', 'Kretanje', 'Krug', 'Svemir'], 'Putanja kojom se tijelo krece oko drugog tijela.'],
    ['Genetika', 'Srednje', ['Nasljedje', 'DNK', 'Osobine', 'Geni'], 'Oblast koja proucava nasljedne osobine zivih bica.'],
    ['Fosil', 'Srednje', ['Kamen', 'Ostatak', 'Proslost', 'Nalaz'], 'Ocuvani ostatak ili trag davnog zivog bica.'],
    ['Gravitacija', 'Srednje', ['Privlacenje', 'Pad', 'Masa', 'Sila'], 'Sila koja privlaci tijela jedno ka drugom.'],
    ['Hormon', 'Tesko', ['Organizam', 'Signal', 'Zlijezda', 'Ravnoteza'], 'Hemijski glasnik koji regulise mnoge procese u tijelu.'],
    ['Meteorologija', 'Tesko', ['Vrijeme', 'Prognoza', 'Oblaci', 'Padavine'], 'Nauka koja proucava vrijeme i atmosferu.'],
    ['Tektonika', 'Tesko', ['Ploce', 'Zemljotres', 'Pomjeranje', 'Kora'], 'Proucavanje kretanja i sudara velikih djelova Zemljine kore.'],
  ],
  Sport: [
    ['Boks', 'Lako', ['Rukavice', 'Ring', 'Udarac', 'Runda'], 'Borilacki sport u kojem se protivnici nadmecu udarcima rukama.'],
    ['Kajak', 'Lako', ['Veslo', 'Rijeka', 'Camac', 'Staza'], 'Usko plovilo kojim se upravlja veslom.'],
    ['Sudija', 'Srednje', ['Pistaljka', 'Pravila', 'Odluka', 'Mec'], 'Osoba koja sprovodi pravila tokom sportskog takmicenja.'],
    ['Sprint', 'Srednje', ['Brzina', 'Staza', 'Start', 'Finis'], 'Kratka i veoma brza trka.'],
    ['Jedrenje', 'Srednje', ['Vjetar', 'Jedro', 'More', 'Kurs'], 'Kretanje plovilom uz pomoc vjetra i jedra.'],
    ['Kapiten', 'Tesko', ['Tim', 'Vodja', 'Traka', 'Odgovornost'], 'Igrac koji predvodi tim na terenu ili u igri.'],
    ['Turnir', 'Tesko', ['Parovi', 'Runda', 'Pobjednik', 'Takmicenje'], 'Takmicenje sastavljeno od vise meceva ili rundi.'],
    ['Finale', 'Tesko', ['Zavrsnica', 'Pehar', 'Pobjednik', 'Navijaci'], 'Poslednji i odlucujuci mec na takmicenju.'],
  ],
  Film: [
    ['Scenario', 'Lako', ['Dijalog', 'Radnja', 'Likovi', 'Stranice'], 'Pisani plan filma sa scenama i dijalozima.'],
    ['Dubler', 'Lako', ['Zamjena', 'Glumac', 'Akcija', 'Rizik'], 'Osoba koja umjesto glumca izvodi zahtjevne ili opasne scene.'],
    ['Montaza', 'Srednje', ['Rezovi', 'Kadrovi', 'Ritam', 'Sastavljanje'], 'Faza u kojoj se snimljeni materijal slaze u cjelinu.'],
    ['Sinopsis', 'Srednje', ['Prica', 'Kratak opis', 'Radnja', 'Pregled'], 'Sazet prikaz sadrzaja filmske price.'],
    ['Festival', 'Srednje', ['Projekcije', 'Nagrade', 'Publika', 'Grad'], 'Dogadjaj na kojem se prikazuju i vrednuju filmovi.'],
    ['Animacija', 'Tesko', ['Crtanje', 'Pokret', 'Frejmovi', 'Iluzija'], 'Tehnika stvaranja utiska pokreta od niza slika.'],
    ['Rasvjeta', 'Tesko', ['Svjetlo', 'Set', 'Sjena', 'Atmosfera'], 'Organizovanje svjetla da bi scena izgledala kako treba.'],
    ['Trilogija', 'Tesko', ['Tri dijela', 'Nastavak', 'Prica', 'Serijal'], 'Prica ispricana kroz tri medjusobno povezana djela.'],
  ],
  Istorija: [
    ['Povelja', 'Lako', ['Dokument', 'Pravo', 'Potpis', 'Vladar'], 'Svecani pisani akt sa pravilima, pravima ili odlukama.'],
    ['Ustanak', 'Lako', ['Pobuna', 'Narod', 'Otpor', 'Promjena'], 'Organizovano dizanje protiv vlasti ili okupatora.'],
    ['Arhiv', 'Srednje', ['Dokumenti', 'Cuvanje', 'Proslo', 'Zapisi'], 'Mjesto gdje se trajno cuvaju vazni istorijski i pravni zapisi.'],
    ['Opsada', 'Srednje', ['Grad', 'Vojska', 'Zidine', 'Okruzenje'], 'Vojna taktika okruzivanja i iscrpljivanja protivnika.'],
    ['Bastina', 'Srednje', ['Nasljedje', 'Spomenici', 'Kultura', 'Proslo'], 'Vrijednosti i tragovi koje nam je ostavila proslost.'],
    ['Imperator', 'Tesko', ['Carstvo', 'Vladar', 'Kruna', 'Moc'], 'Vladar ogromne drzave ili carstva.'],
    ['Republika', 'Tesko', ['Drzava', 'Gradjani', 'Ustav', 'Vlast'], 'Oblik drzavnog uredjenja bez monarha na celu.'],
    ['Hronicar', 'Tesko', ['Zapisi', 'Svjedok', 'Proslo', 'Doba'], 'Osoba koja biljezi vazne dogadjaje svog vremena.'],
  ],
  Priroda: [
    ['Potok', 'Lako', ['Voda', 'Tok', 'Obala', 'Sapat'], 'Manji prirodni vodeni tok.'],
    ['Duga', 'Lako', ['Boje', 'Kisa', 'Nebo', 'Luk'], 'Pojava raznobojnog luka na nebu poslije kise.'],
    ['Sjeme', 'Lako', ['Biljka', 'Rast', 'Klica', 'Plod'], 'Pocetak novog biljnog zivota iz kojeg nicu biljke.'],
    ['Munja', 'Srednje', ['Oluja', 'Bljesak', 'Elektricitet', 'Nebo'], 'Jak elektricni prasak u atmosferi tokom nevremena.'],
    ['Pustinja', 'Srednje', ['Pijesak', 'Susa', 'Toplota', 'Dine'], 'Vrlo suvo podrucje sa malo padavina i biljnog svijeta.'],
    ['Uvala', 'Srednje', ['Obala', 'More', 'Zakrivljenje', 'Mirna voda'], 'Dio obale koji se blago uvukao u kopno.'],
    ['Mahovina', 'Tesko', ['Vlaga', 'Kamen', 'Zeleno', 'Sjena'], 'Niska biljka koja raste na vlaznim i sjenovitim mjestima.'],
    ['Plima', 'Tesko', ['More', 'Mjesec', 'Rast nivoa', 'Obala'], 'Periodican porast nivoa morske vode.'],
  ],
  Umjetnost: [
    ['Atelje', 'Lako', ['Platno', 'Boje', 'Prostor', 'Umjetnik'], 'Radni prostor slikara, vajara ili drugog umjetnika.'],
    ['Skulptura', 'Lako', ['Kamen', 'Oblik', 'Vajar', 'Figura'], 'Umjetnicko djelo oblikovano u tri dimenzije.'],
    ['Balet', 'Lako', ['Ples', 'Pozornica', 'Tutu', 'Pokret'], 'Scenska umjetnost zasnovana na skladnom plesnom izrazu.'],
    ['Sonata', 'Srednje', ['Klavir', 'Stavovi', 'Muzika', 'Kompozitor'], 'Muzicko djelo sa vise povezanih djelova.'],
    ['Mozaik', 'Srednje', ['Kockice', 'Slika', 'Zid', 'Sastavljanje'], 'Slika ili ukras sastavljen od mnogo malih djelova.'],
    ['Dirigent', 'Srednje', ['Orkestar', 'Palica', 'Tempo', 'Vodjenje'], 'Osoba koja vodi muzicko izvodjenje ansambla.'],
    ['Gravura', 'Tesko', ['Metal', 'Otisak', 'Rezbarenje', 'Grafika'], 'Likovni postupak i djelo nastalo urezivanjem i otiskom.'],
    ['Simfonija', 'Tesko', ['Orkestar', 'Stavovi', 'Zvuk', 'Cjelina'], 'Veliko muzicko djelo napisano za orkestar.'],
  ],
  Tehnologija: [
    ['Procesor', 'Lako', ['Cip', 'Racunanje', 'Jezgro', 'Brzina'], 'Glavna racunarska komponenta koja obradjuje instrukcije.'],
    ['Senzor', 'Lako', ['Mjerenje', 'Signal', 'Detekcija', 'Uredjaj'], 'Komponenta koja registruje promjenu i pretvara je u podatak.'],
    ['Aplikacija', 'Srednje', ['Telefon', 'Program', 'Interfejs', 'Koristenje'], 'Softver namijenjen odredjenom zadatku korisnika.'],
    ['Protokol', 'Srednje', ['Pravila', 'Mreza', 'Razmjena', 'Standard'], 'Skup pravila po kojima uredjaji komuniciraju.'],
    ['Bekap', 'Srednje', ['Kopija', 'Sigurnost', 'Obnova', 'Podaci'], 'Rezervna kopija vaznih podataka za slucaj problema.'],
    ['Kompajler', 'Tesko', ['Kod', 'Prevodjenje', 'Programski jezik', 'Izvrsavanje'], 'Program koji prevodi izvorni kod u oblik razumljiv racunaru.'],
    ['Robotika', 'Tesko', ['Masina', 'Automatika', 'Kretanje', 'Senzori'], 'Oblast koja razvija i upravlja robotima.'],
    ['Satelit', 'Tesko', ['Orbita', 'Signal', 'Antena', 'Prenos'], 'Uredjaj u svemiru koji prenosi ili prikuplja podatke.'],
  ],
  Geografija: [
    ['Zaliv', 'Lako', ['More', 'Obala', 'Uvlacenje', 'Voda'], 'Dio mora ili okeana uvucen u kopno.'],
    ['Fjord', 'Lako', ['More', 'Planine', 'Uski zaliv', 'Lednik'], 'Dubok i uzak morski zaliv sa strmim obalama.'],
    ['Ekvator', 'Srednje', ['Zemlja', 'Sirina', 'Toplota', 'Nulta linija'], 'Zamisljena linija koja dijeli Zemlju na dvije polulopte.'],
    ['Meridian', 'Srednje', ['Duzina', 'Mapa', 'Linija', 'Vrijeme'], 'Zamisljena linija koja povezuje polove na globusu.'],
    ['Laguna', 'Srednje', ['Plicak', 'More', 'Obala', 'Mirna voda'], 'Plitka vodena povrsina odvojena od otvorenog mora.'],
    ['Klisura', 'Tesko', ['Rijeka', 'Usjek', 'Stijene', 'Dubina'], 'Uska i duboka dolina strmih strana.'],
    ['Kontinent', 'Tesko', ['Kopno', 'Velicina', 'Granice', 'Planeta'], 'Velika cjelina kopna na Zemlji.'],
    ['Tjesnac', 'Tesko', ['More', 'Prolaz', 'Uski put', 'Obala'], 'Uski morski prolaz izmedju dva kopna.'],
  ],
}

const generatedAssociations = Object.entries(generatedAssociationBlueprints).flatMap(
  ([category, items]) =>
    items.map(([word, difficulty, clues, hint, acceptedAnswers = [], symbol = '']) =>
      createAssociation(word, category, difficulty, clues, hint, acceptedAnswers, symbol)
    )
)

const manualRelations = [
  { leftWord: 'Tacan', rightWord: 'Precizan', relation: 'Sinonim', category: 'Nauka', difficulty: 'Lako', hint: 'Rijeci imaju gotovo isto znacenje.' },
  { leftWord: 'Zivo', rightWord: 'Nezivo', relation: 'Antonim', category: 'Nauka', difficulty: 'Srednje', hint: 'Pomisli na suprotne osobine.' },
  { leftWord: 'Laboratorija', rightWord: 'Eksperiment', relation: 'Asocijacija', category: 'Nauka', difficulty: 'Tesko', hint: 'Jedan pojam prirodno ide uz drugi u nauci.' },
  { leftWord: 'Jak', rightWord: 'Snazan', relation: 'Sinonim', category: 'Sport', difficulty: 'Lako', hint: 'Rijeci opisuju slicnu fizicku osobinu.' },
  { leftWord: 'Pobjeda', rightWord: 'Poraz', relation: 'Antonim', category: 'Sport', difficulty: 'Srednje', hint: 'Rezultati su suprotni.' },
  { leftWord: 'Trka', rightWord: 'Staza', relation: 'Asocijacija', category: 'Sport', difficulty: 'Tesko', hint: 'Jedan pojam se odvija na drugom.' },
  { leftWord: 'Scena', rightWord: 'Prizor', relation: 'Sinonim', category: 'Film', difficulty: 'Lako', hint: 'Rijeci se koriste za slican dio prikaza.' },
  { leftWord: 'Junak', rightWord: 'Negativac', relation: 'Antonim', category: 'Film', difficulty: 'Srednje', hint: 'Pomisli na suprotne uloge u prici.' },
  { leftWord: 'Kamera', rightWord: 'Objektiv', relation: 'Asocijacija', category: 'Film', difficulty: 'Tesko', hint: 'Jedan pojam je vazan dio drugog.' },
  { leftWord: 'Drevno', rightWord: 'Staro', relation: 'Sinonim', category: 'Istorija', difficulty: 'Lako', hint: 'Znacenje je veoma slicno.' },
  { leftWord: 'Mir', rightWord: 'Sukob', relation: 'Antonim', category: 'Istorija', difficulty: 'Srednje', hint: 'Pojmovi oznacavaju suprotna stanja.' },
  { leftWord: 'Kruna', rightWord: 'Prijesto', relation: 'Asocijacija', category: 'Istorija', difficulty: 'Tesko', hint: 'Oba pojma prizivaju vladarsku moc.' },
  { leftWord: 'Tiho', rightWord: 'Mirno', relation: 'Sinonim', category: 'Priroda', difficulty: 'Lako', hint: 'Obje rijeci opisuju gotovo isto stanje.' },
  { leftWord: 'Topao', rightWord: 'Hladan', relation: 'Antonim', category: 'Priroda', difficulty: 'Srednje', hint: 'Rijeci imaju suprotno znacenje.' },
  { leftWord: 'Oblak', rightWord: 'Kisa', relation: 'Asocijacija', category: 'Priroda', difficulty: 'Tesko', hint: 'Jedna pojava cesto vodi ka drugoj.' },
  { leftWord: 'Nadahnuce', rightWord: 'Inspiracija', relation: 'Sinonim', category: 'Umjetnost', difficulty: 'Lako', hint: 'Oba pojma opisuju isti unutrasnji podsticaj.' },
  { leftWord: 'Tisina', rightWord: 'Buka', relation: 'Antonim', category: 'Umjetnost', difficulty: 'Srednje', hint: 'Pomisli na dvije suprotnosti.' },
  { leftWord: 'Kist', rightWord: 'Platno', relation: 'Asocijacija', category: 'Umjetnost', difficulty: 'Tesko', hint: 'Pojmovi su prirodno povezani u slikanju.' },
  { leftWord: 'Brz', rightWord: 'Ubrzan', relation: 'Sinonim', category: 'Tehnologija', difficulty: 'Lako', hint: 'Rijeci opisuju slicnu osobinu rada.' },
  { leftWord: 'Siguran', rightWord: 'Nesiguran', relation: 'Antonim', category: 'Tehnologija', difficulty: 'Srednje', hint: 'Jedna rijec negira drugu.' },
  { leftWord: 'Kod', rightWord: 'Program', relation: 'Asocijacija', category: 'Tehnologija', difficulty: 'Tesko', hint: 'Jedan pojam gradi drugi.' },
  { leftWord: 'Mapa', rightWord: 'Karta', relation: 'Sinonim', category: 'Geografija', difficulty: 'Lako', hint: 'Rijeci se koriste kao isto ili skoro isto.' },
  { leftWord: 'Sjever', rightWord: 'Jug', relation: 'Antonim', category: 'Geografija', difficulty: 'Srednje', hint: 'Pojmovi pokazuju suprotne strane svijeta.' },
  { leftWord: 'Kompas', rightWord: 'Pravac', relation: 'Asocijacija', category: 'Geografija', difficulty: 'Tesko', hint: 'Jedan pojam sluzi da odredi drugi.' },
]

const demoUsers = [
  { username: 'admin_seed', password: 'Admin123', role: 'admin', points: 1500, level: 2 },
  { username: 'demo_mia', password: 'Demo123', role: 'user', points: 570, level: 1 },
  { username: 'demo_nikola', password: 'Igra123', role: 'user', points: 1210, level: 2 },
  { username: 'demo_lana', password: 'Test123', role: 'user', points: 880, level: 1 },
  { username: 'demo_marko', password: 'Demo123', role: 'user', points: 1045, level: 2 },
  { username: 'demo_sara', password: 'Demo123', role: 'user', points: 690, level: 1 },
]

const demoSubmissions = [
  {
    userLabel: 'demo_mia',
    gameType: 'Asocijacija',
    content: 'Atom -> atom | Galaksija -> galaksija | More -> more',
    points: 260,
    timeSeconds: 74,
    status: 'pending',
    isDaily: 0,
    createdAt: '2026-04-01 11:00:00',
  },
  {
    userLabel: 'demo_nikola',
    gameType: 'Logicki test',
    content: 'Teleskop, Planeta, Zvijezda -> Astronomija',
    points: 220,
    timeSeconds: 55,
    status: 'approved',
    isDaily: 0,
    createdAt: '2026-04-02 12:00:00',
  },
  {
    userLabel: 'demo_lana',
    gameType: 'Ne pripada',
    content: 'Bor, Hrast, Jela, Tablet -> Tablet',
    points: 180,
    timeSeconds: 48,
    status: 'flagged',
    isDaily: 0,
    createdAt: '2026-04-03 13:00:00',
  },
  {
    userLabel: 'demo_marko',
    gameType: 'Lanac rijeci',
    content: 'centar: program | softver | kvar | robot | algoritam',
    points: 245,
    timeSeconds: 81,
    status: 'pending',
    isDaily: 0,
    createdAt: '2026-04-04 14:00:00',
  },
]

const demoHistory = [
  {
    username: 'demo_mia',
    gameType: 'association',
    score: 1460,
    baseScore: 1430,
    earnedPoints: 260,
    awardedPoints: 260,
    total: 3,
    correct: 3,
    accuracy: 100,
    timeSeconds: 46,
    category: 'Priroda',
    difficulty: 'Lako',
    hintCount: 1,
    isDaily: 0,
    dailyReward: 0,
    createdAt: '2026-04-01 10:15:00',
  },
  {
    username: 'demo_nikola',
    gameType: 'association',
    score: 1880,
    baseScore: 1380,
    earnedPoints: 180,
    awardedPoints: 680,
    total: 1,
    correct: 1,
    accuracy: 100,
    timeSeconds: 19,
    category: 'Nauka',
    difficulty: 'Srednje',
    hintCount: 1,
    isDaily: 1,
    dailyReward: 500,
    createdAt: '2026-04-07 09:00:00',
  },
  {
    username: 'demo_lana',
    gameType: 'word-chain',
    score: 1540,
    baseScore: 1540,
    earnedPoints: 270,
    awardedPoints: 270,
    total: 5,
    correct: 5,
    accuracy: 100,
    timeSeconds: 63,
    category: 'Geografija',
    difficulty: 'Tesko',
    hintCount: 0,
    isDaily: 0,
    dailyReward: 0,
    createdAt: '2026-04-05 18:00:00',
  },
  {
    username: 'demo_marko',
    gameType: 'logic',
    score: 1470,
    baseScore: 1440,
    earnedPoints: 200,
    awardedPoints: 200,
    total: 4,
    correct: 4,
    accuracy: 100,
    timeSeconds: 47,
    category: 'Sport',
    difficulty: 'Tesko',
    hintCount: 0,
    isDaily: 0,
    dailyReward: 0,
    createdAt: '2026-04-07 20:00:00',
  },
  {
    username: 'demo_sara',
    gameType: 'relation',
    score: 1490,
    baseScore: 1460,
    earnedPoints: 190,
    awardedPoints: 190,
    total: 4,
    correct: 4,
    accuracy: 100,
    timeSeconds: 24,
    category: 'Priroda',
    difficulty: 'Lako',
    hintCount: 0,
    isDaily: 0,
    dailyReward: 0,
    createdAt: '2026-04-05 15:10:00',
  },
]

const mapAssociation = (item) => ({
  word: item.word,
  symbol: item.symbol || '',
  category: item.category,
  difficulty: item.difficulty,
  clues: item.clues,
  hint: item.hint,
  acceptedAnswers: unique([...(item.acceptedAnswers || []).map(lower), lower(item.word)]),
})

const mapLogic = (item) => ({
  mode: item.mode,
  words: item.words,
  answer: item.answer,
  hint: item.hint,
  category: item.category,
  difficulty: item.difficulty,
})

const mapRelation = (item) => ({
  leftWord: item.leftWord,
  rightWord: item.rightWord,
  relation: item.relation,
  category: item.category,
  difficulty: item.difficulty,
  hint: item.hint,
})

const dedupeBy = (items, keyBuilder) => {
  const seen = new Set()

  return items.filter((item) => {
    const key = keyBuilder(item)

    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

const allAssociations = dedupeBy(
  [
    ...DEFAULT_ASSOCIATION_WORDS.map(mapAssociation),
    ...extraAssociations,
    ...extraAssociationsLocal,
    ...associationBoosts,
    ...associationTopUps,
    ...generatedAssociations,
  ],
  (item) => lower(item.word)
)

const derivedConceptLogic = allAssociations.map((item) => ({
  mode: 'concept',
  words: item.clues.slice(0, 3),
  answer: item.word,
  hint: item.hint,
  category: item.category,
  difficulty: item.difficulty,
}))

const derivedOddOneOutLogic = allAssociations.map((item, index) => {
  const distractorPool = allAssociations.filter(
    (candidate) =>
      candidate &&
      candidate.category !== item.category &&
      candidate.word !== item.word &&
      !item.clues.includes(candidate.word)
  )
  const distractorSource =
    distractorPool[index % distractorPool.length] || allAssociations[(index + 1) % allAssociations.length]

  return {
    mode: 'odd-one-out',
    words: [...item.clues.slice(0, 3), distractorSource.word],
    answer: distractorSource.word,
    hint: `Tri pojma vode ka "${item.word}", a jedan ne pripada toj grupi.`,
    category: item.category,
    difficulty: item.difficulty,
  }
})

const allLogic = dedupeBy(
  [
    ...DEFAULT_LOGIC_CHALLENGES.map(mapLogic),
    ...derivedConceptLogic,
    ...derivedOddOneOutLogic,
  ],
  buildLogicIdentityKey
)

const clueRelations = allAssociations.flatMap((item) =>
  item.clues.slice(0, 2).map((clue) => ({
    leftWord: item.word,
    rightWord: clue,
    relation: 'Asocijacija',
    category: item.category,
    difficulty: item.difficulty,
    hint: `Povezi pojam "${item.word}" sa jednim od njegovih tragova.`,
  }))
)

const allRelations = dedupeBy(
  [
    ...DEFAULT_RELATION_CHALLENGES.map(mapRelation),
    ...manualRelations,
    ...clueRelations,
  ],
  (item) =>
    `${lower(item.leftWord)}|${lower(item.rightWord)}|${item.relation}|${item.category}|${item.difficulty}`
)

const buildAssociationInsert = (rows) => `
INSERT INTO association_words (word, symbol, category, difficulty, clues_json, hint, accepted_answers_json)
SELECT seed.word, seed.symbol, seed.category, seed.difficulty, seed.clues_json, seed.hint, seed.accepted_answers_json
FROM (
${rows
  .map(
    (row, index) =>
      `  ${index === 0 ? 'SELECT' : 'UNION ALL SELECT'} ${sqlString(row.word)} AS word, ${sqlString(row.symbol || '')} AS symbol, ${sqlString(row.category)} AS category, ${sqlString(row.difficulty)} AS difficulty, ${sqlJson(row.clues)} AS clues_json, ${sqlString(row.hint)} AS hint, ${sqlJson(row.acceptedAnswers)} AS accepted_answers_json`
  )
  .join('\n')}
) AS seed
LEFT JOIN association_words existing ON LOWER(existing.word) = LOWER(seed.word)
WHERE existing.id IS NULL;`

const buildLogicInsert = (rows) => `
INSERT INTO logic_challenges (mode, words_json, answer, hint, category, difficulty)
SELECT seed.mode, seed.words_json, seed.answer, seed.hint, seed.category, seed.difficulty
FROM (
${rows
  .map(
    (row, index) =>
      `  ${index === 0 ? 'SELECT' : 'UNION ALL SELECT'} ${sqlString(row.mode)} AS mode, ${sqlJson(row.words)} AS words_json, ${sqlString(row.answer)} AS answer, ${sqlString(row.hint)} AS hint, ${sqlString(row.category)} AS category, ${sqlString(row.difficulty)} AS difficulty`
  )
  .join('\n')}
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
WHERE existing.id IS NULL;`

const buildRelationInsert = (rows) => `
INSERT INTO relation_challenges (left_word, right_word, relation, category, difficulty, hint)
SELECT seed.left_word, seed.right_word, seed.relation, seed.category, seed.difficulty, seed.hint
FROM (
${rows
  .map(
    (row, index) =>
      `  ${index === 0 ? 'SELECT' : 'UNION ALL SELECT'} ${sqlString(row.leftWord)} AS left_word, ${sqlString(row.rightWord)} AS right_word, ${sqlString(row.relation)} AS relation, ${sqlString(row.category)} AS category, ${sqlString(row.difficulty)} AS difficulty, ${sqlString(row.hint)} AS hint`
  )
  .join('\n')}
) AS seed
LEFT JOIN relation_challenges existing
  ON LOWER(existing.left_word) = LOWER(seed.left_word)
 AND LOWER(existing.right_word) = LOWER(seed.right_word)
 AND existing.relation = seed.relation
 AND existing.category = seed.category
 AND existing.difficulty = seed.difficulty
WHERE existing.id IS NULL;`

const buildUsersInsert = async (rows) => {
  const values = await Promise.all(
    rows.map(async (row) => {
      const passwordHash = await bcrypt.hash(row.password, 10)

      return `  (${sqlString(row.username)}, ${sqlString(passwordHash)}, ${sqlString(row.role)}, ${row.points}, ${row.level})`
    })
  )

  return `
INSERT INTO users (username, password_hash, role, points, level)
VALUES
${values.join(',\n')}
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  points = VALUES(points),
  level = VALUES(level);`
}

const buildSubmissionsInsert = (rows) => `
INSERT INTO game_submissions (user_label, game_type, content, points, time_seconds, status, is_daily, created_at)
SELECT seed.user_label, seed.game_type, seed.content, seed.points, seed.time_seconds, seed.status, seed.is_daily, seed.created_at
FROM (
${rows
  .map(
    (row, index) =>
      `  ${index === 0 ? 'SELECT' : 'UNION ALL SELECT'} ${sqlString(row.userLabel)} AS user_label, ${sqlString(row.gameType)} AS game_type, ${sqlString(row.content)} AS content, ${row.points} AS points, ${row.timeSeconds} AS time_seconds, ${sqlString(row.status)} AS status, ${row.isDaily} AS is_daily, ${sqlString(row.createdAt)} AS created_at`
  )
  .join('\n')}
) AS seed
LEFT JOIN game_submissions existing
  ON existing.user_label = seed.user_label
 AND existing.game_type = seed.game_type
 AND existing.created_at = seed.created_at
WHERE existing.id IS NULL;`

const buildHistoryInsert = (rows) => `
INSERT INTO game_history (
  user_id, game_type, score, base_score, earned_points, awarded_points, total, correct,
  accuracy, time_seconds, category, difficulty, hint_count, is_daily, daily_reward, created_at
)
SELECT u.id, seed.game_type, seed.score, seed.base_score, seed.earned_points, seed.awarded_points,
       seed.total, seed.correct, seed.accuracy, seed.time_seconds, seed.category, seed.difficulty,
       seed.hint_count, seed.is_daily, seed.daily_reward, seed.created_at
FROM (
${rows
  .map(
    (row, index) =>
      `  ${index === 0 ? 'SELECT' : 'UNION ALL SELECT'} ${sqlString(row.username)} AS username, ${sqlString(row.gameType)} AS game_type, ${row.score} AS score, ${row.baseScore} AS base_score, ${row.earnedPoints} AS earned_points, ${row.awardedPoints} AS awarded_points, ${row.total} AS total, ${row.correct} AS correct, ${row.accuracy} AS accuracy, ${row.timeSeconds} AS time_seconds, ${sqlString(row.category)} AS category, ${sqlString(row.difficulty)} AS difficulty, ${row.hintCount} AS hint_count, ${row.isDaily} AS is_daily, ${row.dailyReward} AS daily_reward, ${sqlString(row.createdAt)} AS created_at`
  )
  .join('\n')}
) AS seed
JOIN users u ON u.username = seed.username
LEFT JOIN game_history existing
  ON existing.user_id = u.id
 AND existing.game_type = seed.game_type
 AND existing.created_at = seed.created_at
WHERE existing.id IS NULL;`

const associationStatements = chunk(allAssociations, 60).map(buildAssociationInsert)
const logicStatements = chunk(allLogic, 60).map(buildLogicInsert)
const relationStatements = chunk(allRelations, 60).map(buildRelationInsert)
const dedupeAssociationRowsStatement = `
DELETE duplicate
FROM association_words duplicate
JOIN association_words existing
  ON LOWER(duplicate.word) = LOWER(existing.word)
 AND duplicate.id > existing.id;`
const dedupeLogicRowsStatement = `
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
 AND duplicate.id > existing.id;`
const dedupeRelationRowsStatement = `
DELETE duplicate
FROM relation_challenges duplicate
JOIN relation_challenges existing
  ON LOWER(duplicate.left_word) = LOWER(existing.left_word)
 AND LOWER(duplicate.right_word) = LOWER(existing.right_word)
 AND duplicate.relation = existing.relation
 AND duplicate.category = existing.category
 AND duplicate.difficulty = existing.difficulty
 AND duplicate.id > existing.id;`

const buildFile = async () => {
  const usersStatement = await buildUsersInsert(demoUsers)
  const submissionsStatement = buildSubmissionsInsert(demoSubmissions)
  const historyStatement = buildHistoryInsert(demoHistory)

  const sql = `USE word_association_lab;
SET NAMES utf8mb4;

START TRANSACTION;

-- Mega seed generated automatically.
-- Associations: ${allAssociations.length}
-- Logic challenges: ${allLogic.length}
-- Relation challenges: ${allRelations.length}

${dedupeAssociationRowsStatement}

${dedupeLogicRowsStatement}

${dedupeRelationRowsStatement}

${usersStatement}

${associationStatements.join('\n\n')}

${logicStatements.join('\n\n')}

${relationStatements.join('\n\n')}

${dedupeAssociationRowsStatement}

${dedupeLogicRowsStatement}

${dedupeRelationRowsStatement}

UPDATE association_words
SET clues_json = CAST(${sqlJson(['More', 'Hrid', 'Kolonija', 'Organizam'])} AS JSON)
WHERE word = 'Koral';

${submissionsStatement}

${historyStatement}

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
`

  fs.writeFileSync(outputPath, sql, 'utf8')
  console.log(`Generated ${path.basename(outputPath)}`)
  console.log(`Associations: ${allAssociations.length}`)
  console.log(`Logic challenges: ${allLogic.length}`)
  console.log(`Relation challenges: ${allRelations.length}`)
}

buildFile().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
