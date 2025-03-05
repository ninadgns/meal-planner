"use client"

import { useState } from "react"
import { Check, X, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    type SortingState,
    getPaginationRowModel,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CompatibleRecipe } from "../page"



const createColumns = (): ColumnDef<CompatibleRecipe>[] => [
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Title
                {getSortIcon(column.getIsSorted())}
            </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
        accessorKey: "allergy_safe",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Allergy Safe
                {getSortIcon(column.getIsSorted())}
            </Button>
        ),
        cell: ({ row }) => (
            <div className="text-center">
                {row.getValue("allergy_safe") ? (
                    <Check className="inline-block text-green-500" />
                ) : (
                    <X className="inline-block text-red-500" />
                )}
            </div>
        ),
    },
    {
        accessorKey: "nutritional_compliant",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Nutritional Compliance
                {getSortIcon(column.getIsSorted())}
            </Button>
        ),
        cell: ({ row }) => (
            <div className="text-center">
                {row.getValue("nutritional_compliant") ? (
                    <Check className="inline-block text-green-500" />
                ) : (
                    <X className="inline-block text-red-500" />
                )}
            </div>
        ),
    },
    {
        accessorKey: "categorical_compliant",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Categorical Compliance
                {getSortIcon(column.getIsSorted())}
            </Button>
        ),
        cell: ({ row }) => (
            <div className="text-center">
                {row.getValue("categorical_compliant") ? (
                    <Check className="inline-block text-green-500" />
                ) : (
                    <X className="inline-block text-red-500" />
                )}
            </div>
        ),
    },
    {
        accessorKey: "fully_compliant",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Fully Compliant
                {getSortIcon(column.getIsSorted())}
            </Button>
        ),
        cell: ({ row }) => {
            const isCompliant = row.getValue("fully_compliant")
            return (
                <div
                    className={`text-center font-bold text-lg px-2 py-1 rounded-md ${isCompliant ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
                        }`}
                >
                    {isCompliant ? (
                        <Check className="inline-block w-6 h-6" />
                    ) : (
                        <X className="inline-block w-6 h-6" />
                    )}
                </div>
            )
        },
    },

]

// Helper function to get sort icon
const getSortIcon = (sortDirection: string | boolean) => {
    return {
        asc: <ChevronUp className="ml-2 h-4 w-4" />,
        desc: <ChevronDown className="ml-2 h-4 w-4" />,
    }[sortDirection as string] ?? <ChevronsUpDown className="ml-2 h-4 w-4" />
}

interface RecipesTableProps {
    recipes: CompatibleRecipe[]
}

export function RecipesTable({ recipes }: RecipesTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const columns = createColumns()

    const table = useReactTable({
        data: recipes,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    })

    return (
        <div>
            <div className="p-4">
                <h2 className="text-lg font-semibold">Compatible Recipes</h2>
                <p>Recipes that match your dietary preferences and restrictions</p>
            </div><div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

        </div>
    )
}