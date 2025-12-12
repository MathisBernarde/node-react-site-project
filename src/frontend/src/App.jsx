import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";
import LoginForm from "./views/security/login-form";
import RegisterForm from "./views/security/register-form";
import ShoppingList from "./views/ShoppingList";
import RecipeList from "./views/recipes/index";
import RecipeForm from "./views/recipes/form";
import RecipeDetail from "./views/recipes/detail";

import Button from "./components/Button";

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) decodeAndSetUser(token);
  }, []);

  const decodeAndSetUser = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch (e) {
      localStorage.removeItem("token");
    }
  };

  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    decodeAndSetUser(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <BrowserRouter>
      <div className="container" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      
        {user && (
          <nav style={{ 
            display: "flex", justifyContent: "space-between", alignItems: "center", 
            marginBottom: "20px", padding: "10px", backgroundColor: "#333", color: "white", borderRadius: "8px" 
          }}>
            <div style={{ display: "flex", gap: "20px" }}>
              <Link to="/shopping-lists" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Courses</Link>
              <Link to="/recipes" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Recettes</Link>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <span>Bonjour, {user.login || user.username}</span>
              <Button onClick={handleLogout} title="Déconnexion" style={{ background: "red", color: "white", padding: "5px 10px" }} />
            </div>
          </nav>
        )}
        <Routes>
          {!user ? (
            <>
              <Route path="/" element={
                <div style={{ display: 'flex', gap: '50px', justifyContent: 'center', marginTop: '50px' }}>
                  <LoginForm onLogin={handleLoginSuccess} />
                  <div style={{borderLeft: '1px solid #ccc'}}></div>
                  <RegisterForm />
                </div>
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            /* if connected = acces fonctionnaliter*/
            <>
              <Route path="/" element={<Navigate to="/shopping-lists" />} />
              <Route path="/shopping-lists" element={<ShoppingList />} />
              <Route path="/recipes" element={<RecipeList />} />
              <Route path="/recipes/new" element={<RecipeForm />} />
              <Route path="/recipes/:id/edit" element={<RecipeForm />} />
              <Route path="/recipes/:id" element={<RecipeDetail />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;