"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import IngredientTable from "./IngredientTable";
import IngredientDialogs from "./IngredientDialogs";
import CategoryManagement from "./CategoryManagement";
import CategoryDialogs from "./CategoryDialogs";

// Type Definitions
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
  recipeIngredients,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] =
    useState<boolean>(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("category_id, category_name, description");

      if (error) console.error("Error fetching categories:", error);
      else setCategories(data || []);
    };
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Ingredient Management</h1>
      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Search ingredients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <div className="flex gap-2">
          <CategoryManagement
            categories={categories}
            setIsAddCategoryDialogOpen={setIsAddCategoryDialogOpen}
          />
          <Button onClick={() => setIsAddDialogOpen(true)}>Add Ingredient</Button>
        </div>
      </div>
      <IngredientTable ingredients={ingredients} searchTerm={searchTerm} />
      <IngredientDialogs
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        categories={categories}
      />
      <CategoryDialogs
        isAddCategoryDialogOpen={isAddCategoryDialogOpen}
        setIsAddCategoryDialogOpen={setIsAddCategoryDialogOpen}
      />
    </div>
  );
};

export default IngredientManagementPage;
