import { createClient } from "@/utils/supabase/client";
import { Ingredients, Recipes, RecipeWithIngredients } from "@/utils/type";
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

  //This part fetches all the recipes and sends them to the FilterScreen component
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipe_ingredients")
    .select("recipe:recipe_id(*), ingredients(*)");

  if (error) {
    console.error("Error fetching recipes with ingredients:", error);
    return {};
  }
  const recipeData: Record<string, RecipeWithIngredients> = {};
  data.forEach(({ recipe, ingredients }: { recipe: Recipes, ingredients: Ingredients }) => {
    if (!recipeData[recipe.recipe_id]) {
      recipeData[recipe.recipe_id] = { recipe, ingredients: [] };
    }
    recipeData[recipe.recipe_id].ingredients.push(ingredients);
  });

  const { data: DietData, error: DietError } = await supabase.from('diets_type_1').select('diet_id(*), per_meal_calorie_max,per_meal_calorie_min,per_meal_carbs_max,per_meal_carbs_min,per_meal_fat_max,per_meal_fat_min,per_meal_protein_max,per_meal_protein_min');




  if (DietError) {
    console.error("Error fetching diets:", DietError);
    return {};
  }
  const diets = DietData || [];
  return (
    <FilterScreen dietData={diets} recipeWithIngredients={Object.values(recipeData)} />

  )
}

