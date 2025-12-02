import { useEffect, useState } from 'react';
import { getAllRecipes, createRecipe } from '../services/recipe-service';

export default function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [isPublic, setIsPublic] = useState(false);

    // Charger recettes au démarrage
    useEffect(() => {
        getAllRecipes().then(data => setRecipes(data)).catch(console.error);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const savedRecipe = await createRecipe({ title: newTitle, isPublic });
            setRecipes([...recipes, savedRecipe]); // Ajout liste sans recharger
            setNewTitle("");
        } catch (error) {
            alert("Erreur lors de la création");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Gestion des Recettes</h1>
            
            {/* Formulaire d'ajout */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                <h3>Nouvelle Recette</h3>
                <input 
                    type="text" 
                    placeholder="Titre de la recette" 
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    required
                />
                <label style={{ marginLeft: '10px' }}>
                    <input 
                        type="checkbox" 
                        checked={isPublic} 
                        onChange={e => setIsPublic(e.target.checked)} 
                    />
                    Publique ?
                </label>
                <button type="submit" style={{ marginLeft: '10px' }}>Ajouter</button>
            </form>

            {/* Liste des recettes */}
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Titre</th>
                        <th>Visibilité</th>
                        <th>Créateur (ID)</th>
                    </tr>
                </thead>
                <tbody>
                    {recipes.map(recipe => (
                        <tr key={recipe.id}>
                            <td>{recipe.id}</td>
                            <td>{recipe.title}</td>
                            <td>{recipe.isPublic ? "🌍 Public" : "🔒 Privé"}</td>
                            <td>{recipe.UserId}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}