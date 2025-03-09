"use client"
import {  RecipeWithIngredientsAndSteps } from "@/utils/type"
import { Clock, CookingPot, ChefHat, Utensils } from "lucide-react"
import { RecipeModal } from "./RecipeModal"
import { formatCookingTime } from "@/utils/utils"
import { Button } from "@/components/ui/button"



export default function RecipeGrid({ recipeWithIngredients }: { recipeWithIngredients: RecipeWithIngredientsAndSteps[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipeWithIngredients.map(({ recipe, ingredients, steps }) => (

        <div
          className="group bg-card rounded-xl shadow-md border border-border/50 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full"
          key={recipe.recipe_id}
        >
          <div className="p-6 flex flex-col flex-grow">
            <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{recipe.title}</h2>

            <p className="text-muted-foreground mb-4 line-clamp-2 flex-grow">
              {recipe.description || "A delicious recipe awaits you."}
            </p>

            <div className="mt-auto">
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm">{formatCookingTime(recipe.cooking_time)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CookingPot className="h-4 w-4 text-primary" />
                  <span className="text-sm">{recipe.serving_size}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-primary" />
                  <span className="text-sm">{ingredients.length} ingredients</span>
                </div>
              </div>

              <RecipeModal recipe={recipe} ingredients={ingredients} trigger={
                <Button className="w-full">
                  View Recipe
                </Button>
              } steps={steps} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}