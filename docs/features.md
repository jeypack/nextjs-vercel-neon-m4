# 🌟 Feature-Übersicht – Smart Recipe & Meal Planner

> **Smart Recipe & Meal Planner** ist eine alltagstaugliche Full-Stack-Webanwendung, die Vorratsmanagement, Rezeptfindung, KI-Rezeptideen, Wochenplanung und automatisierte Einkaufslisten in einem nahtlosen Kreislauf vereint.  
> Ziel ist es, **Lebensmittelverschwendung nachhaltig zu reduzieren**, Zeit bei der Essensplanung zu sparen und vorhandene Lebensmittel optimal zu verwerten.

---

## 🔄 Das Kernprinzip: Der geschlossene Kreislauf (Closed Loop)

Alle Module der Anwendung greifen wie Zahnräder ineinander, um einen vollständigen Lebensmittelkreislauf abzubilden:

```text
       ┌────────────────────────────────────────────────────────┐
       │                                                        ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  1. Vorrat   │ ──> │ 2. Kochen &  │ ──> │  3. Wochen-  │ ──> │ 4. Einkaufs- │
│  verwalten   │     │    KI-Suche  │     │     plan     │     │    liste     │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
       ▲                                                               │
       └────────────────── Gekaufte Artikel übernehmen ────────────────┘
```

1. **Vorrat pflegen:** Lebensmittel mit Mengen, Einheiten und Haltbarkeitsdaten erfassen.
2. **Rezepte finden oder generieren:** Passende Gerichte aus Vorräten kochen oder von Google Gemini neue KI-Kreationen vorschlagen lassen.
3. **Woche planen:** Mahlzeiten für Frühstück, Mittag- und Abendessen festlegen.
4. **Automatisch einkaufen:** Nur das einkaufen, was für die Planung fehlt (Bedarf minus Vorrat).
5. **Kreislauf schließen:** Gekaufte Lebensmittel mit einem Klick zurück in den Vorrat buchen.

---

## 📊 Feature-Matrix auf einen Blick

| Modul | Hauptfunktionen | Zielgruppe | Status |
|---|---|---|:---:|
| **🥕 Vorratslager** | Bestandserfassung, Verfallsdaten, Autokategorisierung, Packungsgrößen | Angemeldete Nutzer | ✅ Produktiv |
| **🍳 Rezeptbuch** | Community- & Privatrezepte, Zutatenlisten, Filter, Volltextsuche, CRUD | Öffentlich / Nutzer | ✅ Produktiv |
| **🔍 Koch dir was** | Zutatengestütztes Matching, Übereinstimmungsgrad, Fehlzutaten-Anzeige | Öffentlich / Nutzer | ✅ Produktiv |
| **🤖 KI-Rezept-Chef** | Gemini 3.1 Flash Lite Rezeptgenerator, Structured JSON, Sofortübernahme | Angemeldete Nutzer | ✅ Produktiv |
| **📅 Wochenplaner** | Mahlzeitenkalender (Frühstück, Mittag, Abend), Slot-Schutz, Schnellzuordnung | Angemeldete Nutzer | ✅ Produktiv |
| **🛒 Einkaufsliste** | Delta-Kalkulation, Mengenaggregation, Abhaken, Vorratstransfer | Angemeldete Nutzer | ✅ Produktiv |
| **🔐 Benutzer & Auth** | Argon2-Login, Session-Management, Profil, Avatar mit Magic-Bytes-Prüfung | Alle | ✅ Produktiv |
| **🛡️ Administration** | Nutzerverwaltung, Rollenverwaltung (`USER` / `ADMIN`), Account-Löschung | Administratoren | ✅ Produktiv |
| **🎨 UI & Design** | Dark/Light Mode, Responsive Design, Barrierefreiheit, Toasts & Modals | Alle | ✅ Produktiv |

---

## 1. 🥕 Vorratsverwaltung (`/pantry`)

Die Vorratsverwaltung bildet das Herzstück zur Erfassung des häuslichen Lebensmittelbestands.

### Funktionen im Detail:
- **Bestandserfassung mit Einheiten:**
  - Erfassen von Mengen mit typisierten Einheiten (Gramm, Kilogramm, Milliliter, Liter, Stück, Packung, Dose, Bund etc.).
  - Unterstützung von **Packungsgrößen & Abtropfgewichten** (z. B. "2 Dosen Kidneybohnen à 400 g").
