"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Diets, DietType1, DietType2 } from "@/utils/type";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

// Define TypeScript interfaces for the data structures



interface Category {
  id: string;
  name: string;
}

interface CurrentDietState {
  diet_id: string;
  diet_name: string;
  description: string | null;
  diet_type: string;
  type1Details: {
    per_meal_calorie_min: number | null;
    per_meal_calorie_max: number | null;
    per_meal_protein_min: number | null;
    per_meal_protein_max: number | null;
    per_meal_carbs_min: number | null;
    per_meal_carbs_max: number | null;
    per_meal_fat_min: number | null;
    per_meal_fat_max: number | null;
  };
  type2Details: {
    category_ids: string[];
  };
}

interface DietManagementProps {
  diets: Diets[];
  diets_type_1: DietType1[];
  diets_type_2: DietType2[];
}

const DietManagement: React.FC<DietManagementProps> = ({
  diets,
  diets_type_1,
  diets_type_2
}) => {
  const supabase = createClient();
  const [allDiets, setAllDiets] = useState<Diets[]>(diets || []);
  const [allDietsType1, setAllDietsType1] = useState<DietType1[]>(diets_type_1 || []);
  const [allDietsType2, setAllDietsType2] = useState<DietType2[]>(diets_type_2 || []);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentDiet, setCurrentDiet] = useState<CurrentDietState>({
    diet_id: "",
    diet_name: "",
    description: "",
    diet_type: "1",
    type1Details: {
      per_meal_calorie_min: 200,
      per_meal_calorie_max: 800,
      per_meal_protein_min: 15,
      per_meal_protein_max: 75,
      per_meal_carbs_min: 30,
      per_meal_carbs_max: 90,
      per_meal_fat_min: 5,
      per_meal_fat_max: 20
    },
    type2Details: {
      category_ids: []
    }
  });
  const [categories] = useState<Category[]>([
    { id: "c01", name: "Vegetables" },
    { id: "c04", name: "Dairy" },
    { id: "c05", name: "Grains" },
    { id: "c06", name: "Meat" },
    { id: "c07", name: "Fish" }
  ]);

  // Open dialog for creating a new diet
  const handleCreateDiet = (): void => {
    // Generate a new diet ID (format: dXX where XX is next number)
    const nextId = allDiets.length > 0
      ? Math.max(...allDiets.map(d => parseInt(d.diet_id.substring(1)))) + 1
      : 1;
    const newDietId = `d${nextId.toString().padStart(2, '0')}`;

    setCurrentDiet({
      diet_id: newDietId,
      diet_name: "",
      description: "",
      diet_type: "1",
      type1Details: {
        per_meal_calorie_min: 200,
        per_meal_calorie_max: 800,
        per_meal_protein_min: 15,
        per_meal_protein_max: 75,
        per_meal_carbs_min: 30,
        per_meal_carbs_max: 90,
        per_meal_fat_min: 5,
        per_meal_fat_max: 20
      },
      type2Details: {
        category_ids: []
      }
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  // Open dialog for editing an existing diet
  const handleEditDiet = (diet: Diets): void => {
    // Find type 1 details if applicable
    const type1Details = allDietsType1.find(d => d.diet_id === diet.diet_id) || {
      per_meal_calorie_min: 200,
      per_meal_calorie_max: 800,
      per_meal_protein_min: 15,
      per_meal_protein_max: 75,
      per_meal_carbs_min: 30,
      per_meal_carbs_max: 90,
      per_meal_fat_min: 5,
      per_meal_fat_max: 20
    };

    // Find type 2 details if applicable
    const type2Details = {
      category_ids: allDietsType2
        .filter(d => d.diet_id === diet.diet_id)
        .map(d => d.category_id)
    };

    setCurrentDiet({
      ...diet,
      diet_type: diet.diet_type.toString(),
      type1Details,
      type2Details
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  // Handle input changes for diet basic info
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setCurrentDiet(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input changes for type 1 diet specific fields
  const handleType1InputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCurrentDiet(prev => ({
      ...prev,
      type1Details: {
        ...prev.type1Details,
        [name]: parseFloat(value)
      }
    }));
  };

  // Toggle a category for type 2 diets
  const handleCategoryToggle = (categoryId: string): void => {
    setCurrentDiet(prev => {
      const currentCategories = [...prev.type2Details.category_ids];
      const updatedCategories = currentCategories.includes(categoryId)
        ? currentCategories.filter(id => id !== categoryId)
        : [...currentCategories, categoryId];

      return {
        ...prev,
        type2Details: {
          ...prev.type2Details,
          category_ids: updatedCategories
        }
      };
    });
  };

  // Save a new or updated diet
  const handleSaveDiet = async (): Promise<void> => {
    try {
      const dietData: Diets = {
        diet_id: currentDiet.diet_id,
        diet_name: currentDiet.diet_name,
        description: currentDiet.description,
        diet_type: parseInt(currentDiet.diet_type)
      };

      if (isEditing) {
        // Update existing diet
        const { error } = await supabase
          .from('diets')
          .update(dietData)
          .eq('diet_id', currentDiet.diet_id);

        if (error) throw error;

        // Update diet specific data
        if (currentDiet.diet_type === "1") {
          // Delete previous type 2 data if diet switched from type 2 to 1
          await supabase
            .from('diets_type_2')
            .delete()
            .eq('diet_id', currentDiet.diet_id);

          // Update or insert type 1 data
          const type1Data: DietType1 = {
            diet_id: currentDiet.diet_id,
            ...currentDiet.type1Details
          };

          const { error: type1Error } = await supabase
            .from('diets_type_1')
            .upsert(type1Data);

          if (type1Error) throw type1Error;
        } else {
          // Delete previous type 1 data if diet switched from type 1 to 2
          await supabase
            .from('diets_type_1')
            .delete()
            .eq('diet_id', currentDiet.diet_id);

          // Delete all existing type 2 entries for this diet
          await supabase
            .from('diets_type_2')
            .delete()
            .eq('diet_id', currentDiet.diet_id);

          // Insert new type 2 entries
          for (const categoryId of currentDiet.type2Details.category_ids) {
            const type2Data: DietType2 = {
              diet_id: currentDiet.diet_id,
              category_id: categoryId
            };

            const { error: type2Error } = await supabase
              .from('diets_type_2')
              .insert(type2Data);

            if (type2Error) throw type2Error;
          }
        }

        // Update local state
        setAllDiets(prev =>
          prev.map(d => d.diet_id === currentDiet.diet_id ? dietData : d)
        );
      } else {
        // Insert new diet
        const { error } = await supabase
          .from('diets')
          .insert(dietData);

        if (error) throw error;

        // Insert diet specific data
        if (currentDiet.diet_type === "1") {
          const type1Data: DietType1 = {
            diet_id: currentDiet.diet_id,
            ...currentDiet.type1Details
          };

          const { error: type1Error } = await supabase
            .from('diets_type_1')
            .insert(type1Data);

          if (type1Error) throw type1Error;
        } else {
          for (const categoryId of currentDiet.type2Details.category_ids) {
            const type2Data: DietType2 = {
              diet_id: currentDiet.diet_id,
              category_id: categoryId
            };

            const { error: type2Error } = await supabase
              .from('diets_type_2')
              .insert(type2Data);

            if (type2Error) throw type2Error;
          }
        }

        // Update local state
        setAllDiets(prev => [...prev, dietData]);
      }

      // Refresh data
      const { data: diets } = await supabase.from('diets').select('*');
      const { data: diets_type_1 } = await supabase.from('diets_type_1').select('*');
      const { data: diets_type_2 } = await supabase.from('diets_type_2').select('*');

      if (diets) setAllDiets(diets as Diets[]);
      if (diets_type_1) setAllDietsType1(diets_type_1 as DietType1[]);
      if (diets_type_2) setAllDietsType2(diets_type_2 as DietType2[]);

      // Close dialog
      setOpenDialog(false);
    } catch (error) {
      console.error("Error saving diet:", error);
      alert("Failed to save diet. Please try again.");
    }
  };

  // Delete a diet
  const handleDeleteDiet = async (dietId: string): Promise<void> => {
    if (confirm("Are you sure you want to delete this diet? This action cannot be undone.")) {
      try {
        // Delete from all tables
        await supabase.from('diets_type_1').delete().eq('diet_id', dietId);
        await supabase.from('diets_type_2').delete().eq('diet_id', dietId);
        await supabase.from('diets').delete().eq('diet_id', dietId);

        // Update local state
        setAllDiets(prev => prev.filter(d => d.diet_id !== dietId));
        setAllDietsType1(prev => prev.filter(d => d.diet_id !== dietId));
        setAllDietsType2(prev => prev.filter(d => d.diet_id !== dietId));
      } catch (error) {
        console.error("Error deleting diet:", error);
        alert("Failed to delete diet. Please try again.");
      }
    }
  };

  // Get diet type display name
  const getDietType = (typeId: number): string => {
    return typeId === 1 ? "Nutritional" : "Restriction";
  };

  // Get diet details display
  const getDietDetails = (diet: Diets): string => {
    if (diet.diet_type === 1) {
      const type1Data = allDietsType1.find(d => d.diet_id === diet.diet_id);
      if (!type1Data) return "No details";

      return `Calories: ${type1Data.per_meal_calorie_min}-${type1Data.per_meal_calorie_max} kcal, 
              Protein: ${type1Data.per_meal_protein_min}-${type1Data.per_meal_protein_max}g, 
              Carbs: ${type1Data.per_meal_carbs_min}-${type1Data.per_meal_carbs_max}g, 
              Fat: ${type1Data.per_meal_fat_min}-${type1Data.per_meal_fat_max}g`;
    } else {
      const type2Data = allDietsType2.filter(d => d.diet_id === diet.diet_id);
      if (!type2Data.length) return "No restrictions";

      const categoryNames = type2Data.map(d => {
        const category = categories.find(c => c.id === d.category_id);
        return category ? category.name : d.category_id;
      });

      return `Avoids: ${categoryNames.join(", ")}`;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Diet Management</CardTitle>
              <CardDescription>View, create and edit dietary plans</CardDescription>
            </div>
            <Button onClick={handleCreateDiet}>Add New Diet</Button>
          </div>
        </CardHeader>
        <CardContent>
          {allDiets.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No diets found. Click 'Add New Diet' to create one.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="px-5">Details</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allDiets.map((diet) => (
                  <TableRow key={diet.diet_id}>
                    <TableCell className="font-medium text-left">{diet.diet_id}</TableCell>
                    <TableCell className="text-left">{diet.diet_name}</TableCell>
                    <TableCell className="text-left">{diet.description}</TableCell>
                    <TableCell className="text-left">{getDietType(diet.diet_type)}</TableCell>
                    <TableCell className="max-w-md truncate text-left px-5">
                      {getDietDetails(diet)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="w-8 h-8">
                            <EllipsisVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEditDiet(diet)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteDiet(diet.diet_id)} className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Diet Edit/Create Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? `Edit Diet: ${currentDiet.diet_name}` : "Create New Diet"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="diet_id" className="text-right">
                Diet ID
              </Label>
              <Input
                id="diet_id"
                name="diet_id"
                value={currentDiet.diet_id}
                readOnly
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="diet_name" className="text-right">
                Diet Name
              </Label>
              <Input
                id="diet_name"
                name="diet_name"
                value={currentDiet.diet_name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={currentDiet.description || ""}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="diet_type" className="text-right">
                Diet Type
              </Label>
              <Select
                name="diet_type"
                value={currentDiet.diet_type}
                onValueChange={(value: string) =>
                  setCurrentDiet(prev => ({ ...prev, diet_type: value }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select diet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Nutritional (Type 1)</SelectItem>
                  <SelectItem value="2">Restriction (Type 2)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type-specific forms */}
            <div className="mt-4">
              {currentDiet.diet_type === "1" ? (
                <div className="space-y-4">
                  <h3 className="font-medium">Nutritional Requirements</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="per_meal_calorie_min">Min Calories/Meal</Label>
                      <Input
                        id="per_meal_calorie_min"
                        name="per_meal_calorie_min"
                        type="number"
                        value={currentDiet.type1Details.per_meal_calorie_min ?? ''}
                        onChange={handleType1InputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="per_meal_calorie_max">Max Calories/Meal</Label>
                      <Input
                        id="per_meal_calorie_max"
                        name="per_meal_calorie_max"
                        type="number"
                        value={currentDiet.type1Details.per_meal_calorie_max ?? ''}
                        onChange={handleType1InputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="per_meal_protein_min">Min Protein (g)</Label>
                      <Input
                        id="per_meal_protein_min"
                        name="per_meal_protein_min"
                        type="number"
                        value={currentDiet.type1Details.per_meal_protein_min ?? ''}
                        onChange={handleType1InputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="per_meal_protein_max">Max Protein (g)</Label>
                      <Input
                        id="per_meal_protein_max"
                        name="per_meal_protein_max"
                        type="number"
                        value={currentDiet.type1Details.per_meal_protein_max ?? ''}
                        onChange={handleType1InputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="per_meal_carbs_min">Min Carbs (g)</Label>
                      <Input
                        id="per_meal_carbs_min"
                        name="per_meal_carbs_min"
                        type="number"
                        value={currentDiet.type1Details.per_meal_carbs_min ?? ''}
                        onChange={handleType1InputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="per_meal_carbs_max">Max Carbs (g)</Label>
                      <Input
                        id="per_meal_carbs_max"
                        name="per_meal_carbs_max"
                        type="number"
                        value={currentDiet.type1Details.per_meal_carbs_max ?? ''}
                        onChange={handleType1InputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="per_meal_fat_min">Min Fat (g)</Label>
                      <Input
                        id="per_meal_fat_min"
                        name="per_meal_fat_min"
                        type="number"
                        value={currentDiet.type1Details.per_meal_fat_min ?? ''}
                        onChange={handleType1InputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="per_meal_fat_max">Max Fat (g)</Label>
                      <Input
                        id="per_meal_fat_max"
                        name="per_meal_fat_max"
                        type="number"
                        value={currentDiet.type1Details.per_meal_fat_max ?? ''}
                        onChange={handleType1InputChange}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-medium">Food Restrictions</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Select food categories to restrict in this diet:
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {categories.map(category => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Switch
                          id={`category-${category.id}`}
                          checked={currentDiet.type2Details.category_ids.includes(category.id)}
                          onCheckedChange={() => handleCategoryToggle(category.id)}
                        />
                        <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDiet}>
              {isEditing ? "Update Diet" : "Create Diet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
};

export default DietManagement;