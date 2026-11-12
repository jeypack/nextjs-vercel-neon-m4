# ⚠️ Bekannte Probleme & Einschränkungen (Known Issues)

> **Dokumentationsstatus:** Release 0.1.0  
> **Projekt:** Smart Recipe & Meal Planner (`modul4-next-web-25-12-jp`)  
> **Zweck:** Dieses Dokument erfasst bekannte technische Einschränkungen, Edge Cases, architektonische Besonderheiten sowie empfohlene Workarounds für Entwickler und Administratoren.

---

## 📋 Schnellübersicht (Issue Matrix)

| Bereich | Problem / Limitation | Schweregrad | Status / Workaround |
|---|---|:---:|---|
| **Datenbank** | Migrationen über Connection-Pooler schlagen fehl | 🟡 Mittel | `DATABASE_URL_UNPOOLED` verwenden |
| **Datenbank** | Kaltstart-Latenz bei inaktiver Neon-Instanz | 🟢 Gering | Neon-Compute Warm-up / Keep-Alive |
| **Datenbank** | Abgelaufene Sessions verbleiben in der Datenbank | 🟢 Gering | Cron-Job / periodisches Cleanup geplant |
| **Einkaufsliste** | Keine automatische Einheitenkonvertierung (z.B. g $\leftrightarrow$ kg) | 🟡 Mittel | Einheitliche Einheiten im Vorrat pflegen |
| **Einkaufsliste** | Zutaten ohne Mengenangaben (`amount: null`) | 🟢 Gering | Manuelle Mengenangabe bei Bedarf |
| **KI-Integration** | Rate-Limits / Kontingente bei Google Gemini API | 🟡 Mittel | Graceful Fallback greift; manuelle Suche aktiv |
| **Zutaten-Matching**| String-Gleichheit bei Singular/Plural & Synonymen | 🟢 Gering | Vorschläge der Autocomplete-Box nutzen |
| **Authentifizierung** | Kein automatischer "Passwort vergessen"-Mailversand | 🟡 Mittel | Manuelle Rücksetzung durch Administrator |
| **Dateispeicher** | 2 MB Limit & EXIF-Metadaten bei Bild-Uploads | 🟢 Gering | Magic-Bytes aktiv; Sharp-Resize als Roadmap |
| **Zeitzonen** | Tagesübergreifende Slot-Berechnung kurz vor Mitternacht | 🟢 Gering | UTC-Normalisierung aktiv (`parseDateInputToUtcDate`) |

---

## 1. 🗄️ Datenbank & Persistenz (Neon / Prisma 7)

### 1.1 Migrationen über PgBouncer-Connection-Pooler
- **Symptom:** Beim Ausführen von `prisma migrate dev` oder `prisma migrate deploy` tritt ein Fehler auf (`advisory locks not supported` oder Verbindungsabbrüche).
- **Ursache:** Neon nutzt PgBouncer im Transaction-Pooling-Modus für die primäre Verbindungs-URL (`DATABASE_URL`). PostgreSQL verbietet bestimmte DDL-Operationen (Data Definition Language) und Session-Advisory-Locks über transaktionale Connection-Pooler.
- **Lösung / Workaround:**
  In `prisma.config.ts` ist die unpooled Direktverbindung hinterlegt:
  ```typescript
  datasource: {
    url: process.env["DATABASE_URL_UNPOOLED"],
  }
  ```
  Für alle Migrations- und Seed-Befehle muss zwingend `DATABASE_URL_UNPOOLED` verwendet werden (wie in den npm-Skripten `migrate:deploy:neon` und `seed:neon` hinterlegt).

### 1.2 Neon Serverless Compute Kaltstart (Cold Start)
- **Symptom:** Nach längerer Inaktivität dauert der allererste Seitenaufruf oder die erste Datenbankabfrage 1,5 bis 3 Sekunden.
- **Ursache:** Neon schaltet inaktive Compute-Instanzen automatisch in den Ruhezustand (Suspend), um Kosten und Ressourcen zu sparen. Beim ersten Request wird die Instanz reaktiviert.
- **Lösung / Workaround:**
  - Für Produktionssysteme mit hohem SLA kann in der Neon-Konsole das Suspend-Timeout erhöht oder deaktiviert werden.
  - Alternativ halten periodische Health-Checks (z. B. via Vercel Cron oder Uptime-Monitor) die Verbindung aktiv.

