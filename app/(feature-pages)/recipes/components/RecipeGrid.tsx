"use client"
import { RecipeWithIngredients } from "@/utils/type"
import { Clock, CookingPot, ChefHat } from "lucide-react"
import { RecipeModal } from "./RecipeModal"
import { formatCookingTime } from "@/utils/utils"



export default function RecipeGrid({ recipeWithIngredients }: { recipeWithIngredients: RecipeWithIngredients[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipeWithIngredients.map(({ recipe, ingredients }) => (
        <div 
          className="group bg-card rounded-xl shadow-md border border-border/50 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full" 
          key={recipe.recipe_id}
        >
          {/* Recipe image placeholder - uncomment if you have images */}
          {/* <div className="h-48 bg-muted relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <img 
              src="/api/placeholder/400/300" 
              alt={recipe.title} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
            />
          </div> */}
          
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
                  <ChefHat className="h-4 w-4 text-primary" />
                  <span className="text-sm">{ingredients.length} ingredients</span>
                </div>
              </div>
              
              <RecipeModal recipe={recipe} ingredients={ingredients} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}