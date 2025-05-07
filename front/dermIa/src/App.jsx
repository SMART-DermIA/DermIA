
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './components/navBar/navbar'
import Footer from './components/footer/footer'
import HomePage from './home/home'
import Login from './login'
import Register from './register'
import UserAccueil from './userAccueil/userAccueil'
import Historique from './historique/historique';


function App() {
  return (
  <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/userAccueil" element={<UserAccueil/>}/>
        <Route path="/historique" element={<Historique/>}/>
      </Routes>
    </Router>
  </div>
  );
}

export default App;