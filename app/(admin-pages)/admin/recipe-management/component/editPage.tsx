"use client"
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Info, ArrowLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Recipe_Directions } from '@/utils/type';

// Types from your schema
type Recipes = {
    calories_per_serving: number;
    carbs_per_serving: number;
    cooking_time: number;
    description: string | null;
    fat_per_serving: number;
    protein_per_serving: number;
    recipe_id: number;
    serving_size: string;
    title: string;
}

type Ingredients = {
    category_id: string | null;
    ingredient_id: number;
    name: string;
}

type RecipeIngredients = {
    ingredient_id: number;
    quantity_per_serving: number;
    recipe_id: number;
    unit: string;
}

type RecipeDirections = {
    recipe_id: number;
    step_order: number;
    step_description: string;
    time_duration_minutes: number | null;
}

type Category = {
    category_id: string;
    category_name: string;
    description: string | null;
}

// Unit options for ingredients
const unitOptions = [
    'g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'oz', 'lb', 'pinch', 'piece'
];

// Define the form schema with Zod
const recipeFormSchema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters." }),
    description: z.string().nullable(),
    serving_size: z.string().min(1, { message: "Serving size is required." }),
    carbs_per_serving: z.coerce.number().min(0),
    protein_per_serving: z.coerce.number().min(0),
    fat_per_serving: z.coerce.number().min(0),
    ingredients: z.array(
        z.object({
            ingredient_id: z.number(),
            quantity_per_serving: z.coerce.number().min(0),
            unit: z.string(),
        })
    ),
    directions: z.array(
        z.object({
            step_order: z.number(),
            step_description: z.string(),
            time_duration_minutes: z.coerce.number().nullable(),
        })
    ),
});

type RecipeFormValues = z.infer<typeof recipeFormSchema>;

