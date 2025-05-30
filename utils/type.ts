import { Database } from "./supabase/dbTypes";

export type User = Database["public"]["Tables"]["users"]["Row"];
export type Recipes = Database["public"]["Tables"]["recipes"]["Row"];
export type Ingredients = Database["public"]["Tables"]["ingredients"]["Row"];
export type AllTables = Database["public"]["Tables"];
export interface RecipeWithIngredients {
  recipe: Recipes;
  ingredients: Ingredients[];
}
export interface RecipeWithIngredientsAndSteps {
  recipe: Recipes;
  ingredients: {
    ingredient: Ingredients;
    quantity_per_serving: number | null;
    unit: string | null;
  }[];
  steps: Recipe_Directions[];
}


export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type RecipeIngredients = Database["public"]["Tables"]["recipe_ingredients"]["Row"];
export type Diets = Database["public"]["Tables"]["diets"]["Row"];
export type Recipe_Directions = Database["public"]["Tables"]["recipe_directions"]["Row"];
export type DietType1 = Database["public"]["Tables"]["diets_type_1"]["Row"];
export type DietType2 = Database["public"]["Tables"]["diets_type_2"]["Row"];