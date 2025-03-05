"use client";
import React, { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { FilterProps } from "../FilterScreen";
import MultiSelectCombobox from "./MultiSelect";
import { Ingredients } from "@/utils/type";
import { Radio, RotateCcw } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const preferences = ["Diabetic", "Keto", "Low Protein", "Cardiac", "Low Cholesterol"];

export default function FilterSidebar({
  onFilterApply,
  calorieRange,
  ingredients,
  cookingTimeRange,
  proteinRange,
  fatRange,
  carbRange
}: {
  onFilterApply: (filters: FilterProps) => void;
  calorieRange: { min: number; max: number };
  cookingTimeRange: { min: number; max: number };
  proteinRange: { min: number; max: number };
  fatRange: { min: number; max: number };
  carbRange: { min: number; max: number };
  ingredients: Ingredients[];
}) {
  // Store initial values for reset functionality
  const initialState = {
    calorie: [calorieRange.min, calorieRange.max],
    cookingTime: [cookingTimeRange.min, cookingTimeRange.max],
    protein: [proteinRange.min, proteinRange.max],
    fat: [fatRange.min, fatRange.max],
    carb: [carbRange.min, carbRange.max],
    ingredientsToAvoid: [] as number[],
    ingredientsToInclude: [] as number[]
  };

  // Current filter state
  const [filters, setFilters] = useState(initialState);

  // Track if filters have been modified
  const [filtersModified, setFiltersModified] = useState(false);

  // Update the modified state whenever filters change
  useEffect(() => {
    const isModified =
      filters.calorie[0] !== initialState.calorie[0] ||
      filters.calorie[1] !== initialState.calorie[1] ||
      filters.cookingTime[0] !== initialState.cookingTime[0] ||
      filters.cookingTime[1] !== initialState.cookingTime[1] ||
      filters.protein[0] !== initialState.protein[0] ||
      filters.protein[1] !== initialState.protein[1] ||
      filters.fat[0] !== initialState.fat[0] ||
      filters.fat[1] !== initialState.fat[1] ||
      filters.carb[0] !== initialState.carb[0] ||
      filters.carb[1] !== initialState.carb[1] ||
      filters.ingredientsToAvoid.length > 0 ||
      filters.ingredientsToInclude.length > 0;

    setFiltersModified(isModified);
  }, [filters, initialState]);

  // Handle filter updates with a generic updater function
  const updateFilter = <K extends keyof typeof filters>(
    key: K,
    value: typeof filters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Apply the current filters
  const applyFilters = () => {
    onFilterApply(filters);
  };

  // Reset all filters to initial values
  const resetFilters = () => {
    setFilters(initialState);
    onFilterApply(initialState);
  };

  // Helper function to render sliders consistently
  const renderSlider = (
    name: keyof typeof filters,
    value: number[],
    min: number,
    max: number,
    unit: string = ""
  ) => (
    <div className="space-y-4">
      <Slider
        max={max}
        min={min}
        value={value}
        onValueChange={(newValue) => updateFilter(name, newValue)}
      />
      <div className="flex justify-between text-sm">
        <span>{value[0]}{unit}</span>
        <span>{value[1]}{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="w-full p-4 border rounded-md space-y-4 relative">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-bold">Filter Recipes</h1>
        {filtersModified && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      <Accordion type="multiple" className="w-full">
        {/* Diet and Preferences Group */}
        <AccordionItem value="dietType" className="border-b-2 pb-2">
          <AccordionTrigger className="font-medium">Diet & Preferences</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroup>
                  {preferences.map((preference) => (
                    <div key={preference} className="flex items-center space-x-2">
                      <RadioGroupItem value={preference} id={`diet-${preference}`} />
                      <Label htmlFor={`diet-${preference}`}>{preference}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Nutritional Information Group */}
        <AccordionItem value="nutritionalInfo" className="border-b-2 pb-2">
          <AccordionTrigger className="font-medium">Nutritional Information</AccordionTrigger>
          <AccordionContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Calories</h3>
              {renderSlider("calorie", filters.calorie, calorieRange.min, calorieRange.max, " cal")}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Protein</h3>
              {renderSlider("protein", filters.protein, proteinRange.min, proteinRange.max, "g")}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Carbs</h3>
              {renderSlider("carb", filters.carb, carbRange.min, carbRange.max, "g")}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Fat</h3>
              {renderSlider("fat", filters.fat, fatRange.min, fatRange.max, "g")}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Cooking Time Group */}
        <AccordionItem value="cooking-time" className="border-b-2 pb-2">
          <AccordionTrigger className="font-medium">Cooking Time</AccordionTrigger>
          <AccordionContent>
            {renderSlider("cookingTime", filters.cookingTime, cookingTimeRange.min, cookingTimeRange.max, " mins")}
          </AccordionContent>
        </AccordionItem>

        {/* Ingredients Group */}
        <AccordionItem value="ingredients" className="border-b-2 pb-2">
          <AccordionTrigger className="font-medium">Ingredients</AccordionTrigger>
          <AccordionContent className="space-y-6"><div>
            <h3 className="text-sm font-medium mb-2">Include These Ingredients</h3>
            <MultiSelectCombobox
              options={ingredients.map((ingredient) => ({
                value: ingredient.ingredient_id.toString(), // Convert number to string
                label: ingredient.name
              }))}
              onChange={(value) => updateFilter("ingredientsToInclude", value.map(Number))} // Convert strings back to numbers
              value={filters.ingredientsToInclude.map(String)} // Convert numbers to strings
              placeholder="Ingredients to include..."
            />
          </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Avoid These Ingredients</h3>
              <MultiSelectCombobox
                options={ingredients.map((ingredient) => ({
                  value: ingredient.ingredient_id.toString(), // Convert number to string
                  label: ingredient.name
                }))}
                onChange={(value) => updateFilter("ingredientsToAvoid", value.map(Number))} // Convert strings back to numbers
                value={filters.ingredientsToAvoid.map(String)} // Convert numbers to strings
                placeholder="Ingredients to avoid..."
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        onClick={applyFilters}
        className="w-full mt-6 bg-primary hover:bg-primary/90"
      >
        Apply Filters
      </Button>
    </div>
  );
}