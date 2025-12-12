import { useState, useEffect } from "react";
import ShoppingListService from "../services/shopping-list";
import RecipeService from "../services/recipe-service";

export default function ShoppingList() {
  const [lists, setLists] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]); 
  const [newTitle, setNewTitle] = useState("");
  const [selectedListId, setSelectedListId] = useState(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const dataLists = await ShoppingListService.getAll();
      const dataRecipes = await RecipeService.getAll();
      setLists(dataLists);
      setAllRecipes(dataRecipes);
    } catch (e) { console.error(e); }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    try {
        await ShoppingListService.create(newTitle);
        setNewTitle("");
        loadData();
    } catch(e) { alert("Erreur création"); }
  };

  const handleAddRecipeToList = async () => {
      if(!selectedListId || !selectedRecipeId) return;
      try {
          await ShoppingListService.addRecipe(selectedListId, selectedRecipeId);
          loadData();
          setSelectedListId(null);
      } catch(e) { alert("Erreur ajout recette"); }
  };

  const handleDeleteList = async (id) => {
      if(!confirm("Supprimer cette liste ?")) return;
      try {
        await ShoppingListService.delete(id);
        loadData();
      } catch(e) { alert("Erreur suppression"); }
  };
  const toggleStatus = async (list) => {
    try {
      const newStatus = list.status === "OPEN" ? "COMPLETED" : "OPEN";
      await ShoppingListService.update(list.id, { status: newStatus });
      loadData();
    } catch (e) { alert("Erreur mise à jour statut"); }
  };
  const calculateTotalIngredients = (list) => {
      if (!list.Recipes) return [];
      const totals = {};
      list.Recipes.forEach(recipe => {
          recipe.Ingredients.forEach(ing => {
              const key = `${ing.name}_${ing.RecipeIngredient.unit}`;
              if (!totals[key]) {
                  totals[key] = {
                      name: ing.name,
                      unit: ing.RecipeIngredient.unit,
                      quantity: 0
                  };
              }
              totals[key].quantity += ing.RecipeIngredient.quantity;
          });
      });
      return Object.values(totals);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Listes de Courses Intelligentes</h1>

      <form onSubmit={handleCreateList} style={{marginBottom: "20px"}}>
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Nom de la liste..." required style={{padding:"8px", marginRight: "20px"}} />
          <button type="submit" style={{padding:"8px"}}>Créer liste</button>
      </form>

      <div style={{ display: "grid", gap: "20px" }}>
        {lists.map(list => {
            const aggregatedIngredients = calculateTotalIngredients(list);
            const isCompleted = list.status === "COMPLETED";

            return (
                <div key={list.id} style={{ 
                    border: "1px solid #ccc", 
                    padding: "20px", 
                    borderRadius: "8px", 
                    background: isCompleted ? "#dcfce7" : "white",
                    opacity: isCompleted ? 0.8 : 1,
                    transition: "background 0.3s"
                }}>
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                        <h2 style={{textDecoration: isCompleted ? "line-through" : "none", color: isCompleted ? "#166534" : "black"}}>
                            {list.title}
                        </h2>
                        <div>
                            <button 
                                onClick={() => toggleStatus(list)} 
                                style={{
                                    marginRight: "10px", 
                                    padding: "5px 10px",
                                    background: isCompleted ? "#fbbf24" : "#22c55e",
                                    color: isCompleted ? "black" : "white", 
                                    border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold"
                                }}
                            >
                                {isCompleted ? "Rouvrir" : "Terminer"}
                            </button>
                            
                            <button onClick={() => handleDeleteList(list.id)} style={{background:"#ef4444", color:"white", padding: "5px 10px", border: "none", borderRadius: "4px", cursor: "pointer"}}>
                                Supprimer
                            </button>
                        </div>
                    </div>
                    {!isCompleted && (
                        <div style={{ margin: "10px 0", padding: "10px", background: "#f0f9ff", borderRadius: "4px" }}>
                            <select 
                                onChange={(e) => {
                                    setSelectedListId(list.id);
                                    setSelectedRecipeId(e.target.value);
                                }}
                                defaultValue=""
                                style={{padding: "5px"}}
                            >
                                <option value="" disabled>Ajouter une recette...</option>
                                {allRecipes.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                            </select>
                            {selectedListId === list.id && (
                                <button onClick={handleAddRecipeToList} style={{marginLeft: "10px", cursor:"pointer"}}>Valider</button>
                            )}
                        </div>
                    )}

                    <div style={{marginBottom: "15px", textAlign: "center", color:"black"}}>
                        <strong>Au menu :</strong>
                        {list.Recipes && list.Recipes.length > 0 ? (
                            <ul style={{marginTop: "5px", paddingLeft: 0, listStylePosition: "inside"}}>
                                {list.Recipes.map((r, i) => <li key={i}>{r.title}</li>)}
                            </ul>
                        ) : <p style={{fontStyle:"italic", color:"#888"}}>Aucune recette pour l'instant</p>}
                    </div>

                    {aggregatedIngredients.length > 0 && (
                        <div style={{ marginTop: "15px", borderTop: "2px dashed #ccc", paddingTop: "15px", color:"black" }}>
                            <h3>Total à acheter</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px" }}>
                                {aggregatedIngredients.map((item, index) => (
                                    <div key={index} style={{ background: "white", padding: "8px", borderRadius: "4px", border: "1px solid #bbf7d0", textAlign:"center", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                                        <div style={{fontWeight:"bold", fontSize:"1.2em", color: "#166534"}}>{item.quantity} {item.unit}</div>
                                        <div style={{color: "#374151"}}>{item.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        })}
      </div>
    </div>
  );
}