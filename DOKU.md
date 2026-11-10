This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# `Prisma ORM 7`

## Schritt 1: PostgreSQL mit Docker starten

    services:
      db:
        image: postgres:15
        container_name: prisma_demo_db
        environment:
          POSTGRES_USER: admin
          POSTGRES_PASSWORD: 1234
          POSTGRES_DB: prisma_demo_db
        ports:
          - "5432:5432"
        volumes:
          - prisma_demo_db_data:/var/lib/postgresql/data

    volumes:
      prisma_demo_db_data:


Speichere die gezeigte Datei als `docker-compose.yml` im Projektverzeichnis. Starte dann Docker Desktop und führe im selben Verzeichnis aus:

    docker compose up -d


Prüfe, ob der Container läuft:

    docker compose ps


Die Datenbank verwendet laut deiner Konfiguration:
- Datenbank: prisma_demo_db
- Benutzer: admin
- Passwort: 1234
- Port: 5432

Das Volume prisma_demo_db_data sorgt dafür, dass die Daten bei einem normalen Stoppen des Containers erhalten bleiben.

## Schritt 2: Prisma 7 und PostgreSQL-Pakete installieren

Öffne ein zweites Terminal im Stammverzeichnis deines Next.js-Projekts – dort, wo deine `package.json` liegt.
Wir installieren die Pakete getrennt nach ihrer Aufgabe. Die Versionen 7.9.1 und @prisma/client@7.9.1 halten wir dabei bewusst fest, damit nicht versehentlich Prisma 8 installiert wird. Die offizielle Prisma-7-Anleitung verwendet ebenfalls den PostgreSQL-Adapter @prisma/adapter-pg. 

## 2.1 – Prisma CLI und TypeScript-Typen installieren

    npm install -D prisma@7.9.1 @types/pg


## 2.2 – Prisma Client, PostgreSQL-Adapter und Treiber installieren

    npm install @prisma/client@7.9.1 @prisma/adapter-pg@7.9.1 pg dotenv


Die Pakete haben folgende Aufgaben:
- prisma: Kommandozeilenwerkzeuge für Schema und Migrationen
- @prisma/client: Datenbankzugriff aus deinem Anwendungscode
- @prisma/adapter-pg und pg: Verbindung zu PostgreSQL
- dotenv: Lädt Umgebungsvariablen aus .env
- @types/pg: TypeScript-Typen für den PostgreSQL-Treiber

## Schritt 3: Prisma initialisieren

Wenn beide Installationen erfolgreich waren, führe Folgendes aus:

    npx prisma init --datasource-provider postgresql --output ../lib/generated/prisma


Damit legst du die grundlegenden Prisma-Konfigurationsdateien an. Der Client wird später in `lib/generated/prisma` erzeugt, sodass wir ihn direkt aus deinem Next.js-Code importieren können.

## Schritt 4: Datenbank-Verbindung konfigurieren

Öffne die `.env` im Projektstamm und setze die Verbindungszeichenfolge auf deine Docker-Datenbank:

    DATABASE_URL="postgresql://admin:1234@localhost:5432/prisma_demo_db?schema=public"


Wichtig: Hier steht localhost, weil Next.js und Prisma zunächst auf deinem Mac laufen. Würde dein Backend ebenfalls in einem Docker-Container laufen, wäre der Hostname normalerweise db.
Prüfe außerdem die Datei `prisma.config.ts`. Für Prisma 7 sollte sie sinngemäß so aussehen:

    import "dotenv/config";
    import { defineConfig, env } from "prisma/config";

    export default defineConfig({
      schema: "prisma/schema.prisma",
      migrations: {
        path: "prisma/migrations",
      },
      datasource: {
        url: env("DATABASE_URL"),
      },
    });


## Schritt 5: Das Prisma-Schema prüfen

Öffne `prisma/schema.prisma`. Der Generator sollte den neuen Prisma-7-Client konfigurieren:

    generator client {
      provider = "prisma-client"
      output   = "../lib/generated/prisma"
    }

    datasource db {
      provider = "postgresql"
    }

