import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RecipeService from "../../services/recipe-service";
import IngredientService from "../../services/ingredient-service";

export default function RecipeForm() {
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    steps: "",
    isPublic: false
  });

  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [currentIngId, setCurrentIngId] = useState("");
  const [currentQty, setCurrentQty] = useState("");
  const [currentUnit, setCurrentUnit] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
        const allIngredients = await IngredientService.getAll();
        setAvailableIngredients(allIngredients);
        if(allIngredients.length > 0) {
            setCurrentIngId(allIngredients[0].id);
            setCurrentUnit(allIngredients[0].unit);
        }

        if (id) {
            const data = await RecipeService.get(id);
            setRecipe(data);
            if (data.Ingredients) {
              const formattedIngredients = data.Ingredients.map(ing => ({
                id: ing.id,
                name: ing.name,
                quantity: ing.RecipeIngredient.quantity,
                unit: ing.RecipeIngredient.unit || ing.unit
              }));
              setSelectedIngredients(formattedIngredients);
            }
        }
    } catch (e) {
        console.error(e);
    }
  };

  const addIngredient = (e) => {
    e.preventDefault();
    if(!currentIngId || !currentQty) return;
    const ingObj = availableIngredients.find(i => i.id == currentIngId);
    setSelectedIngredients([
        ...selectedIngredients,
        { id: currentIngId, name: ingObj.name, quantity: currentQty, unit: currentUnit }
    ]);
    setCurrentQty("");
  };
  const handleIngredientChange = (e) => {
    const selectedId = e.target.value;
    setCurrentIngId(selectedId);
    const ing = availableIngredients.find(i => i.id == selectedId);
    if (ing) {
        setCurrentUnit(ing.unit);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
          ...recipe,
          ingredients: selectedIngredients
      };

      if (id) {
        await RecipeService.update(id, payload);
      } else {
        await RecipeService.create(payload);
      }
      navigate("/recipes");
    } catch (e) {
      alert("Erreur lors de la sauvegarde");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{id ? "Modifier la recette" : "Nouvelle recette"}</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "600px" }}>
        
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
        
        <div style={{ background: "#f9f9f9", padding: "15px", borderRadius: "8px", border: "1px solid #ddd", color: "black"}}>
            <h4>Ingrédients de la recette</h4>
            
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px"}}>
                {/* SELECT MODIFIÉ */}
                <select 
                    value={currentIngId} 
                    onChange={handleIngredientChange} // <--- Appel de la nouvelle fonction
                    style={{flex: 1, padding: "5px"}}
                >
                    {availableIngredients.map(ing => (
                        <option key={ing.id} value={ing.id}>{ing.name}</option>
                    ))}
                </select>

                <input 
                    type="number" placeholder="Qté" style={{width: "60px", padding: "5px"}}
                    value={currentQty} onChange={e => setCurrentQty(e.target.value)} 
                />

                {/* INPUT UNITÉ BLOQUÉ */}
                <input 
                    type="text" 
                    placeholder="Unité" 
                    value={currentUnit} 
                    readOnly // <--- Empêche l'écriture
                    disabled // <--- Grise le champ
                    style={{
                        width: "60px", 
                        padding: "5px",
                        backgroundColor: "#e9ecef", // Fond gris
                        color: "#6c757d",           // Texte gris foncé
                        cursor: "not-allowed",
                        border: "1px solid #ccc"
                    }} 
                />

                <button onClick={addIngredient} type="button" style={{background: "#2196F3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", padding: "0 10px"}}>
                    Ajouter
                </button>
            </div>
            
            <ul style={{ margin: 0, paddingLeft: "0px", listStylePosition: "inside"}}>
                {selectedIngredients.map((item, index) => (
                    <li key={index}>
                        {item.quantity} {item.unit} de <strong>{item.name}</strong>
                    </li>
                ))}
            </ul>
        </div>

        <textarea 
          placeholder="Étapes de préparation..." 
          value={recipe.steps} 
          onChange={e => setRecipe({...recipe, steps: e.target.value})}
          style={{ padding: "8px", height: "150px" }}
        />

        <label style={{ cursor: "pointer" }}>
          <input 
            type="checkbox" 
            checked={recipe.isPublic} 
            onChange={e => setRecipe({...recipe, isPublic: e.target.checked})} 
          />
          &nbsp; Rendre cette recette publique ?
        </label>

        <button type="submit" style={{ padding: "12px", background: "#4CAF50", color: "white", border: "none", fontSize: "1.1em", cursor: "pointer" }}>
          Sauvegarder la recette
        </button>
      </form>
    </div>
  );
}