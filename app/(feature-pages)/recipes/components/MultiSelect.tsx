"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

// Sample data for the combobox

type MultiSelectComboboxProps = {
  value?: string[]
  onChange: (value: string[]) => void
  options: { value: string; label: string }[]
  placeholder?: string
}

export default function MultiSelectCombobox({
  value,
  onChange,
  options,
  placeholder = "Select frameworks...",
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedValues, setSelectedValues] = React.useState<string[]>(value || [])

  // Update internal state when prop changes
  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(value)
    }
  }, [value])

  // Function to toggle selection of an item
  const toggleItem = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value]

    setSelectedValues(newValues)
    onChange?.(newValues)
  }

  // Function to remove a selected item
  const removeItem = (value: string, e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()

    const newValues = selectedValues.filter((item) => item !== value)
    setSelectedValues(newValues)
    onChange?.(newValues)
  }

  // Get labels for selected values
  const selectedLabels = selectedValues.map((value) => options.find((option) => option.value === value)?.label)

  return (
    <div className="w-full max-w-md">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            <span className="text-muted-foreground">{placeholder}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {options.map((option) => (
                  <CommandItem key={option.value} value={option.label} onSelect={() => toggleItem(option.value)}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValues.includes(option.value) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedValues.length > 0 && (
        <div className="mt-3">
          <div className="text-sm text-muted-foreground mb-2">Selected {placeholder.toLowerCase()}:</div>
          <div className="flex flex-wrap gap-2">
            {selectedValues.map((value) => {
              const option = options.find((o) => o.value === value)
              return (
                <Badge key={value} variant="secondary" className="rounded-sm">
                  {option?.label}
                  <button
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={(e) => removeItem(value, e)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    <span className="sr-only">Remove {option?.label}</span>
                  </button>
                </Badge>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

