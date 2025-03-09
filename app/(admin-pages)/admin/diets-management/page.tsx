import { createClient } from "@/utils/supabase/server";
import React from "react"
import DietManagement from "./dietManagementComponent";

const DietManagementPage = async () => {
    const supabase = await createClient();
    const { data: dietsMaybeNull, error: dietsError } = await supabase.from('diets').select('*');
    const { data: diets_type_1MaybeNull, error: diets_type_1_error } = await supabase.from('diets_type_1').select('*');
    const { data: diets_type_2MaybeNull, error: diets_type_2_error } = await supabase.from('diets_type_2').select('*');

    const diets = dietsError ? [] : dietsMaybeNull;
    const diets_type_1 = diets_type_1_error ? [] : diets_type_1MaybeNull;
    const diets_type_2 = diets_type_2_error ? [] : diets_type_2MaybeNull;
    

    return (
        <DietManagement diets={diets} diets_type_1={diets_type_1} diets_type_2={diets_type_2} />
    )
};

export default DietManagementPage;
