"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, ChefHat } from "lucide-react"
import { Ingredients, Recipes } from "@/utils/type"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"





export function RecipeModal({ recipe, ingredients}: { recipe: Recipes; ingredients: Ingredients[] }) {
    
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button  variant="outline" className="bg-green-400">View Recipe</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{recipe.title}</DialogTitle>
          {recipe.description && <DialogDescription>{recipe.description}</DialogDescription>}
        </DialogHeader>

        <div className="flex flex-wrap gap-2 my-2">
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{recipe.cooking_time} mins</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{recipe.serving_size}</span>
          </div>
          {/* {recipe.difficulty && (
            <div className="flex items-center gap-1 text-sm">
              <ChefHat className="h-4 w-4 text-muted-foreground" />
              <span>{recipe.difficulty}</span>
            </div>
          )} */}
        </div>

        {/* {recipe.tags && (
          <div className="flex flex-wrap gap-1 my-2">
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )} */}

        {/* <Separator /> */}

        <div className="grid gap-4 py-4">
          <div>
            <h3 className="font-medium mb-2">Ingredients</h3>
            <ul className="list-disc pl-5 space-y-1">
              {ingredients?.map((ingredient, index) => (
                <li key={index} className="text-sm">
                   {ingredient.name}
                </li>
              ))}
            </ul>
          </div>

          {/* <div>
            <h3 className="font-medium mb-2">Instructions</h3>
            <ol className="list-decimal pl-5 space-y-2">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="text-sm">
                  {step}
                </li>
              ))}
            </ol>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}

