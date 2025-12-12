import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import RecipeService from "../../services/recipe-service";

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      const data = await RecipeService.get(id);
      setRecipe(data);
    } catch (e) {
      alert("Impossible de charger la recette (privée ou inexistante).");
      navigate("/recipes");
    }
  };

  if (!recipe) return <p>Chargement...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Link to="/recipes" style={{ textDecoration: "none", color: "#666" }}>Retour aux recettes</Link>
      
      <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "30px", marginTop: "20px", background: "white" }}>
        <div style={{ borderBottom: "2px solid #eee", paddingBottom: "20px", marginBottom: "20px" }}>
            <h1 style={{ margin: 0, color: "#333" }}>{recipe.title}</h1>
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                {recipe.isPublic && <span style={{ background: "#e0f7fa", color: "#006064", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8em" }}>PUBLIC</span>}
                {recipe.author && <span style={{ color: "#888", fontSize: "0.9em" }}>Par {recipe.author.login || recipe.author.email}</span>}
            </div>
        </div>
        <div style={{ marginBottom: "30px", fontStyle: "italic", color: "#555",overflowWrap: "break-word", wordBreak: "break-word" }}>
            "{recipe.description}"
        </div>
        <div>
            <h3 style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>Préparation</h3>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6", color: "#333", overflowWrap: "break-word", wordBreak: "break-word" }}>
                {recipe.steps || "Aucune étape renseignée."}
            </div>
        </div>

      </div>
    </div>
  );
}