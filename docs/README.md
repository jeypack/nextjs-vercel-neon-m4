# 🍽️ Smart Recipe & Meal Planner

**Weniger Lebensmittel verschwenden. Mehr aus vorhandenen Zutaten machen.**

Smart Recipe & Meal Planner ist eine Full-Stack-Webanwendung zur Verwaltung von Rezepten und Vorräten sowie zur Planung von Mahlzeiten und Einkaufslisten. Ziel ist es, vorhandene Lebensmittel sinnvoll zu nutzen, passende Rezepte zu finden und Lebensmittelverschwendung zu reduzieren.

Die Anwendung verbindet eine persönliche Vorratsverwaltung mit einer Rezeptdatenbank, einem Wochenplaner und einer automatisch abgeleiteten Einkaufsliste. Zusätzlich unterstützt eine KI-gestützte Rezeptsuche dabei, aus vorhandenen Zutaten neue Gerichte zu entdecken.

**Live Demo:** https://nextjs-vercel-neon-m4.vercel.app

---

## 📸 Screenshots

### Startseite

![Startseite – Screenshot](./docs/images/home.jpg)

### Koch dir was – Rezeptsuche

![Koch dir was – Screenshot](./docs/images/cook.jpg)

### Rezeptübersicht

![Rezepte – Screenshot](./docs/images/recipes.jpg)

### Vorratsverwaltung

![Vorrat – Screenshot](./docs/images/pantry.jpg)

### Wochenplaner

![Meal Planner – Screenshot](./docs/images/meal-plan.jpg)

### Einkaufsliste

![Einkaufsliste – Screenshot](./docs/images/shopping-list.jpg)

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
| Validierung | TypeScript / serverseitige Validierung |
| Datenbank | PostgreSQL |
| ORM | Prisma 7 |
| Datenbank-Hosting | Neon |
| Authentifizierung | Eigene Authentifizierung mit Argon2 |
| KI-Integration | Google Gemini API |
| Deployment | Vercel |
| Versionsverwaltung | Git / GitHub |

---

## 🏗️ Architektur

Die Anwendung basiert auf dem Next.js App Router und verwendet eine serverorientierte Architektur.

- **Server Components** für die Darstellung und das Laden von Daten.
- **Client Components** für interaktive Funktionen und Dialoge.
- **Server Actions** für Datenänderungen und serverseitige Abläufe.
- **Prisma ORM** für den typsicheren Datenbankzugriff.
- **PostgreSQL** als relationale Datenbank.
- **Neon** als serverloser PostgreSQL-Datenbankdienst.

Die Anwendung verwendet eine eigene Authentifizierung mit serverseitiger Session-Verwaltung. Passwörter werden nicht im Klartext gespeichert, sondern mit Argon2 gehasht.

Die KI-Integration erfolgt über die Google Gemini API. Die generierten Rezeptvorschläge werden strukturiert verarbeitet und können anschließend in die eigene Rezeptdatenbank übernommen werden.

---

## 🚀 Lokale Installation

### Voraussetzungen

- Node.js
- npm
- PostgreSQL-Datenbank oder Neon-Datenbank
- Google Gemini API Key (für die KI-Rezeptvorschläge)

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

Eine `.env`-Datei im Projektverzeichnis anlegen:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"

ARGON2_SECRET="DEIN_GEHEIMER_SCHLUESSEL"

GEMINI_API_KEY="DEIN_GEMINI_API_KEY"
```

Die Werte müssen durch die eigenen Zugangsdaten ersetzt werden.

**Wichtig:** API-Keys und andere Geheimnisse dürfen niemals in das Git-Repository eingecheckt werden.

### 4. Datenbank vorbereiten

Prisma Client generieren:

```bash
npx prisma generate
```

Datenbankmigrationen ausführen:

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
- **Versionsverwaltung:** GitHub
- **KI-Schnittstelle:** Google Gemini API

Die benötigten Umgebungsvariablen werden in den Vercel Project Settings hinterlegt und den entsprechenden Deployment-Umgebungen zugeordnet.

Datenbankmigrationen müssen auch für die jeweilige Deployment-Umgebung berücksichtigt werden.

---

## 🎯 Projektziel

Das Projekt entstand im Rahmen einer Weiterbildung im Bereich Web Development.

Im Mittelpunkt standen die Konzeption und Umsetzung einer vollständigen Full-Stack-Anwendung mit moderner Webtechnologie.

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