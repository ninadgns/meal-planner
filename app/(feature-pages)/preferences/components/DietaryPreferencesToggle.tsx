"use client"

import { Control, useController } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Toggle } from "@/components/ui/toggle"
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Diets } from "@/utils/type"

const formSchema = z.object({
  dietaryPreferences: z.array(z.string()).optional(),
})

interface DietaryPreferencesToggleProps {
  control: Control<z.infer<typeof formSchema>>;
  dietaryOptions: Diets[];
}

export default function DietaryPreferencesToggle({ 
  control, 
  dietaryOptions 
}: DietaryPreferencesToggleProps) {
  const { field } = useController({
    control,
    name: "dietaryPreferences",
    defaultValue: [],
  });

  // Group dietary options by diet_type
  const groupedDietaryOptions = dietaryOptions.reduce((acc, option) => {
    if (!acc[option.diet_type]) {
      acc[option.diet_type] = [];
    }
    acc[option.diet_type].push(option);
    return acc;
  }, {} as Record<string, Diets[]>);

  return (
    <FormItem>
      <div className="mb-4">
        <FormLabel className="text-base">Dietary Preferences</FormLabel>
        <FormDescription>Select all that apply to your diet.</FormDescription>
      </div>
      
      {Object.entries(groupedDietaryOptions).map(([type, options]) => (
        <div key={type} className="mb-4">
          <FormLabel className="text-sm text-muted-foreground mb-2">{type=='1'? "Nutrition-Based Diets":"Ingredient-Specific Diets"}</FormLabel>
          <div className="flex flex-wrap gap-4">
            {options.map((option) => {
              const isSelected = field.value?.includes(option.diet_id);

              return (
                <FormItem key={option.diet_id}>
                  <FormControl>
                    <Toggle
                      variant="outline"
                      pressed={isSelected}
                      onPressedChange={(pressed) => {
                        field.onChange(
                          pressed
                            ? [...(field.value || []), option.diet_id]
                            : field.value?.filter((value) => value !== option.diet_id)
                        )
                      }}
                      className={cn(
                        "data-[state=on]:bg-green-500 data-[state=on]:text-primary-foreground",
                        "transition-colors duration-200"
                      )}
                    >
                      {option.diet_name}
                    </Toggle>
                  </FormControl>
                </FormItem>
              )
            })}
          </div>
        </div>
      ))}
      <FormMessage />
    </FormItem>
  )
}