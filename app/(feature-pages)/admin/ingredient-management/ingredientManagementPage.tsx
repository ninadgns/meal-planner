"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Type definitions
interface Category {
  category_id: string;
  category_name: string;
}

interface Ingredient {
  ingredient_id: number;
  name: string;
  category_id: Category | null;
}

interface RecipeIngredient {
  recipe_id: {
    title: string;
  };
  ingredient_id: number;
}

interface IngredientManagementPageProps {
  ingredients: Ingredient[];
  recipeIngredients: RecipeIngredient[] | null;
}

const IngredientManagementPage: React.FC<IngredientManagementPageProps> = ({ 
  ingredients, 
  recipeIngredients 
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState<boolean>(false);
  const [currentIngredient, setCurrentIngredient] = useState<Ingredient | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [editedCategoryId, setEditedCategoryId] = useState<string>("");
  const [affectedRecipes, setAffectedRecipes] = useState<{title: string}[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const supabase = createClient();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("category_id, category_name");
      
      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        setCategories(data || []);
      }
    };

    fetchCategories();
  }, []);

  // Filter ingredients based on search term
  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if an ingredient is used in any recipes
  const getIngredientRecipes = (ingredientId: number): {title: string}[] => {
    if (!recipeIngredients) return [];
    
    return recipeIngredients
      .filter((ri) => ri.ingredient_id === ingredientId)
      .map((ri) => ri.recipe_id);
  };

  // Handle editing an ingredient
  const handleEditClick = (ingredient: Ingredient) => {
    setCurrentIngredient(ingredient);
    setEditedName(ingredient.name);
    setEditedCategoryId(ingredient.category_id?.category_id || "");
    setIsEditDialogOpen(true);
  };

  // Handle deleting an ingredient
  const handleDeleteClick = (ingredient: Ingredient) => {
    const recipes = getIngredientRecipes(ingredient.ingredient_id);
    setCurrentIngredient(ingredient);
    
    if (recipes.length > 0) {
      // Show warning that ingredient cannot be deleted
      setAffectedRecipes(recipes);
      setIsWarningDialogOpen(true);
    } else {
      // Show delete confirmation dialog
      setIsDeleteDialogOpen(true);
    }
  };

  // Update ingredient in the database
  const handleUpdateIngredient = async () => {
    if (!currentIngredient) return;
    
    setIsLoading(true);
    
    const recipes = getIngredientRecipes(currentIngredient.ingredient_id);
    
    if (recipes.length > 0) {
      // If recipes use this ingredient, show warning before updating
      setAffectedRecipes(recipes);
      setIsEditDialogOpen(false);
      setIsWarningDialogOpen(true);
      setIsLoading(false);
      return;
    }
    
    // Proceed with update if no recipes are affected
    await performUpdate();
  };

  // Perform the actual update operation
  const performUpdate = async () => {
    if (!currentIngredient) return;
    
    try {
      const { error } = await supabase
        .from("ingredients")
        .update({
          name: editedName,
          category_id: editedCategoryId || null
        })
        .eq("ingredient_id", currentIngredient.ingredient_id);

      if (error) {
        console.error("Error updating ingredient:", error);
        alert("Failed to update ingredient. Please try again.");
      } else {
        // Close the dialog and refresh the page to show updated data
        setIsEditDialogOpen(false);
        setIsWarningDialogOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete ingredient from the database
  const handleDeleteIngredient = async () => {
    if (!currentIngredient) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("ingredients")
        .delete()
        .eq("ingredient_id", currentIngredient.ingredient_id);

      if (error) {
        console.error("Error deleting ingredient:", error);
        alert("Failed to delete ingredient. Please try again.");
      } else {
        setIsDeleteDialogOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Ingredient Management</h1>
      
      {/* Search input */}
      <div className="mb-6">
        <Input
          placeholder="Search ingredients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {/* Ingredients table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Used in Recipes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIngredients.length > 0 ? (
              filteredIngredients.map((ingredient) => {
                const recipes = getIngredientRecipes(ingredient.ingredient_id);
                
                return (
                  <TableRow key={ingredient.ingredient_id}>
                    <TableCell className="font-medium">{ingredient.name}</TableCell>
                    <TableCell>{ingredient.category_id?.category_name || "Uncategorized"}</TableCell>
                    <TableCell>{recipes.length}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditClick(ingredient)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteClick(ingredient)}
                          disabled={recipes.length > 0}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No ingredients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit Ingredient Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Ingredient</DialogTitle>
            <DialogDescription>
              Update the ingredient's name or category.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category" className="text-right">
                Category
              </label>
              <Select
                value={editedCategoryId}
                onValueChange={setEditedCategoryId}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Uncategorized</SelectItem>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.category_id} 
                      value={category.category_id}
                    >
                      {category.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateIngredient}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the ingredient "{currentIngredient?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteIngredient}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Warning Dialog for Updates or Deletions */}
      <AlertDialog open={isWarningDialogOpen} onOpenChange={setIsWarningDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {editedName ? "Warning: Used in Recipes" : "Cannot Delete Ingredient"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {editedName ? (
                <>
                  This ingredient is used in {affectedRecipes.length} recipe(s).
                  Changing it will affect all recipes that use it.
                </>
              ) : (
                <>
                  This ingredient cannot be deleted because it's used in {affectedRecipes.length} recipe(s).
                  Remove it from all recipes first before deleting.
                </>
              )}
              
              <div className="mt-4 max-h-40 overflow-y-auto border rounded p-2">
                <h4 className="font-medium mb-2">Affected Recipes:</h4>
                <ul className="list-disc ml-5">
                  {affectedRecipes.map((recipe, index) => (
                    <li key={index}>{recipe.title}</li>
                  ))}
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {editedName && (
              <AlertDialogAction 
                onClick={performUpdate}
                disabled={isLoading}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {isLoading ? "Updating..." : "Update Anyway"}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default IngredientManagementPage;