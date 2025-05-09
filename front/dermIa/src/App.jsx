
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './home/home'
import UserAccueil from './userAccueil/userAccueil'
import Historique from './historique/historique';
import './services/i18n'; 


function App() {
  return (
  <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/userAccueil" element={<UserAccueil/>}/>
        <Route path="/historique" element={<Historique/>}/>
      </Routes>
    </Router>
  </div>
  );
}

export default App;