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
import { ChefHat, Clock, CookingPot, ListOrdered, Utensils } from "lucide-react"
import { Ingredients, Recipe_Directions, Recipes } from "@/utils/type"
import { formatCookingTime } from "@/utils/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type RecipeModalProps = {
  recipe: Recipes;
  ingredients: {
    ingredient: Ingredients;
    quantity_per_serving: number | null;
    unit: string | null;
  }[];
  steps?: Recipe_Directions[]; // Made steps optional
  isOpen?: boolean; // Allow external control
  onClose?: () => void; // Callback to close modal
  trigger?: React.ReactNode;
};

export function RecipeModal({ recipe, ingredients, isOpen, onClose, trigger, steps = [] }: RecipeModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = isOpen !== undefined;

  const handleOpenChange = (open: boolean) => {
    if (isControlled) {
      if (!open && onClose) onClose(); // Call onClose when externally controlled
    } else {
      setInternalOpen(open);
    }
  };

  // Nutrition values
  const nutritionData = [
    { label: "Calories", value: recipe.calories_per_serving, unit: "kcal" },
    { label: "Protein", value: recipe.protein_per_serving, unit: "g" },
    { label: "Carbs", value: recipe.carbs_per_serving, unit: "g" },
    { label: "Fat", value: recipe.fat_per_serving, unit: "g" },
  ];

  // Determine if steps should be shown
  const hasSteps = steps && steps.length > 0;

  return (
    <Dialog open={isControlled ? isOpen : internalOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">{recipe.title}</DialogTitle>
          {recipe.description && (
            <DialogDescription className="text-base mt-2">{recipe.description}</DialogDescription>
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
          <TabsList className={`grid ${hasSteps ? 'grid-cols-3' : 'grid-cols-2'} mb-4`}>
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            {hasSteps && <TabsTrigger value="steps">Cooking Instructions</TabsTrigger>}
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
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pl-4">
                {ingredients.map((item, index) => (
                  <li key={index} className="text-sm flex items-start group hover:bg-muted/30 p-1.5 rounded-md transition-colors">
                    <span className="w-2 h-2 bg-primary/80 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                    <span className="flex flex-wrap items-center">
                      <span className="font-medium">{item.ingredient.name}</span>
                      {item.quantity_per_serving && item.unit && (
                        <>
                          <span className="mx-1.5 text-muted-foreground inline-flex items-center">•</span>
                          <span className="text-muted-foreground">{item.quantity_per_serving} {item.unit}</span>
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          {hasSteps && (
            <TabsContent value="steps" className="space-y-4">
              <div>
                <h3 className="font-medium text-lg mb-3 flex items-center">
                  <span className="bg-primary/10 w-6 h-6 inline-flex items-center justify-center rounded-full mr-2 text-primary">
                    <ListOrdered className="h-3.5 w-3.5" />
                  </span>
                  Instructions
                </h3>
                <ol className="space-y-4 pl-4">
                  {steps.map((step, index) => (
                    <li key={index} className="pb-3 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                          {step.step_order}
                        </span>
                        {step.time_duration_minutes && (
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {step.time_duration_minutes} min
                          </span>
                        )}
                      </div>
                      <p className="text-sm mt-1">{step.step_description}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </TabsContent>
          )}

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
  );
}