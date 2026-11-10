# 🍽️ Smart Recipe & Meal Planner

**Weniger Lebensmittel verschwenden. Mehr aus vorhandenen Zutaten machen.**

Smart Recipe & Meal Planner ist eine Full-Stack-Webanwendung zur Verwaltung von Rezepten und Vorräten sowie zur Planung von Mahlzeiten und Einkaufslisten. Ziel ist es, vorhandene Lebensmittel sinnvoll zu nutzen, passende Rezepte zu finden und Lebensmittelverschwendung zu reduzieren.

Die Anwendung verbindet eine persönliche Vorratsverwaltung mit einer Rezeptdatenbank, einem Wochenplaner und einer Einkaufsliste. Zusätzlich unterstützt eine KI-gestützte Rezeptsuche dabei, aus vorhandenen Zutaten neue Gerichte zu entdecken.

**Live Demo:** https://nextjs-vercel-neon-m4.vercel.app

---

## 📸 Screenshots

### Startseite

![Startseite](./docs/images/home.jpg)

### Koch dir was – Rezeptsuche

![Koch dir was](./docs/images/cook.jpg)

### Rezeptübersicht

![Rezepte](./docs/images/recipes.jpg)

### Vorratsverwaltung

![Vorrat](./docs/images/pantry.jpg)

### Wochenplaner

![Meal Planner](./docs/images/meal-plan.jpg)

### Einkaufsliste

![Einkaufsliste](./docs/images/shopping-list.jpg)

---

## ✨ Features

### 🥕 Vorratsverwaltung
- Persönliche Verwaltung vorhandener Lebensmittel.
- Zutaten mit Mengen und passenden Einheiten erfassen.
- Vorratsartikel bearbeiten und löschen.
- Vorhandene Zutaten bei der Rezeptsuche berücksichtigen.

### 🍳 Rezeptverwaltung
- Übersicht öffentlicher und eigener Rezepte.
- Rezepte mit Zutaten, Mengen, Einheiten und Zubereitungsschritten.
- Eigene Rezepte erstellen und verwalten.
- KI-generierte Rezeptvorschläge übernehmen und als eigene Rezepte speichern.

### 🔍 Koch dir was
- Rezeptsuche auf Basis der vorhandenen Vorratszutaten.
- Anzeige passender Rezepte mit Trefferinformationen.
- KI-gestützte Rezeptvorschläge mit Google Gemini.
- Zutaten eingeben und daraus neue Rezeptideen generieren lassen.

### 📅 Meal Planner
- Mahlzeiten für mehrere Tage planen.
- Rezepte den einzelnen Mahlzeiten zuordnen.
- Belegte Zeitfenster berücksichtigen.
- Rezepte direkt aus der Rezeptübersicht in den Essensplan übernehmen.

### 🛒 Einkaufsliste
- Einkaufsartikel verwalten.
- Artikel als gekauft markieren.
- Gekaufte Lebensmittel direkt in den eigenen Vorrat übernehmen.
- Einkaufsartikel löschen.
- Einkaufsliste aus der Mahlzeitenplanung ableiten.

### 🔐 Benutzerverwaltung
- Registrierung und Anmeldung.
- Individuelle Benutzerkonten.
- Geschützte Bereiche und persönliche Daten.
- Passwort-Hashing mit Argon2.
- Session-basierte Authentifizierung.

### 🎨 Benutzeroberfläche
- Responsive Design für Desktop, Tablet und Smartphone.
- Light Mode und Dark Mode.
- Einheitliches Design mit Tailwind CSS.
- Dialoge für zentrale Benutzeraktionen.
- Benutzerfreundliche Rückmeldungen über Toast-Nachrichten.

---

## 🛠️ Tech Stack

| Bereich | Technologie |
|---|---|
| Framework | Next.js (App Router) |
| UI Library | React |
| Sprache | TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Komponenten | Headless UI |
| Formulare | React Hook Form |
| Datenbank | PostgreSQL |
| ORM | Prisma 7 |
| Datenbank-Hosting | Neon |
| Authentifizierung | Eigene Authentifizierung mit Argon2 |
| KI-Integration | Google Gemini API |
| Datei- und Bildspeicher | Vercel Blob |
| Deployment | Vercel |
| Versionsverwaltung | Git / GitHub |

---

## 🏗️ Architektur

Die Anwendung basiert auf dem Next.js App Router und verwendet eine serverorientierte Architektur.

- **Server Components** für die Darstellung und das Laden von Daten.
- **Client Components** für interaktive Funktionen und Dialoge.
- **Server Actions** für Datenänderungen und serverseitige Abläufe.
- **Prisma ORM** als Abstraktionsschicht zwischen TypeScript-Anwendung und PostgreSQL-Datenbank.
- **PostgreSQL** als relationale Datenbank.
- **Neon** als serverloser PostgreSQL-Datenbankdienst.

