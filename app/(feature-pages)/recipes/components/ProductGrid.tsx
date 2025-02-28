"use client"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Ingredients, Recipes } from "@/utils/type"



import { Clock, Copy } from "lucide-react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import { useState } from "react"
import { RecipeModal } from "./recipe-modal"
import { RecipeWithIngredients } from "../page"



export default function RecipeGrid({ recipeWithIngredients }: { recipeWithIngredients: RecipeWithIngredients[] }) {

  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipeWithIngredients.map(({recipe, ingredients}) => (
        <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
          <p className="text-muted-foreground mb-4 text-wrap">{recipe.description}</p>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{recipe.cooking_time} mins</span>
            </div>
            <RecipeModal recipe={recipe} ingredients={ingredients} />
          </div>
        </div>
        // <Card key={recipe.recipe_id} className="flex flex-col">
        //   <CardContent className="p-4 flex-grow">

        //     <h2 className="text-xl font-semibold line-clamp-2">{recipe.title}</h2>
        //   </CardContent>
        //   <CardFooter>
        //     <Dialog>
        //       <DialogTrigger asChild>
        //         <Button onClick={()=>fetchRecipe(recipe.recipe_id)} className="bg-green-500 w-full text-lg py-6">View Details</Button>
        //       </DialogTrigger>
        //       <DialogContent className="sm:max-w-md">
        //         <DialogHeader>
        //           <DialogTitle>{recipe.title}</DialogTitle>
        //           <DialogDescription>
        //             {recipe.description}
        //           </DialogDescription>
        //         </DialogHeader>
        //         <h1>Ingredients</h1>
        //         <div className="flex items-center space-x-2">
        //           <ul className="list-disc pl-5">
        //             {ingredients?.map((ingredient) => (
        //               <li key={ingredient.ingredient_id}>{ingredient.name}</li>
        //             ))}
        //           </ul>
        //         </div>
        //         <DialogFooter className="sm:justify-start">
        //           <DialogClose asChild>
        //             <Button type="button" variant="outline">
        //               Close
        //             </Button>
        //           </DialogClose>
        //         </DialogFooter>
        //       </DialogContent>
        //     </Dialog>
        //   </CardFooter>
        // </Card>
      ))}
    </div>
  )
}