### 1.3 Bereinigung abgelaufener Benutzersitzungen (`Session`)
- **Symptom:** Die Tabelle `Session` wächst kontinuierlich an, da ausgelaufene Sitzungen nicht sofort physisch gelöscht werden.
- **Aktuelles Verhalten:** Beim Auslesen (`getCurrentUser()`) werden abgelaufene Sessions via `session.expiresAt <= new Date()` zuverlässig ignoriert und abgewiesen. Die Datenzeile verbleibt jedoch vorerst in der Datenbank.
- **Geplante Lösung:** Einrichtung eines regelmäßigen Wartungsskripts oder Vercel-Cron-Jobs:
  ```sql
  DELETE FROM "Session" WHERE "expiresAt" < NOW();
  ```

---

## 2. 🛒 Einkaufsliste & Einheiten-System

### 2.1 Fehlende automatische Einheitenkonvertierung (Cross-Unit Conversion)
- **Symptom:** Ein geplantes Rezept benötigt "500 g Mehl". Im Vorrat ist "1 kg Mehl" oder "1 Packung Mehl" hinterlegt. Die Einkaufsliste berechnet trotzdem 500 g als fehlend.
- **Ursache:** Die Aggregation und Differenzberechnung in `app/shopping-list/_lib/actions.ts` gruppiert strikt nach dem Tupel `ingredientId:unitId`. Da `g`, `kg` und `Packung` unterschiedliche `unitId`-Werte besitzen, findet keine automatische mathematische Umrechnung statt.
- **Empfohlener Workaround:**
  Zutaten im Vorrat idealerweise in der Basiseinheit pflegen, die auch in den favorisierten Rezepten vorkommt (z. B. Gramm statt Kilogramm bzw. Milliliter statt Liter).
- **Roadmap:** Implementierung einer normalisierten Einheiten-Umrechnungstabelle basierend auf `UnitType` (`WEIGHT`, `VOLUME`).

### 2.2 Zutaten ohne Mengenangaben (`amount: null`)
- **Symptom:** Zutaten wie "Prise Salz", "etwas Pfeffer" oder "Öl zum Anbraten" erscheinen auf der Einkaufsliste ohne konkrete Mengenzahl.
- **Ursache:** Rezepte definieren für Gewürze oder optionale Zutaten häufig keinen fixen Zahlenwert (`amount = null`).
- **Verhalten:** Die Anwendung listet den Artikel korrekt namentlich auf, kann jedoch logischerweise keine quantitative Differenz zum Vorratsbestand bilden.

---

## 3. 🔍 Zutatensuche & KI-Chef (Google Gemini)

### 3.1 Rate Limits & API-Quotas bei Google Gemini (HTTP 429)
- **Symptom:** Beim Klick auf "Mit KI Rezept vorschlagen" erscheint gelegentlich eine Fehlermeldung ("KI-Vorschlag fehlgeschlagen").
- **Ursache:** Der Google Gemini API-Key unterliegt Ratenbegrenzungen (Requests Per Minute / Tokens Per Minute). Bei parallelen Zugriffen oder erreichtem Monatskontingent verweigert die API weitere Anfragen.
- **Resilienz-Verhalten:** Der Fehler wird durch ein `try/catch` in der Server Action abgefangen. Die Anwendung stürzt nicht ab, sondern informiert den Benutzer via Toast. Die herkömmliche datenbankbasierte Rezeptsuche bleibt uneingeschränkt funktionsfähig.

### 3.2 Zutatennamen: Exakte String-Übereinstimmung
- **Symptom:** Wer nach "Karotten" sucht, findet unter Umständen Rezepte nicht, die als Zutat "Karotte" (Singular) hinterlegt haben.
- **Ursache:** Der Matching-Algorithmus in `app/cook/_lib/queries.ts` führt einen Normalisierungsabgleich (`trim().toLocaleLowerCase("de-DE")`) durch, besitzt aktuell jedoch kein linguistisches Stemming (Wortstammreduktion) für deutsche Pluralformen.
- **Empfohlener Workaround:** Beim Erfassen neuer Rezepte und Vorräte stets die Vorschläge der Such- und Eingabe-Combobox verwenden, um Duplikate zu vermeiden.

---

