import { Database } from "./supabase/dbTypes";

export type Recipes = Database["public"]["Tables"]["recipes"]["Row"];
export type Ingredients = Database["public"]["Tables"]["ingredients"]["Row"];
export interface RecipeWithIngredients {
  recipe: Recipes;
  ingredients: Ingredients[];
}
export type Diets = Database["public"]["Tables"]["diets"]["Row"];

export type DietType1 = Database["public"]["Tables"]["diets_type_1"]["Row"];