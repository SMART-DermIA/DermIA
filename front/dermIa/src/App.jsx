
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './components/navBar/navbar'
import Footer from './components/footer/footer'
import HomePage from './home/home'
import Login from './login/login'
import Register from './register/register'
import UserAccueil from './userAccueil/userAccueil'


function App() {
  return (
  <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/userAccueil" element={<UserAccueil/>}/>
      </Routes>
    </Router>
  </div>
  );
}

export default App;