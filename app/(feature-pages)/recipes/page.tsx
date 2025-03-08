import { createClient } from "@/utils/supabase/client";
import { Ingredients, Recipes, RecipeWithIngredientsAndSteps } from "@/utils/type";
import FilterScreen from "./FilterScreen";

export type DietData = {
  diet_id: {
    description: string | null;
    diet_id: string;
    diet_name: string;
    diet_type: number;
  };
  per_meal_calorie_max: number | null;
  per_meal_calorie_min: number | null;
  per_meal_carbs_max: number | null;
  per_meal_carbs_min: number | null;
  per_meal_fat_max: number | null;
  per_meal_fat_min: number | null;
  per_meal_protein_max: number | null;
  per_meal_protein_min: number | null;
}

export default async function ProductPage() {
  const supabase = await createClient();

  // Fetch all necessary data in parallel
  const [
    recipeIngredientsResult,
    stepsResult,
    dietsResult
  ] = await Promise.all([
    supabase.from("recipe_ingredients").select("recipe_id, ingredient_id, quantity_per_serving, unit, recipe:recipe_id(*), ingredients(*)"),
    supabase.from("recipe_directions").select("*"),
    supabase.from('diets_type_1').select('diet_id(*), per_meal_calorie_max, per_meal_calorie_min, per_meal_carbs_max, per_meal_carbs_min, per_meal_fat_max, per_meal_fat_min, per_meal_protein_max, per_meal_protein_min')
  ]);

  // Handle errors
  if (recipeIngredientsResult.error) {
    console.error("Error fetching recipes with ingredients:", recipeIngredientsResult.error);
    return <div>Error loading recipes. Please try again later.</div>;
  }

  if (stepsResult.error) {
    console.error("Error fetching recipe steps:", stepsResult.error);
    return <div>Error loading recipe steps. Please try again later.</div>;
  }

  if (dietsResult.error) {
    console.error("Error fetching diets:", dietsResult.error);
    return <div>Error loading diet information. Please try again later.</div>;
  }

  // Process recipe data
  const recipes = processRecipeData(recipeIngredientsResult.data, stepsResult.data);

  return (
    <FilterScreen
      dietData={dietsResult.data || []}
      recipeWithIngredients={recipes}
    />
  );
}

/**
 * Process recipe data by combining ingredients and steps
 */
function processRecipeData(
  recipeIngredients: {
    recipe_id: number;
    ingredient_id: number;
    quantity_per_serving: number | null;
    unit: string | null;
    recipe: Recipes;
    ingredients: Ingredients;
  }[],
  steps: any[]
): RecipeWithIngredientsAndSteps[] {
  // Group ingredients by recipe_id
  const recipesMap = new Map<number, RecipeWithIngredientsAndSteps>();

  // First pass: create recipes with ingredients
  recipeIngredients.forEach((item) => {
    const { recipe, ingredients, quantity_per_serving, unit } = item;

    if (!recipesMap.has(recipe.recipe_id)) {
      recipesMap.set(recipe.recipe_id, { recipe, ingredients: [], steps: [] });
    }

    recipesMap.get(recipe.recipe_id)!.ingredients.push({
      ingredient: ingredients,
      quantity_per_serving,
      unit
    });
  });

  // Second pass: add steps to recipes
  steps.forEach((step) => {
    const recipe = recipesMap.get(step.recipe_id);
    if (recipe) {
      recipe.steps.push(step);
    }
  });

  // Sort steps and convert to array
  const recipeArray = Array.from(recipesMap.values());
  recipeArray.forEach(recipe => {
    recipe.steps.sort((a, b) => a.step_order - b.step_order);
  });

  return recipeArray;
}