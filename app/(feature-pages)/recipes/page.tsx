import ProductGrid from "./components/ProductGrid"
import FilterSidebar from "./components/FilterSidebar"
import { createClient } from "@/utils/supabase/server";

export default async  function ProductPage() {

  const supabase = await createClient();
  const {data:recipes, error:recipeError} = await  supabase.from("recipes").select("*");
  if(!recipes || recipeError)
  return console.log("error fetching recipes");


  return (
    <div className="container ">
      <h1 className="text-4xl mt-5 font-bold mb-8">Our Products</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-1/5">
          <FilterSidebar />
        </aside>
        <main className="w-full lg:w-4/5">
          <ProductGrid recipes={recipes} />
        </main>
      </div>
    </div>
  )
}

