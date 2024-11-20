import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './komponenten/Header';
import Footer from './komponenten/Footer';
import Auswahl from './komponenten/Auswahl';
import Test from './komponenten/Test';
import Steps from './komponenten/Steps';
import Regester from './komponenten/Regester'; // Stellen Sie sicher, dass der Dateiname korrekt ist
import Login from './komponenten/Login';
import FileUpload from './komponenten/FileUpload';
import Visualisierung from './komponenten/Visualisierung';
import Course from './komponenten/Course';
import Praktikum from './komponenten/Praktikum';

function App() {
  const location = useLocation();
  const isRegisterPage = location.pathname === '/regester' || location.pathname==='/';
  

  return (
    <div className="App">
      {!isRegisterPage && (
        <header className="App-header">
          <Header />
        </header>
      )}
      <main>
        <Routes>

          <Route exact path="/regester" element={<Regester />} />
          <Route path="/" element={<Login />}/>
          <Route path="/steps" element={<Steps />} />
          <Route path="/auswahl" element={<Auswahl />} />
          <Route path="/fileUpload" element={<FileUpload />} />
          <Route path="/test" element={<Test />} />
          <Route path="/visualisierung" element={<Visualisierung />} />
          <Route path="/meine-faecher" element={<Course />} />
          <Route path="/Praktikum" element={<Praktikum />} />
        
        </Routes>
      </main>
      {!isRegisterPage && (
        <footer>
          <Footer />
        </footer>
      )}
    </div>
  );
}

export default App;
