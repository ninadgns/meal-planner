"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FilterProps } from "../FilterScreen";

// const categories = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];
const allergies = ["Diabetic", "Keto", "Low Protein", "Cardiac", "Gluten-Free", "Lactose-Free", "Low Cholesterol", "Vegetarian"];

// Define props type
interface FilterSidebarProps {
  onFilterApply: (filters: FilterProps) => void;
}

export default function FilterSidebar({
  onFilterApply,
  calorieRange,
  cookingTimeRange
}: {
  onFilterApply: (filters: FilterProps) => void;
  calorieRange: { min: number; max: number };
  cookingTimeRange: { min: number; max: number };
}) {


  const [selectedCalorie, setSelectedCalorie] = useState<number[]>([calorieRange.min, calorieRange.max]);
  const [cookingTime, setCookingTime] = useState<number[]>([cookingTimeRange.min, cookingTimeRange.max]);

  const onApplyFilters = () => {
    onFilterApply({ calorie: selectedCalorie, cookingTime });
  };

  return (
    <div className="w-full p-4 border rounded-md space-y-4">
      <Accordion type="multiple" className="w-full">
        

        {/* Allergies Filter */}
        <AccordionItem value="dietType">
          <AccordionTrigger>Diet Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {allergies.map((allergy) => (
                <div key={allergy} className="flex items-center space-x-2">
                  <Checkbox id={`diet-${allergy}`} />
                  <Label htmlFor={`diet-${allergy}`}>{allergy}</Label>
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
      </Accordion>

      {/* Apply Filter Button */}
      <Button onClick={onApplyFilters} className="w-full">
        Apply Filter
      </Button>
    </div>
  );
}
