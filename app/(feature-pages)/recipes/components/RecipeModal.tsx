"use client"
import { useState } from "react"
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
import { Clock, Users, ChefHat, CookingPot, Utensils, Eye } from "lucide-react"
import { Ingredients, Recipes } from "@/utils/type"
import { formatCookingTime } from "@/utils/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type RecipeModalProps = {
  recipe: Recipes;
  ingredients: Ingredients[];
  trigger?: React.ReactNode;
};

export function RecipeModal({ recipe, ingredients, trigger }: RecipeModalProps) {
  const defaultTrigger = (
    <Button variant="default" className="w-full group-hover:bg-primary/90 transition-colors">
      View Recipe
    </Button>
  );
  
  // Nutrition values
  const nutritionData = [
    { label: "Calories", value: recipe.calories_per_serving, unit: "kcal" },
    { label: "Protein", value: recipe.protein_per_serving, unit: "g" },
    { label: "Carbs", value: recipe.carbs_per_serving, unit: "g" },
    { label: "Fat", value: recipe.fat_per_serving, unit: "g" },
  ];
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">{recipe.title}</DialogTitle>
          {recipe.description && (
            <DialogDescription className="text-base mt-2">
              {recipe.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex flex-wrap gap-4 my-4">
          <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{formatCookingTime(recipe.cooking_time)}</span>
          </div>
          <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
            <CookingPot className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{recipe.serving_size}</span>
          </div>
          <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
            <Utensils className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{ingredients.length} ingredients</span>
          </div>
        </div>

        <Tabs defaultValue="ingredients" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ingredients" className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-3 flex items-center">
                <span className="bg-primary/10 w-6 h-6 inline-flex items-center justify-center rounded-full mr-2 text-primary">
                  <ChefHat className="h-3.5 w-3.5" />
                </span>
                Ingredients
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 pl-4">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="text-sm flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary/80 rounded-full mr-2"></span>
                    {ingredient.name}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="nutrition">
            <div className="bg-muted/40 rounded-lg p-4">
              <h3 className="font-medium text-lg mb-4">Nutrition per serving</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {nutritionData.map((item) => (
                  <div key={item.label} className="bg-card rounded-lg p-4 text-center shadow-sm border border-border/50">
                    <div className="text-2xl font-bold text-primary">
                      {item.value}{item.unit}
                    </div>
                    <div className="text-sm text-muted-foreground">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}