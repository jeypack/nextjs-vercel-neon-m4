# 📖 Abkürzungsverzeichnis & Shortcuts (Glossar)

> Dieses Verzeichnis enthält alle im Projekt (*README.md*, *docs/project-overview.md*, *docs/architecture.md*) verwendeten technischen Abkürzungen, Architektur-Muster, Protokolle und Akronyme mit einer kurzen Erklärung.

---

## 1. Architektur, Software-Design & Prinzipien

- **API** – Application Programming Interface (Programmierschnittstelle zur standardisierten Kommunikation zwischen Softwarekomponenten)
- **CRUD** – Create, Read, Update, Delete (Die vier Grundoperationen der persistenten Datenverarbeitung)
- **DDD** – Domain-Driven Design (Architekturansatz, der den fachlichen Kern und die Geschäftsdomäne in den Mittelpunkt des Entwurfs stellt)
- **DRY** – Don't Repeat Yourself (Entwurfsprinzip: Vermeide redundante Code- und Logik-Duplikate)
- **KISS** – Keep It Simple, Stupid (Entwurfsprinzip: Halte Implementierungen so einfach und verständlich wie möglich)
- **MVC** – Model-View-Controller (Architekturmuster zur Trennung von Datenmodell, Benutzeroberfläche und Steuerungslogik)
- **ORM** – Object-Relational Mapping (Abstraktionstechnik wie Prisma, um objektorientierten Code typsicher mit relationalen Tabellen zu verknüpfen)
- **REST** – Representational State Transfer (Zustandsloser Architekturstil für Webservices über Standard-HTTP-Methoden)
- **RPC** – Remote Procedure Call (Netzwerkprotokoll/Muster, bei dem eine Prozedur auf einem entfernten Server wie eine lokale Funktion aufgerufen wird – z. B. Next.js Server Actions)
- **SOLID** – Fünf Grundprinzipien des objektorientierten Software-Designs (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion)
- **WET** – Write Everything Twice / We Enjoy Typing (Scherzhaftes Gegenstück zu DRY für noch nicht abstrahierten, mehrfach vorhandenen Code)
- **YAGNI** – You Aren't Gonna Need It (Entwurfsprinzip: Implementiere Funktionen erst dann, wenn sie tatsächlich gebraucht werden, nicht auf Vorrat)

---

## 2. Frontend-, Web- & Rendering-Technologien

- **CSS** – Cascading Style Sheets (Stylesheet-Sprache zur visuellen Gestaltung und Formatierung von Webinhalten, im Projekt mit Tailwind CSS v4)
- **DOM** – Document Object Model (Strukturierte, baumartige Objektrepräsentation eines HTML-Dokuments im Browser)
- **FOUC** – Flash of Unstyled Content (Kurzes störendes Aufblitzen unformatierter Inhalte oder falscher Farbthemen beim initialen Laden der Webseite)
- **HTML** – Hypertext Markup Language (Standard-Auszeichnungssprache für die Grundstruktur von Dokumenten im Web)
- **JS** – JavaScript (Dynamische Standard-Skriptsprache für client- und serverseitige Webentwicklung)
- **RSC** – React Server Components (React 19-Komponenten, die ausschließlich auf dem Server ausgeführt werden und kein JavaScript-Bundle an den Client senden)
- **SSR** – Server-Side Rendering (Serverseitige Generierung des vollständigen HTML-Markups vor der Übertragung an den Webbrowser)
- **TS** – TypeScript (Streng typisierte Erweiterung von JavaScript für durchgängige Code-Sicherheit und bessere Entwickler-Ergonomie)
- **UI** – User Interface (Visuelle Benutzeroberfläche, über die Benutzer mit der Anwendung interagieren)
- **UX** – User Experience (Gesamte Nutzungserfahrung, Wahrnehmung und Benutzerfreundlichkeit einer Software)

---

## 3. Entwicklung, Prozesse, Tools & Methoden

- **CI/CD** – Continuous Integration / Continuous Delivery / Deployment (Automatisierte Pipelines zum Testen, Erstellen und Ausrollen von Code)
- **CLI** – Command Line Interface (Befehlszeilenschnittstelle im Terminal, z. B. `prisma`, `next` oder `npm`)
- **IDE** – Integrated Development Environment (Integrierte Entwicklungsumgebung wie Visual Studio Code, Cursor oder IntelliJ)
- **MVP** – Minimum Viable Product (Die kleinste funktionale Produktversion, die echten Nutzen stiftet und schnelles Feedback ermöglicht)
- **PR** – Pull Request (Code-Review-Anfrage zur Zusammenführung eines Entwicklungs-Branches in den Hauptzweig eines Repositories)
- **QA** – Quality Assurance (Qualitätssicherung durch automatisierte Tests, statische Codeanalyse und manuelles Testen)
- **SDK** – Software Development Kit (Sammlung von Entwickler-Werkzeugen, Bibliotheken und Schnittstellen, z. B. das Google GenAI SDK `@google/genai`)
- **TDD** – Test-Driven Development (Testgetriebene Entwicklung, bei der automatisierte Tests vor dem produktiven Code geschrieben werden)
- **WIP** – Work in Progress (Kennzeichnung für Aufgaben oder Code, der sich aktuell noch in der Bearbeitung befindet)

---

## 4. Datenbanken, Datenstrukturen & Datenmodelle

