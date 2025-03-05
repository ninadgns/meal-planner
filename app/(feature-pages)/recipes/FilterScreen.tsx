"use client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Diets, DietType1, RecipeWithIngredients } from "@/utils/type";
import { ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import FilterSidebar from "./components/FilterSidebar";
import RecipeGrid from "./components/RecipeGrid";
import { ViewSwitcher } from "./components/Switcher";
import { RecipeTable } from "./components/RecipeTable";
import { DietData } from "./page";

export interface FilterProps {
  calorie: number[];
  protein: number[];
  fat: number[];
  carb: number[];
  cookingTime: number[];
  ingredientsToAvoid: number[];
  ingredientsToInclude: number[];
  preference: string; // Add preference to FilterProps
}

// Define sort criteria type to include all sortable properties
type SortCriteria = "cooking_time" | "calories_per_serving" | "protein_per_serving" | "carbs_per_serving" | "fat_per_serving" | "";

const FilterScreen = ({ recipeWithIngredients, dietData }: { recipeWithIngredients: RecipeWithIngredients[], dietData: DietData[] }) => {
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeWithIngredients[]>(recipeWithIngredients);
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>("");
  const [view, setView] = useState<"grid" | "table">("grid");

  // Pre-calculate ranges and ingredients using useMemo to avoid recalculation on re-renders
  const calorieRange = useMemo(() => ({
    min: Math.min(...recipeWithIngredients.map(({ recipe }) => recipe.calories_per_serving)),
    max: Math.max(...recipeWithIngredients.map(({ recipe }) => recipe.calories_per_serving)),
  }), [recipeWithIngredients]);

  const proteinRange = useMemo(() => ({
    min: Math.min(...recipeWithIngredients.map(({ recipe }) => recipe.protein_per_serving)),
    max: Math.max(...recipeWithIngredients.map(({ recipe }) => recipe.protein_per_serving)),
  }), [recipeWithIngredients]);

  const fatRange = useMemo(() => ({
    min: Math.min(...recipeWithIngredients.map(({ recipe }) => recipe.fat_per_serving)),
    max: Math.max(...recipeWithIngredients.map(({ recipe }) => recipe.fat_per_serving)),
  }), [recipeWithIngredients]);

  const carbRange = useMemo(() => ({
    min: Math.min(...recipeWithIngredients.map(({ recipe }) => recipe.carbs_per_serving)),
    max: Math.max(...recipeWithIngredients.map(({ recipe }) => recipe.carbs_per_serving)),
  }), [recipeWithIngredients]);

  const cookingTimeRange = useMemo(() => ({
    min: Math.min(...recipeWithIngredients.map(({ recipe }) => recipe.cooking_time)),
    max: Math.max(...recipeWithIngredients.map(({ recipe }) => recipe.cooking_time)),
  }), [recipeWithIngredients]);

  const uniqueIngredients = useMemo(() => {
    const allIngredients = recipeWithIngredients.flatMap(({ ingredients }) => ingredients);
    return Array.from(
      new Map(allIngredients.map((ingredient) => [ingredient.name, ingredient])).values()
    );
  }, [recipeWithIngredients]);

  // Sort function to handle all criteria
  const sortRecipes = (recipes: RecipeWithIngredients[], criteria: SortCriteria) => {
    if (!criteria) return recipes;

    return [...recipes].sort((a, b) => a.recipe[criteria] - b.recipe[criteria]);
  };

  // Assuming you have a type or interface for diet preferences
  type DietPreference = {
    diet_id: string;
    per_meal_calorie_min: number;
    per_meal_calorie_max: number;
    per_meal_protein_min: number;
    per_meal_protein_max: number;
    per_meal_carbs_min: number;
    per_meal_carbs_max: number;
    per_meal_fat_min: number;
    per_meal_fat_max: number;
    diet_name: string;
    description: string;
    diet_type: number;
  };

  // Diet preferences mapping
  const DIET_PREFERENCES: { [key: string]: DietPreference } = dietData.reduce(
    (acc, dietData) => {
      acc[dietData.diet_id.diet_name] = {
        diet_id: dietData.diet_id.diet_id,
        diet_name: dietData.diet_id.diet_name,
        description: dietData.diet_id.description || "",
        diet_type: dietData.diet_id.diet_type,
        per_meal_calorie_min: dietData.per_meal_calorie_min || 0,
        per_meal_calorie_max: dietData.per_meal_calorie_max || 0,
        per_meal_protein_min: dietData.per_meal_protein_min || 0,
        per_meal_protein_max: dietData.per_meal_protein_max || 0,
        per_meal_carbs_min: dietData.per_meal_carbs_min || 0,
        per_meal_carbs_max: dietData.per_meal_carbs_max || 0,
        per_meal_fat_min: dietData.per_meal_fat_min || 0,
        per_meal_fat_max: dietData.per_meal_fat_max || 0,
      };
      return acc;
    },
    {} as { [key: string]: DietPreference }
  );

  console.log(DIET_PREFERENCES);

  const handleFilterApply = (filters: FilterProps) => {
    console.log("Applied Filters:", filters);

    // Filter recipes based on criteria
    const filtered = recipeWithIngredients.filter(({ recipe, ingredients }) => {
      // Filter by cooking time
      const matchesCookingTime = recipe.cooking_time >= filters.cookingTime[0] && recipe.cooking_time <= filters.cookingTime[1];

      // Filter by calorie range
      const matchesCalorieRange = recipe.calories_per_serving >= filters.calorie[0] && recipe.calories_per_serving <= filters.calorie[1];

      // Filter by protein range
      const matchesProteinRange = recipe.protein_per_serving >= filters.protein[0] && recipe.protein_per_serving <= filters.protein[1];

      // Filter by fat range
      const matchesFatRange = recipe.fat_per_serving >= filters.fat[0] && recipe.fat_per_serving <= filters.fat[1];

      // Filter by carb range
      const matchesCarbRange = recipe.carbs_per_serving >= filters.carb[0] && recipe.carbs_per_serving <= filters.carb[1];

      // Filter by ingredients to avoid
      const matchesIngredientAvoidance = filters.ingredientsToAvoid.length === 0 ||
        !ingredients.some(ingredient => filters.ingredientsToAvoid.includes(ingredient.ingredient_id));

      // Filter by ingredients to include
      const matchesIngredientInclusion = filters.ingredientsToInclude.length === 0 ||
        filters.ingredientsToInclude.every(ingredientId =>
          ingredients.some(ingredient => ingredient.ingredient_id === ingredientId)
        );

      // Filter by diet preference
      let matchesDietPreference = true;
      if (filters.preference) {
        const dietPreference = DIET_PREFERENCES[filters.preference];

        // Check if recipe matches diet-specific nutritional ranges
        matchesDietPreference =
          recipe.calories_per_serving >= dietPreference.per_meal_calorie_min &&
          recipe.calories_per_serving <= dietPreference.per_meal_calorie_max &&
          recipe.protein_per_serving >= dietPreference.per_meal_protein_min &&
          recipe.protein_per_serving <= dietPreference.per_meal_protein_max &&
          recipe.carbs_per_serving >= dietPreference.per_meal_carbs_min &&
          recipe.carbs_per_serving <= dietPreference.per_meal_carbs_max &&
          recipe.fat_per_serving >= dietPreference.per_meal_fat_min &&
          recipe.fat_per_serving <= dietPreference.per_meal_fat_max;
      }

      return matchesCookingTime && matchesCalorieRange && matchesProteinRange &&
        matchesFatRange && matchesCarbRange && matchesIngredientAvoidance &&
        matchesIngredientInclusion && matchesDietPreference;
    });

    // Apply any active sorting
    const sortedFiltered = sortCriteria ? sortRecipes(filtered, sortCriteria) : filtered;
    setFilteredRecipes(sortedFiltered);
  };


  const handleSort = (criteria: SortCriteria) => {
    setSortCriteria(criteria);
    setFilteredRecipes(sortRecipes(filteredRecipes, criteria));
  };

  // Map sort criteria to display names
  const getSortCriteriaDisplayName = (criteria: SortCriteria): string => {
    const displayNames = {
      "cooking_time": "Cooking Time",
      "calories_per_serving": "Calories",
      "protein_per_serving": "Protein",
      "carbs_per_serving": "Carbs",
      "fat_per_serving": "Fat",
      "": ""
    };
    return displayNames[criteria];
  };

  return (
    <div className="container">
      <h1 className="px-4 text-3xl font-bold mb-3">Recipes</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-1/4">
          <FilterSidebar
            onFilterApply={handleFilterApply}
            calorieRange={calorieRange}
            cookingTimeRange={cookingTimeRange}
            ingredients={uniqueIngredients}
            carbRange={carbRange}
            proteinRange={proteinRange}
            fatRange={fatRange}
            dietData={dietData}
          />
        </aside>
        <main className="w-full lg:w-4/5">
          <div className="flex justify-between items-center gap-4 mb-4">
            <div className="ml-4 text-muted-foreground">
              {filteredRecipes.length} out of {recipeWithIngredients.length} total recipes
            </div>
            <div className="flex gap-5">
              {view == 'grid' && <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Sort By {sortCriteria ? `: ${getSortCriteriaDisplayName(sortCriteria)}` : ""}
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleSort("cooking_time")}>Cooking Time</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("calories_per_serving")}>Calories</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("protein_per_serving")}>Protein</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("carbs_per_serving")}>Carbs</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("fat_per_serving")}>Fat</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>}
              <ViewSwitcher view={view} onViewChange={setView} />
            </div>
          </div>

          {view === "table"
            ? <RecipeTable data={filteredRecipes} />
            : <RecipeGrid recipeWithIngredients={filteredRecipes} />
          }
        </main>
      </div>
    </div>
  );
};

export default FilterScreen;