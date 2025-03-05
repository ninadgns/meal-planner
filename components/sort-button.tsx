import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react"
import { Button } from "./ui/button"

const getSortIcon = (sortDirection: string | boolean) => {
    return {
        asc: <ChevronUp className="ml-2 h-4 w-4" />,
        desc: <ChevronDown className="ml-2 h-4 w-4" />,
    }[sortDirection as string] ?? <ChevronsUpDown className="ml-2 h-4 w-4" />
}

export const SortButton = ({ column, label }: { column: any, label: string }) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      {getSortIcon(column.getIsSorted())}
    </Button>
  )
}