Prisma übernimmt das Object-Relational Mapping (ORM). Es abstrahiert den Datenbankzugriff und ermöglicht es, mit TypeScript-Objekten und Methoden statt mit direkten SQL-Abfragen zu arbeiten.

Die Anwendung verwendet eine eigene Authentifizierung mit serverseitiger Session-Verwaltung. Passwörter werden nicht im Klartext gespeichert, sondern mit Argon2 gehasht.

Die KI-Integration erfolgt über die Google Gemini API. Die generierten Rezeptvorschläge werden strukturiert verarbeitet und können anschließend in die eigene Rezeptdatenbank übernommen werden.

Vercel Blob dient der Speicherung von Dateien und Bildern.

---

## 🚀 Lokale Installation

### Voraussetzungen

- Node.js
- npm
- PostgreSQL-Datenbank oder Neon-Datenbank
- Google Gemini API Key (für die KI-Rezeptvorschläge)
- Vercel Blob Store (für Datei- und Bildspeicherung)

### 1. Repository klonen

```bash
git clone https://github.com/DEIN-USERNAME/DEIN-REPOSITORY.git
cd DEIN-REPOSITORY
```

### 2. Abhängigkeiten installieren

```bash
npm install
```

### 3. Umgebungsvariablen konfigurieren

Für die verschiedenen Umgebungen werden separate Environment-Dateien verwendet:

- `.env` – lokale Entwicklung
- `.env.neon-dev` – Neon-Datenbank für die Entwicklungsumgebung
- `.env.neon` – Neon-Datenbank für die Produktionsumgebung

Folgende Umgebungsvariablen werden benötigt:

| Variable | Beschreibung |
|---|---|
| `DATABASE_URL` | Gepoolte Datenbankverbindung für die Anwendung |
| `DATABASE_URL_UNPOOLED` | Direkte Datenbankverbindung, z. B. für Migrationen |
| `ARGON2_SECRET` | Geheimer Schlüssel für die Passwort-Hashing-Konfiguration |
| `GEMINI_API_KEY` | API-Key für Google Gemini |
| `BLOB_STORE_ID` | Kennung des Vercel Blob Stores |
| `BLOB_READ_WRITE_TOKEN` | Zugriffstoken für Vercel Blob |

Beispiel für die Datenbankkonfiguration:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
```

Die tatsächlichen Verbindungsdaten werden von Neon bereitgestellt.

Die übrigen Variablen werden mit den jeweiligen Zugangsdaten und Schlüsseln ergänzt.

**Wichtig:** Alle Zugangsdaten und Secrets müssen vertraulich behandelt werden und dürfen nicht in das Git-Repository eingecheckt werden.

### 4. Datenbank vorbereiten

Prisma Client generieren:

```bash
npx prisma generate
```

Datenbankmigrationen für die lokale Entwicklungsumgebung ausführen:

```bash
npx prisma migrate dev
```

### 5. Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung ist anschließend unter folgender Adresse erreichbar:

http://localhost:3000

---

## ☁️ Deployment

Das Projekt wird über Vercel bereitgestellt.

- **Frontend und Backend:** Vercel
- **Datenbank:** Neon PostgreSQL
- **Datei- und Bildspeicherung:** Vercel Blob
- **Versionsverwaltung:** GitHub
- **KI-Schnittstelle:** Google Gemini API

Die benötigten Umgebungsvariablen werden in den Vercel Project Settings hinterlegt und den jeweiligen Deployment-Umgebungen zugeordnet.

Development und Production werden getrennt konfiguriert. Dabei werden die passenden Neon-Datenbankverbindungen und API-Zugangsdaten verwendet.

Datenbankmigrationen werden für die jeweilige Umgebung mit der entsprechenden Datenbankverbindung ausgeführt.

---

## 🎯 Projektziel

Das Projekt entstand im Rahmen einer Weiterbildung im Bereich Web Development.

Im Mittelpunkt standen die Konzeption und Umsetzung einer vollständigen Full-Stack-Anwendung mit modernen Webtechnologien.

Besondere Schwerpunkte:

- Entwicklung einer relationalen Datenbankstruktur.
- Umsetzung einer eigenen Authentifizierung.
- Entwicklung wiederverwendbarer React-Komponenten.
- Datenverarbeitung mit Prisma und TypeScript.
- Serverseitige Datenverarbeitung mit Next.js.
- Integration externer APIs.
- Deployment und Verwaltung verschiedener Umgebungen.

**Smart Recipe & Meal Planner verbindet praktische Alltagsfunktionen mit modernen Webtechnologien und zeigt die Umsetzung eines vollständigen Anwendungskonzepts – von der Datenbank bis zur Benutzeroberfläche.**

---

*Developed with Next.js, React, TypeScript and Prisma.*