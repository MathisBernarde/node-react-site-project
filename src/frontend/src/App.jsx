import { useState, useEffect } from "react";
import "./App.css";
import Button from "./components/Button";
import RegisterForm from "./views/security/register-form";
import LoginForm from "./views/security/login-form";
import ShoppingList from "./views/ShoppingList";

function App() {
  const [user, setUser] = useState(null);

  // 1. Au chargement : On vérifie si on est déjà connecté
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      decodeAndSetUser(token);
    }
  }, []);

  // Fonction pour décoder le token (partie payload)
  const decodeAndSetUser = (token) => {
    try {
      const [, payloadEncoded] = token.split(".");
      const payload = JSON.parse(atob(payloadEncoded));
      setUser(payload);
    } catch (e) {
      console.error("Token invalide", e);
      localStorage.removeItem("token");
    }
  };

  // 2. Fonction appelée QUAND on se connecte via le formulaire
  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token); // On sauvegarde
    decodeAndSetUser(token); // On met à jour l'état User pour changer l'écran
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="app-container" style={{ padding: '20px' }}>
      {!user ? (
        // --- ÉCRAN NON CONNECTÉ ---
        <div style={{ display: 'flex', justifyContent: 'center', gap: '50px' }}>
          <div>
            <h2>Connexion</h2>
            {/* On passe la fonction handleLoginSuccess au formulaire */}
            <LoginForm onLogin={handleLoginSuccess} />
          </div>
          <div style={{ borderLeft: '1px solid #ccc', paddingLeft: '50px' }}>
            <h2>Inscription</h2>
            <RegisterForm />
          </div>
        </div>
      ) : (
        // --- ÉCRAN CONNECTÉ ---
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>Bonjour {user.username || user.login || "Chef"} !</h1>
            <Button onClick={handleLogout} style={{ background: 'red', color: 'white' }}>
                Se déconnecter
            </Button>
          </div>
          
          <hr />
          
          {/* Tes composants ici */}
          <ShoppingList />
        </div>
      )}
    </div>
  );
}

export default App;