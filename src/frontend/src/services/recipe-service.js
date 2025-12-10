import api from "./api";

// bring all recettes
export const getRecipes = async () => {
  const response = await api("/recipes");
  return await response.json();
};

// bring une seule recette
export const getRecipe = async (id) => {
  const response = await api(`/recipes/${id}`);
  return await response.json();
};

// creer une recette
export const createRecipe = async (recipe) => {
  const response = await api("/recipes", {
    method: "POST",
    body: recipe,
  });
  if (!response.ok) throw new Error("Erreur lors de la création");
  return await response.json();
};

// modifier une recette
export const updateRecipe = async (id, recipe) => {
  const response = await api(`/recipes/${id}`, {
    method: "PATCH",
    body: recipe,
  });
  return await response.json();
};

// delet une recette
export const deleteRecipe = async (id) => {
  return await api(`/recipes/${id}`, {
    method: "DELETE",
  });
};