Hier wird der Client aber ausdrücklich in deinem eigenen Ausgabeordner erzeugt (siehe Schritt 7).
Das Datenmodell kommt darunter. Als einfaches Beispiel kannst du später ein User-Modell ergänzen. Die Tabellen werden aus diesem Schema erzeugt.

## Schritt 6: Erstes Modell anlegen und Migration ausführen
Ergänze testweise in `prisma/schema.prisma`:

    model User {
      id           Int      @id @default(autoincrement())
      email        String   @unique
      firstName    String
      lastName     String
      passwordHash String
      createdAt    DateTime @default(now())
    }


Führe anschließend aus:

    npx prisma validate
    npx prisma migrate dev --name init
    npx prisma generate


Damit prüfst du das Schema, erzeugst die Datenbanktabelle und generierst den Prisma Client. 


## Schritt 7: Prisma Client in Next.js verwenden
Erstelle `src/lib/prisma.ts`:

    // Singleton
    import {PrismaPg} from "@prisma/adapter-pg";
    import { PrismaClient } from "../src/generated/prisma/client";

    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });

    const globalForPrisma = global as unknown as {
      prisma: PrismaClient;
    };

    export const prisma = globalForPrisma.prisma ?? new PrismaClient({adapter});

    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;


Das ist die grundlegende Verbindung für Prisma 7 mit PostgreSQL. Eine Singleton, damit Next.js nicht bei jedem Hot Reload neue Client-Instanzen erzeugt. 

## Schritt: Tabelle um das Feld `createdAt`erweitern

    model User {
      id    Int    @id @default(autoincrement())
      email String @unique
      name  String
      createdAt DateTime @default(now())
    }

Dann: 

    npx prisma migrate dev --name add-created-at




## Next, choose how you want to set up your database:

### CONNECT EXISTING DATABASE:
  1. Configure your DATABASE_URL in prisma.config.ts
  2. Run prisma db pull to introspect your database.

### CREATE NEW DATABASE:
  - Local: `npx prisma dev` (runs Postgres locally in your terminal)
  - Cloud: `npx create-db` (creates a free Prisma Postgres database)

Then, define your models in prisma/schema.prisma and run prisma migrate dev to apply your schema.

Learn more: https://pris.ly/getting-started

## Install

    npm install @prisma/adapter-neon

### Lokal – Migration erstellen und deine lokale Datenbank aktualisieren:

    npx prisma migrate dev --name add_field

### Auf Neon – die bereits erstellte Migration anwenden:

    DATABASE_URL_UNPOOLED='DEINE_NEON_URL' npx prisma migrate deploy

## Du kannst eine .env.neon verwenden, ohne die lokale .env mit den Docker-Zugangsdaten anzutasten.

### Ändere den Befehl einfach so:

    npx dotenv -e .env.neon -- npx prisma migrate deploy


### Aber: Dafür muss das CLI-Paket dotenv-cli installiert sein. Falls noch nicht geschehen:

    npm install --save-dev dotenv-cli


### Deine .env.neon sollte diese Variable enthalten:

    DATABASE_URL_UNPOOLED="postgresql://..."


### Damit lädt dotenv-cli die Neon-Variable aus .env.neon und startet anschließend Prisma. 
### Deine normale .env bleibt unverändert.

### Wichtig: Den Neon-Befehl brauchst du nur, wenn es neue Migrationen gibt.

## Du kannst dir den Befehl auch als Script in der package.json speichern:

    "migrate:deploy:neon": "dotenv -e .env.neon -- prisma migrate deploy"


### Dann reicht künftig:

    npm run migrate:deploy:neon


### Script	           Zweck

- npm run dev:migrate //	Lokale Entwicklung: Migration erstellen und anwenden
- npm run dev:seed //	Lokale Datenbank mit Beispieldaten befüllen
- npm run dev:studio //	Datenbank in Prisma Studio ansehen
- npm run migrate:deploy:neon //	Vorhandene Migrationen auf Neon main anwenden
- npm run migrate:deploy:neon-dev //	Vorhandene Migrationen auf Neon dev anwenden
- npm run seed:neon-dev //	Beispieldaten nur auf Neon dev einspielen

