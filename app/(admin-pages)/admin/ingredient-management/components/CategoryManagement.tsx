import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface Category {
  category_id: string;
  category_name: string;
  description: string | null;
}

interface CategoryManagementProps {
  categories: Category[];
  setIsAddCategoryDialogOpen: (open: boolean) => void;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({
  categories,
  setIsAddCategoryDialogOpen,
}) => {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}>
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
              {categories.map((category) => (
                <div key={category.category_id} className="px-4 py-2 text-sm hover:bg-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-700">{category.category_name}</span>
                      {category.description && (
                        <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button className="text-blue-600 hover:text-blue-800">Edit</button>
                      <span className="text-gray-300 mx-1">|</span>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
