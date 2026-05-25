# Word Association Lab

Word Association Lab je interaktivna aplikacija za povezivanje rijeci, logicke izazove i pracenje napretka korisnika. Projekat je radjen kao studentski projekat za predmet Interaktivni dizajn i pokriva MVP i MVP+ fazu kroz funkcionalan frontend, backend i MySQL bazu.

## Glavne funkcionalnosti

- registracija i prijava korisnika
- zasticene rute i JWT autentikacija
- igra asocijacija sa tragovima, hintovima i opcionim simbolom/piktogramom
- logicki izazovi: zajednicki pojam i ne pripada
- igra relacija: sinonim, antonim i asocijacija
- lanac rijeci
- daily challenge sa jednom dnevnom nagradom
- rezultati, XP, nivoi, bedzevi i napredak
- istorija partija i leaderboard
- admin panel za dodavanje, izmjenu i brisanje sadrzaja
- moderacija korisnickih unosa
- poruke izmedju admina i korisnika

## Tehnologije

- React
- Vite
- React Router
- Express
- MySQL
- localStorage za session i fallback UX

## Pokretanje projekta

### 1. Instalacija

```powershell
npm install
```

### 2. `.env`

Napraviti fajl `.env` u root folderu projekta.

Primer:

```env
PORT=4000
CLIENT_URL=http://localhost:5173
JWT_SECRET=wal_local_2026_secure_4n7k9q_podgorica_seed_ready

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=word_association_lab
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD
```

### 3. Baza

Prvo pustiti:

- `server/sql/schema.sql`

Zatim napuniti bazu:

- `server/sql/seed_mega_insert_only.sql`

Ako zelis da regenerises mega seed:

```powershell
npm run seed:mega
```

### 4. Pokretanje

Backend:

```powershell
npm run server:dev
```

Frontend:

```powershell
npm run dev
```

## Skripte

- `npm run dev` - pokrece Vite frontend
- `npm run build` - pravi production build
- `npm run lint` - ESLint provera
- `npm run server` - pokrece backend
- `npm run server:dev` - pokrece backend sa nodemon-om
- `npm run seed:mega` - regenerise mega SQL seed
- `npm run mobile:sync` - pravi web build i prebacuje ga u Android projekat
- `npm run mobile:android` - sync + otvaranje Android projekta u Android Studio

## Mobilna aplikacija

Projekat je pripremljen i kao Android mobilna aplikacija preko Capacitor-a.

### Android workflow

1. Pokreni backend:

```powershell
npm run server:dev
```

2. Ako testiras na emulatoru, default Android fallback radi na:

- `http://10.0.2.2:4000/api`

3. Ako testiras na pravom telefonu, napravi `.env.mobile.example` kopiju u `.env` ili dopuni postojeci `.env` tako da `VITE_API_URL` pokazuje na IP adresu tvog racunara, na primer:

```env
VITE_API_URL=http://192.168.0.100:4000/api
```

4. Prebaci novi web build u Android projekat:

```powershell
npm run mobile:sync
```

5. Otvori Android projekat:

```powershell
npm run mobile:android
```

6. U Android Studio mozes praviti:

- debug APK
- release APK
- AAB za Play Store

### Brza Windows komanda za APK

Ako hoces da iz komandne linije odmah dobijes novi debug APK:

```powershell
npm run mobile:apk
```

Ova komanda:

- pronalazi lokalni JDK ako `JAVA_HOME` nije vec podesen
- pravi novi web build
- sync-uje Android projekat
- pravi novi `app-debug.apk`

## Demo nalozi

- `admin_seed / Admin123`
- `demo_mia / Demo123`
- `demo_nikola / Igra123`
- `demo_lana / Test123`
- `demo_marko / Demo123`
- `demo_sara / Demo123`

## Struktura projekta

- `src` - frontend
- `server` - backend
- `server/sql` - schema i seed fajlovi
- `docs` - dodatna dokumentacija

## Dokumentacija

- `docs/SRS.md`

## Status

Projekat je zavrsen kao funkcionalan MVP+ demo za predmet Interaktivni dizajn. Preostale buduce nadogradnje bi bile automatski testovi, websocket chat i naprednija AI semanticka provjera odgovora.
