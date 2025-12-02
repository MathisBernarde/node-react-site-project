import { api } from './api';

export async function getAllRecipes() {
    const response = await api.get('/recipes');
    return response.data;
}

export async function createRecipe(recipeData) {
    const response = await api.post('/recipes', recipeData);
    return response.data;
}