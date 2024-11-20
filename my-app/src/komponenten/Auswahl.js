import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Importiere autoTable für Tabellen
import './Auswahl.css';

const Header = () => {
  const [timetable, setTimetable] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // Verwende useNavigate aus react-router-dom

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);

    if (storedUserId) {
      fetchTimetable(storedUserId);
    }
  }, []);

  const fetchTimetable = (userId) => {
    fetch(`http://localhost:3000/api/timetable?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => setTimetable(data))
      .catch((error) => console.error('Error fetching timetable:', error));
  };

  const deleteTimetableEntry = (timetableId) => {
    fetch('http://localhost:3000/api/timetable', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, timetableId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setTimetable(timetable.filter((entry) => entry.id !== timetableId));
        }
      })
      .catch((error) => console.error('Error deleting timetable entry:', error));
  };

  const toggleDeleteButtons = () => {
    setShowDeleteButtons(!showDeleteButtons);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const downloadPdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Stundenplan', 10, 10);

    const tableData = timeslots.map((time) => {
      const row = [time];
      days.forEach((day) => {
        const entry = timetable.find((item) => item.tag === day && item.zeit === time);
        const content = entry ? `${entry.kurs} (${entry.raum})` : '-';
        row.push(content);
      });
      return row;
    });

    doc.autoTable({
      head: [['Time', ...days]],
      body: tableData,
      startY: 20,
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 35 },
        2: { cellWidth: 35 },
        3: { cellWidth: 35 },
        4: { cellWidth: 35 },
        5: { cellWidth: 35 },
      },
      theme: 'grid',
    });

    doc.save('Stundenplan.pdf');
  };

  const timeslots = [
    "08:00-09:00",
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-13:00",
    "13:00-14:00",
    "14:00-15:00",
    "15:00-16:00",
    "16:00-17:00",
    "17:00-18:00",
    "18:00-19:00",
    "19:00-20:00",
  ];

  const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];

  const renderTableData = () => {
    return timeslots.map((time) => (
      <tr key={time}>
        <td className="time-slot">{time}</td>
        {days.map((day) => {
          const entries = timetable.filter((item) => item.tag === day && item.zeit === time);
  
          return (
            <td key={day}>
              {entries.length > 0 ? (
                <div className="multiple-entries">
                  {entries.map((entry, index) => (
                    <div
                      key={index}
                      className={`entry-color-${index % 5}`}
                      style={{ padding: '5px', marginBottom: '5px' }}
                    >
                      <div>{entry.kurs}</div>
                      <div>{entry.prof}</div>
                      <div>{entry.raum}</div>
                      {showDeleteButtons && (
                        <button
                          className="delete-button"
                          onClick={() => deleteTimetableEntry(entry.id)}
                        >
                          Löschen
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-slot">-</div>
              )}
            </td>
          );
        })}
      </tr>
    ));
  };

  function redirectToTimetable() {
    navigate('/fileUpload');
  }

  function redirectToVisualization() {
    navigate('/visualisierung');
  }

  const redirectToMeineFaecher = () => {
    navigate('/meine-faecher');
  };

  const redirectToPraktikum = () => {
    navigate('/praktikum'); // Neue Funktion für die Navigation zur Praktikum-Seite
  };

  return (
    <main id="mainAuswahl">
      <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <button className="toggle-delete-button" onClick={toggleDeleteButtons}>
          {showDeleteButtons ? 'Löschen ausblenden' : 'Löschen anzeigen'}
        </button>
        <button className="uploadJsonButton1" onClick={redirectToTimetable}>
          HTML-Datei hochladen
        </button>
        <button className="download-pdf-button" onClick={downloadPdf}>
          Plan als PDF herunterladen
        </button>
        <button className="visualize-button" onClick={redirectToVisualization}>
          Zur Visualisierung
        </button>
        <button className="course-button" onClick={redirectToMeineFaecher}>
          Module Infos
        </button>
        <button className="praktikum-button" onClick={redirectToPraktikum}>
          Praktikum
        </button>
      </div>

      <div className={`content ${menuOpen ? 'shifted' : ''}`}>
        <div className="burger-menu" onClick={toggleMenu}>
          <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
          <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
          <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Time</th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>{renderTableData()}</tbody>
        </table>
      </div>
    </main>
  );
};

export default Header;
