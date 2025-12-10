import { useEffect, useState } from "react";
import { createRecipe, getRecipe, updateRecipe } from "../../services/recipe-service";
import { useNavigate, useParams } from "react-router-dom";

export default function RecipeForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    steps: "",
    isPublic: false
  });
  
  const navigate = useNavigate();
  const { id } = useParams(); // if id exist = just edit
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      getRecipe(id).then(setFormData);
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateRecipe(id, formData);
      } else {
        await createRecipe(formData);
      }
      navigate("/recipes");
    } catch (error) {
      alert("Erreur lors de la sauvegarde !");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h1>{isEditing ? "Modifier la recette" : "Créer une recette"}</h1>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        
        <label>
          Titre :
          <input 
            name="title" 
            value={formData.title || ""} 
            onChange={handleChange} 
            required 
            style={{ width: "100%", padding: "8px", marginTop: "5px" }} 
          />
        </label>

        <label>
          Description :
          <textarea 
            name="description" 
            value={formData.description || ""} 
            onChange={handleChange} 
            style={{ width: "100%", padding: "8px", marginTop: "5px" }} 
          />
        </label>

        <label>
          Étapes (Texte simple pour l'instant) :
          <textarea 
            name="steps" 
            value={formData.steps || ""} 
            onChange={handleChange} 
            rows="5"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }} 
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input 
            type="checkbox" 
            name="isPublic" 
            checked={formData.isPublic || false} 
            onChange={handleChange} 
          />
          Rendre cette recette publique ?
        </label>

        <button type="submit" style={{ padding: "10px", background: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
          {isEditing ? "Mettre à jour" : "Sauvegarder"}
        </button>
      </form>
    </div>
  );
}