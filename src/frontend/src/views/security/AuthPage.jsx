import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function AuthPage({ setUser }) {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({ email: "", password: "", username: "" });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const response = await api.post("/login", { 
        email: formData.email, 
        password: formData.password 
      });
      
      const token = response.data.token;
      localStorage.setItem("token", token);
      
      const [, payloadEncoded] = token.split(".");
      const userDecoded = JSON.parse(atob(payloadEncoded));
      
      setUser(userDecoded);
      navigate("/recipes");
    } catch (err) {
      setMessage({ type: "error", text: "Identifiants incorrects." });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!formData.username || !formData.email || !formData.password) {
      return setMessage({ type: "error", text: "Champs obligatoires manquants." });
    }

    try {
      await api.post("/users", {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      setMessage({ type: "success", text: "Compte créé. Veuillez vous connecter." });
      setActiveTab("login");
      setFormData(prev => ({ ...prev, password: "" }));
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Erreur lors de l'inscription.";
      setMessage({ type: "error", text: errorMsg });
    }
  };

  return (
    <div className="account-container">
      <div className="tabs-nav">
        <button 
          className={`tab-btn ${activeTab === "login" ? "active" : ""}`} 
          onClick={() => { setActiveTab("login"); setMessage(null); }}
        >
          Connexion
        </button>
        <button 
          className={`tab-btn ${activeTab === "signup" ? "active" : ""}`} 
          onClick={() => { setActiveTab("signup"); setMessage(null); }}
        >
          Inscription
        </button>
        <div 
          className="tab-underline" 
          style={{ 
            width: "50%", 
            transform: activeTab === "login" ? "translateX(0%)" : "translateX(100%)" 
          }}
        ></div>
      </div>

      {message && (
        <div style={{ padding: "15px 20px 0" }}>
          <div className={`message-box ${message.type}`}>
            {message.text}
          </div>
        </div>
      )}

      {activeTab === "login" && (
        <div className="form-section">
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <div className="input-group">
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required />
              </div>
            </div>
            <button type="submit">Se connecter</button>
          </form>
        </div>
      )}

      {activeTab === "signup" && (
        <div className="form-section">
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <div className="input-group">
                <input type="text" name="username" placeholder="Nom d'utilisateur" value={formData.username} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required />
              </div>
            </div>
            <button type="submit">S'inscrire</button>
          </form>
        </div>
      )}
    </div>
  );
}