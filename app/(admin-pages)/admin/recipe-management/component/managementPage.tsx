"use client"
import React from "react";
import RecipeForm from "./editPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Recipes } from "@/utils/type";
import RecipeDeletePage from "./DeletePage";

// Define types for the recipe data


const CreateEditPage = ({recipes}:{recipes:Recipes[]}) => {

  return (
    <div className="container mx-auto py-8 w-full">
      <RecipeSelector recipes={recipes} />
    </div>
  );
};

// Client-side component with TypeScript
interface RecipeSelectorProps {
  recipes: Recipes[];
}

function RecipeSelector({ recipes }: RecipeSelectorProps) {
  const [selectedRecipeId, setSelectedRecipeId] = React.useState<number | null>(null);

  const handleRecipeSelect = (value: string) => {
    setSelectedRecipeId(value ? parseInt(value) : null);
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Recipe Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="create">Create New Recipe</TabsTrigger>
            <TabsTrigger value="update">Update Existing Recipe</TabsTrigger>
            <TabsTrigger value="delete">Delete Existing Recipes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <RecipeForm />
          </TabsContent>
          
          <TabsContent value="update">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipe-select">Select Recipe to Update</Label>
                <Select onValueChange={handleRecipeSelect}>
                  <SelectTrigger id="recipe-select">
                    <SelectValue placeholder="Select a recipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipes.map((recipe) => (
                      <SelectItem key={recipe.recipe_id} value={recipe.recipe_id.toString()}>
                        {recipe.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedRecipeId ? (
                <RecipeForm recipeId={selectedRecipeId} />
              ) : (
                <div className="text-muted-foreground text-sm italic pt-4">
                  Please select a recipe to update
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="delete">
            <RecipeDeletePage recipeData={recipes}/>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default CreateEditPage;