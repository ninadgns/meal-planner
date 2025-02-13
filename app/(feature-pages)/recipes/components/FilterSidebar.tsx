"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const categories = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];
const allergies = ["Gluten-Free", "Dairy-Free", "Nut-Free", "Soy-Free"];
const calorieRange = { min: 0, max: 2000 };

export default function FilterSidebar() {
  const [calorie, setCalorie] = useState([calorieRange.min, calorieRange.max]);

  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="category">
        <AccordionTrigger>Category</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox id={`category-${category}`} />
                <Label htmlFor={`category-${category}`}>{category}</Label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="allergies">
        <AccordionTrigger>Allergies</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {allergies.map((allergy) => (
              <div key={allergy} className="flex items-center space-x-2">
                <Checkbox id={`brand-${allergy}`} />
                <Label htmlFor={`brand-${allergy}`}>{allergy}</Label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="calorie">
        <AccordionTrigger>Calorie Range</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <Slider
              max={calorieRange.max}

              defaultValue={calorie}
              onValueChange={(value) => { setCalorie(value); console.log(value) }}
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${calorie[0]}</span>
              <span>${calorie[1]}</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}