- **Automatische Zutat-Kategorisierung:**
  - Eine integrierte Regex-Katalog-Engine (`app/pantry/_lib/category.ts`) erkennt bei Eingabe den Zutatennamen und weist diesen automatisch Gruppen wie *Gemüse*, *Obst*, *Milchprodukte*, *Gewürze*, *Getreide & Teigwaren* oder *Hülsenfrüchte* zu.
  - Neue Zutaten werden nahtlos im zentralen Zutatensystem angelegt.
- **Haltbarkeitskontrolle & Warnhinweise:**
  - Optionale Angabe des Mindesthaltbarkeitsdatums (`expiresAt`).
  - Farbliche Visualisierung baldig ablaufender oder abgelaufener Lebensmittel zur Vermeidung von Verderb.
- **Notizfeld:** Speichern individueller Hinweise (z. B. "im Tiefkühler ganz unten" oder "geöffnet am Dienstag").
- **Live-Bearbeitung & Löschschutz:**
  - Schnelles Aktualisieren von Mengen direkt im Vorratsbestand.
  - Sichere Löschung über einen Bestätigungsdialog (`DeletePantryDialog`).

---

## 2. 🍳 Rezeptverwaltung (`/recipes`)

Ein vollwertiges Rezeptbuch für eigene Kreationen und Community-Rezepte.

### Funktionen im Detail:
- **Öffentliche und private Rezepte:**
  - Rezepte können als privat (nur für den Ersteller sichtbar) oder öffentlich (`isPublic = true`) markiert werden.
  - Gäste können alle öffentlichen Rezepte einsehen; angemeldete Nutzer verwalten eigene Rezepte.
- **Rezeptdetails:**
  - Titel, optionale Beschreibung, Zubereitungszeit (in Minuten), Portionsanzahl.
  - Schwierigkeitsgrade mit optischen Badges: `Einfach`, `Mittel`, `Anspruchsvoll`.
  - Vollständige Schritt-für-Schritt-Zubereitungsanleitung.
  - Strukturierte Zutatenliste mit Mengenangabe, Einheit und Zubereitungshinweisen (z. B. "fein gehackt").
- **Filterung & Suche:**
  - **Kategorie-Filter:** Schnellfilter nach Rezeptkategorien (z. B. Frühstück, Pasta, Vegetarisch, Schnelle Küche).
  - **Live-Such-Combobox:** Durchsucht Titel und Beschreibungen in Echtzeit.
- **Rezept-Editor (CRUD):**
  - Intuitive Formulare zum Erstellen (`/recipes/new`) und Bearbeiten (`/recipes/[id]/edit`).
  - Dynamischer Zutaten-Zeilen-Builder: Beliebiges Hinzufügen und Entfernen von Zutatenzeilen im Formular.
  - Serverseitige Validierung über Zod mit gezielten Fehlermeldungen pro Eingabefeld.
- **Direktintegration in den Wochenplan:**
  - Rezepte können mit einem einzigen Klick ("Zum Wochenplan hinzufügen") direkt für einen bestimmten Tag und Slot eingeplant werden.

---

## 3. 🔍 "Koch dir was" & KI-Rezept-Chef (`/cook`)

Dieses Modul inspiriert beim Kochen und sorgt dafür, dass primär vorhandene Zutaten auf den Tisch kommen.

### 3.1 Zutatengestütztes Rezept-Matching
- **Vorratsübernahme:** Mit einem Klick können alle aktuell vorhandenen Zutaten aus dem persönlichen Vorrat als Filterkriterien übernommen werden.
- **Manuelle Zutatenauswahl:** Zutaten können über eine Autovervollständigung manuell als interaktive Chips ergänzt oder entfernt werden.
- **Intelligenter Treffer-Algorithmus:**
  - Gleicht die ausgewählten Zutaten mit allen verfügbaren Rezepten ab.
  - Zeigt an, wie viele benötigte Zutaten bereits vorhanden sind.
  - Listet exakt auf, welche Zutaten fehlen, um das Rezept vollständig kochen zu können.

### 3.2 KI-Rezeptgenerierung mit Google Gemini
Wenn der Rezeptkatalog kein passendes Gericht bereithält, übernimmt die integrierte KI:
- **Google Gemini 3.1 Flash Lite:** Schnelle und präzise Rezeptkreation auf Basis der vorhandenen Zutaten.
- **Deterministische Structured JSON Outputs:**
  - Die KI generiert 4 vollwertige, strukturierte Rezeptvorschläge.
  - Jedes Rezept enthält Titel, Beschreibung, Vorbereitungszeit, Portionen, genaue Zutaten mit Einheiten und nummerierte Kochanweisungen.
