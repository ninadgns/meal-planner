import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  category_id: string;
  category_name: string;
}

interface IngredientDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  categories: Category[];
}

const IngredientDialogs: React.FC<IngredientDialogsProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  categories,
}) => {
  const [newIngredientName, setNewIngredientName] = useState<string>("");
  const [newIngredientCategoryId, setNewIngredientCategoryId] = useState<string>("");

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Ingredient</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Ingredient Name"
            value={newIngredientName}
            onChange={(e) => setNewIngredientName(e.target.value)}
          />
          <Select value={newIngredientCategoryId} onValueChange={setNewIngredientCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
            Cancel
          </Button>
          <Button>Add Ingredient</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IngredientDialogs;