## Blob

    nextjs-vercel-neon-m4-blob

### Environment variables that will be created:

    BLOB_READ_WRITE_TOKEN
    BLOB_STORE_ID
    BLOB_WEBHOOK_PUBLIC_KEY

### Seeding for production
    ALLOW_PRODUCTION_SEED=true npm run seed:neon

### Struktur

    app/
    ├── user/
    │   ├── page.tsx
    │   ├── _components/
    │   └── _lib/
    │
    ├── recipes/
    │   ├── page.tsx
    │   ├── new/
    │   │   └── page.tsx
    │   ├── [id]/
    │   │   ├── page.tsx
    │   │   └── edit/
    │   │       └── page.tsx
    │   ├── _components/
    │   └── _lib/
    │
    ├── cook/
    │   ├── page.tsx
    │   ├── _components/
    │   └── _lib/
    │
    ├── pantry/
    ├── meal-plan/
    ├── shopping-list/
    ├── layout.tsx
    └── page.tsx

    lib/
    ├── auth/
    │   ├── actions.ts
    │   └── sessions.ts
    ├── generated/
    │   └── prisma/
    └── prisma.ts

### MVP heißt: Minimum Viable Product.

Die kleinste sinnvolle Version eines Features/Produkts, die schon echten Nutzen hat.

- Pantry-MVP = Zutaten hinzufügen, anzeigen, löschen
- (ohne fancy Filter, ohne Automationen am Anfang)
- Also: erst funktionierend & nutzbar, danach ausbauen.

