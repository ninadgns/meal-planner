import { createClient } from "@/utils/supabase/client";
import { Ingredients, Recipes, RecipeWithIngredients } from "@/utils/type";
import FilterScreen from "./FilterScreen";

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

  return (
    <FilterScreen recipeWithIngredients={Object.values(recipeData)} />
  )
}

