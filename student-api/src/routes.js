const express = require('express');
const router = express.Router();
const pool = require('./db'); // Verbindung zur Datenbank
const multer = require('multer');
const fs = require('fs');

// Middleware for file upload
const upload = multer({ dest: 'uploads/' });

// Route to get all courses
router.get('/courses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses');
    res.json(result.rows);
  } catch (err) {
    console.error('Fehler beim Abrufen der Kurse:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route to add a new course
router.post('/courses', async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    console.log('Fehler: Kursname ist erforderlich');
    return res.status(400).json({ error: 'Course name is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO courses (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING RETURNING *',
      [name, description || 'Keine Beschreibung verfügbar']
    );

    if (result.rows.length === 0) {
      console.log(`Der Kurs "${name}" existiert bereits.`);
      return res.status(409).json({ message: 'Course already exists' });
    }

    res.status(201).json({ message: 'Course added successfully', course: result.rows[0] });
  } catch (err) {
    console.error('Fehler beim Hinzufügen des Kurses:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route to get all timetable entries for a specific user
router.get('/timetable', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const result = await pool.query(
      `SELECT timetable.id, timetable.userid, timetable.prof, timetable.tag, timetable.zeit, timetable.raum, 
              timetable.semester, courses.name AS kurs
       FROM timetable 
       JOIN courses ON timetable.kurs_id = courses.id
       WHERE timetable.userid = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Fehler beim Abrufen der Stundenpläne:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route for uploading timetable files
router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const userId = req.body.userId;
  const semester = req.body.semester;

  if (!file) {
    console.log('Fehler: Keine Datei hochgeladen');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (!userId) {
    console.log('Fehler: Benutzer-ID ist erforderlich');
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (!semester) {
    console.log('Fehler: Semester ist erforderlich');
    return res.status(400).json({ error: 'Semester is required' });
  }

  fs.readFile(file.path, 'utf8', async (err, data) => {
    if (err) {
      console.error('Fehler beim Lesen der Datei:', err);
      return res.status(500).json({ error: 'Error reading file' });
    }

    try {
      const jsonData = JSON.parse(data);
      const timetable = jsonData.timetable;

      for (const entry of timetable) {
        const { Instructor, Course, Day, Time, Room } = entry;

        // Speichere den Kursnamen in der 'courses'-Tabelle, falls er noch nicht existiert
        const courseResult = await pool.query(
          'INSERT INTO courses (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING *',
          [Course]
        );

        // Hole die Kurs-ID, entweder aus dem Insert oder durch erneutes Abrufen
        const courseId = courseResult.rows[0]?.id || 
                         (await pool.query('SELECT id FROM courses WHERE name = $1', [Course])).rows[0].id;

        // Speichere den Eintrag in der timetable-Tabelle
        await pool.query(
          'INSERT INTO timetable (userId, prof, kurs_id, tag, zeit, raum, semester) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [userId, Instructor, courseId, Day, Time, Room, semester]
        );
      }

      console.log('Datei erfolgreich verarbeitet und Stundenplan gespeichert.');
      res.json({ message: 'File uploaded and data saved successfully' });
    } catch (error) {
      console.error('Fehler beim Parsen des JSON oder Speichern der Daten:', error);
      res.status(500).json({ error: 'Error parsing JSON or saving data' });
    }
  });
});

// Route to get selected courses for a specific user
router.get('/selected-courses', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const result = await pool.query(
      `SELECT courses.id, courses.name, courses.description
       FROM timetable
       JOIN courses ON timetable.kurs_id = courses.id
       WHERE timetable.userid = $1
       GROUP BY courses.id, courses.name, courses.description`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Fehler beim Abrufen der ausgewählten Kurse:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route for student login
router.post('/login', async (req, res) => {
  const { email, passwort } = req.body;

  if (!email || !passwort) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM student WHERE email = $1 AND passwort = $2', [email, passwort]);
    const user = result.rows[0];

    if (user) {
      res.json({ message: 'Login erfolgreich', userId: user.id });
    } else {
      res.status(401).json({ error: 'Ungültige Anmeldeinformationen' });
    }
  } catch (err) {
    console.error('Fehler beim Login:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route for student registration
router.post('/students', async (req, res) => {
  const { name, vorname, email, passwort } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO student (name, vorname, email, passwort) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, vorname, email, passwort]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Fehler beim Erstellen des Benutzers:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route to manage praktikum entries
router.get('/praktikum', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM praktikum');
    res.json(result.rows);
  } catch (err) {
    console.error('Error retrieving praktikum:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/praktikum/user', async (req, res) => {
  const { student_id } = req.query;

  if (!student_id) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  try {
    const result = await pool.query('SELECT * FROM praktikum WHERE student_id = $1', [student_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error retrieving praktikum for user:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/praktikum', async (req, res) => {
  const { student_id, kurs, datum, uhrzeit, beschreibung, raum } = req.body;

  if (!student_id || !kurs || !datum || !uhrzeit || !beschreibung || !raum) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO praktikum (student_id, kurs, datum, uhrzeit, beschreibung, raum) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [student_id, kurs, datum, uhrzeit, beschreibung, raum]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error creating praktikum:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/praktikum/:id', async (req, res) => {
  const { id } = req.params;
  const { student_id, kurs, datum, uhrzeit, beschreibung, raum } = req.body;

  if (!student_id || !kurs || !datum || !uhrzeit || !beschreibung || !raum) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE praktikum SET student_id = $1, kurs = $2, datum = $3, uhrzeit = $4, beschreibung = $5, raum = $6 WHERE id = $7 RETURNING *',
      [student_id, kurs, datum, uhrzeit, beschreibung, raum, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Praktikum entry not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating praktikum:', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/praktikum/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM praktikum WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Praktikum entry not found' });
    }
    res.json({ message: 'Praktikum entry deleted successfully', deletedEntry: result.rows[0] });
  } catch (err) {
    console.error('Error deleting praktikum:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
