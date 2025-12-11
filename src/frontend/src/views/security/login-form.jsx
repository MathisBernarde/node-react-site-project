import { useState } from "react";
import Button from "../../components/Button";
import api from "../../services/api"; 

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(false);

    try {
      const response = await api.post("/login", {
        email: email,
        password: password
      });
      const token = response.data.token;
      if (onLogin) {
        onLogin(token);
      }
      
    } catch (e) {
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