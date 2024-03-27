// App.js
import Footer from "./footer"
import React, { useEffect, useState } from 'react';
import Chat from './Chat';
import Login from './Logins';
import Register from './Register';
import { BrowserRouter as Router, Routes, Route, Link, redirect } from 'react-router-dom';
import "./Topbar.css"
function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
    redirect("/")
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('token');
  };
  useEffect(()=>{
  if (localStorage.getItem("token")){
    setLoggedIn(true);
  }
  })
  return (
    <div className="App">
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {!loggedIn && (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
            {loggedIn && (
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </nav>

        <Routes>
          <Route
            exact
            path="/"
            element={loggedIn ? <Chat /> : <Login onLogin={handleLogin} />}
          />
          <Route exact path="/login" element={<Login onLogin={handleLogin} />} />
          <Route exact path="/register" element={<Register />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
