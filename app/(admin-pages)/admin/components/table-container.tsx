"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import {
  Utensils, BarChart, ShieldCheck, Eye, List, Package, ChefHat,
  SquareMenu
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarInset
} from "@/components/ui/sidebar"

import AllergySafeIngredients, { AllergySafeIngredientsProps } from "./allergy-safeList"
import RecipesWithDiets, { RecipesWithDietsProps } from "./recipe-diet"
import { DietRecipe, DietUser, UserDietAllergyData, userRecipe } from "../page"
import UserDietAllergyTable from "./user-diet-table"
import { UserToDietChart } from "./chart"
import UserRecipeTable from "./viewTable"
import { Recipes } from "@/utils/type"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import path from "path"
import React from "react"


export interface CombinedDietStats {
  diet_name: string;
  follower_count: number;
  recipe_count: number;
}


interface AdminDashboardProps {
  allergySafeIngredients: AllergySafeIngredientsProps
  recipeWithDiets: RecipesWithDietsProps
  userDietAllergyData: UserDietAllergyData[]
  dietUser: DietUser[]
  view1Data: userRecipe[]
  view2Data: userRecipe[]
  dietRecipe: DietRecipe[]
  view3Data: userRecipe[]
  allRecipe: Recipes[]
}

export function AdminDashboard({
  dietUser,
  allergySafeIngredients,
  recipeWithDiets,
  userDietAllergyData,
  view1Data,
  view2Data,
  view3Data,
  dietRecipe,
  allRecipe
}: AdminDashboardProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Create refs for each section
  // Create refs for each section
  const allergyRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
  const recipeDietRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
  const chartRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
  const userDietAllergyTableRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
  const viewRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>

  // Add state to track the active section
  const [activeSection, setActiveSection] = useState<string>("recipe-diet")

  // Function to scroll to a specific section
  const scrollToRef = (ref: React.RefObject<HTMLDivElement>, sectionId: string) => {
    if (ref.current) {
      const offset = 100; // Adjust this value to set space above the section
      const elementPosition = ref.current.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveSection(sectionId);
    }
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "recipe-diet", ref: recipeDietRef },
        { id: "chart", ref: chartRef },
        { id: "user-diet-allergy", ref: userDietAllergyTableRef },
        { id: "allergy", ref: allergyRef },
        { id: "view", ref: viewRef }
      ]

      // Find the section that is currently in view
      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const menuItems = [
    {
      text: "Recipes based on diets",
      id: "recipe-diet",
      onClick: () => scrollToRef(recipeDietRef, "recipe-diet"),
      icon: Utensils,
      type: "scroll"
    },
    {
      text: "Diet Bar Chart",
      id: "chart",
      onClick: () => scrollToRef(chartRef, "chart"),
      icon: BarChart,
      type: "scroll"
    },
    {
      text: "User Diet and Allergy Table",
      id: "user-diet-allergy",
      onClick: () => scrollToRef(userDietAllergyTableRef, "user-diet-allergy"),
      icon: ShieldCheck,
      type: "scroll"
    },
    {
      text: "Allergy Safe Ingredients",
      id: "allergy",
      onClick: () => scrollToRef(allergyRef, "allergy"),
      icon: ShieldCheck,
      type: "scroll"
    },
    {
      text: "Database Views",
      id: "view",
      onClick: () => scrollToRef(viewRef, "view"),
      icon: Eye,
      type: "scroll"
    },
    // Link menu items
    {
      text: "Recipe Management",
      path: "/admin/recipe-management",
      icon: List,
      type: "link"
    },
    {
      text: "Ingredient Management",
      path: "/admin/ingredient-management",
      icon: Package,
      type: "link"
    },
    {
      text: "Diet Management",
      path: "/admin/diets-management",
      icon: SquareMenu,
      type: "link"
    }
  ]

  

  // Merge the data
  const combinedDietStats: CombinedDietStats[] = [];

  // Use a Map for efficient lookups by diet name
  const dietRecipeMap = new Map(dietRecipe.map(item => [item.diet_name, item.recipe_count]));

  // Combine the data
  dietUser.forEach(dietUser => {
    combinedDietStats.push({
      diet_name: dietUser.diet_name,
      follower_count: dietUser.follower_count,
      recipe_count: dietRecipeMap.get(dietUser.diet_name) || 0
    });
  });

  // Add any diets that are in dietRecipes but not in processedDietUser
  dietRecipe.forEach(dietRecipe => {
    if (!dietUser.some(user => user.diet_name === dietRecipe.diet_name)) {
      combinedDietStats.push({
        diet_name: dietRecipe.diet_name,
        follower_count: 0,
        recipe_count: dietRecipe.recipe_count
      });
    }
  });

  console.log(combinedDietStats);


  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <ChefHat />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Admin Dashboard</span>
                  <span className="text-xs text-muted-foreground">Tables & Navigation</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map(({ text, id, onClick, path, icon: Icon, type }, index) => {
                  // Determine if this item is active based on pathname or activeSection
                  const isActive = path ? pathname === path : id === activeSection;

                  // Add divider before the first link item
                  const showDivider = index > 0 && type === "link" && menuItems[index - 1].type === "scroll";

                  return (
                    <React.Fragment key={index}>
                      {showDivider && (
                        <div className="my-2 mx-4 border-t border-gray-200 dark:border-gray-700"></div>
                      )}
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={path ? () => router.push(path) : onClick}
                          className={`flex items-center gap-3 px-4 py-2 w-full rounded-md shadow-sm transition-all duration-300
              ${isActive ? "bg-primary text-secondary shadow-md" : "bg-secondary hover:bg-primary hover:text-secondary hover:shadow-md"}
            `}
                        >
                          <Icon className={`size-5 transition-colors ${isActive ? "text-white" : "text-gray-500"}`} />
                          <span>{text}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </React.Fragment>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <div className="flex flex-col p-6 gap-8">
          <h1 className="text-3xl font-bold mx-auto border-b border-black">Admin Dashboard</h1>

          <div ref={recipeDietRef} id="recipe-diet">
            <RecipesWithDiets recipesWithDiets={recipeWithDiets.recipesWithDiets} />
          </div>

          <div ref={chartRef} id="chart" className="">
            <UserToDietChart chartData={combinedDietStats} />
          </div>

          <div ref={userDietAllergyTableRef} id="user-diet-allergy">
            <UserDietAllergyTable userdietallergydata={userDietAllergyData} />
          </div>

          <div ref={allergyRef} id="allergy">
            <AllergySafeIngredients ingredientsByCategory={allergySafeIngredients.ingredientsByCategory} />
          </div>

          <div ref={viewRef} id="view" className="mx-auto mt-10">
            <h2 className="text-2xl font-bold my-5">Recipes by Diet Type</h2>
            <Tabs defaultValue="allergy" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="allergy">Allergy Safe</TabsTrigger>
                <TabsTrigger value="nutrition">Nutritionally Safe</TabsTrigger>
                <TabsTrigger value="category">Categorically Safe</TabsTrigger>
              </TabsList>
              <TabsContent value="allergy" className="overflow-y-auto max-h-[70vh]">
                <div>
                  <h2 className="text-xl font-bold mb-4">Allergy Safe Recipe for Users</h2>
                  <UserRecipeTable recipes={view1Data} />
                </div>
              </TabsContent>
              <TabsContent value="nutrition" className="overflow-y-auto max-h-[70vh]">
                <div>
                  <h2 className="text-xl font-bold mb-4">Nutritionally Safe Recipe for Users</h2>
                  <UserRecipeTable recipes={view2Data} />
                </div>
              </TabsContent>
              <TabsContent value="category" className="overflow-y-auto max-h-[70vh]">
                <div>
                  <h2 className="text-xl font-bold mb-4">Categorically Safe Recipe for Users</h2>
                  <UserRecipeTable recipes={view3Data} />
                </div>
              </TabsContent>
            </Tabs>
            {/* <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-auto mx-auto">Show All Views in Database</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-3xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold">Recipe Views</DialogTitle>
                                </DialogHeader>
                                
                            </DialogContent>
                        </Dialog> */}
          </div>
        </div>
      </SidebarInset>
    </>
  )
}