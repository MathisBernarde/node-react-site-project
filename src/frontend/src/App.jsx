import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Button from "./components/Button";
import RegisterForm from "./views/security/register-form";
import LoginForm from "./views/security/login-form";
import CategoryList from "./views/categories";
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
        console.error("Token invalide", e);
        localStorage.removeItem("token");
      }
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/"; // accueil
  }

  return (
    <BrowserRouter>
      <div className="App">
        {/* NAVBAR */}
        <nav style={{ padding: "20px", borderBottom: "1px solid #ccc", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Link to="/" style={{ marginRight: "15px", fontWeight: "bold" }}>Accueil</Link>
            {user && (
              <>
                <Link to="/categories" style={{ marginRight: "15px" }}>Catégories</Link>
                <Link to="/recipes" style={{ marginRight: "15px" }}>Recettes</Link>
              </>
            )}
          </div>
          <div>
            {user ? (
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                Bonjour, {user.username || user.email}
                <Button variant="delete" title="Déconnexion" onClick={handleLogout} />
              </span>
            ) : (
              <Link to="/login">Se connecter</Link>
            )}
          </div>
        </nav>

        {/* LOGOS */}
        <div style={{ textAlign: "center" }}>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>

        {/* GESTION DES ROUTES */}
        <Routes>
          {/* Route d'accueil */}
          <Route path="/" element={
            <div style={{ textAlign: "center" }}>
              <h1>Bienvenue sur l'App Recettes</h1>
              {!user && <p>Connectez-vous pour gérer vos recettes !</p>}
            </div>
          } />

          {/* Routes Auth */}
          <Route path="/login" element={!user ? <LoginForm setUser={setUser} /> : <Navigate to="/recipes" />} />
          <Route path="/register" element={!user ? <RegisterForm /> : <Navigate to="/recipes" />} />

          {/* Routes Catégories */}
          <Route path="/categories" element={user ? <CategoryList /> : <Navigate to="/login" />} />
          <Route path="/recipes" element={user ? <RecipesList /> : <Navigate to="/login" />} />
          <Route path="/recipes/new" element={user ? <RecipeForm /> : <Navigate to="/login" />} />
          <Route path="/recipes/:id/edit" element={user ? <RecipeForm /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;