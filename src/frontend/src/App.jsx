import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";

import AuthPage from "./views/security/AuthPage";
import RecipesList from "./views/recipes/index";
import RecipeForm from "./views/recipes/form";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const [, payloadEncoded] = token.split(".");
        const userDecoded = JSON.parse(atob(payloadEncoded));
        setUser(userDecoded);
      } catch (e) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  }

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">APP CUISINE</Link>
        <div>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <span style={{ fontSize: "0.9rem", color: "#666" }}>{user.email}</span>
              <button onClick={handleLogout} className="btn-logout">Déconnexion</button>
            </div>
          ) : (
            <Link to="/auth"><button className="btn-nav">Connexion</button></Link>
          )}
        </div>
      </nav>

      <div className="main-wrapper">
        <Routes>
          
          <Route path="/" element={
            <div style={{ textAlign: "center", marginTop: "100px" }}>
              <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "var(--secondary)" }}>Gérez vos recettes simplement.</h1>
              {!user ? (
                <Link to="/auth"><button className="btn-nav" style={{ padding: "15px 40px", fontSize: "1.1rem" }}>Commencer maintenant</button></Link>
              ) : (
                <Link to="/recipes"><button className="btn-nav" style={{ background: "var(--success)", padding: "15px 40px" }}>Mes Recettes</button></Link>
              )}
            </div>
          } />

          <Route path="/auth" element={
            !user ? (
              <div className="auth-wrapper">
                <AuthPage setUser={setUser} />
              </div>
            ) : <Navigate to="/recipes" />
          } />
        
          <Route path="/recipes" element={
            user ? (
              <div className="content-container">
                <RecipesList />
              </div>
            ) : <Navigate to="/auth" />
          } />
          
          <Route path="/recipes/new" element={
            user ? (
              <div className="content-container">
                <RecipeForm />
              </div>
            ) : <Navigate to="/auth" />
          } />
          
          <Route path="/recipes/:id/edit" element={
            user ? (
              <div className="content-container">
                <RecipeForm />
              </div>
            ) : <Navigate to="/auth" />
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;