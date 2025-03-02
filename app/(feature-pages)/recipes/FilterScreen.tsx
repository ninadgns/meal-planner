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

  const handleFilterApply = (filters: FilterProps) => {
    console.log("Applied Filters:", filters);

    const filtered = filteredRecipes.filter(({ recipe }) => {
      const matchesCookingTime =
        filters.cookingTime
          ? recipe.cooking_time >= filters.cookingTime[0] &&
            recipe.cooking_time <= filters.cookingTime[1]
          : true;

      const matchesCalorieRange =
        filters.calorie
          ? recipe.calories_per_serving >= filters.calorie[0] &&
            recipe.calories_per_serving <= filters.calorie[1]
          : true;

      return matchesCookingTime && matchesCalorieRange;
    });

    setFilteredRecipes(filtered);
  };

  const handleSort = (criteria: "cooking_time" | "calories_per_serving") => {
    setSortCriteria(criteria);
    const sortedRecipes = [...filteredRecipes].sort((a, b) => a.recipe[criteria] - b.recipe[criteria]);
    setFilteredRecipes(sortedRecipes);
  };

  return (
    <div className="container">
      <h1 className="text-4xl font-bold mb-3">Recipes</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-1/5">
          <FilterSidebar
            onFilterApply={handleFilterApply}
            calorieRange={calorieRange}
            cookingTimeRange={cookingTimeRange}
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
