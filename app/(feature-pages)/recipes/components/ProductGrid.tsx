"use client"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Ingredients, Recipes } from "@/utils/type"



import { Clock, CookingPot, Copy, Users } from "lucide-react"

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
import { RecipeModal } from "./RecipeModal"
import { RecipeWithIngredients } from "../page"

export const formatCookingTime = (minutes:number) => {
  return minutes > 59
    ? `${Math.floor(minutes / 60)}h ${minutes % 60}m`
    : `${minutes} mins`;
};

export default function RecipeGrid({ recipeWithIngredients }: { recipeWithIngredients: RecipeWithIngredients[] }) {

  
  
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipeWithIngredients.map(({ recipe, ingredients }) => (
        <div className=" max-w-md w-full bg-card p-6 rounded-lg shadow-sm border flex flex-col justify-between gap-2">
          <div className="">
            <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
            <p className="text-muted-foreground mb-4 text-wrap">{recipe.description}</p>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2 flex-col">
              <div className="flex gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{formatCookingTime(recipe.cooking_time)}</span>
              </div>
              <div className="flex gap-2">
                <CookingPot className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{recipe.serving_size}</span>
              </div>
            </div>
            <RecipeModal recipe={recipe} ingredients={ingredients} />
          </div>
        </div>
      ))}
    </div>
  )
}

