"use client"
import { Button } from "@/components/ui/button"
import { SidebarInset } from "@/components/ui/sidebar"
import { Diets } from "@/utils/type"
import { userAllergy } from "../page"

type DietSidebarProps = {
    diets: Diets[]
    allergies: userAllergy[]
}

export function DietSidebar({ diets, allergies }: DietSidebarProps) {
    return (
        <SidebarInset>
            <div className="p-4 max-w-80 border-r h-full">
                <h2 className="text-lg font-semibold mb-4">Diet Preferences</h2>
                {diets.length > 0 ? (
                    <ul className="space-y-2">
                        {diets.map((diet) => (
                            <li key={diet.diet_id} className="p-2 border rounded">
                                <strong>{diet.diet_name}</strong>
                                <p className="text-sm">{diet.description}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">No diet preferences found.</p>
                )}


                <h2 className="text-lg font-semibold mt-4">Allergies</h2>
                {allergies.length > 0 ? (
                    <ul className="space-y-2">
                        {allergies.map((allergy) => (
                            <li key={allergy.ingredient.ingredient_id} className="p-2 border rounded">
                                {allergy.ingredient.name}
                                <p className="text-sm">{allergy.severity}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">No allergies found.</p>
                )}

                <Button
                    onClick={() => window.location.href = '/preferences'}
                    className="w-full mt-5"
                >
                    Edit Preferences
                </Button>
            </div>
        </SidebarInset>
    )
}
