import { createClient } from "@/utils/supabase/server";
import React from "react"
import RecipeDeletePage from "./components/DeletePage";

const DeleteRecipePage = async () => {

  const supabase = await createClient();
  const { data: recipeDataMaybeNull, error: recipeError } = await supabase.from('recipes').select('*');
  const recipeData = recipeDataMaybeNull || [];

  return (
    <div>
      <RecipeDeletePage recipeData={recipeData} />
    </div>
  )
};

export default DeleteRecipePage;
