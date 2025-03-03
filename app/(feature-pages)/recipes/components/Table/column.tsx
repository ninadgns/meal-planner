"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Eye, Pointer } from 'lucide-react'
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { RecipeWithIngredients } from "@/utils/type";
import { RecipeModal } from "../RecipeModal"
import { formatCookingTime } from "@/utils/utils"

// Reusable SortButton component
const SortButton = ({ column, label }: { column: any, label: string }) => {
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {label}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    )
}

// Table Columns Definition
export const columns: ColumnDef<RecipeWithIngredients>[] = [
    {
        accessorKey: "recipe.title",
        header: ({ column }) => <SortButton column={column} label="Title" />
    },
    {
        accessorKey: "recipe.cooking_time",
        cell: ({ row }) => {
            return `${formatCookingTime(row.original.recipe.cooking_time)}`
        },
        header: ({ column }) => <SortButton column={column} label="Cooking Time" />
    },
    {
        accessorKey: "recipe.calories_per_serving",
        header: ({ column }) => <SortButton column={column} label="Calories" />
    },
    {
        accessorKey: "recipe.protein_per_serving",
        header: ({ column }) => <SortButton column={column} label="Protein" />,
        cell: ({ row }) => {
            return `${row.original.recipe.protein_per_serving}g`
        },
    },
    {
        accessorKey: "recipe.carbs_per_serving",
        header: ({ column }) => <SortButton column={column} label="Carbs" />,
        cell: ({ row }) => {
            return `${row.original.recipe.carbs_per_serving}g`
        },
    },
    {
        accessorKey: "recipe.fat_per_serving",
        header: ({ column }) => <SortButton column={column} label="Fat" />,
        cell: ({ row }) => {
            return `${row.original.recipe.fat_per_serving}g`
        },
    },
    {
        id: "actions",
        header: "View Details",
        cell: ({ row }) => {
            const recipe = row.original.recipe
            const ingredients = row.original.ingredients

            return (
                <RecipeModal ingredients={ingredients} recipe={recipe} trigger={<Button variant="outline"><Pointer/> </Button>} />
            )
        },
    },
]