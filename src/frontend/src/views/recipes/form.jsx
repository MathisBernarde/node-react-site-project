import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RecipeService from "../../services/recipe-service";

export default function RecipeForm() {
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    steps: "",
    isPublic: false
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      loadRecipe();
    }
  }, [id]);

  const loadRecipe = async () => {
    try {
      const data = await RecipeService.get(id);
      setRecipe(data);
    } catch (e) {
      alert("Impossible de charger la recette");
      navigate("/recipes");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await RecipeService.update(id, recipe);
      } else {
        await RecipeService.create(recipe);
      }
      navigate("/recipes");
    } catch (e) {
      alert("Erreur lors de la sauvegarde");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{id ? "Modifier la recette" : "Nouvelle recette"}</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "500px" }}>
        
        <input 
          placeholder="Titre (ex: Pâtes carbo)" 
          value={recipe.title} 
          onChange={e => setRecipe({...recipe, title: e.target.value})} 
          required 
          style={{ padding: "8px" }}
        />

        <textarea 
          placeholder="Description courte" 
          value={recipe.description} 
          onChange={e => setRecipe({...recipe, description: e.target.value})}
          style={{ padding: "8px", height: "60px" }}
        />

        <textarea 
          placeholder="Étapes de préparation..." 
          value={recipe.steps} 
          onChange={e => setRecipe({...recipe, steps: e.target.value})}
          style={{ padding: "8px", height: "100px" }}
        />

        <label style={{ cursor: "pointer" }}>
          <input 
            type="checkbox" 
            checked={recipe.isPublic} 
            onChange={e => setRecipe({...recipe, isPublic: e.target.checked})} 
          />
          &nbsp; Rendre cette recette publique ?
        </label>

        <button type="submit" style={{ padding: "10px", background: "#4CAF50", color: "white", border: "none" }}>
          Sauvegarder
        </button>
      </form>
    </div>
  );
}