set search_path to public;

create table student(

	id SERIAL primary key,
	name varchar(250),
	vorname varchar(250),
	email varchar(250) unique,
	passwort varchar(250)
	
);

select * from student;


create table timetable(

	id 		   serial primary key,
	prof	   varchar(250),
	kurs	   varchar(250),
	tag		   varchar(250),
	zeit       varchar(250),
	raum       varchar(250)

);


create table timetable(
    id         serial primary key,
    userId     int,
    prof       varchar(250),
    kurs       varchar(250),
    tag        varchar(250),
    zeit       varchar(250),
    raum       varchar(250),
	semester   int,
    foreign key (userId) references student(id)
);


select * from timetable;

drop table timetable;

-- SQL Script to create the courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM courses;
drop table courses;

-- Beispielskript zum Einfügen von Fächern in die Tabelle courses
INSERT INTO courses (name, description) VALUES 
('Mathematik für Informatiker 1-', 'Einführung in mathematische Grundlagen wie Lineare Algebra und Analysis für Informatiker. Voraussetzung: Abitur oder vergleichbarer Abschluss mit Mathematikkenntnissen.'),
('Englisch für Informatiker-V', 'Vertiefung der englischen Sprache mit Fokus auf technische und berufliche Kommunikation. Voraussetzung: Grundkenntnisse der englischen Sprache (B1 Niveau).'),
('Java-Programmierung 1-V', 'Grundlagen der objektorientierten Programmierung mit Java, einschließlich Syntax, Klassen, und Methoden. Voraussetzung: Grundkenntnisse in Programmierung.'),
('Schlüsselkompetenzen 1-V', 'Entwicklung von sozialen und methodischen Kompetenzen, wie Kommunikation und Projektarbeit. Keine spezifischen Voraussetzungen erforderlich.'),
('Grundlagen Elektrotechnik 1-V', 'Einführung in die Grundlagen der Elektrotechnik: elektrische Schaltungen, Spannung, Strom, und Widerstände. Voraussetzung: Grundkenntnisse in Mathematik und Physik.'),
('Datenbanken-V', 'Grundlagen von relationalen Datenbanken und SQL. Voraussetzung: Kenntnisse in Programmierung und Mathematik.'),
('Objektorientierte Programmierung-', 'Vertiefung in objektorientierte Programmierung und Design Patterns. Voraussetzung: Java-Programmierung 1 oder vergleichbare Erfahrung.'),
('Objektorientierte Programmierung-V', 'Fortgeschrittene Themen der objektorientierten Programmierung, wie Polymorphismus, Abstraktion, und Schnittstellen. Voraussetzung: Abschluss des Kurses "Objektorientierte Programmierung".'),
('Einf i d moderne Webtechnologie-V', 'Einführung in moderne Webtechnologien wie HTML, CSS und JavaScript sowie grundlegende Konzepte von Webentwicklung. Voraussetzung: Grundkenntnisse in Programmierung.'),
('Betriebssysteme-V', 'Vertiefung in die Konzepte und Funktionalitäten von Betriebssystemen, einschließlich Prozessverwaltung und Speicherverwaltung. Voraussetzung: Grundkenntnisse in Informatik.'),
('Algorithmen und Datenstrukturen-V', 'Konzepte von Algorithmen und Datenstrukturen, einschließlich Sortier- und Suchalgorithmen sowie Listen und Bäume. Voraussetzung: Programmierkenntnisse und mathematisches Grundverständnis.'),
('VHDL-V', 'Einführung in die Hardwarebeschreibungssprache VHDL zur Entwicklung von digitalen Schaltungen. Voraussetzung: Grundlagen Elektrotechnik und Kenntnisse in Digitaltechnik.'),
('Rust-V', 'Einführung in die Programmiersprache Rust und ihre Anwendung zur Entwicklung sicherer und effizienter Software. Voraussetzung: Kenntnisse in einer Programmiersprache wie C oder C++.'),
('Programmieren in C-V', 'Einführung in die Programmierung in C, einschließlich grundlegender Syntax, Speicherverwaltung und Zeigern. Voraussetzung: Grundkenntnisse in Programmierung.'),
('Lokalisation und mobile Applikationen-V', 'Entwicklung von mobilen Applikationen mit Fokus auf Lokalisierungstechnologien. Voraussetzung: Grundkenntnisse in mobile Programmierung und Webtechnologien.'),
('Bildgebende Verfahren und digitale Bildverarbeitung in der Medizin-V', 'Grundlagen bildgebender Verfahren (z.B. MRT, CT) und digitale Bildverarbeitungstechniken in der Medizin. Voraussetzung: Kenntnisse in Mathematik und Informatik.'),
('Projektmanagement-V', 'Einführung in Projektmanagement-Techniken und Tools, einschließlich Planung, Organisation und Umsetzung von Projekten. Voraussetzung: Grundkenntnisse in Informatik und Organisationsmethoden.');