# Sprint Board (Feature-first)
MP-04
| ID | Titel | Beschreibung | Akzeptanzkriterien (DoD) | Depends | Estimate |
| :-- | :---- | :----------- | :----------------------- | :------------- | :------- |
| MP-01 | Pantry-Liste anzeigen ✅  | In app/pantry/ eine User-spezifische Vorratsliste rendern. | (1) Nur Items des eingeloggten Users sichtbar, (2) Empty-State vorhanden, (3) Mobile-first + Dark/Light passt, (4) Query in route-eigener _lib gekapselt | – | M |
| MP-02 | Pantry-Item erstellen ✅  | Formular für neues Pantry-Item (Ingredient, Menge, Einheit, optional Ablaufdatum). | (1) Validierung + verständliche Fehlermeldungen, (2) erfolgreicher Insert in PantryItem, (3) Liste aktualisiert ohne manuellen Reload, (4) wiederkehrende Klassen in tailwind.ts | MP-01 | M |
| MP-03 | Pantry-Item bearbeiten/löschen ✅  | CRUD-Teil für bestehende Pantry-Items. | (1) Edit + Delete funktionieren, (2) Ownership geprüft (nur Owner), (3) Sortierung: bald ablaufend zuerst, (4) UI-Stati sauber (loading/disabled) | MP-02 | M |
| MP-04 | Cook: Vorrat übernehmen ✅ | In IngredientInput.tsx Button “aus Vorrat übernehmen”. | (1) Pantry-Zutaten werden als Auswahl übernommen, (2) case-insensitive Dubletten-Schutz, (3) bestehender Flow in actions.ts bleibt intakt | MP-03 | S |
| MP-05 | Cook: Matching verbessern ✅ | Rezeptsuche in app/cook/_lib/ um klarere Trefferlogik erweitern. | (1) matched/missing sauber ausgewiesen, (2) stabile Sortierung (mehr Treffer zuerst), (3) Fehlermeldung bei Query-Fail bleibt benutzerfreundlich, (4) keine Regression im aktuellen Cook-Flow | MP-04 | M |
| MP-06 | Recipes-Liste produktiv machen ✅ | recipes/page.tsx von Gemini-Test auf echte Rezeptliste umbauen. | (1) DB-Listing inkl. Kategorie, (2) Filter: Suchtext + Kategorie + public/private, (3) Empty/Loading/Error-States, (4) responsive + dark mode | MP-05 | M |
| MP-07 | Rezept erstellen ✅ | Seite in app/recipes/new/ mit Formular + Zutatenzeilen. | (1) Rezept inkl. RecipeIngredient[] speicherbar, (2) Pflichtfelder validiert, (3) Owner (userId) korrekt gesetzt, (4) Erfolgsnavigation zur Detailseite | MP-06 | L |
| MP-08 | Rezeptdetail anzeigen ✅ | Neue Route /recipes/[id] mit vollständiger Rezeptansicht. | (1) Titel, Beschreibung, Zeiten, Zutaten, Anleitung sichtbar, (2) Public/Private korrekt berücksichtigt, (3) 404 bei ungültiger ID, (4) mobile-first | MP-07 | M |
| MP-09 | Rezept bearbeiten/löschen ✅ | Route /recipes/[id]/edit mit Rechteprüfung. | (1) Nur Owner/Admin darf edit/delete, (2) Änderungen konsistent gespeichert, (3) Delete mit Sicherheitsabfrage, (4) Navigation zurück zur Liste/Detail korrekt | MP-08 | L |
| MP-10 | Meal-Plan Wochenansicht ✅ | In app/meal-plan/ Wochenansicht mit MealType-Slots bauen. | (1) Woche laden/navigieren, (2) Slots für BREAKFAST/LUNCH/DINNER, (3) mobile Karten + desktop grid, (4) Dark/Light konsistent | MP-09 | L |
| MP-11 | Meal-Plan Einträge verwalten ✅ | Erstellen/Löschen von Slot-Belegungen mit Rezepten. | (1) Create/Delete robust, (2) Unique-Konflikte (userId+date+mealType) sauber abgefangen, (3) klare UX bei Konflikten, (4) Rechteprüfung aktiv | MP-10 | M |
| MP-12 | Shopping-List aus Plan ableiten ✅ | Neue Route shopping-list (laut Strukturziel in README.md) aus MealPlan + Rezepten generieren. | (1) Fehlende Zutaten werden erzeugt/angezeigt, (2) Duplikate aggregiert, (3) isBought togglebar, (4) Filter “gekauft ausblenden” | MP-11 | L |
| MP-13 | Navigation & Konsistenz | Navigation in navMenu.ts auf neue/fertige Routen erweitern. | (1) Alle aktiven Routen verlinkt, (2) active-state korrekt, (3) mobile Menü im Header.tsx konsistent, (4) keine toten Links | MP-06, MP-10, MP-12 | S |
| MP-14 | Sprint-Hardening & Doku | Stabilisierung, Regression-Checks, README ergänzen. | (1) Kernflows manuell getestet, (2) bekannte Edge Cases dokumentiert, (3) Routing/Feature-Übersicht in README.md aktualisiert, (4) offene Restpunkte als Backlog notiert | Alle Feature-Tickets | M |

### Empfohlene Reihenfolge (Ready Queue)

1. MP-01 → MP-02 → MP-03
2. MP-04 → MP-05
3. MP-06 → MP-07 → MP-08 → MP-09
4. MP-10 → MP-11
5. MP-12
6. MP-13 + MP-14

https://openrouter.ai/collections/free-models

https://freebuff.com/

### Ein absoluter Klassiker, bei dem die Tomate im Mittelpunkt steht und der trotzdem unglaublich lecker ist, ist **Pasta alla Norma** (oder eine einfache, aber perfekt zubereitete **Pasta Pomodoro**).

Wenn du etwas Besonderes suchst, empfehle ich dir **gebratene Gnocchi mit Kirschtomaten, Knoblauch und Burrata**.

Hier ist das Rezept dafür:

### Gnocchi mit Kirschtomaten und Burrata

**Zutaten (für 2 Personen):**
* 500 g Gnocchi (aus dem Kühlregal)
* 250 g Kirschtomaten (am besten bunte für die Optik)
* 1 Kugel Burrata (oder alternativ Büffelmozzarella)
* 2 Knoblauchzehen (fein gehackt)
* Ein Handvoll frisches Basilikum
* Olivenöl
* Salz, Pfeffer & eine Prise Zucker
* Optional: Etwas Chili oder Pinienkerne