- **Prompt-Optimierung:** Die KI wird angewiesen, vorhandene Zutaten zu priorisieren, keine unpassenden Zutaten zu erfinden und realistische Einheiten zu verwenden.
- **One-Click-Übernahme ins Kochbuch:**
  - Jedes KI-generierte Rezept kann per Klick als echtes Rezept in der PostgreSQL-Datenbank gespeichert und fortan wie ein normales eigenes Rezept genutzt werden.

---

## 4. 📅 Wochen- & Mahlzeitenplaner (`/meal-plan`)

Der Wochenplaner strukturiert den Speiseplan für mehrere Tage im Voraus und bildet die Datenbasis für die Einkaufsliste.

### Funktionen im Detail:
- **Übersichtliche Kalendermatrix:**
  - Aufteilung jedes Tages in drei Kern-Mahlzeiten-Slots:
    - 🌅 **Frühstück** (`BREAKFAST`)
    - ☀️ **Mittagessen** (`LUNCH`)
    - 🌙 **Abendessen** (`DINNER`)
  - Anzeige des aktuellen Wochentags und Datums mit Datumsbereichsauswahl (`MealCalendarRange`).
- **Slot-Belegung & Konfliktvermeidung:**
  - Belegte Slots werden mit Rezeptkarte, Zubereitungszeit und Portionsangabe dargestellt.
  - Ein Datenbank-Constraint (`@@unique([userId, date, mealType])`) verhindert versehentliche Doppelbelegungen desselben Zeitfensters.
- **Schnelle Mahlzeitenauswahl:**
  - Dialoggestützte Rezeptauswahl (`ChoseRecipeDialog`) direkt aus dem Kalender heraus.
  - Alternativ Zuweisung direkt von jeder Rezeptseite aus.
- **Pläne bearbeiten:** Geplante Mahlzeiten können jederzeit entfernt oder durch andere Gerichte ersetzt werden.

---

## 5. 🛒 Intelligente Einkaufsliste (`/shopping-list`)

Die Einkaufsliste denkt mit und spart doppelte Einkäufe durch automatischen Vorratsabgleich.

### Funktionen im Detail:
- **Automatisierte Bedarfsberechnung (Delta-Algorithmus):**
  - Liest alle anstehenden Rezepte aus dem Wochenplan aus.
  - **Tageszeit-Intelligenz:** Berücksichtigt für den aktuellen Tag nur noch ausstehende Mahlzeiten (z. B. ab 18:00 Uhr nur noch das Abendessen; vergangene Mahlzeiten des Tages fließen nicht mehr in den Einkauf ein).
  - Summiert alle benötigten Zutatenmengen nach Zutat und Einheit.
  - **Subtrahiert den aktuellen Vorratsbestand:** Vorhandene Mengen im Vorratslager werden voll angerechnet – auf der Einkaufsliste landet nur die tatsächliche Fehlmenge!
- **Manuelle Verwaltung:**
  - Manuelles Hinzufügen individueller Einkäufe außerhalb des Wochenplans.
  - Bearbeiten und Löschen einzelner Einkaufsartikel.
- **Interaktives Einkaufen:**
  - Artikel lassen sich beim Gang durch den Supermarkt als gekauft abhaken (`isBought`).
  - Gekaufte Artikel werden optisch durchgestrichen dargestellt.
- **Closed-Loop: Übernahme in den Vorrat (`transferBoughtShoppingItemsToPantry`):**
  - Ein Klick auf *"In Vorrat übernehmen"* bucht abgehakte Artikel direkt als neues oder ergänztes Lebensmittel in die Vorratskammer.
  - Gleichzeitig wird der Artikel von der Einkaufsliste entfernt.
- **Bereinigungsfunktion:** Alle als gekauft markierten Artikel können mit einem Klick über einen Bestätigungsdialog restlos entfernt werden.

---

## 6. 🔐 Benutzer-, Profil- & Rechteverwaltung (`/user`, `/user/profile`, `lib/auth`)

Sichere und DSGVO-freundliche Nutzerverwaltung ohne externe Auth-Dienstleister.

### Funktionen im Detail:
- **Registrierung & Login:**
  - Registrierung mit Vorname, Nachname, E-Mail und sicherem Passwort.
  - Validierung von Mindestlängen und E-Mail-Formaten.
