"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Import Sonner's toast

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import DietaryPreferencesToggle from "./diet-preference";
import { Diets, Ingredients } from "@/utils/type";
import { createClient } from "@/utils/supabase/client";
import MultiSelectCombobox from "../../recipes/components/MultiSelect";

// Define form schema with dietary preferences and allergies
const formSchema = z.object({
  dietaryPreferences: z.array(z.string()).optional(),
  allergies: z.array(z.number()).optional(), // Array of ingredient IDs
});

interface UserPreferencesFormClientProps {
  dietaryOptions: Diets[];
  ingredients: Ingredients[];
  userdiets: string[];
  userAllergies: number[];
}

export default function UserPreferencesFormClient({
  dietaryOptions,
  userdiets,
  userAllergies,
  ingredients,
}: UserPreferencesFormClientProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dietaryPreferences: userdiets || [],
      allergies: userAllergies || [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("values", values);

    // Show loading toast before starting async operations
    const loadingToast = toast.loading("Updating your preferences...");

    try {
      const supabase = await createClient();
      const { data: user, error: userError } = await supabase.auth.getUser();
      const userId = user.user?.id || "";

      // Update dietary preferences
      if (values.dietaryPreferences) {
        await supabase.from("user_diets").delete().eq("user_id", userId);
        const { error: dietError } = await supabase.from("user_diets").insert(
          values.dietaryPreferences.map((dietId) => ({
            user_id: userId,
            diet_id: dietId,
          }))
        );

        if (dietError) throw new Error("Failed to update dietary preferences.");
      }

      // Update allergy ingredients
      if (values.allergies) {
        await supabase.from("user_allergies").delete().eq("user_id", userId);
        const { error: allergyError } = await supabase.from("user_allergies").insert(
          values.allergies.map((ingredientId) => ({
            user_id: userId,
            ingredient_id: ingredientId,
          }))
        );

        if (allergyError) throw new Error("Failed to update allergy preferences.");
      }

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("Your preferences have been updated!");

      setTimeout(() => {
        router.push("/compatible-recipes");
      }, 1500);
    } catch (error: any) {
      // Handle any errors
      toast.dismiss(loadingToast);
      toast.error(error.message || "An unexpected error occurred. Please try again.");
      console.error("Error in onSubmit:", error);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent>
        <p className="text-xl font-semibold my-5">User Preferences</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DietaryPreferencesToggle control={form.control} dietaryOptions={dietaryOptions} />

            <Controller
              name="allergies"
              control={form.control}
              render={({ field }) => (
                <MultiSelectCombobox
                  options={ingredients.map((ingredient) => ({
                    value: ingredient.ingredient_id.toString(),  // Convert number to string
                    label: ingredient.name,
                  }))}
                  onChange={(values) => field.onChange(values.map(Number))} // Convert strings back to numbers
                  value={field.value?.map(String)} // Convert numbers to strings
                  placeholder="Ingredients to avoid..."
                />
              )}
            />


            <Button type="submit">Save Preferences</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
