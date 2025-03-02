"use client";
import React, { useState } from "react";
import { RecipeWithIngredients } from "./page";
import ProductGrid from "./components/ProductGrid";
import FilterSidebar from "./components/FilterSidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export interface FilterProps {
  calorie: number[];
  cookingTime: number[];
  ingredientsToAvoid: string[];
}

const FilterScreen = ({ recipeWithIngredients }: { recipeWithIngredients: RecipeWithIngredients[] }) => {
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeWithIngredients[]>(recipeWithIngredients);
  const [sortCriteria, setSortCriteria] = useState<"cooking_time" | "calories_per_serving" | "">("");

  const calorieRange = {
    min: Math.min(...recipeWithIngredients.map(({ recipe }) => recipe.calories_per_serving)),
    max: Math.max(...recipeWithIngredients.map(({ recipe }) => recipe.calories_per_serving)),
  };

  const cookingTimeRange = {
    min: Math.min(...recipeWithIngredients.map(({ recipe }) => recipe.cooking_time)),
    max: Math.max(...recipeWithIngredients.map(({ recipe }) => recipe.cooking_time)),
  };

  const allIngredients = recipeWithIngredients.flatMap(({ ingredients }) => ingredients);
  const uniqueIngredients = Array.from(
    new Map(allIngredients.map((ingredient) => [ingredient.name, ingredient])).values()
  );


  const handleFilterApply = (filters: FilterProps) => {
    console.log("Applied Filters:", filters);

    const filtered = recipeWithIngredients.filter(({ recipe, ingredients }) => {
      const matchesCookingTime = filters.cookingTime 
        ? recipe.cooking_time >= filters.cookingTime[0] && recipe.cooking_time <= filters.cookingTime[1] 
        : true;

      const matchesCalorieRange = filters.calorie 
        ? recipe.calories_per_serving >= filters.calorie[0] && recipe.calories_per_serving <= filters.calorie[1] 
        : true;

      const matchesIngredientAvoidance = filters.ingredientsToAvoid.length > 0
        ? !ingredients.some(ingredient => filters.ingredientsToAvoid.includes(ingredient.ingredient_id))
        : true;

      return matchesCookingTime && matchesCalorieRange && matchesIngredientAvoidance;
    });
    if (sortCriteria) {
      filtered.sort((a, b) => a.recipe[sortCriteria] - b.recipe[sortCriteria]);
    }

    setFilteredRecipes(filtered);
    
};


  const handleSort = (criteria: "cooking_time" | "calories_per_serving") => {
    setSortCriteria(criteria);
    const sortedRecipes = [...filteredRecipes].sort((a, b) => a.recipe[criteria] - b.recipe[criteria]);
    setFilteredRecipes(sortedRecipes);
  };


  return (
    <div className="container">
      <h1 className="px-4 text-3xl font-bold mb-3">Recipes</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-1/5">
          <FilterSidebar
            onFilterApply={handleFilterApply}
            calorieRange={calorieRange}
            cookingTimeRange={cookingTimeRange}
            ingredients={uniqueIngredients}
          />
        </aside>
        <main className="w-full lg:w-4/5">
          {/* Sorting Dropdown */}
          <div className="mb-4 flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Sort By {sortCriteria ? (sortCriteria === "cooking_time" ? ": Cooking Time" : ": Calories") : ""}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSort("cooking_time")}>Cooking Time</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("calories_per_serving")}>Calories</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Product Grid */}
          <ProductGrid recipeWithIngredients={filteredRecipes} />
        </main>
      </div>
    </div>
  );
};

export default FilterScreen;
