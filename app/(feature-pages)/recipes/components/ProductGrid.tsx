"use client"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Ingredients, Recipes } from "@/utils/type"



import { Copy } from "lucide-react"

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



export default function RecipeGrid({ recipes }: { recipes: Recipes[] }) {

  const [ingredients, setIngredients] = useState<Ingredients[]|null>();
  const fetchRecipe = async (id: string) => {
    setIngredients([{name: "loading",
    ingredient_id: "loading",
    category_id: "loading",
    }]);
    const supabase = await createClient();
    const { data: ingredientId, error: ingredientError } = await supabase.from("recipe_ingredients").select("*").eq("recipe_id", id);
    if(ingredientError) return console.log("error fetching ingredients");
    const {data:ingredient, error:ingredientError2} = await supabase.from("ingredients").select("*").in("ingredient_id", ingredientId?.map((ingredient)=>ingredient.ingredient_id));
    console.log(ingredient);
    setIngredients(ingredient);
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <Card key={recipe.recipe_id} className="flex flex-col">
          <CardContent className="p-4 flex-grow">

            <h2 className="text-xl font-semibold line-clamp-2">{recipe.title}</h2>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={()=>fetchRecipe(recipe.recipe_id)} className="bg-green-500 w-full text-lg py-6">View Details</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{recipe.title}</DialogTitle>
                  <DialogDescription>
                    {recipe.description}
                  </DialogDescription>
                </DialogHeader>
                <h1>Ingredients</h1>
                <div className="flex items-center space-x-2">
                  <ul className="list-disc pl-5">
                    {ingredients?.map((ingredient) => (
                      <li key={ingredient.ingredient_id}>{ingredient.name}</li>
                    ))}
                  </ul>
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

