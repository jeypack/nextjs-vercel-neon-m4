# 🍽️ Smart Recipe & Meal Planner

> **Weniger Lebensmittel verschwenden. Mehr aus vorhandenen Zutaten machen.**  
> Eine Full-Stack-Webanwendung zur intelligenten Vorratshaltung, Rezeptfindung, KI-gestützten Mahlzeitenplanung und automatisierten Einkaufslistenerstellung im geschlossenen Kreislauf.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.9-2D3748?logo=prisma)](https://www.prisma.io/)
[![Neon](https://img.shields.io/badge/Database-Neon_Postgres-00E599?logo=postgresql)](https://neon.tech/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini_3.1_Flash_Lite-orange?logo=google)](https://deepmind.google/technologies/gemini/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

**🌐 Live Demo:** [https://nextjs-vercel-neon-m4.vercel.app](https://nextjs-vercel-neon-m4.vercel.app)  
**💻 GitHub Repository:** [https://github.com/jeypack/nextjs-vercel-neon-m4](https://github.com/jeypack/nextjs-vercel-neon-m4)

---

## 📖 Inhaltsverzeichnis

1. [Vision & Closed-Loop-Prinzip](#-vision--closed-loop-prinzip)
2. [Visuelle Feature-Tour](#-visuelle-feature-tour)
   - [Startseite & Dashboard](#1-startseite--dashboard)
   - [Vorratsverwaltung](#2-vorratsverwaltung)
   - [Koch dir was – Zutatensuche & KI-Chef](#3-koch-dir-was--zutatensuche--ki-chef)
   - [Rezeptverwaltung & Kochbuch](#4-rezeptverwaltung--kochbuch)
   - [Wochen- & Mahlzeitenplaner](#5-wochen--und-mahlzeitenplaner)
   - [Intelligente Einkaufsliste](#6-intelligente-einkaufsliste)
3. [Technologie-Stack](#-technologie-stack)
4. [Architektur im Überblick](#-architektur-im-überblick)
5. [Weiterführende Dokumentation](#-weiterführende-dokumentation)
6. [Lokale Installation & Setup](#-lokale-installation--setup)
7. [Deployment & Betrieb](#-deployment--betrieb)

---

## 🔄 Vision & Closed-Loop-Prinzip

Im Alltag landen erhebliche Mengen genießbarer Lebensmittel im Müll – oft schlicht aus mangelnder Übersicht über vorhandene Vorräte, fehlender Inspiration für die Resteverwertung oder ineffizienter Einkaufsplanung.

**Smart Recipe & Meal Planner** löst dieses Problem durch einen **vollständig geschlossenen Kreislauf**:

```text
       ┌────────────────────────────────────────────────────────┐
       │                                                        ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  1. Vorrat   │ ──> │ 2. Kochen &  │ ──> │  3. Wochen-  │ ──> │ 4. Einkaufs- │
│  verwalten   │     │    KI-Chef   │     │     plan     │     │    liste     │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
       ▲                                                               │
       └────────────────── Gekaufte Artikel übernehmen ────────────────┘
```

1. **Vorrat erfassen:** Vorhandene Lebensmittel mit Mengen, Einheiten und Haltbarkeitsdatum eintragen.
2. **Kochen & Verwerten:** Rezepte finden, die primär auf Vorräten basieren, oder Google Gemini um neue Rezeptideen bitten.
3. **Woche planen:** Mahlzeiten für Frühstück, Mittag- und Abendessen festlegen.
4. **Automatisch einkaufen:** Das System ermittelt exakt die Differenz: *Bedarf minus vorhandener Vorratsbestand*.
5. **Vorrat aktualisieren:** Gekaufte Artikel mit einem Klick zurück in den Vorrat buchen.

---

## 📸 Visuelle Feature-Tour

### 1. Startseite & Dashboard

Die zentrale Anlaufstelle bietet für Gäste einen Überblick über die Kernfunktionen und für angemeldete Nutzer ein personalisiertes Dashboard mit Schnellzugriff auf alle Module.

![Startseite & Dashboard](./images/home.jpg)

- **Schnellübersicht:** Aktuelle Statistiken und Direktlinks zu Vorrat, Planer und Einkaufsliste.
- **Responsive Layout:** Automatische Anpassung an Smartphones, Tablets und Widescreen-Monitore.
- **Theme-Toggle:** Flexibler Wechsel zwischen Light- und Dark-Mode ohne Ladeflackern.

---

### 2. Vorratsverwaltung

Das Vorratslager verhindert doppelte Einkäufe und behält den Überblick über gelagerte Lebensmittel.

![Vorratsverwaltung](./images/pantry.jpg)

- **Erweiterte Mengeneinheiten:** Verwaltung von Stück, Gramm, Kilogramm, Milliliter, Liter sowie Packungen und Dosen.
- **Packungsgrößen & Abtropfgewichte:** Erfassung von Packungsinhalten (z. B. "2 Dosen Kidneybohnen à 400 g").
- **Automatische Zutat-Kategorisierung:** Erkennt Zutatennamen per Regex und ordnet sie automatisch Warengruppen wie Gemüse, Milchprodukte, Gewürze oder Hülsenfrüchte zu.
- **Haltbarkeitskontrolle:** Visuelle Hervorhebung bald ablaufender oder abgelaufener Lebensmittel.

---

### 3. Koch dir was – Zutatensuche & KI-Chef

Hilft bei der täglichen Frage *"Was koche ich heute?"* und nutzt konsequent vorhandene Reste.

![Koch dir was – Rezeptsuche & KI-Chef](./images/cook.jpg)

- **Bestandsabgleich (Matching Engine):** Gleicht ausgewählte Zutaten mit allen Rezepten ab, zeigt den Übereinstimmungsgrad und hebt fehlende Zutaten hervor.
- **KI-Rezeptgenerierung mit Google Gemini:**
  - Nutzt das Modell `gemini-3.1-flash-lite` mit strengem JSON-Schema.
  - Generiert 4 vollständige, maßgeschneiderte Rezeptvorschläge mit Mengenangaben, Portionsgrößen und Kochanweisungen.
- **One-Click-Übernahme:** Jedes KI-Rezept kann mit einem Klick dauerhaft als eigenes Rezept in der Datenbank gespeichert werden.

---

### 4. Rezeptverwaltung & Kochbuch

Das digitale Kochbuch für eigene Kreationen und inspirierende Community-Rezepte.

![Rezeptübersicht & Filter](./images/recipes.jpg)

- **Öffentliche & private Rezepte:** Flexibel entscheiden, welche Rezepte für alle sichtbar sind und welche privat bleiben.
- **Filter & Volltextsuche:** Schnelle Filterung nach Kategorien (z. B. Pasta, Vegetarisch, Schnelle Küche) und Echtzeit-Suche.
- **Rezeptdetails:** Detaillierte Zubereitungsschritte, Portionsrechner, Vorbereitungszeit und Schwierigkeitsgrad (`Einfach`, `Mittel`, `Anspruchsvoll`).
- **Rezept-Editor:** Volle CRUD-Funktionen mit dynamischem Zutaten-Zeilen-Builder und Zod-Validierung.
- **Direkt zum Wochenplan:** Jedes Rezept kann direkt aus der Detailansicht in den Wochenplan übertragen werden.

---

### 5. Wochen- und Mahlzeitenplaner

Strukturiert die Mahlzeiten der Woche und spart täglichen Planungsaufwand.

![Wochenplaner](./images/meal-plan.jpg)

- **Kalendermatrix:** Aufteilung jedes Tages in drei Hauptmahlzeiten:
  - 🌅 **Frühstück** (`BREAKFAST`)
  - ☀️ **Mittagessen** (`LUNCH`)
  - 🌙 **Abendessen** (`DINNER`)
- **Konfliktschutz:** Datenbank-Constraint (`@@unique([userId, date, mealType])`) verhindert versehentliche Doppelbelegungen desselben Zeitfensters.
- **Schnellzuweisung:** Rezepte dialoggestützt auswählen oder mit einem Klick austauschen und entfernen.

---

### 6. Intelligente Einkaufsliste

Erzeugt automatisiert eine Einkaufsliste, die exakt auf dem Wochenplan basiert.

![Intelligente Einkaufsliste](./images/shopping-list.jpg)

- **Delta-Bedarfsberechnung:** Liest alle anstehenden Rezepte aus dem Wochenplan, summiert die Zutaten und zieht vorhandene Vorratsmengen automatisch ab.
- **Tageszeit-Logik:** Berücksichtigt für den aktuellen Tag nur noch verbleibende Mahlzeiten (z. B. ab 18:00 Uhr nur noch das Abendessen).
- **Interaktiver Einkauf:** Artikel im Supermarkt als gekauft abhaken.
- **In Vorrat übernehmen:** Gekaufte Artikel fließen per Klick direkt in das Vorratslager zurück und schließen den Kreislauf.

---

## 🛠️ Technologie-Stack

| Bereich | Technologie | Version / Paket | Zweck |
|---|---|---|---|
| **Framework** | **Next.js** | `16.3.8` (App Router) | React Server Components (RSC), Server Actions |
| **UI-Bibliothek** | **React** | `19.2.8` | Komponentenbasiertes UI mit Concurrent Features |
| **Sprache** | **TypeScript** | `^5` | Durchgängige End-to-End Typsicherheit |
| **Styling** | **Tailwind CSS** | `^4` | Atomic CSS mit nativen CSS-Variablen & Dark Mode |
| **Theme** | **next-themes** | `^0.4.6` | Nahtloser Wechsel zwischen Light- und Dark-Theme |
| **Icons & UI** | **Lucide & Headless UI** | `^1.52` / `^2.2` | Vektor-Icons & barrierefreie Modals/Comboboxen |
| **Validierung** | **Zod & Yup** | `^4.6` / `^1.7` | Strikte Schema-Validierung für Server Actions |
| **Datenbank** | **PostgreSQL (Neon)** | Serverless Postgres | Relationale Datenspeicherung mit Connection Pooling |
| **ORM** | **Prisma ORM** | `^7.9.1` | Typsicherer DB-Zugriff mit Neon- & PG-Driver-Adaptern |
| **KI-Engine** | **Google Gemini** | `@google/genai ^2.31` | Modell `gemini-3.1-flash-lite` mit Structured Output |
| **Datei-Storage** | **Vercel Blob** | `@vercel/blob ^2.8` | Cloud-Speicher für Avatare mit Magic-Bytes-Prüfung |
| **Auth** | **Argon2** | `^0.45.1` | Sicheres Passworthashing & Cookie-basierte Sessions |
| **Deployment** | **Vercel** | Platform | Serverless Hosting & Edge Network |

---

## 🏗️ Architektur im Überblick

Die Anwendung folgt dem **Server-First-Paradigma** des Next.js App Routers:

- **Server Components by Default:** Nahezu alle Seiten laden Daten direkt serverseitig über Prisma – ohne REST-API-Overhead oder Ladeflackern.
- **Server Actions (`"use server"`):** Datenmutationen laufen über typsichere Server Actions inklusive serverseitiger Validierung und sofortiger Cache-Invalidierung (`revalidatePath`).
- **Feature Co-Location:** Komponenten (`_components/`), Abfragen (`queries.ts`), Aktionen (`actions.ts`) und Typen (`types.ts`) liegen direkt bei den jeweiligen Fachdomänen.
- **Duales Prisma-Adapter-Pattern:** Dynamische Auswahl zwischen `@prisma/adapter-neon` (HTTP/WebSockets in der Cloud) und `@prisma/adapter-pg` (lokale TCP-Verbindung).
- **Eigenständige Session-Auth:** Cookie-basierte Sessions in PostgreSQL mit Argon2id-Passwort-Hashing – ohne Abhängigkeit von Drittanbietern.

---

## 📚 Weiterführende Dokumentation

Detaillierte Fach- und Architektur-Dokumente im Ordner `docs/`:

| Dokument | Beschreibung |
|---|---|
| **[Systemarchitektur](architecture.md)** | Schichtenmodell, Sequenzdiagramme, Mutation-Layer, Security & Topologie |
| **[Feature-Dokumentation](features.md)** | Vollständige Spezifikation aller Funktionen und Fachdomänen |
| **[Projektübersicht](project-overview.md)** | Management Summary, Datenmodell, Entity-Relationship-Diagramm (ERD) |
| **[Bekannte Probleme](known-issues.md)** | Technische Einschränkungen, Edge Cases und empfohlene Workarounds |
| **[Abkürzungsverzeichnis](shortcuts.md)** | Glossar aller verwendeten Begriffe und Akronyme (RPC, TCP, RSC, etc.) |

---

## 🚀 Lokale Installation & Setup

### Voraussetzungen
- **Node.js** (Version 20 oder höher empfohlen)
- **npm**
- **PostgreSQL** (lokal via Docker oder über einen kostenlosen [Neon](https://neon.tech)-Account)
- **Google Gemini API Key** (kostenlos im [Google AI Studio](https://aistudio.google.com/) erhältlich)
- **Vercel Blob Token** (optional für Avatar-Uploads)

### 1. Repository klonen & Abhängigkeiten installieren

```bash
git clone https://github.com/jeypack/nextjs-vercel-neon-m4.git
cd nextjs-vercel-neon-m4
npm install
```

### 2. Umgebungsvariablen anlegen

Erstelle eine `.env`-Datei im Stammverzeichnis:

```env
# Gepoolte Verbindung für die Anwendung
DATABASE_URL="postgresql://user:password@host-pooler.region.aws.neon.tech/dbname?sslmode=require"

# Direkte (unpooled) Verbindung für Prisma-Migrationen & Seeds
DATABASE_URL_UNPOOLED="postgresql://user:password@host.region.aws.neon.tech/dbname?sslmode=require"

# Passwort-Sicherheit & Admin-Initialisierung
ARGON2_SECRET="dein-geheimer-pepper-schluessel"
ADMIN_EMAIL="admin@beispiel.de"
ADMIN_PASSWORD="sicheres-passwort-1234"

# Google Gemini KI-Schnittstelle
GEMINI_API_KEY="AIzaSy..."

# Vercel Blob Store (Profilbilder)
BLOB_STORE_ID="store_id"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_token"
```

> **Tipp (Lokale Docker-Datenbank):**  
> Für eine rein lokale Datenbank kann der mitgelieferte Docker-Container gestartet werden:  
> `docker compose up -d`  
> In diesem Fall lautet die URL: `DATABASE_URL="postgresql://admin:1234@localhost:5432/prisma_demo_db"`

### 3. Datenbank vorbereiten & mit Testdaten befüllen

```bash
# 1. Prisma Client generieren
npm run generate

# 2. Schema-Migrationen anwenden
npm run dev:migrate

# 3. Datenbank mit Demodaten (Einheiten, Rezepten, Zutaten) befüllen
npm run seed:meal-planner
```

### 4. Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung ist anschließend unter **[http://localhost:3000](http://localhost:3000)** erreichbar.

---

## ☁️ Deployment & Betrieb

Die Anwendung ist für das Deployment auf **Vercel** in Kombination mit **Neon PostgreSQL** optimiert:

1. **Frontend & Serverless Functions:** Deployment über Vercel mit automatischer CI/CD-Pipeline via GitHub.
2. **Datenbank:** Serverless PostgreSQL auf Neon mit automatischem Connection Pooling über PgBouncer.
3. **Environment Variables:** Hinterlegung der Secrets in den Vercel Project Settings.
4. **Produktions-Migration:**
   ```bash
   npm run migrate:deploy:neon
   ```

---

## 📄 Lizenz

Dieses Projekt wurde im Rahmen einer Weiterbildung im Bereich Full-Stack Web Development konzipiert und realisiert.

*Developed with Next.js 16, React 19, TypeScript, Tailwind CSS v4 and Prisma 7.*
