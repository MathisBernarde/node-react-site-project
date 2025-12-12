import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RecipeService from "../../services/recipe-service";

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  
  // verif id
  const token = localStorage.getItem("token");
  const currentUser = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const currentUserId = currentUser ? currentUser.user_id : null;
  const isAdmin = currentUser?.role === "ADMIN";

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const data = await RecipeService.getAll();
      setRecipes(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette recette ?")) return;
    try {
      await RecipeService.delete(id);
      setRecipes(recipes.filter(r => r.id !== id));
    } catch (e) { alert("Erreur suppression"); }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Les Recettes</h1>
        <Link to="/recipes/new" className="button" style={{ background: "#2196F3", color: "white", padding: "10px", textDecoration: "none", borderRadius: "4px" }}>
          + Créer une recette
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", marginTop: "20px" }}>
        {recipes.map(recipe => {
            const isOwner = recipe.userId === currentUserId;
            const canEdit = isOwner || isAdmin;

            return (
                <div key={recipe.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", background: "white", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between"}}>
                        <h3 style={{ margin: "0 0 10px 0", color:"#333" }}>{recipe.title}</h3>
                        {recipe.isPublic && <span style={{ fontSize: "12px", background: "#e0f7fa", color: "#006064", padding: "2px 6px", borderRadius: "4px", height: "fit-content" }}>PUBLIC</span>}
                    </div>
                    
                    <p style={{ color: "#666", fontSize: "0.9em" }}>{recipe.description}</p>
                    
                    {recipe.author && (
                        <div style={{ fontSize: "0.8em", color: "#888", marginBottom: "10px" }}>
                            Par: {recipe.author.login || recipe.author.email}
                        </div>
                    )}
                    <Link to={`/recipes/${recipe.id}`} style={{ flex: 1, textAlign: "center", background: "#4CAF50", color: "black", padding: "8px", borderRadius: "4px", textDecoration: "none", fontSize: "0.9em" }}>
                      Voir
                    </Link>
                    {canEdit && (
                        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                            <Link to={`/recipes/${recipe.id}/edit`} style={{ flex: 1, textAlign: "center", background: "#ff9800", color: "white", padding: "5px", borderRadius: "4px", textDecoration: "none", fontSize: "0.9em" }}>
                                Modifier
                            </Link>
                            <button onClick={() => handleDelete(recipe.id)} style={{ background: "#f44336", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>
                                Supprimer
                            </button>
                        </div>
                    )}
                </div>
            );
        })}
      </div>
    </div>
  );
}