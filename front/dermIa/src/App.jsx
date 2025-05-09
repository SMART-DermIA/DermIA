
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from './home/home';
import UserAccueil from './userAccueil/userAccueil';
import Historique from './historique/historique';
import Album from './album/album';

import './services/i18n'; 
import './App.css';

function App() {
  return (
  <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/userAccueil" element={<UserAccueil/>}/>
        <Route path="/historique" element={<Historique/>}/>
        <Route path="/historique/:id" element={<Album />}/>
      </Routes>
    </Router>
  </div>
  );
}

export default App;