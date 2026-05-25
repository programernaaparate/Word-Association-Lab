# SRS - Word Association Lab

## 1. Uvod

Word Association Lab je interaktivna aplikacija koja povezuje igre rijeci, logicke izazove i pracenje napretka korisnika. Projekat je osmisljen kao studentski proizvod za predmet Interaktivni dizajn i implementiran je kao funkcionalan MVP+ demo.

## 2. Cilj sistema

Cilj sistema je da korisniku omoguci:

- povezivanje rijeci, pojmova i simbola
- rjesavanje logickih izazova
- pracenje rezultata, XP-a i nivoa
- vracanje u aplikaciju kroz daily challenge
- jednostavno upravljanje sadrzajem kroz admin panel

## 3. Ciljna grupa

- studenti i mladi korisnici koji vole igre rijeci
- korisnici zainteresovani za logiku, jezik i edukativne aplikacije
- nastavnici i drugi korisnici kojima je zanimljivo povezivanje pojmova

## 4. Funkcionalni zahtjevi

### 4.1 Korisnicki dio

- korisnik moze da se registruje i prijavi
- korisnik moze da zapocne novu sesiju ili nastavi aktivnu
- sistem podrzava kategorije i nivoe tezine
- sistem prikazuje rijec, pojam ili simbol kao dio zadatka
- korisnik moze da unese odgovor ili klikne odgovor kad je to prirodnije za tip igre
- sistem cuva rezultate, istoriju i ukupan napredak
- sistem prikazuje leaderboard
- sistem prikazuje daily challenge
- sistem podrzava hint sistem

### 4.2 Tipovi igara

- asocijacije
- zajednicki pojam
- ne pripada
- sinonim / antonim / asocijacija
- lanac rijeci

### 4.3 Administracija

- admin moze da dodaje novi sadrzaj
- admin moze da mijenja i brise postojeci sadrzaj
- admin moze da postavi daily challenge za danas
- admin moze da pregleda korisnicke unose
- admin moze da resetuje XP i istoriju konkretnom korisniku
- admin moze da komunicira sa korisnicima kroz support poruke

## 5. Nefunkcionalni zahtjevi

- interfejs mora biti jasan i pregledan
- aplikacija mora raditi na telefonu i sirem ekranu
- navigacija mora biti intuitivna
- sistem mora biti dovoljno fleksibilan za dodavanje novog sadrzaja
- backend mora cuvati korisnike, istoriju i sadrzaj u bazi

## 6. Korisnicki tok

1. Korisnik otvara aplikaciju.
2. Prijavljuje se ili registruje.
3. Na pocetnoj stranici bira kategoriju i tezinu.
4. Pokrece igru ili daily challenge.
5. Rjesava rundu.
6. Dobija rezultate, XP i bedzeve.
7. Moze da pregleda istoriju, leaderboard i profil.

## 7. Tehnicka arhitektura

### Frontend

- React
- Vite
- React Router
- localStorage za sesiju, fallback i kratkorocno stanje

### Backend

- Express
- JWT autentikacija
- REST API za auth, content, history, leaderboard, admin i poruke

### Baza

- MySQL
- korisnici
- sadrzaj igara
- istorija partija
- submissions
- daily challenge override
- support poruke

## 8. MVP

MVP obuhvata:

- auth
- home
- asocijacije
- lanac rijeci
- logicki izazov
- rezultate
- osnovni napredak
- admin panel

## 9. MVP+

MVP+ obuhvata:

- istoriju rezultata
- dnevni izazov
- hint sistem
- prosireni admin panel

## 10. Trenutni status

Implementirani su MVP i MVP+ elementi kao funkcionalan demo sistem sa frontendom, backendom i bazom. Projekat je spreman za demonstraciju i predaju u okviru predmeta.
