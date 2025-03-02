"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FilterProps } from "../FilterScreen";
import MultiSelectCombobox from "./MultiSelect";
import { Ingredients } from "@/utils/type";

// const categories = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];
const preferences = ["Diabetic", "Keto", "Low Protein", "Cardiac", "Gluten-Free", "Lactose-Free", "Low Cholesterol", "Vegetarian"];

export default function FilterSidebar({
  onFilterApply,
  calorieRange,
  ingredients,
  cookingTimeRange
}: {
  onFilterApply: (filters: FilterProps) => void;
  calorieRange: { min: number; max: number };
  cookingTimeRange: { min: number; max: number };
  ingredients: Ingredients[];
}) {


  const [selectedCalorie, setSelectedCalorie] = useState<number[]>([calorieRange.min, calorieRange.max]);
  const [cookingTime, setCookingTime] = useState<number[]>([cookingTimeRange.min, cookingTimeRange.max]);
  const [ingredientsToAvoid, setIngredientsToAvoid] = useState<string[]>([])

  const onApplyFilters = () => {
    onFilterApply({ calorie: selectedCalorie, cookingTime, ingredientsToAvoid });
  };

  return (
    <div className="w-full p-4 border rounded-md space-y-4">
      <h1 className="text-lg font-bold">Filter by</h1>
      <Accordion type="multiple" className="w-full">
        {/* Allergies Filter */}
        <AccordionItem value="dietType">
          <AccordionTrigger>Diet Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {preferences.map((preference) => (
                <div key={preference} className="flex items-center space-x-2">
                  <Checkbox id={`diet-${preference}`} />
                  <Label htmlFor={`diet-${preference}`}>{preference}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Calorie Filter */}
        <AccordionItem value="calorie">
          <AccordionTrigger>Calorie Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                max={calorieRange.max}
                min={calorieRange.min}
                defaultValue={selectedCalorie}
                onValueChange={setSelectedCalorie} // Updates state on change
              />
              <div className="flex justify-between text-sm">
                <span>{selectedCalorie[0]}</span>
                <span>{selectedCalorie[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Cooking Time Filter */}
        <AccordionItem value="cooking-time">
          <AccordionTrigger>Cooking Time</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                max={cookingTimeRange.max}
                min={cookingTimeRange.min}
                defaultValue={cookingTime}
                onValueChange={setCookingTime} // Updates state on change 
              />
              <div className="flex justify-between text-sm">
                <span>{cookingTime[0]} mins</span>
                <span>{cookingTime[1]} mins</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="allergy">
          <AccordionTrigger>Allergy</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <MultiSelectCombobox
              options={ingredients.map((ingredient) => ({ value: ingredient.ingredient_id, label: ingredient.name }))}
              onChange={setIngredientsToAvoid}
              value={ingredientsToAvoid}
              placeholder="Ingredients to avoid..."
            />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Apply Filter Button */}
      <Button onClick={onApplyFilters} className="w-full">
        Apply Filter
      </Button>
    </div>
  );
}
