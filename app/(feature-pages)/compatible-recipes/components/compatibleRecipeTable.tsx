"use client"

import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table"
import { Check, X } from "lucide-react"
import { useState } from "react"

import { SortButton } from "@/components/sort-button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RecipeModal } from "../../recipes/components/RecipeModal"
import { CompatibleRecipe } from "../page"

const createColumns = (): ColumnDef<CompatibleRecipe>[] => [
    {
        accessorKey: "title",
        accessorFn: (row) => row.recipe.title,
        header: ({ column }) => (
            <SortButton column={column} label="Title" />
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
        accessorKey: "allergy_safe",
        header: ({ column }) => (
            <SortButton column={column} label="Allergy Safe" />
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
            <SortButton column={column} label="Nutritional Compliance" />
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
            <SortButton column={column} label="Categorical Compliance" />
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
            <SortButton column={column} label="Fully Compliant" />
        ),
        cell: ({ row }) => {
            const isCompliant = row.getValue("fully_compliant")
            return (
                <div
                    className={`text-center font-bold text-lg w-fit p-1 mx-auto rounded-md ${isCompliant ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
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


interface RecipesTableProps {
    recipes: CompatibleRecipe[]
}

export function RecipesTable({ recipes }: RecipesTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [selectedRecipe, setSelectedRecipe] = useState<CompatibleRecipe | null>(null)
    const columns = createColumns()

    const table = useReactTable({
        data: recipes,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: { sorting },
    })

    return (
        <div>
            <div className="p-4">
                <h2 className="text-lg font-semibold">Compatible Recipes</h2>
                <p>Recipes that match your dietary preferences and restrictions</p>
            </div>
            <div className="rounded-md border">
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
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="cursor-pointer hover:bg-muted transition-colors"
                                    onClick={() => setSelectedRecipe(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
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

            {/* Modal */}
            {selectedRecipe && (
                <RecipeModal
                    recipe={selectedRecipe.recipe}
                    ingredients={selectedRecipe.ingredients}
                    isOpen={!!selectedRecipe}
                    onClose={() => setSelectedRecipe(null)}
                    steps={selectedRecipe.steps}
                />
            )}
        </div>
    )
}

