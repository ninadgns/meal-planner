import { createClient } from "@/utils/supabase/server"
import UserPreferencesFormClient from "./components/form";

export default async function UserPreferencesPage() {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error('Error fetching user:', userError);
    return null;
  }
  const {data: ingredientsMaybeNull, error: ingredientsError} = await supabase.from('ingredients').select('*');
  const ingredients = ingredientsMaybeNull || [];
  const { data: dietaryOptionsMaybeNull, error: dietsError } = await supabase.from('diets').select('*');
  const { data: userDiets, error: preferencesError } = await supabase
    .from('user_diets')
    .select('diet_id')
    .eq('user_id', user.user?.id || '');

  const {data:userAllergies, error: allergiesError} = await supabase.from('user_allergies').select('ingredient_id').eq('user_id', user.user?.id||'');

  if (preferencesError) {
    console.error('Error fetching user preferences:', preferencesError);
  }
  if (allergiesError) {
    console.error('Error fetching user allergies:', allergiesError);
  }
  const dietaryOptions = dietaryOptionsMaybeNull || [];
  const userDietaryPreferences = userDiets?.map((item) => item.diet_id) || [];
  console.log(userDietaryPreferences);
  const userAllergiesList = userAllergies?.map((item) => item.ingredient_id) || [];

  return <UserPreferencesFormClient dietaryOptions={dietaryOptions} userdiets={userDietaryPreferences} userAllergies = {userAllergiesList} ingredients={ingredients}/>;
}