const RecipeForm = ({ recipeId }: { recipeId?: number }) => {
    const router = useRouter();
    const [showNewIngredientDialog, setShowNewIngredientDialog] = useState(false);
    const [newIngredient, setNewIngredient] = useState({ name: '', category_id: '' });
    const [ingredients, setIngredients] = useState<Ingredients[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingRecipe, setLoadingRecipe] = useState(!!recipeId);
    const [error, setError] = useState<string | null>(null);
    const [pageTitle, setPageTitle] = useState(recipeId ? "Update Recipe" : "Create New Recipe");
    const [pageDescription, setPageDescription] = useState(
        recipeId ? "Update the details of your existing recipe." : "Fill in the details to add a new recipe to your collection."
    );

    // Derived values
    const calculatedCalories = (carbs: number, protein: number, fat: number) => {
        // Using the standard conversion: 4 calories per gram of carbs and protein, 9 calories per gram of fat
        return (carbs * 4) + (protein * 4) + (fat * 9);
    };

    const calculatedCookingTime = (directions: { time_duration_minutes: number | null }[]) => {
        return directions.reduce((total, step) => total + (step.time_duration_minutes || 0), 0);
    };

    // Default values for the form
    const defaultValues: RecipeFormValues = {
        title: '',
        description: '',
        serving_size: '',
        carbs_per_serving: 0,
        protein_per_serving: 0,
        fat_per_serving: 0,
        ingredients: [{ ingredient_id: 0, quantity_per_serving: 0, unit: 'g' }],
        directions: [{ step_order: 1, step_description: '', time_duration_minutes: null }],
    };

    // Initialize the form
    const form = useForm<RecipeFormValues>({
        resolver: zodResolver(recipeFormSchema),
        defaultValues,
    });

    // Fetch categories and ingredients from Supabase
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const supabase = await createClient();

                // Fetch categories
                const { data: categoryData, error: categoryError } = await supabase
                    .from('categories')
                    .select('*');

                if (categoryError) throw categoryError;

                // Fetch ingredients
                const { data: ingredientData, error: ingredientError } = await supabase
                    .from('ingredients')
                    .select('*');

                if (ingredientError) throw ingredientError;

                setCategories(categoryData);
                setIngredients(ingredientData);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load categories and ingredients. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Fetch existing recipe data if recipeId is provided
    useEffect(() => {
        const fetchRecipe = async () => {
            if (!recipeId) {
                setLoadingRecipe(false);
                return;
            }

            try {
                const supabase = await createClient();

                // Fetch recipe data
                const { data: recipeData, error: recipeError } = await supabase
                    .from('recipes')
                    .select('*')
                    .eq('recipe_id', recipeId)
                    .single();

                if (recipeError) throw recipeError;

                // Fetch recipe ingredients
                const { data: ingredientsData, error: ingredientsError } = await supabase
                    .from('recipe_ingredients')
                    .select('*')
                    .eq('recipe_id', recipeId);

                if (ingredientsError) throw ingredientsError;

                // Fetch recipe directions
                const { data: directionsData, error: directionsError } = await supabase
                    .from('recipe_directions')
                    .select('*')
                    .eq('recipe_id', recipeId)
                    .order('step_order');

                if (directionsError) throw directionsError;

                // Set form values from fetched data
                form.reset({
                    title: recipeData.title,
                    description: recipeData.description || '',
                    serving_size: recipeData.serving_size,
                    carbs_per_serving: recipeData.carbs_per_serving,
                    protein_per_serving: recipeData.protein_per_serving,
                    fat_per_serving: recipeData.fat_per_serving,
                    ingredients: ingredientsData.length > 0
                        ? ingredientsData.map((ingredient: RecipeIngredients) => ({
                            ingredient_id: ingredient.ingredient_id,
                            quantity_per_serving: ingredient.quantity_per_serving,
                            unit: ingredient.unit
                        }))
                        : [{ ingredient_id: 0, quantity_per_serving: 0, unit: 'g' }],
                    directions: directionsData.length > 0
                        ? directionsData.map((direction: Recipe_Directions) => ({
                            step_order: direction.step_order,
                            step_description: direction.step_description || '',
                            time_duration_minutes: direction.time_duration_minutes
                        }))
                        : [{ step_order: 1, step_description: '', time_duration_minutes: null }]
                });

            } catch (err) {
                console.error('Error fetching recipe data:', err);
                setError('Failed to load recipe data. Please try again.');
            } finally {
                setLoadingRecipe(false);
            }
        };

        fetchRecipe();
    }, [recipeId, form]);

    // Submit handler
    const onSubmit = async (data: RecipeFormValues) => {
        try {
            const supabase = await createClient();

            // Calculate calories and cooking time
            const calories = calculatedCalories(
                data.carbs_per_serving,
                data.protein_per_serving,
                data.fat_per_serving
            );

            const cookingTime = calculatedCookingTime(data.directions);

            // Prepare recipe data
            const recipeData = {
                title: data.title,
                description: data.description,
                serving_size: data.serving_size,
                carbs_per_serving: data.carbs_per_serving,
                protein_per_serving: data.protein_per_serving,
                fat_per_serving: data.fat_per_serving,
                calories_per_serving: calories,
                cooking_time: cookingTime
            };

            let recipe_id = recipeId;

            if (recipeId) {
                // Update existing recipe
                const { error: recipeError } = await supabase
                    .from('recipes')
                    .update(recipeData)
                    .eq('recipe_id', recipeId);

                if (recipeError) throw recipeError;

                // Delete existing recipe ingredients to replace them
                const { error: deleteIngredientsError } = await supabase
                    .from('recipe_ingredients')
                    .delete()
                    .eq('recipe_id', recipeId);

                if (deleteIngredientsError) throw deleteIngredientsError;

                // Delete existing recipe directions to replace them
                const { error: deleteDirectionsError } = await supabase
                    .from('recipe_directions')
                    .delete()
                    .eq('recipe_id', recipeId);

                if (deleteDirectionsError) throw deleteDirectionsError;
            } else {
                // Insert new recipe and get the new recipe ID
                const { data: newRecipe, error: recipeError } = await supabase
                    .from('recipes')
                    .insert(recipeData)
                    .select('recipe_id')
                    .single();

                if (recipeError) throw recipeError;
                recipe_id = newRecipe.recipe_id;
            }

            // Insert recipe ingredients
            const ingredientsData = data.ingredients.map(ingredient => ({
                recipe_id: recipe_id!,
                ingredient_id: ingredient.ingredient_id,
                quantity_per_serving: ingredient.quantity_per_serving,
                unit: ingredient.unit
            }));

            const { error: ingredientsError } = await supabase
                .from('recipe_ingredients')
                .insert(ingredientsData);

            if (ingredientsError) throw ingredientsError;

            // Insert recipe directions
            const directionsData = data.directions.map(direction => ({
                recipe_id: recipe_id || 0,
                step_order: direction.step_order,
                step_description: direction.step_description,
                time_duration_minutes: direction.time_duration_minutes
            }));

            const { error: directionsError } = await supabase
                .from('recipe_directions')
                .insert(directionsData);

            if (directionsError) throw directionsError;

            alert(recipeId ? 'Recipe updated successfully!' : 'Recipe saved successfully!');
            
            router.push('/recipes');

        } catch (err) {
            console.error('Error saving recipe:', err);
            alert('Failed to save recipe. Please try again.');
        }
    };

    // Add a new ingredient
    const handleAddNewIngredient = async () => {
        if (newIngredient.name && newIngredient.category_id) {
            try {
                const supabase = await createClient();

                const { data, error } = await supabase
                    .from('ingredients')
                    .insert({
                        name: newIngredient.name,
                        category_id: newIngredient.category_id
                    })
                    .select('*')
                    .single();

                if (error) throw error;

                setIngredients([...ingredients, data]);
                setNewIngredient({ name: '', category_id: '' });
                setShowNewIngredientDialog(false);

            } catch (err) {
                console.error('Error adding new ingredient:', err);
                alert('Failed to add new ingredient. Please try again.');
            }
        }
    };

    // Add another ingredient to the recipe
    const addIngredient = () => {
        const currentIngredients = form.getValues('ingredients');
        form.setValue('ingredients', [
            ...currentIngredients,
            { ingredient_id: 0, quantity_per_serving: 0, unit: 'g' }
        ]);
    };

    // Remove an ingredient from the recipe
    const removeIngredient = (index: number) => {
        const currentIngredients = form.getValues('ingredients');
        if (currentIngredients.length > 1) {
            form.setValue(
                'ingredients',
                currentIngredients.filter((_, i) => i !== index)
            );
        }
    };

    // Add another direction step
    const addDirection = () => {
        const currentDirections = form.getValues('directions');
        const nextOrder = currentDirections.length + 1;
        form.setValue('directions', [
            ...currentDirections,
            { step_order: nextOrder, step_description: '', time_duration_minutes: null }
        ]);
    };

    // Remove a direction step
    const removeDirection = (index: number) => {
        const currentDirections = form.getValues('directions');
        if (currentDirections.length > 1) {
            const updatedDirections = currentDirections
                .filter((_, i) => i !== index)
                .map((step, i) => ({ ...step, step_order: i + 1 }));

            form.setValue('directions', updatedDirections);
        }
    };

    // Go back to recipes list
    const handleGoBack = () => {
        router.push('/admin');
    };

    // Calculate calories and cooking time for display
    const watchCarbs = form.watch('carbs_per_serving');
    const watchProtein = form.watch('protein_per_serving');
    const watchFat = form.watch('fat_per_serving');
    const watchDirections = form.watch('directions');

    const totalCalories = calculatedCalories(watchCarbs, watchProtein, watchFat);
    const totalCookingTime = calculatedCookingTime(watchDirections);

    if (isLoading || loadingRecipe) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    return (
        <div className="container mx-auto py-6">
            <Button
                variant="ghost"
                onClick={handleGoBack}
                className="mb-4 flex items-center"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin
            </Button>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{pageTitle}</CardTitle>
                    <CardDescription>
                        {pageDescription}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Basic Recipe Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Recipe Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter recipe title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="serving_size"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Serving Size</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., 1 cup, 200g" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your recipe"
                                                className="min-h-24"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Nutritional Information */}
                            <div>
                                <h3 className="text-lg font-medium">Nutritional Information (per serving)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="carbs_per_serving"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Carbs (g)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="0" step="0.1" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="protein_per_serving"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Protein (g)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="0" step="0.1" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="fat_per_serving"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Fat (g)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="0" step="0.1" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="mt-4 flex items-center gap-4">
                                    <div className="p-4 bg-blue-50 rounded-md flex items-center gap-2">
                                        <Info className="h-4 w-4 text-blue-500" />
                                        <span>Calculated Calories: <strong>{totalCalories.toFixed(1)}</strong> kcal</span>
                                    </div>
                                </div>
                            </div>

                            {/* Ingredients Section */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium">Ingredients</h3>
                                    <Dialog open={showNewIngredientDialog} onOpenChange={setShowNewIngredientDialog}>
                                        <DialogTrigger asChild>
                                            <Button type="button" variant="outline" size="sm">
                                                <Plus className="h-4 w-4 mr-2" />
                                                New Ingredient
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add New Ingredient</DialogTitle>
                                                <DialogDescription>
                                                    Create a new ingredient that will be available for all recipes.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <label htmlFor="name" className="text-right">Name</label>
                                                    <Input
                                                        id="name"
                                                        value={newIngredient.name}
                                                        onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                                                        className="col-span-3"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <label htmlFor="category" className="text-right">Category</label>
                                                    <Select
                                                        onValueChange={(value) => setNewIngredient({ ...newIngredient, category_id: value })}
                                                        value={newIngredient.category_id}
                                                    >
                                                        <SelectTrigger className="col-span-3">
                                                            <SelectValue placeholder="Select a category" />
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
                                            </div>
                                            <DialogFooter>
                                                <Button type="button" onClick={handleAddNewIngredient}>Save Ingredient</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {form.watch('ingredients').map((_, index) => (
                                    <div key={index} className="flex items-end gap-2 mb-4">
                                        <FormField
                                            control={form.control}
                                            name={`ingredients.${index}.ingredient_id`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel className={index !== 0 ? "sr-only" : undefined}>
                                                        Ingredient
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={(value) => field.onChange(parseInt(value))}
                                                        value={field.value.toString()}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select ingredient" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {ingredients.map((ingredient) => (
                                                                <SelectItem
                                                                    key={ingredient.ingredient_id}
                                                                    value={ingredient.ingredient_id.toString()}
                                                                >
                                                                    {ingredient.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`ingredients.${index}.quantity_per_serving`}
                                            render={({ field }) => (
                                                <FormItem className="w-24">
                                                    <FormLabel className={index !== 0 ? "sr-only" : undefined}>
                                                        Quantity
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input type="number" min="0" step="0.01" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`ingredients.${index}.unit`}
                                            render={({ field }) => (
                                                <FormItem className="w-24">
                                                    <FormLabel className={index !== 0 ? "sr-only" : undefined}>
                                                        Unit
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Unit" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {unitOptions.map((unit) => (
                                                                <SelectItem key={unit} value={unit}>
                                                                    {unit}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeIngredient(index)}
                                            className="mb-1"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addIngredient}
                                    className="mt-2"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Ingredient
                                </Button>
                            </div>

                            {/* Directions Section */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium">Directions</h3>
                                    <div className="p-4 bg-blue-50 rounded-md flex items-center gap-2">
                                        <Info className="h-4 w-4 text-blue-500" />
                                        <span>Total Cooking Time: <strong>{totalCookingTime}</strong> minutes</span>
                                    </div>
                                </div>

                                {form.watch('directions').map((_, index) => (
                                    <div key={index} className="flex items-end gap-2 mb-4">
                                        <div className="flex-none w-10 text-center">
                                            <FormLabel className={index !== 0 ? "sr-only" : undefined}>
                                                Step
                                            </FormLabel>
                                            <div className="mt-2 font-medium">{index + 1}.</div>
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name={`directions.${index}.step_description`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel className={index !== 0 ? "sr-only" : undefined}>
                                                        Description
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Describe this step"
                                                            className="min-h-20"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`directions.${index}.time_duration_minutes`}
                                            render={({ field }) => (
                                                <FormItem className="w-32">
                                                    <FormLabel className={index !== 0 ? "sr-only" : undefined}>
                                                        Duration (min)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            placeholder="Optional"
                                                            {...field}
                                                            value={field.value === null ? '' : field.value}
                                                            onChange={(e) => {
                                                                const value = e.target.value === '' ? null : Number(e.target.value);
                                                                field.onChange(value);
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeDirection(index)}
                                            className="mb-1"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addDirection}
                                    className="mt-2"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Step
                                </Button>
                            </div>

                            <CardFooter className="px-0 pt-6 flex justify-end">
                                <Button type="submit">
                                    {recipeId ? 'Update Recipe' : 'Save Recipe'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default RecipeForm;