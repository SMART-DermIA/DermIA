
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from './home/home';
import UserAccueil from './userAccueil/userAccueil';
import Historique from './historique/historique';
import Album from './album/album';

import './services/i18n'; 
import './App.css';
import {AuthProvider} from "./auth/authContext.jsx";

function App() {
  return (
  <div className="App">
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/userAccueil" element={<UserAccueil/>}/>
        <Route path="/historique" element={<Historique/>}/>
        <Route path="/historique/:id" element={<Album />}/>
      </Routes>
    </Router>
    </AuthProvider>
  </div>
  );
}

export default App;