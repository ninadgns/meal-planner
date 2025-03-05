import { SidebarProvider } from "@/components/ui/sidebar"
import { createClient } from "@/utils/supabase/server"
import { Diets } from "@/utils/type"
import { RecipesErrorState } from "./components/recipeTableError"
import { RecipesTable } from "./components/compatibleRecipeTable"
import { DietSidebar } from "./components/dietSidebar"

export type CompatibleRecipe = {
    recipe_id: number
    title: string
    allergy_safe: boolean
    nutritional_compliant: boolean
    categorical_compliant: boolean
    fully_compliant: boolean // New attribute
}

export default async function CompatibleRecipesPage() {
    const supabase = await createClient()

    try {
        // Get the current user
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser()

        // If no user, show error
        if (userError || !user) {
            return (
                <RecipesErrorState error="You must be logged in to view compatible recipes" />
            )
        }

        // Fetch user's diets
        const { data: dietData, error: dietsError } = await supabase
            .from("user_diets")
            .select(`
                diet_id,
                diets:diet_id (
                    diet_id,
                    diet_name,
                    description,
                    diet_type
                )
            `)
            .eq("user_id", user.id)

        const diets: Diets[] = dietData?.map((item) => item.diets as Diets) || []

        // Fetch compatible recipes
        const { data: recipesData, error: rpcError } = await supabase.rpc("get_compatible_recipes", {
            p_user_id: user.id,
        })

        // Handle potential errors
        if (rpcError) {
            console.error("Error fetching recipes:", rpcError)
            return (
                <RecipesErrorState error="Failed to fetch compatible recipes" />
            )
        }

        // Process recipes and add fully_compliant attribute
        const recipes: CompatibleRecipe[] = (recipesData as CompatibleRecipe[]).map((recipe) => ({
            ...recipe,
            fully_compliant: recipe.allergy_safe && recipe.nutritional_compliant && recipe.categorical_compliant,
        }))

        // Layout with sidebar
        return (
            <SidebarProvider>
                <div className="flex h-screen">
                    <DietSidebar diets={diets} />
                    <div className="overflow-y-auto h-screen">
                        <RecipesTable recipes={recipes} />
                    </div>
                </div>
            </SidebarProvider>
        )
        
    } catch (err) {
        console.error("Unexpected error:", err)
        return (
            <RecipesErrorState error="An unexpected error occurred" />
        )
    }
}