UPDATE courses 
SET description = 'Einführung in mathematische Grundlagen wie Lineare Algebra und Analysis für Informatiker. Voraussetzung: Abitur oder vergleichbarer Abschluss mit Mathematikkenntnissen.' 
WHERE name = 'Mathematik für Informatiker 1-';

UPDATE courses 
SET description = 'Vertiefung der englischen Sprache mit Fokus auf technische und berufliche Kommunikation. Voraussetzung: Grundkenntnisse der englischen Sprache (B1 Niveau).' 
WHERE name = 'Englisch für Informatiker-V';

UPDATE courses 
SET description = 'Grundlagen der objektorientierten Programmierung mit Java, einschließlich Syntax, Klassen, und Methoden. Voraussetzung: Grundkenntnisse in Programmierung.' 
WHERE name = 'Java-Programmierung 1-V';

UPDATE courses 
SET description = 'Entwicklung von sozialen und methodischen Kompetenzen, wie Kommunikation und Projektarbeit. Keine spezifischen Voraussetzungen erforderlich.' 
WHERE name = 'Schlüsselkompetenzen 1-V';

UPDATE courses 
SET description = 'Einführung in die Grundlagen der Elektrotechnik: elektrische Schaltungen, Spannung, Strom, und Widerstände. Voraussetzung: Grundkenntnisse in Mathematik und Physik.' 
WHERE name = 'Grundlagen Elektrotechnik 1-V';

UPDATE courses 
SET description = 'Grundlagen von relationalen Datenbanken und SQL. Voraussetzung: Kenntnisse in Programmierung und Mathematik.' 
WHERE name = 'Datenbanken-V';

UPDATE courses 
SET description = 'Vertiefung in objektorientierte Programmierung und Design Patterns. Voraussetzung: Java-Programmierung 1 oder vergleichbare Erfahrung.' 
WHERE name = 'Objektorientierte Programmierung-';

UPDATE courses 
SET description = 'Fortgeschrittene Themen der objektorientierten Programmierung, wie Polymorphismus, Abstraktion, und Schnittstellen. Voraussetzung: Abschluss des Kurses "Objektorientierte Programmierung".' 
WHERE name = 'Objektorientierte Programmierung-V';

UPDATE courses 
SET description = 'Einführung in moderne Webtechnologien wie HTML, CSS und JavaScript sowie grundlegende Konzepte von Webentwicklung. Voraussetzung: Grundkenntnisse in Programmierung.' 
WHERE name = 'Einf i d moderne Webtechnologie-V';

UPDATE courses 
SET description = 'Vertiefung in die Konzepte und Funktionalitäten von Betriebssystemen, einschließlich Prozessverwaltung und Speicherverwaltung. Voraussetzung: Grundkenntnisse in Informatik.' 
WHERE name = 'Betriebssysteme-V';

UPDATE courses 
SET description = 'Konzepte von Algorithmen und Datenstrukturen, einschließlich Sortier- und Suchalgorithmen sowie Listen und Bäume. Voraussetzung: Programmierkenntnisse und mathematisches Grundverständnis.' 
WHERE name = 'Algorithmen und Datenstrukturen-V';

UPDATE courses 
SET description = 'Einführung in die Hardwarebeschreibungssprache VHDL zur Entwicklung von digitalen Schaltungen. Voraussetzung: Grundlagen Elektrotechnik und Kenntnisse in Digitaltechnik.' 
WHERE name = 'VHDL-V';

UPDATE courses 
SET description = 'Einführung in die Programmiersprache Rust und ihre Anwendung zur Entwicklung sicherer und effizienter Software. Voraussetzung: Kenntnisse in einer Programmiersprache wie C oder C++.' 
WHERE name = 'Rust-V';

UPDATE courses 
SET description = 'Einführung in die Programmierung in C, einschließlich grundlegender Syntax, Speicherverwaltung und Zeigern. Voraussetzung: Grundkenntnisse in Programmierung.' 
WHERE name = 'Programmieren in C-V';

UPDATE courses 
SET description = 'Entwicklung von mobilen Applikationen mit Fokus auf Lokalisierungstechnologien. Voraussetzung: Grundkenntnisse in mobile Programmierung und Webtechnologien.' 
WHERE name = 'Lokalisation und mobile Applikationen-V';

UPDATE courses 
SET description = 'Grundlagen bildgebender Verfahren (z.B. MRT, CT) und digitale Bildverarbeitungstechniken in der Medizin. Voraussetzung: Kenntnisse in Mathematik und Informatik.' 
WHERE name = 'Bildgebende Verf. und dig. Bildv. in der Medizin-V';

UPDATE courses 
SET description = 'Einführung in Projektmanagement-Techniken und Tools, einschließlich Planung, Organisation und Umsetzung von Projekten. Voraussetzung: Grundkenntnisse in Informatik und Organisationsmethoden.' 
WHERE name = 'Projektmanagement-V';


CREATE TABLE timetable (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL,
    prof VARCHAR(255) NOT NULL,
    kurs_id INTEGER REFERENCES courses(id),
    tag VARCHAR(50),
    zeit VARCHAR(50),
    raum VARCHAR(255),
    semester INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


