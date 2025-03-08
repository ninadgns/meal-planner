import { SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { AdminDashboardContainer } from "./components/table-container";
import { AllergySafeIngredientsProps } from "./components/allergy-safeList";

export interface UserDietAllergyData {
    id: string;
    user_name: string | null;
    user_allergies?: {
        ingredient_id: number;
        ingredients: {
            name: string;
        };
    }[];
    user_diets?: {
        diet_id: string;
        diets: {
            diet_name: string;
        };
    }[];
}

export interface DietUser {
    diet_name: string;
    follower_count: number;
}

export interface userRecipe {
    recipe_id: number | null;
    title: string | null;
    user_id: string | null;
    user_name: string | null;
}

export default async function TablesPage() {
    const supabase = await createClient();

    // Fetch allergy-safe ingredients
    const { data: allergySafeIngredientsMaybeNull, error: allergySafeIngredientsError } =
        await supabase.rpc("get_allergy_safe_ingredients_by_category").select("*");

    const allergySafeIngredients = {
        ingredientsByCategory: allergySafeIngredientsError ? [] : allergySafeIngredientsMaybeNull
    };

    // Fetch recipes with diets
    const { data: recipeWithDietsMaybeNull, error: recipeWithDietsError } =
        await supabase.rpc("get_recipes_with_diets").select("*");

    const recipeWithDiets = {
        recipesWithDiets: recipeWithDietsError ? [] : recipeWithDietsMaybeNull
    };

    // Fetch user allergies
    const { data: userAllergyMaybeNull, error: userAllergyMaybeNullError } = await supabase
        .from("users")
        .select(`
            id,
            user_name,
            user_allergies (
                ingredient_id,
                ingredients ( name )
            )
        `)
        .order("id", { ascending: true });

    // Fetch user diets
    const { data: userDietMaybeNull, error: userDietMaybeNullError } = await supabase
        .from("users")
        .select(`
            id,
            user_name,
            user_diets (
                diet_id,
                diets ( diet_name )
            )
        `);

    const userAllergies = userAllergyMaybeNullError ? [] : userAllergyMaybeNull;
    const userDiets = userDietMaybeNullError ? [] : userDietMaybeNull;

    // Merge user allergies and diets data
    const userDietAllergyData: UserDietAllergyData[] = [];

    userAllergies.forEach((user) => {
        userDietAllergyData.push({
            id: user.id,
            user_name: user.user_name,
            user_allergies: user.user_allergies ?? [],
            user_diets: [] // Initialize diets as empty, to be updated later
        });
    });

    userDiets.forEach((userDiet) => {
        const existingUser = userDietAllergyData.find((user) => user.id === userDiet.id);

        if (existingUser) {
            existingUser.user_diets = userDiet.user_diets ?? [];
        } else {
            userDietAllergyData.push({
                id: userDiet.id,
                user_name: userDiet.user_name,
                user_allergies: [], // Initialize allergies as empty
                user_diets: userDiet.user_diets ?? []
            });
        }
    });

    // Fetch diet followers
    const { data: dietUserMaybeNull, error: dietUserMaybeNullError } = await supabase
        .from("diets")
        .select(`
            diet_id,
            diet_name,
            user_diets (
                user_id
            )
        `);

    const dietUsers = dietUserMaybeNullError ? [] : dietUserMaybeNull;

    // Process data to count followers
    const processedDietUser = dietUsers
        .map(diet => ({
            diet_name: diet.diet_name,
            follower_count: diet.user_diets ? diet.user_diets.length : 0
        }))
        .filter(diet => diet.follower_count >= 1) // HAVING COUNT(ud.user_id) >= 1
        .sort((a, b) => b.diet_name.localeCompare(a.diet_name)); // ORDER BY d.diet_name DESC

    // console.log("Processed Data:", processedDietUser);


    const { data: view1DataMaybeNull, error: view1Error } = await supabase.from("user_allergy_safe_recipes").select("*");
    const { data: view2DataMaybeNull, error: view2Error } = await supabase.from("user_nutritional_diet_recipes").select("*");
    const { data: view3DataMaybeNull, error: view3Error } = await supabase.from("user_categorical_diet_recipes").select("*")
    const view1Data = view1DataMaybeNull || [];
    const view2Data = view2DataMaybeNull || [];
    const view3Data = view3DataMaybeNull || [];
    const {data: allRecipeMaybeNull, error: allRecipeError} = await supabase.from("recipes").select("*");
    const allRecipes = allRecipeMaybeNull || [];

    return (
        <SidebarProvider>
            <AdminDashboardContainer
                allergySafeIngredients={allergySafeIngredients}
                recipeWithDiets={recipeWithDiets}
                userDietAllergyData={userDietAllergyData}
                dietUser={processedDietUser}
                view1Data={view1Data}
                view2Data={view2Data}
                view3Data={view3Data}
                allRecipe={allRecipes}
                
            />
        </SidebarProvider>
    );
}