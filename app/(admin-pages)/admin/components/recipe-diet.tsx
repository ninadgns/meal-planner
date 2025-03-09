import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface RecipesWithDietsProps {
  recipesWithDiets: {
    recipe_title: string;
    applicable_diets: string[];
  }[];
}

export const getDietColor = (diet: string): string => {
  const dietColors: Record<string, string> = {
    "vegetarian": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
    "keto": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    "low cholesterol": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    "low protein": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "cardiac": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    "gluten-free": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    "lactose-free": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
    "diabetic": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  };

  // Convert diet to lowercase for matching
  const dietLower = diet.toLowerCase();

  // Return the mapped color or a default
  for (const [key, value] of Object.entries(dietColors)) {
    if (dietLower.includes(key)) {
      return value;
    }
  }

  // Default color if no match is found
  return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
};

const RecipesWithDiets: React.FC<RecipesWithDietsProps> = ({ recipesWithDiets }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Get all unique diet types for filtering
  const allDietTypes = Array.from(
    new Set(recipesWithDiets.flatMap(recipe => recipe.applicable_diets))
  ).sort();

  // Filter recipes based on search term
  const filteredRecipes = recipesWithDiets.filter(recipe =>
    recipe.recipe_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.applicable_diets.some(diet =>
      diet.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Color mapping for diet types



  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recipes by Diet Type</h2>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search recipes or diets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium pt-1">Filter by diet:</span>
          {allDietTypes.map((diet) => (
            <Badge
              key={diet}
              variant="outline"
              className={`cursor-pointer ${searchTerm === diet ? 'ring-2 ring-offset-2' : ''} ${getDietColor(diet)}`}
              onClick={() => setSearchTerm(searchTerm === diet ? "" : diet)}
            >
              {diet}
            </Badge>
          ))}
        </div>
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {filteredRecipes.map((recipe, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{recipe.recipe_title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recipe.applicable_diets.map((diet, dietIndex) => (
                    <Badge key={dietIndex} className={getDietColor(diet)}>
                      {diet}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No recipes found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default RecipesWithDiets;