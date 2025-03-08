"use client"

import type * as React from "react"
import { useRef, useState } from "react"

import { SidebarInset } from "@/components/ui/sidebar"
import AllergySafeIngredients, { AllergySafeIngredientsProps } from "./allergy-safeList"
import { AppSidebar } from "./admin-sidebar"
import { DietUser, UserDietAllergyData, userRecipe } from "../page"
import RecipesWithDiets, { RecipesWithDietsProps } from "./recipe-diet"
import UserDietAllergyTable from "./user-diet-table"
import { UserToDietChart } from "./chart"
import UserRecipeTable from "./viewTable"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Recipes } from "@/utils/type"
interface TableContainerProps {
    allergySafeIngredients: AllergySafeIngredientsProps
    recipeWithDiets: RecipesWithDietsProps
    userDietAllergyData: UserDietAllergyData[]
    dietUser: DietUser[]
    view1Data: userRecipe[]
    view2Data: userRecipe[]
    view3Data: userRecipe[]
    allRecipe: Recipes[]
}

export function AdminDashboardContainer({ dietUser, allergySafeIngredients, recipeWithDiets, userDietAllergyData, view1Data, view2Data, view3Data, allRecipe }: TableContainerProps) {
    const allergyRef = useRef<HTMLDivElement>(null)
    const recipeDietRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<HTMLDivElement>(null)
    const userDietAllergyTableRef = useRef<HTMLDivElement>(null)
    const viewRef = useRef<HTMLDivElement>(null)
    const scrollToDelete = useRef<HTMLDivElement>(null)

    const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" })
        }
    }


    return (
        <>
            <AppSidebar
                scrollToAllergy={() => scrollToRef(allergyRef)}
                scrollToRecipeDiet={() => scrollToRef(recipeDietRef)}
                scrollToChart={() => scrollToRef(chartRef)}
                scrollToUserDietAllergyTable={() => scrollToRef(userDietAllergyTableRef)}
                scrollToView={() => scrollToRef(viewRef)}
                scrollToDelete={() => scrollToRef(scrollToDelete)}
            />
            <SidebarInset>
                <div className="flex flex-col p-6 gap-8">
                    <h1 className="text-3xl font-bold mx-auto border-b border-black">Admin Dashboard</h1>

                    <div ref={recipeDietRef}>
                        <RecipesWithDiets recipesWithDiets={recipeWithDiets.recipesWithDiets} />
                    </div>
                    <div ref={chartRef} className="">
                        <UserToDietChart chartData={dietUser} />
                    </div>
                    <div ref={userDietAllergyTableRef}>
                        <UserDietAllergyTable userdietallergydata={userDietAllergyData} />
                    </div>
                    <div ref={allergyRef}>
                        <AllergySafeIngredients ingredientsByCategory={allergySafeIngredients.ingredientsByCategory} />
                    </div>
                    <div ref={viewRef} className="mx-auto">
                        <Dialog >
                            <DialogTrigger asChild>
                                <Button className="w-auto mx-auto">Show All Views in Database</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-3xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold">Recipe Views</DialogTitle>
                                </DialogHeader>
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
                            </DialogContent>
                        </Dialog>
                    </div>


                </div>
            </SidebarInset>
        </>
    )
}

