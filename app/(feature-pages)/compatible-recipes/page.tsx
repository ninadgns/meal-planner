import { SidebarProvider } from "@/components/ui/sidebar"
import { createClient } from "@/utils/supabase/server"
import { Diets, Ingredients, Recipes } from "@/utils/type"
import { RecipesErrorState } from "./components/recipeTableError"
import { RecipesTable } from "./components/compatibleRecipeTable"
import { DietSidebar } from "./components/dietSidebar"

export type CompatibleRecipe = {
  recipe: Recipes;
  ingredients: Ingredients[]; // Now included
  allergy_safe: boolean;
  nutritional_compliant: boolean;
  categorical_compliant: boolean;
  fully_compliant: boolean; // New attribute
};

export type userAllergy = {
  ingredient: {
    category_id: string | null;
    ingredient_id: number;
    name: string;
  };
};

export default async function CompatibleRecipesPage() {
  const supabase = await createClient();

  try {
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // If no user, show error
    if (userError || !user) {
      return (
        <RecipesErrorState error="You must be logged in to view compatible recipes" />
      );
    }

    // Fetch user's diets
    const { data: dietData, error: dietsError } = await supabase
      .from("user_diets")
      .select(
        `
        diet_id,
        diets:diet_id (
            diet_id,
            diet_name,
            description,
            diet_type
        )`
      )
      .eq("user_id", user.id);

    const { data: allergyData, error: allergyError } = await supabase
      .from("user_allergies")
      .select(`ingredient:ingredient_id(*)`)
      .eq("user_id", user.id);

    const diets: Diets[] = dietData?.map((item) => item.diets as Diets) || [];
    const allergies: userAllergy[] = allergyData || [];

    // Fetch compatible recipes
    const { data: recipesData, error: rpcError } = await supabase.rpc(
      "get_compatible_recipes",
      {
        p_user_id: user.id,
      }
    );

    // Handle potential errors
    if (rpcError) {
      console.error("Error fetching recipes:", rpcError);
      return <RecipesErrorState error="Failed to fetch compatible recipes" />;
    }

    if (!recipesData || recipesData.length === 0) {
      return <RecipesTable recipes={[]} />;
    }

    // Fetch detailed recipe ingredients
    const { data: recipeDetails, error: recipeDetailsError } = await supabase
      .from("recipe_ingredients")
      .select("recipe:recipe_id(*), ingredients:ingredient_id(*)")
      .in("recipe_id", recipesData.map((recipe) => recipe.recipe_id));

    if (recipeDetailsError) {
      console.error("Error fetching recipe details:", recipeDetailsError);
      return <RecipesTable recipes={[]} />;
    }

    // Map recipesData to CompatibleRecipe[]
    const recipes: CompatibleRecipe[] = recipesData.map((recipe) => {
      // Find the matching recipe details
      const detailedRecipe = recipeDetails?.filter(
        (r) => r.recipe.recipe_id === recipe.recipe_id
      );

      return {
        recipe: detailedRecipe?.[0]?.recipe as Recipes, // Ensure correct typing
        ingredients: detailedRecipe?.map((r) => r.ingredients) || [], // Extract ingredients properly
        allergy_safe: recipe.allergy_safe,
        nutritional_compliant: recipe.nutritional_compliant,
        categorical_compliant: recipe.categorical_compliant,
        fully_compliant:
          recipe.allergy_safe &&
          recipe.nutritional_compliant &&
          recipe.categorical_compliant,
        compliance_count:
          (recipe.allergy_safe ? 1 : 0) +
          (recipe.nutritional_compliant ? 1 : 0) +
          (recipe.categorical_compliant ? 1 : 0)
      };
    }).sort((a, b) => {
      // First, sort by fully compliant (true first)
      if (a.fully_compliant !== b.fully_compliant) {
        return a.fully_compliant ? -1 : 1;
      }

      // If not fully compliant, sort by number of compliances
      return b.compliance_count - a.compliance_count;
    });



    // Layout with sidebar
    return (
      <SidebarProvider>
        <div className="flex h-screen">
          <DietSidebar diets={diets} allergies={allergies} />
          <div className="overflow-y-auto h-screen">
            <RecipesTable recipes={recipes} />
          </div>
        </div>
      </SidebarProvider>
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return <RecipesErrorState error="An unexpected error occurred" />;
  }
}