- **BLOB** – Binary Large Object (Datentyp bzw. Cloud-Speicher für große, unstrukturierte Binärdaten wie Avatare oder Bilddateien in Vercel Blob)
- **CUID** – Collision-resistant Unique Identifier (Kollisionsresistente, kompakte Kennung für verteilte Systeme, im Projekt für Session-IDs verwendet)
- **DB** – Database (Datenbank – System zur strukturierten, elektronischen Speicherung und Verwaltung von Datenbeständen)
- **DDL** – Data Definition Language (Teilmenge von SQL-Befehlen zur Strukturierung und Änderung des Schemas wie `CREATE`, `ALTER`, `DROP`)
- **ERD** – Entity-Relationship-Diagramm (Grafische Darstellung aller Entitäten/Tabellen, Attributen und deren Beziehungen untereinander)
- **FK** – Foreign Key (Fremdschlüssel – Spalte, die auf den Primärschlüssel einer anderen Tabelle verweist, um Relationen herzustellen)
- **JSON** – JavaScript Object Notation (Weit verbreitetes, leichtgewichtiges textbasiertes Format zum Austausch strukturierter Daten)
- **PG** – PostgreSQL (Leistungsstarkes, relationales Open-Source-Datenbanksystem, im Projekt als Neon Serverless Postgres betrieben)
- **PK** – Primary Key (Primärschlüssel – Eindeutiger Identifikator für jeden einzelnen Datensatz einer relationalen Tabelle)
- **SQL** – Structured Query Language (Standardisierte Abfragesprache für relationale Datenbanken)
- **UK** – Unique Key (Eindeutiger Schlüssel / Constraint, der verhindert, dass Werte in einer Spalte mehrfach vorkommen)
- **UUID** – Universally Unique Identifier (Standardisierter 128-Bit-Bezeichner zur global eindeutigen Kennzeichnung von Objekten)
- **XML** – Extensible Markup Language (Hierarchische Auszeichnungssprache für den plattformunabhängigen Austausch von Daten)

---

## 5. Netzwerke, Protokolle & Cloud-Infrastruktur

- **CDN** – Content Delivery Network (Geografisch verteiltes Servernetzwerk zur latenzarmen Zwischenspeicherung und Auslieferung von Assets an Edge-Standorten)
- **DNS** – Domain Name System (Hierarchischer Verzeichnisdienst, der menschenlesbare Domainnamen in maschinenlesbare IP-Adressen auflöst)
- **HTTP** – Hypertext Transfer Protocol (Zustandsloses Netzwerkprotokoll zur Übertragung von Webseiten und API-Anfragen im World Wide Web)
- **HTTPS** – Hypertext Transfer Protocol Secure (Verschlüsselte und abhörsichere Variante von HTTP unter Verwendung von TLS/SSL)
- **IP** – Internet Protocol (Grundlegendes Netzwerkprotokoll zur Adressierung und Paketvermittlung in Computernetzwerken)
- **SSL / TLS** – Secure Sockets Layer / Transport Layer Security (Kryptografische Protokolle zur sicheren, authentifizierten Datenübertragung im Internet)
- **TCP** – Transmission Control Protocol (Zuverlässiges, verbindungsorientiertes Transportprotokoll, das Paketverluste ausgleicht – Basis u. a. für direkte Postgres-Verbindungen)
- **TCP/IP** – Transmission Control Protocol / Internet Protocol (Die zentrale Protokollfamilie, auf der die gesamte Kommunikation des Internets aufbaut)
- **URL** – Uniform Resource Locator (Standardisierte Internetadresse zur eindeutigen Lokalisierung einer Web-Ressource)

---

## 6. Sicherheit, Hardware & Künstliche Intelligenz

- **AI / KI** – Artificial Intelligence / Künstliche Intelligenz (Algorithmen und Sprachmodelle zur intelligenten Informationsverarbeitung, im Projekt via Google Gemini)
- **ASIC** – Application-Specific Integrated Circuit (Spezialisierter Hardware-Chip; Argon2id ist gegen hardwarebeschleunigte Brute-Force-Angriffe via ASICs gehärtet)
- **GPU** – Graphics Processing Unit (Grafikprozessor mit hoher Parallelrechenleistung; moderne Passworthash-Verfahren minimieren die GPU-Angriffsfläche)
- **MIME** – Multipurpose Internet Mail Extensions (Standardisierter Medientyp-Katalog zur Identifikation von Dateiformaten im Web wie `image/jpeg` oder `image/png`)
- **PHP** – Hypertext Preprocessor (Weit verbreitete serverseitige Skriptsprache; im Projekt im Kontext der Magic-Bytes-Prüfung gegen File-Upload-Schadcode erwähnt)

---

## 7. Dateiformate & Medien

- **JPEG / JPG** – Joint Photographic Experts Group (Verbreitetes, verlustbehaftet komprimiertes Bildformat, ideal für Fotos)
- **PNG** – Portable Network Graphics (Verlustfreies Rastergrafikformat mit voller Unterstützung von Alphakanal-Transparenz)
- **RIFF** – Resource Interchange File Format (Universelles Containerformat, das als Basis für WebP-, AVI- und WAV-Dateien dient)
- **WebP** – Web Picture Format (Modernes Bildformat von Google für das Web mit überlegener Kompression bei hoher visueller Qualität)

---

## 8. Kulinarische Mengeneinheiten (Fachdomäne)

- **EL** – Esslöffel (Kulinarische Mengeneinheit im Vorrats- und Rezeptsystem, entspricht ca. 15 ml)
- **TL** – Teelöffel (Kulinarische Mengeneinheit im Vorrats- und Rezeptsystem, entspricht ca. 5 ml)