## 4. 🔐 Authentifizierung, Sicherheit & Profil

### 4.1 Kein Self-Service für "Passwort vergessen"
- **Symptom:** Nutzer haben auf der Login-Seite keine "Passwort vergessen"-Option mit E-Mail-Reset-Link.
- **Ursache:** Aus Gründen des Datenschutzes und zur Vermeidung externer E-Mail-Dienstleister (SMTP-Relay / SendGrid / Resend) wurde vorerst auf ein automatisches Mail-Subsystem verzichtet.
- **Lösung für Administratoren:**
  Ein Administrator mit der Rolle `ADMIN` kann über die Benutzerverwaltung (`/user`) das Profil des Nutzers bearbeiten oder das Passwort bei Bedarf manuell über die Konsole neu hashen:
  ```bash
  # Beispiel via Seed-Skript oder Prisma Studio
  npm run dev:studio
  ```

### 4.2 Bild-Upload: Größenbegrenzung & Metadaten
- **Symptom:** Bilder über 2 MB werden beim Avatar-Upload abgewiesen.
- **Ursache:** Schutz vor übermäßigem Speicher- und Bandbreitenverbrauch im Vercel Blob Store.
- **Sicherheits-Status:** 
  - Die Validierung nutzt binäre **Magic Bytes** (Prüfung der ersten 12 Datei-Bytes auf `image/jpeg`, `image/png`, `image/webp`), wodurch umbenannte Schadprogramme zuverlässig geblockt werden.
  - Bildkomprimierung via `sharp` ist serverseitig derzeit auskommentiert, um native Serverless-Binary-Abhängigkeiten auf Vercel gering zu halten. EXIF-Metadaten (z.B. GPS-Daten) werden daher aktuell noch nicht herausgefiltert.

---

## 5. 📅 Wochenplaner & Zeitzonen-Edge-Cases

### 5.1 Tagesabgleich kurz vor Mitternacht
- **Symptom:** Bei der automatischen Generierung der Einkaufsliste um 23:55 Uhr wird das Abendessen des aktuellen Tages unter Umständen nicht mehr berücksichtigt.
- **Ursache:** Die Logik in `getAllowedMealTypesForToday` schließt vergangene Mahlzeiten aus (nach 18:00 Uhr verbleibt nur noch das Abendessen; nach 24:00 Uhr schaltet der Filter auf den Folgetag um).
- **Verhalten:** Dies ist ein beabsichtigtes Feature, um keine Mahlzeiten einzukaufen, die für den heutigen Tag bereits gegessen wurden. Sollte dennoch vorausschauend für den nächsten Tag eingekauft werden, bezieht die Funktion automatisch alle Tage ab morgen mit ein.

### 5.2 Zeitzonendifferenz (UTC vs. Lokale Zeit)
- **Symptom:** Ein im Wochenplan eingetragenes Datum könnte auf Systemen mit stark abweichender Zeitzone verschoben dargestellt werden.
- **Gegenmaßnahme im Code:** Alle Datumswerte werden explizit mit `parseDateInputToUtcDate()` normalisiert und als reines `@db.Date` ohne Uhrzeitkomponente in PostgreSQL gespeichert.

---

## 6. 🛠️ Entwicklungsumgebung & Tooling

### 6.1 Automatische Aktualisierung von `AGENTS.md`
- **Symptom:** Nach dem Start von `next dev` erscheint die Datei `AGENTS.md` gelegentlich als modifiziert in Git.
- **Ursache:** Next.js 16 prüft und aktualisiert automatisch interne Agenten-Richtlinien über `node_modules/next/dist/server/lib/generate-agent-files.js`.
- **Empfehlung:** Den erzeugten Block nicht aus dem Git-Index löschen, sondern wie in den Next.js-Richtlinien vorgesehen im Repository belassen.

---

## 💡 Support & Problem melden

Sollte ein unerwartetes Verhalten auftreten, das in diesem Dokument nicht aufgeführt ist:
1. Entwickler-Konsole des Browsers auf Client-Fehler prüfen.
2. Vercel Function Logs bzw. lokales Terminal auf Server-Action-Fehler prüfen.
3. Bei Bedarf issue im GitHub-Repository anlegen: [https://github.com/jeypack/nextjs-vercel-neon-m4/issues](https://github.com/jeypack/nextjs-vercel-neon-m4/issues).
