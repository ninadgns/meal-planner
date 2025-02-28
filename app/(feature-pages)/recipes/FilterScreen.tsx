"use client";
import React, { useState } from "react";
import { RecipeWithIngredients } from "./page";
import ProductGrid from "./components/ProductGrid";
import FilterSidebar from "./components/FilterSidebar";

export interface FilterProps {
  calorie: number[];
  cookingTime: number[];
}

const FilterScreen = ({ recipeWithIngredients }: { recipeWithIngredients: RecipeWithIngredients[] }) => {
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeWithIngredients[]>(recipeWithIngredients);
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
  
    const filtered = recipeWithIngredients.filter(({ recipe }) => {
      // Filter by cooking time range
      const matchesCookingTime = filters.cookingTime
        ? recipe.cooking_time >= filters.cookingTime[0] && recipe.cooking_time <= filters.cookingTime[1]
        : true;
  
      // Filter by calories per serving range
      const matchesCalorieRange = filters.calorie
        ? recipe.calories_per_serving >= filters.calorie[0] && recipe.calories_per_serving <= filters.calorie[1]
        : true;
  
      return matchesCookingTime && matchesCalorieRange;
    });
  
    setFilteredRecipes(filtered);
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
          <ProductGrid recipeWithIngredients={filteredRecipes} />
        </main>
      </div>
    </div>
  );
};

export default FilterScreen;
