import { useState, useEffect } from "react";
import IngredientService from "../../services/ingredient-service";

export default function IngredientList() {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({ name: "", unit: "g" });
  const [error, setError] = useState(null);

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    try {
      const data = await IngredientService.getAll();
      setIngredients(data);
    } catch (e) {
      setError("Impossible de charger les ingrédients.");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const created = await IngredientService.create(newIngredient);
      setIngredients([...ingredients, created]);
      setNewIngredient({ name: "", unit: "g" });
    } catch (e) {
      alert("Erreur création (Nom déjà pris ?)");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Mes Ingrédients</h1>
      <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3 style={{color: "black"}}>Ajouter un ingrédient</h3>
        <form onSubmit={handleCreate} style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Nom (ex: Farine)"
            value={newIngredient.name}
            onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
            required
            style={{ padding: "8px" }}
          />
          <select 
            value={newIngredient.unit}
            onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
            style={{ padding: "8px" }}
          >
            <option value="g">Grammes (g)</option>
            <option value="kg">Kilos (kg)</option>
            <option value="ml">Millilitres (ml)</option>
            <option value="l">Litres (l)</option>
            <option value="pièce">Pièce</option>
            <option value="c.à.s">Cuillère à soupe</option>
          </select>
          <button type="submit" style={{ background: "#4CAF50", color: "white", border: "none", padding: "8px 16px" }}>
            Ajouter
          </button>
        </form>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px" }}>
        {ingredients.map((ing) => (
          <div key={ing.id} style={{ 
              border: "1px solid #ddd", 
              padding: "10px", 
              borderRadius: "5px", 
              textAlign: "center",
              background: "white",
              color: "black"
          }}>
            <div style={{ fontSize: "1.5em", marginBottom: "5px" }}></div>
            <strong>{ing.name}</strong>
            <div style={{ color: "#666", fontSize: "0.9em" }}>Unité : {ing.unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}