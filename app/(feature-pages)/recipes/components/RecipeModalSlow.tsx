"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Supabase client
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CookingPot, ListOrdered, Utensils, Salad } from "lucide-react";
import { formatCookingTime } from "@/utils/utils";

export function RecipeModalSlow({ recipe_id }: { recipe_id: number }) {
  const supabase = createClient();

  // State for fetched data
  const [recipe, setRecipe] = useState<any>(null);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);

  // Fetch recipe details when modal opens
  useEffect(() => {
    if (open) {
      fetchRecipeData();
    }
  }, [open]);

  const fetchRecipeData = async () => {
    setLoading(true);

    try {
      // Fetch Recipe Details
      const { data: recipeData, error: recipeError } = await supabase
        .from("recipes")
        .select("*")
        .eq("recipe_id", recipe_id)
        .single();

      if (recipeError) throw recipeError;
      setRecipe(recipeData);

      // Fetch Ingredients
      const { data: ingredientData, error: ingredientError } = await supabase
        .from("recipe_ingredients")
        .select("quantity_per_serving, unit, ingredient:ingredients(name)")
        .eq("recipe_id", recipe_id);

      if (ingredientError) throw ingredientError;
      setIngredients(ingredientData || []);

      // Fetch Steps
      const { data: stepData, error: stepError } = await supabase
        .from("recipe_directions")
        .select("step_order, step_description, time_duration_minutes")
        .eq("recipe_id", recipe_id)
        .order("step_order");

      if (stepError) throw stepError;
      setSteps(stepData || []);

    } catch (error) {
      console.error("Error fetching recipe data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Nutrition values
  const nutritionData = recipe
    ? [
        { label: "Calories", value: recipe.calories_per_serving, unit: "kcal" },
        { label: "Protein", value: recipe.protein_per_serving, unit: "g" },
        { label: "Carbs", value: recipe.carbs_per_serving, unit: "g" },
        { label: "Fat", value: recipe.fat_per_serving, unit: "g" },
      ]
    : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View Recipe</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="text-center py-6">Loading...</div>
        ) : recipe ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary">{recipe.title}</DialogTitle>
              {recipe.description && (
                <DialogDescription className="text-base mt-2">{recipe.description}</DialogDescription>
              )}
            </DialogHeader>

            {/* Recipe Info */}
            <div className="flex flex-wrap gap-4 my-4">
              <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{formatCookingTime(recipe.cooking_time)}</span>
              </div>
              <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                <CookingPot className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{recipe.serving_size} servings</span>
              </div>
              <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                <Utensils className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{ingredients.length} ingredients</span>
              </div>
            </div>

            {/* Tabs for Ingredients, Instructions, and Nutrition */}
            <Tabs defaultValue="ingredients" className="w-full">
              <TabsList className={`grid ${steps.length > 0 ? 'grid-cols-3' : 'grid-cols-2'} mb-4`}>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                {steps.length > 0 && <TabsTrigger value="steps">Cooking Instructions</TabsTrigger>}
                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              </TabsList>

              {/* Ingredients Tab */}
              <TabsContent value="ingredients">
                <h3 className="font-medium text-lg mb-3 flex items-center">
                  <Utensils className="h-5 w-5 mr-2 text-primary" />
                  Ingredients
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                  {ingredients.map((item, index) => (
                    <li key={index} className="text-sm flex items-start group hover:bg-muted/30 p-1.5 rounded-md transition-colors">
                      <span className="w-2 h-2 bg-primary/80 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                      <span className="font-medium">{item.ingredient.name}</span>
                      {item.quantity_per_serving && item.unit && (
                        <>
                          <span className="mx-1.5 text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{item.quantity_per_serving} {item.unit}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </TabsContent>

              {/* Cooking Steps Tab */}
              {steps.length > 0 && (
                <TabsContent value="steps">
                  <h3 className="font-medium text-lg mb-3 flex items-center">
                    <ListOrdered className="h-5 w-5 mr-2 text-primary" />
                    Instructions
                  </h3>
                  <ol className="space-y-4">
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
                </TabsContent>
              )}

              {/* ✅ Fixed Nutrition Tab */}
              <TabsContent value="nutrition">
                <h3 className="font-medium text-lg mb-3 flex items-center">
                  <Salad className="h-5 w-5 mr-2 text-primary" />
                  Nutrition per Serving
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {nutritionData.map((item) => (
                    <div key={item.label} className="bg-card rounded-lg p-4 text-center shadow-sm border border-border/50">
                      <div className="text-2xl font-bold text-primary">{item.value}{item.unit}</div>
                      <div className="text-sm text-muted-foreground">{item.label}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <p className="text-center py-6 text-red-500">Recipe not found</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
