import React, { useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Define the props type for our component
export interface AllergySafeIngredientsProps {
    ingredientsByCategory: {
        category_name: string;
        safe_ingredients: string[];
    }[];
}

const AllergySafeIngredients: React.FC<AllergySafeIngredientsProps> = ({ ingredientsByCategory }) => {
    const [searchTerm, setSearchTerm] = useState("");

    // Filter ingredients based on search term
    const filteredCategories = ingredientsByCategory.map(category => ({
        ...category,
        safe_ingredients: category.safe_ingredients.filter(ingredient =>
            ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.safe_ingredients.length > 0);

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Allergy Safe Ingredients</h2>
                <p className="text-gray-500 pb-4">
                    Search for ingredients that are safe for people with any allergies
                </p>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search ingredients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            {filteredCategories.length > 0 ? (
                <Accordion type="multiple" defaultValue={[]}>
                    {filteredCategories.map((category, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left hover:no-underline">
                                <div className="flex justify-between w-full pr-4">
                                    <span className="font-medium">{category.category_name}</span>
                                    <Badge variant="outline" className="ml-2">
                                        {category.safe_ingredients.length}
                                    </Badge>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {category.safe_ingredients.map((ingredient, idx) => (
                                        <div key={idx} className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-sm">
                                            {ingredient}
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    No ingredients found matching "{searchTerm}"
                </div>
            )}
        </div>
    );
};

export default AllergySafeIngredients;