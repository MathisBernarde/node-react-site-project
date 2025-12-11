import { useState, useEffect } from "react";
import ShoppingListService from "../services/shopping-list";
import UserService from "../services/user-service"; // ⚠️ Assurez-vous d'avoir créé ce fichier !

export default function ShoppingList() {
  const [lists, setLists] = useState([]);
  const [users, setUsers] = useState([]); // État pour stocker les utilisateurs (Admin)
  const [newTitle, setNewTitle] = useState("");
  const [error, setError] = useState(null);

  // --- 1. LOGIQUE ADMIN : Qui suis-je ? ---
  const token = localStorage.getItem("token");
  let currentUser = null;
  if (token) {
    try {
      // On décode le payload du token JWT pour lire le rôle
      currentUser = JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error("Erreur lecture token", e);
    }
  }
  const isAdmin = currentUser?.role === "ADMIN";

  // --- 2. CHARGEMENT DES DONNÉES ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Tout le monde charge les listes
      const dataLists = await ShoppingListService.getAll();
      setLists(dataLists);

      // SEUL l'admin charge les utilisateurs
      if (isAdmin) {
        const dataUsers = await UserService.getAll();
        setUsers(dataUsers);
      }
    } catch (e) {
      setError("Impossible de charger les données.");
    }
  };

  // --- 3. ACTIONS ---
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const newList = await ShoppingListService.create(newTitle);
      
      // Astuce : On ajoute manuellement les infos de l'user courant à l'objet liste
      // pour que l'affichage Admin (Propriétaire : Moi) marche tout de suite sans recharger
      newList.User = { 
        login: currentUser.login || currentUser.username || currentUser.email 
      };

      setLists([...lists, newList]);
      setNewTitle("");
    } catch (e) {
      setError("Erreur lors de la création.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette liste ?")) return;
    try {
      await ShoppingListService.delete(id);
      setLists(lists.filter((l) => l.id !== id));
    } catch (e) {
      alert("Erreur suppression");
    }
  };

  const toggleStatus = async (list) => {
    try {
      const newStatus = list.status === "OPEN" ? "COMPLETED" : "OPEN";
      const updatedList = await ShoppingListService.update(list.id, {
        status: newStatus,
      });

      // Mise à jour locale en préservant l'objet User s'il n'est pas renvoyé par l'update
      setLists(lists.map((l) => (l.id === list.id ? { ...l, ...updatedList } : l)));
    } catch (e) {
      alert("Erreur mise à jour");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ======================================================= */}
      {/* BLOC RÉSERVÉ AUX ADMINISTRATEURS                        */}
      {/* ======================================================= */}
      {isAdmin && (
        <div style={{ 
            marginBottom: "40px", 
            border: "2px solid #333", 
            borderRadius: "8px",
            padding: "20px", 
            backgroundColor: "#000000" 
        }}>
          <h2 style={{ marginTop: 0}}>Espace Administrateur</h2>
          <p>Vous avez accès à la liste complète des utilisateurs.</p>
          
          <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse", background: "white", color: "black" }}>
            <thead style={{ background: "#ddd" }}>
              <tr>
                <th>ID</th>
                <th>Login</th>
                <th>Email</th>
                <th>Rôle</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.login || user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span style={{ 
                        padding: "4px 8px", 
                        borderRadius: "4px", 
                        background: user.role === "ADMIN" ? "gold" : "#eee",
                        fontSize: "0.8em",
                        fontWeight: "bold"
                    }}>
                        {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================= */}
      {/* LISTES DE COURSES                                       */}
      {/* ======================================================= */}
      <h1> {isAdmin ? "Toutes les listes (Vue Globale)" : "Mes Listes de Courses"}</h1>

      <form onSubmit={handleCreate} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Nouvelle liste..."
          required
          style={{ padding: "8px", width: "300px", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>Ajouter</button>
      </form>

      <div style={{ display: "grid", gap: "10px" }}>
        {lists.map((list) => (
          <div
            key={list.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: list.status === "COMPLETED" ? "#e0ffe0" : "grey",
            }}
          >
            <div>
              <strong
                style={{
                  fontSize: "1.2em",
                  color: "black",
                  textDecoration: list.status === "COMPLETED" ? "line-through" : "none",
                }}
              >
                {list.title}
              </strong>

              {/* ⚠️ AFFICHAGE SPÉCIAL ADMIN : À qui est cette liste ? */}
              {isAdmin && list.User && (
                  <div style={{ color: "blue", fontSize: "0.9em", marginTop: "5px" }}>
                      Propriétaire : <strong>{list.User.login || list.User.username || list.User.email}</strong>
                  </div>
              )}
              
              <div style={{ fontSize: "0.8em", color: "black", marginTop: "5px" }}>
                Statut : {list.status}
              </div>
            </div>

            <div>
              <button onClick={() => toggleStatus(list)} style={{ marginRight: "5px" }}>
                {list.status === "OPEN" ? "Terminer" : "↩️ Rouvrir"}
              </button>
              <button
                onClick={() => handleDelete(list.id)}
                style={{ background: "red", color: "white" }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
        
        {lists.length === 0 && <p style={{color: "#888"}}>Aucune liste de courses pour le moment.</p>}
      </div>
    </div>
  );
}