- **Modernste Passwortsicherheit:**
  - Passworthashing mit **Argon2id** und Server-Pepper (`ARGON2_SECRET`) zum Schutz vor Brute-Force-Angriffen.
- **Session-Handling:**
  - Serverseitig in PostgreSQL gespeicherte Sessions.
  - Sitzungs-ID im Browser als `HttpOnly`, `SameSite=Lax` Cookie geschützt (Schutz gegen XSS-Session-Hijacking).
- **Benutzerprofil (`/user/profile`):**
  - Einsicht und Pflege der persönlichen Daten.
  - Möglichkeit zur vollständigen Löschung des eigenen Nutzerkontos (`DeleteAccountForm`).
- **Avatar-Upload mit Magic-Bytes-Sicherheitsprüfung:**
  - Profilbild-Upload direkt in den **Vercel Blob Storage**.
  - **Sicherheits-Check:** Prüfung der ersten 12 Datei-Bytes (Magic Bytes) zur eindeutigen Erkennung von JPEG, PNG und WebP. Das Hochladen von Schadcode mit manipulierter Endung wird serverseitig blockiert.
  - Automatisches Löschen des alten Avatars aus dem Cloud-Speicher beim Hochladen eines neuen Bildes.
- **Administrations-Dashboard (für Admins):**
  - Übersicht aller registrierten Nutzer mit Registrierungsdatum und Rollenstatus.
  - Ändern von Benutzerrollen zwischen `USER` und `ADMIN` (`UpdateUserRoleDialog`).
  - Administratives Löschen von Benutzerkonten (`DeleteUserDialog`).

---

## 7. 🎨 Benutzeroberfläche, Design & User Experience (UI/UX)

- **Dark Mode & Light Mode:**
  - Systemweites Umschalten zwischen hellem und dunklem Design via `next-themes`.
  - Persistierung der Benutzereinstellung im LocalStorage ohne Layout-Flackern (No-FOUC).
- **Responsive Layout:**
  - Optimiert für alle Bildschirmgrößen: Mobile Smartphones, Tablets und Widescreen-Desktop-Monitore.
  - Mobile-freundliche Navigation und berührungssensible Schaltflächen.
- **Modernes Tailwind CSS v4 Styling:**
  - Elegante Farbverläufe (`BgGradient`), Cards und Akzentfarben.
  - Klare typografische Hierarchien mit der modernen Schriftfamilie *Geist Sans* & *Geist Mono*.
- **Interaktive Feedback-Elemente:**
  - Globale Toast-Meldungen bei erfolgreichen oder fehlgeschlagenen Aktionen (`Toast.tsx`).
  - Barrierefreie Modals und Dialoge auf Basis von `@headlessui/react`.
  - Dynamische Dashboard-Ansichten: Willkommens-Hero für Gäste vs. personalisiertes Dashboard für angemeldete Nutzer.
- **Komfort-Funktionen:**
  - "Scroll-to-Top"-Schaltfläche bei längeren Rezept- oder Vorratslisten.
  - Granulare Lade-Skelette (`loading.tsx`) für angenehme Ladeübergänge.

---

## 8. ⚙️ Technische System-Features & Architekturstärken

- **Next.js 16 App Router & React 19:**
  - Schnelle Ladezeiten durch serverseitiges Rendering (React Server Components).
  - Mutationen über typsichere Server Actions (`"use server"`) ohne REST-Overhead.
- **Prisma ORM 7 mit Driver-Adaptern:**
  - Dualer Datenbankadapter: `@prisma/adapter-neon` im Vercel-Serverless-Betrieb und `@prisma/adapter-pg` für lokale Docker-Entwicklung.
- **Transaktionssicherheit:**
  - Atomare Mehrschrittoperationen in `prisma.$transaction` (z. B. beim Berechnen und Deduplizieren der Einkaufsliste).
- **Cloud-Infrastruktur:**
  - Datenbank-Hosting auf **Neon PostgreSQL** mit automatischem Connection Pooling.
  - Hosting und Edge-Auslieferung über die **Vercel Cloud Platform**.

---

## 🎯 Fazit

Der **Smart Recipe & Meal Planner** geht weit über eine herkömmliche Rezeptsammlung hinaus: Durch die intelligente Verknüpfung von Vorratsbestand, Wochenplanung, KI-gestützter Resteverwertung und automatischer Einkaufsliste bietet die Anwendung eine echte Alltagshilfe für einen nachhaltigen und organisierten Umgang mit Lebensmitteln.
