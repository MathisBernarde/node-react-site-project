import { useState } from "react";
import api from "../../services/api"; // axios
import { useNavigate } from "react-router-dom";

export default function LoginForm({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/login", { email, password });
      
      // stock token
      const token = response.data.token;
      localStorage.setItem("token", token);
      
      const [, payloadEncoded] = token.split(".");
      const userDecoded = JSON.parse(atob(payloadEncoded));
      
      setUser(userDecoded);
      navigate("/recipes");
    } catch (e) {
      console.error(e);
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Connexion</h2>
      
      <form onSubmit={handleSubmit}>
        
        {/* Groupe Email */}
        <div className="form-group">
          <div className="input-group">
            <span className="icon">📧</span>
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Groupe Password */}
        <div className="form-group">
          <div className="input-group">
            <span className="icon">🔒</span>
            <input
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {error && <div style={{color: 'var(--danger)', marginBottom: '15px'}}>{error}</div>}

        <button type="submit">
          Se connecter
        </button>
      </form>
      
      <p style={{marginTop: '20px', fontSize: '0.9rem', color: '#888'}}>
        Pas encore de compte ? <a href="/register" style={{color: '#007aff'}}>Créer un compte</a>
      </p>
    </div>
  );
}