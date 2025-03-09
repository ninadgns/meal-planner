import React from "react"
import CreateEditPage from "./component/managementPage";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
    const supabase = await createClient();
    const { data: recipe, error: recipeError } = await supabase.from("recipes").select("*");
    const recipes = recipe || [];
    return (
        <div>
            <CreateEditPage recipes={recipes} />
        </div>
    )
};

