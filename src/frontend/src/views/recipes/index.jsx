import { useEffect, useState } from "react";
import { getRecipes, deleteRecipe } from "../../services/recipe-service";
import { Link } from "react-router-dom"; // edition/création

export default function RecipesList() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRecipes()
      .then(setRecipes)
      .catch((e) => setError("Erreur de chargement des recettes (êtes-vous connecté ?)"));
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Voulez-vous vraiment supprimer cette recette ?")) {
      await deleteRecipe(id);
      setRecipes(recipes.filter((r) => r.id !== id)); // local update
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Mes Recettes</h1>
      
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "20px" }}>
        <Link to="/recipes/new">
          <button style={{ padding: "10px", background: "green", color: "white" }}>
            + Nouvelle Recette
          </button>
        </Link>
      </div>

      <div style={{ display: "grid", gap: "10px" }}>
        {recipes.map((recipe) => (
          <div key={recipe.id} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
            {recipe.isPublic && <span style={{fontSize: "0.8em", background:"#ddd", padding:"2px"}}>Public</span>}
            
            <div style={{ marginTop: "10px" }}>
              <Link to={`/recipes/${recipe.id}/edit`} style={{ marginRight: "10px" }}>Modifier</Link>
              <button onClick={() => handleDelete(recipe.id)} style={{ color: "red" }}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
      
      {recipes.length === 0 && !error && <p>Aucune recette trouvée.</p>}
    </div>
  );
}