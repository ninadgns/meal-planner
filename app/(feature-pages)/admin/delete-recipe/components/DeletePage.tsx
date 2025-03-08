'use client';
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Recipes } from '@/utils/type';


interface RecipeDeletePageProps {
    recipeData: Recipes[];
}

const RecipeDeletePage: React.FC<RecipeDeletePageProps> = ({ recipeData }) => {
    const [recipes, setRecipes] = useState<Recipes[]>(recipeData || []);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    // Create typesafe client

    const handleDelete = async (id: number, recipeName: string): Promise<void> => {
        const supabase = await createClient();
        if (!confirm(`Are you sure you want to delete "${recipeName}"?`)) {
            return;
        }

        setIsDeleting(true);
        setMessage('');

        try {
            const { error } = await supabase
                .from('recipes')
                .delete()
                .eq('recipe_id', id);

            if (error) {
                throw error;
            }

            // Update local state after successful deletion
            setRecipes(recipes.filter(recipe => recipe.recipe_id !== id));
            setMessage(`"${recipeName}" has been deleted successfully.`);
        } catch (error: any) {
            console.error('Error deleting recipe:', error);
            setMessage(`Error: ${error.message || 'Failed to delete recipe'}`);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Delete Recipes</h1>

            {message && (
                <div className={`p-4 mb-6 rounded ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            {recipes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    {recipeData?.length === 0 ? "No recipes found." : "All recipes have been deleted."}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {recipes.map((recipe) => (
                            <li key={recipe.recipe_id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium text-lg">{recipe.title || recipe.title || 'Untitled Recipe'}</h3>
                                    {recipe.description && (
                                        <p className="text-gray-600 mt-1 line-clamp-2">{recipe.description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDelete(recipe.recipe_id, recipe.title || recipe.title || 'this recipe')}
                                    disabled={isDeleting}
                                    className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RecipeDeletePage;