import { createClient } from "@/utils/supabase/server";
import React from "react";
import IngredientManagementPage from "./components/ingredientManagementPageOld";
import { Category } from "@/utils/type";

// Type definitions for the data from Supabase


interface Ingredient {
  ingredient_id: number;
  name: string;
  category_id: Category | null;
}

interface RecipeIngredient {
  recipe_id: {
    title: string;
  };
  ingredient_id: number;
}

const IngredientManagementPageWrapper = async () => {
  const supabase = await createClient();

  const { data: ingredientsMaybeNull, error: ingredientError } = await supabase
    .from("ingredients")
    .select("ingredient_id, name, category_id(category_id, category_name, description)");

  const { data: recipeIngredientsMaybeNull, error: recipeIngredientsError } = await supabase
    .from("recipe_ingredients")
    .select("recipe_id(title), ingredient_id");

  if (ingredientError) {
    console.error("Error fetching ingredients:", ingredientError);
  }

  if (recipeIngredientsError) {
    console.error("Error fetching recipe ingredients:", recipeIngredientsError);
  }

  const ingredients: Ingredient[] = ingredientsMaybeNull || [];
  const recipeIngredients: RecipeIngredient[] = recipeIngredientsMaybeNull || [];

  return (
    <div>
      <IngredientManagementPage
        ingredients={ingredients}
        recipeIngredients={recipeIngredients}
      />
    </div>
  );
};

export default IngredientManagementPageWrapper;