"use client"

import React, { useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table"
import { ArrowUpDown, Pointer } from 'lucide-react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { RecipeModal } from "./RecipeModal"
import { RecipeWithIngredientsAndSteps } from "@/utils/type"
import { formatCookingTime } from "@/utils/utils"
import { SortButton } from "@/components/sort-button"

// Reusable SortButton component


// Table Columns Definition
const columns: ColumnDef<RecipeWithIngredientsAndSteps>[] = [
  {
    accessorKey: "recipe.title",
    header: ({ column }) => <SortButton column={column} label="Title" />
  },
  {
    accessorKey: "recipe.cooking_time",
    cell: ({ row }) => `${formatCookingTime(row.original.recipe.cooking_time)}`,
    header: ({ column }) => <SortButton column={column} label="Cooking Time" />
  },
  {
    accessorKey: "recipe.calories_per_serving",
    header: ({ column }) => <SortButton column={column} label="Calories" />
  },
  {
    accessorKey: "recipe.protein_per_serving",
    header: ({ column }) => <SortButton column={column} label="Protein" />,
    cell: ({ row }) => `${row.original.recipe.protein_per_serving}g`,
  },
  {
    accessorKey: "recipe.carbs_per_serving",
    header: ({ column }) => <SortButton column={column} label="Carbs" />,
    cell: ({ row }) => `${row.original.recipe.carbs_per_serving}g`,
  },
  {
    accessorKey: "recipe.fat_per_serving",
    header: ({ column }) => <SortButton column={column} label="Fat" />,
    cell: ({ row }) => `${row.original.recipe.fat_per_serving}g`,
  },
  {
    id: "actions",
    header: "View Details",
    cell: ({ row }) => (
      <Button variant="outline"><Pointer /></Button>
    ),
  },
]

interface RecipeTableProps {
  data: RecipeWithIngredientsAndSteps[];
  onRowClick?: (row: RecipeWithIngredientsAndSteps) => void;
}

export function RecipeTable({ data, onRowClick }: RecipeTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [selectedRow, setSelectedRow] = useState<RecipeWithIngredientsAndSteps | null>(null)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div>
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
                  onClick={() => {
                    setSelectedRow(row.original);
                    onRowClick?.(row.original);
                  }}
                >
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

      {/* Modal */}
      {selectedRow && (
        <RecipeModal
          recipe={selectedRow.recipe}
          ingredients={selectedRow.ingredients}
          steps={selectedRow.steps}
          isOpen={!!selectedRow}
          onClose={() => setSelectedRow(null)}
        />
      )}
    </div>
  )
}