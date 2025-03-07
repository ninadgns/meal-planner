"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { UserDietAllergyData } from "../page"
import { getDietColor } from "./recipe-diet"

const allergyColors = [
  "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
];




export default function UserDietAllergyTable({ userdietallergydata }: { userdietallergydata: UserDietAllergyData[] }) {
  const [selectedUser, setSelectedUser] = useState<UserDietAllergyData | null>(null)
  const [open, setOpen] = useState(false)

  const handleRowClick = (user: UserDietAllergyData) => {
    setSelectedUser(user)
    setOpen(true)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">User Diet and Allergy Information</h2>
      </div>
      <div className="border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead className="text-right">Diet Count</TableHead>
              <TableHead className="text-right">Allergy Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userdietallergydata.map((user) => (
              <TableRow key={user.id} onClick={() => handleRowClick(user)} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{user.user_name || "Unnamed User"}</TableCell>
                <TableCell className="text-right">{user.user_diets?.length || 0}</TableCell>
                <TableCell className="text-right">{user.user_allergies?.length || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedUser?.user_name || "User"}</DialogTitle>
              <DialogDescription>Diet preferences and allergies information of {selectedUser?.user_name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Diets</h3>
                {selectedUser?.user_diets?.length ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedUser.user_diets.map((diet) => (
                      <Badge key={diet.diet_id} className={getDietColor(diet.diets.diet_name)}>
                        {diet.diets.diet_name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">No diets specified</p>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium">Allergies</h3>
                {selectedUser?.user_allergies?.length ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedUser.user_allergies.map((allergy, index) => {
                      const colorClass = allergyColors[index % allergyColors.length]; // Rotate through colors
                      return (
                        <Badge key={allergy.ingredient_id} className={colorClass}>
                          {allergy.ingredients.name}
                        </Badge>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">No allergies specified</p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

