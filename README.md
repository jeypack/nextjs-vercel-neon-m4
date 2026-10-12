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


Speichere die gezeigte Datei als docker-compose.yml im Projektverzeichnis. Starte dann Docker Desktop und führe im selben Verzeichnis aus:

    docker compose up -d


Prüfe, ob der Container läuft:

    docker compose ps


Die Datenbank verwendet laut deiner Konfiguration:
- Datenbank: prisma_demo_db
- Benutzer: admin
- Passwort: 1234
- Port: 5432
Das Volume prisma_demo_db_data sorgt dafür, dass die Daten bei einem normalen Stoppen des Containers erhalten bleiben.
Schritt 2: Prisma 7 und PostgreSQL-Pakete installieren
Öffne ein zweites Terminal im Stammverzeichnis deines Next.js-Projekts – dort, wo deine package.json liegt.
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
Wenn einer dieser Befehle fehlschlägt, führe den nächsten noch nicht aus, sondern sichere die vollständige Fehlermeldung.

## Schritt 3: Prisma initialisieren

Wenn beide Installationen erfolgreich waren, führe Folgendes aus:

    npx prisma init --datasource-provider postgresql --output ../src/generated/prisma


Damit legst du die grundlegenden Prisma-Konfigurationsdateien an. Der Client wird später in src/generated/prisma erzeugt, sodass wir ihn direkt aus deinem Next.js-Code importieren können.

## Schritt 4: Datenbank-Verbindung konfigurieren

Öffne die .env im Projektstamm und setze die Verbindungszeichenfolge auf deine Docker-Datenbank:

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
      output   = "../src/generated/prisma"
    }

    datasource db {
      provider = "postgresql"
    }

Hier wird der Client aber ausdrücklich in deinem eigenen Ausgabeordner erzeugt (siehe Schritt 7).
Das Datenmodell kommt darunter. Als einfaches Beispiel kannst du später ein User-Modell ergänzen. Die Tabellen werden aus diesem Schema erzeugt.

## Schritt 6: Erstes Modell anlegen und Migration ausführen
Ergänze testweise in `prisma/schema.prisma`:

    model User {
      id    Int    @id @default(autoincrement())
      email String @unique
      name  String?
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