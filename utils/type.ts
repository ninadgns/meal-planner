import { Database } from "./supabase/dbTypes";

export type Recipes = Database["public"]["Tables"]["recipes"]["Row"];
export type Ingredients = Database["public"]["Tables"]["ingredients"]["Row"];
export type AllTables = Database["public"]["Tables"];
export interface RecipeWithIngredients {
  recipe: Recipes;
  ingredients: Ingredients[];
}
export interface RecipeWithIngredientsAndSteps {
  recipe: Recipes;
  ingredients: Ingredients[];
  steps: Recipe_Directions[];
}
export type Diets = Database["public"]["Tables"]["diets"]["Row"];
export type Recipe_Directions = Database["public"]["Tables"]["recipe_directions"]["Row"];
export type DietType1 = Database["public"]["Tables"]["diets_type_1"]["Row"];