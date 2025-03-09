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
  description: string | null;
}

interface Ingredients {
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
  ingredients: Ingredients[];
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
  const [currentIngredient, setCurrentIngredient] = useState<Ingredients | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [editedCategoryId, setEditedCategoryId] = useState<string>("");
  const [affectedRecipes, setAffectedRecipes] = useState<{ title: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"edit" | "delete" | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [newIngredientName, setNewIngredientName] = useState<string>("");
  const [newIngredientCategoryId, setNewIngredientCategoryId] = useState<string>("");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState<boolean>(false);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState<boolean>(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState<boolean>(false);
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState<boolean>(false);
  const [isCategoryWarningDialogOpen, setIsCategoryWarningDialogOpen] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState<string>("");
  const [affectedIngredients, setAffectedIngredients] = useState<Ingredients[]>([]);
  const [categoryActionType, setCategoryActionType] = useState<"edit" | "delete" | null>(null);
  const [newCategoryDescription, setNewCategoryDescription] = useState<string>("");
  const [editedCategoryDescription, setEditedCategoryDescription] = useState<string>("");
  const supabase = createClient();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("category_id, category_name, description");

      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        setCategories(data || []);
      }
    };

    fetchCategories();
  }, []);;

  // Filter ingredients based on search term
  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if an ingredient is used in any recipes
  const getIngredientRecipes = (ingredientId: number): { title: string }[] => {
    if (!recipeIngredients) return [];

    return recipeIngredients
      .filter((ri) => ri.ingredient_id === ingredientId)
      .map((ri) => ri.recipe_id);
  };

  const getCategoryIngredients = (categoryId: string): Ingredients[] => {
    return ingredients.filter(
      (ingredient) => ingredient.category_id?.category_id === categoryId
    );
  };

  // Add this function to handle adding a new category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          category_id: `c${categories.length + 1}`,
          category_name: newCategoryName.trim(),
          description: newCategoryDescription.trim() || null
        })
        .select();

      if (error) {
        console.error("Error adding category:", error);
        alert("Failed to add category. Please try again.");
      } else {
        setIsAddCategoryDialogOpen(false);
        setNewCategoryName("");
        setNewCategoryDescription("");
        // Fetch updated categories
        const { data: updatedCategories } = await supabase
          .from("categories")
          .select("category_id, category_name, description");
        if (updatedCategories) {
          setCategories(updatedCategories);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add this function to handle editing a category
  const handleEditCategoryClick = (category: Category) => {
    setCurrentCategory(category);
    setEditedCategoryName(category.category_name);
    setEditedCategoryDescription(category.description || "");

    // Check if any ingredients use this category
    const categoryIngredients = getCategoryIngredients(category.category_id);
    setAffectedIngredients(categoryIngredients);

    if (categoryIngredients.length > 0) {
      setCategoryActionType("edit");
      setIsCategoryWarningDialogOpen(true);
    } else {
      setIsEditCategoryDialogOpen(true);
    }
  };

  // Add this function to handle updating a category
  const handleUpdateCategory = async () => {
    if (!currentCategory || !editedCategoryName.trim()) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("categories")
        .update({
          category_name: editedCategoryName.trim(),
          description: editedCategoryDescription.trim() || null
        })
        .eq("category_id", currentCategory.category_id);

      if (error) {
        console.error("Error updating category:", error);
        alert("Failed to update category. Please try again.");
      } else {
        setIsEditCategoryDialogOpen(false);
        setIsCategoryWarningDialogOpen(false);

        // Fetch updated categories
        const { data: updatedCategories } = await supabase
          .from("categories")
          .select("category_id, category_name, description");
        if (updatedCategories) {
          setCategories(updatedCategories);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add this function to handle deleting a category
  const handleDeleteCategoryClick = (category: Category) => {
    setCurrentCategory(category);

    // Check if any ingredients use this category
    const categoryIngredients = getCategoryIngredients(category.category_id);

    if (categoryIngredients.length > 0) {
      setAffectedIngredients(categoryIngredients);
      setCategoryActionType("delete");
      setIsCategoryWarningDialogOpen(true);
    } else {
      setIsDeleteCategoryDialogOpen(true);
    }
  };

  // Add this function to handle deleting a category from the database
  const handleDeleteCategory = async () => {
    if (!currentCategory) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("category_id", currentCategory.category_id);

      if (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category. Please try again.");
      } else {
        setIsDeleteCategoryDialogOpen(false);

        // Fetch updated categories
        const { data: updatedCategories } = await supabase
          .from("categories")
          .select("*");
        if (updatedCategories) {
          setCategories(updatedCategories);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleAddIngredient = async () => {
    if (!newIngredientName.trim()) {
      alert("Please enter an ingredient name");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("ingredients")
        .insert({
          name: newIngredientName.trim(),
          category_id: newIngredientCategoryId || null
        })
        .select();

      if (error) {
        console.error("Error adding ingredient:", error);
        alert("Failed to add ingredient. Please try again.");
      } else {
        setIsAddDialogOpen(false);
        setNewIngredientName("");
        setNewIngredientCategoryId("");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  // Handle editing an ingredient
  const handleEditClick = (ingredient: Ingredients) => {
    setCurrentIngredient(ingredient);
    setEditedName(ingredient.name);
    setEditedCategoryId(ingredient.category_id?.category_id || "");
    setIsEditDialogOpen(true);
    setActionType("edit");
  };

  // Handle deleting an ingredient
  const handleDeleteClick = (ingredient: Ingredients) => {
    setCurrentIngredient(ingredient);
    const recipes = getIngredientRecipes(ingredient.ingredient_id);
    setAffectedRecipes(recipes);

    if (recipes.length > 0) {
      // Show warning that ingredient cannot be deleted
      setActionType("delete");
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
      setActionType("edit");
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

      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
            >
              Manage Categories
            </Button>

            {isCategoryMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setIsCategoryMenuOpen(false);
                      setIsAddCategoryDialogOpen(true);
                    }}
                  >
                    Add New Category
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <div className="max-h-60 overflow-y-auto">
                    {categories.map(category => (
                      <div key={category.category_id} className="px-4 py-2 text-sm hover:bg-gray-100">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-gray-700">{category.category_name}</span>
                            {category.description && (
                              <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <button
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => {
                                setIsCategoryMenuOpen(false);
                                handleEditCategoryClick(category);
                              }}
                            >
                              Edit
                            </button>
                            <span className="text-gray-300 mx-1">|</span>
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => {
                                setIsCategoryMenuOpen(false);
                                handleDeleteCategoryClick(category);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
          >
            Add New Ingredient
          </Button>
        </div>
      </div>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Ingredient</DialogTitle>
            <DialogDescription>
              Enter the details for the new ingredient.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="new-name" className="text-right">
                Name
              </label>
              <Input
                id="new-name"
                value={newIngredientName}
                onChange={(e) => setNewIngredientName(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="new-category" className="text-right">
                Category
              </label>
              <Select
                value={newIngredientCategoryId}
                onValueChange={setNewIngredientCategoryId}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
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
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddIngredient}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Ingredient"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Enter details for the new category.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category-name" className="text-right">
                Name
              </label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category-description" className="text-right">
                Description
              </label>
              <Input
                id="category-description"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                className="col-span-3"
                placeholder="Optional"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCategory}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category details.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-category-name" className="text-right">
                Name
              </label>
              <Input
                id="edit-category-name"
                value={editedCategoryName}
                onChange={(e) => setEditedCategoryName(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-category-description" className="text-right">
                Description
              </label>
              <Input
                id="edit-category-description"
                value={editedCategoryDescription}
                onChange={(e) => setEditedCategoryDescription(e.target.value)}
                className="col-span-3"
                placeholder="Optional"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateCategory}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category "{currentCategory?.category_name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isCategoryWarningDialogOpen} onOpenChange={setIsCategoryWarningDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {categoryActionType === "edit" ? "Warning: Category In Use" : "Cannot Delete Category"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {categoryActionType === "edit" ? (
                <>
                  This category is used by {affectedIngredients.length} ingredient(s).
                  Changing it will affect all ingredients in this category.
                </>
              ) : (
                <>
                  This category cannot be deleted because it contains {affectedIngredients.length} ingredient(s).
                  You must first move or delete all ingredients in this category.
                </>
              )}

              <div className="mt-4 max-h-40 overflow-y-auto border rounded p-2">
                <h4 className="font-medium mb-2">Affected Ingredients:</h4>
                <ul className="list-disc ml-5">
                  {affectedIngredients.map((ingredient) => (
                    <li key={ingredient.ingredient_id}>{ingredient.name}</li>
                  ))}
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {categoryActionType === "edit" && (
              <AlertDialogAction
                onClick={() => {
                  setIsCategoryWarningDialogOpen(false);
                  setIsEditCategoryDialogOpen(true);
                }}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Edit Anyway
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      {/* Ingredients table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow >
              <TableHead className="text-left">Name</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Used in Recipes</TableHead>
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
              {actionType === "edit" ? "Warning: Used in Recipes" : "Cannot Delete Ingredient"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "edit" ? (
                <>
                  This ingredient is used in {affectedRecipes.length} recipe(s).
                  Changing it will affect all recipes that use it.
                </>
              ) : (
                <>
                  This ingredient cannot be deleted because it's used in the following recipe(s).
                  You must remove it from all recipes before deleting.
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
            <AlertDialogCancel>Close</AlertDialogCancel>
            {actionType === "edit" && (
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