**Zubereitung:**

1. **Tomaten anbraten:** Erhitze 2 EL Olivenöl in einer Pfanne. Gib die halbierten Kirschtomaten hinein und brate sie bei mittlerer Hitze ca. 5 Minuten an, bis sie weich werden und anfangen zu schmelzen.
2. **Würzen:** Gib den gehackten Knoblauch (und falls gewünscht etwas Chili) hinzu und dünste ihn kurz mit. Würze das Ganze mit Salz, Pfeffer und einer kleinen Prise Zucker, um die Süße der Tomaten zu betonen.
3. **Gnocchi dazu:** Gib die Gnocchi direkt aus der Packung mit in die Pfanne zu den Tomaten. Brate sie ca. 5–8 Minuten mit, bis sie von außen leicht goldbraun und knusprig sind.
4. **Anrichten:** Gib alles auf einen Teller. Setze die Burrata-Kugel in die Mitte und schneide sie vorsichtig ein, sodass der cremige Kern herausläuft.
5. **Finish:** Garniere alles großzügig mit frischem Basilikum, einem Schuss hochwertigem Olivenöl und bei Bedarf mit gerösteten Pinienkernen.

**Warum das so lecker ist?**
Die Säure und Süße der geschmorten Tomaten harmoniert perfekt mit der cremigen, fast sahneartigen Konsistenz der Burrata. Die knusprigen Gnocchi geben den nötigen Biss.

Guten Appetit!

### Hier sind drei sehr einfache und leckere Gerichte, bei denen Tomaten die Hauptrolle spielen:

1. **Tomate-Mozzarella (Insalata Caprese)**
   * **Was es ist:** Der absolute Klassiker der italienischen Küche – ganz ohne Kochen.
   * **Zubereitung:** Tomaten und Mozzarella in Scheiben schneiden und abwechselnd auf einem Teller anrichten. Mit frischem Basilikum belegen, mit gutem Olivenöl (und nach Wunsch etwas Balsamico-Creme) beträufeln und mit Salz und frisch gemahlenem Pfeffer würzen. 
   * **Dauer:** ca. 5 Minuten.

2. **Klassische Bruschetta**
   * **Was es ist:** Geröstetes Brot mit frischem, aromatischem Tomatenbelag.
   * **Zubereitung:** Reife Tomaten entkernen und fein würfeln. Mit gehacktem Basilikum, etwas Olivenöl, Salz und Pfeffer mischen. Weißbrotscheiben (z. B. Ciabatta oder Baguette) im Ofen oder Toaster rösten, mit einer halbierten Knoblauchzehe einreiben und die Tomatenmischung darauf verteilen.
   * **Dauer:** ca. 10 Minuten.

3. **Schnelle Pasta mit frischen Tomaten (Pasta al Pomodoro)**
   * **Was es ist:** Ein leichtes, warmes Nudelgericht für jeden Tag.
   * **Zubereitung:** Während die Pasta (z. B. Spaghetti) kocht, eine Knoblauchzehe in Olivenöl anbraten. Gewürfelte Tomaten dazugeben und bei mittlerer Hitze ca. 8–10 Minuten leicht einköcheln lassen, bis sie weich sind. Mit Salz, Pfeffer und einer Prise Zucker abschmecken, die gekochten Nudeln direkt in die Pfanne geben, durchschwenken und mit Parmesan servieren.

### Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
### To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://www.postgresql.org/docs/current/libpq-ssl.html for libpq SSL mode definitions.

### Pasta-Klassiker
* 1 rote getrocknete Pfefferschote halbieren.
* 1/2 Bund Petersilie fein hacken.
* 400 g Spaghetti oder Vermicelli in Salzwasser kochen.
* Inzwischen 75 g Olivenöl erhitzen,
* Knoblauch, Pfefferschote und Petersilie kurz darin schwenken.
* Die Nudeln abgießen, mit der Sauce mischen und salzen.