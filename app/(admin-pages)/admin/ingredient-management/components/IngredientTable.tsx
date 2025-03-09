import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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

interface IngredientTableProps {
  ingredients: Ingredients[];
  searchTerm: string;
}

const IngredientTable: React.FC<IngredientTableProps> = ({
  ingredients,
  searchTerm,
}) => {
  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredIngredients.length > 0 ? (
            filteredIngredients.map((ingredient) => (
              <TableRow key={ingredient.ingredient_id}>
                <TableCell>{ingredient.name}</TableCell>
                <TableCell>{ingredient.category_id?.category_name || "Uncategorized"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                No ingredients found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default IngredientTable;
