"use client"

import type * as React from "react"
import { useRef } from "react"

import { SidebarInset } from "@/components/ui/sidebar"
import AllergySafeIngredients, { AllergySafeIngredientsProps } from "./allergy-safeList"
import { AppSidebar } from "./admin-sidebar"
import { DietUser, UserDietAllergyData } from "../page"
import RecipesWithDiets, { RecipesWithDietsProps } from "./recipe-diet"
import UserDietAllergyTable from "./user-diet-table"
import { UserToDietChart } from "./chart"

interface TableContainerProps {
    allergySafeIngredients: AllergySafeIngredientsProps
    recipeWithDiets: RecipesWithDietsProps
    userDietAllergyData: UserDietAllergyData[]
    dietUser: DietUser[]
}

export function TableContainer({dietUser, allergySafeIngredients, recipeWithDiets, userDietAllergyData }: TableContainerProps) {
    const allergyRef = useRef<HTMLDivElement>(null)
    const recipeDietRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<HTMLDivElement>(null)
    const userDietAllergyTableRef = useRef<HTMLDivElement>(null)

    const scrollToTable = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <>
            <AppSidebar
                scrollToAllergy={() => scrollToTable(allergyRef)}
                scrollToRecipeDiet={() => scrollToTable(recipeDietRef)}
                scrollToChart={() => scrollToTable(chartRef)}
                scrollToUserDietAllergyTable={() => scrollToTable(userDietAllergyTableRef)}
            />
            <SidebarInset>
                <div className="flex flex-col p-6 gap-8">
                    <h1 className="text-3xl font-bold mx-auto border-b border-black">Admin Dashboard</h1>
                    <div ref={recipeDietRef}>
                        <RecipesWithDiets recipesWithDiets={recipeWithDiets.recipesWithDiets} />
                    </div>
                    <div ref={chartRef} className="">
                        <UserToDietChart chartData={dietUser}/>
                    </div>
                    <div ref={userDietAllergyTableRef}>
                        <UserDietAllergyTable userdietallergydata={userDietAllergyData} />
                    </div>
                    <div ref={allergyRef}>
                        <AllergySafeIngredients ingredientsByCategory={allergySafeIngredients.ingredientsByCategory} />
                    </div>


                </div>
            </SidebarInset>
        </>
    )
}

