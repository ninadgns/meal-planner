import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// User Recipe interface
interface UserRecipe {
  recipe_id: number | null;
  title: string | null;
  user_id: string | null;
  user_name: string | null;
}

interface UserRecipeTableProps {
  recipes: UserRecipe[];
}

const UserRecipeTable: React.FC<UserRecipeTableProps> = ({ recipes }) => {
  return (
    <Table>
      <TableCaption>A list of user recipes</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">Recipe ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="text-center">User ID</TableHead>
          <TableHead className="text-right">User Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <TableRow key={recipe.recipe_id}>
              <TableCell className="font-medium">{recipe.recipe_id}</TableCell>
              <TableCell className="text-left">{recipe.title}</TableCell>
              <TableCell>{recipe.user_id}</TableCell>
              <TableCell className="text-right">{recipe.user_name}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No recipes found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default UserRecipeTable;