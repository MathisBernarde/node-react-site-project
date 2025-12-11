import { useState } from "react";
import Button from "../../components/Button";
import api from "../../services/api"; // On utilise ton instance API configurée

// Note: On reçoit 'onLogin' en prop, pas 'setUser'
export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(false);

    try {
      // 1. On utilise 'api' (axios) au lieu de 'fetch'
      // Cela permet d'utiliser la bonne URL de base automatiquement
      const response = await api.post("/login", {
        email: email,
        password: password
      });

      // 2. Axios renvoie la réponse dans .data
      const token = response.data.token;

      // 3. On remonte le token au parent (App.jsx) qui va gérer le localStorage et l'affichage
      if (onLogin) {
        onLogin(token);
      }
      
    } catch (e) {
      // Si erreur 401 ou autre
      console.error(e);
      setError(true);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {error && <p style={{ color: "red" }}>Email ou mot de passe incorrect</p>}
      
      <label>Email</label>
      <input 
        name="email" 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <label>Password</label>
      <input 
        name="password" 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <Button component="input" type="submit" title="Se connecter" />
    </form>
  );
}