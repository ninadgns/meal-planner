"use client"

import { Utensils, BarChart, ShieldCheck, Eye, Database, List, Package, ChefHat } from "lucide-react"; // Import icons

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"

interface AppSidebarProps {
  scrollToAllergy: () => void
  scrollToRecipeDiet: () => void
  scrollToUserDietAllergyTable: () => void
  scrollToChart: () => void
  scrollToView: () => void
}

export function AppSidebar({ scrollToUserDietAllergyTable, scrollToAllergy, scrollToRecipeDiet, scrollToChart, scrollToView }: AppSidebarProps) {
  const router = useRouter();
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg ">
                <ChefHat />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Admin Dashboard</span>
                <span className="text-xs text-muted-foreground">Tables & Navigation</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {[
                { text: "Recipes based on diets", onClick: scrollToRecipeDiet, icon: Utensils },
                { text: "User to Diet Chart", onClick: scrollToChart, icon: BarChart },
                { text: "User Diet and Allergy Table", onClick: scrollToUserDietAllergyTable, icon: ShieldCheck },
                { text: "Allergy Safe Ingredients", onClick: scrollToAllergy, icon: ShieldCheck },
                { text: "Database Views", onClick: scrollToView, icon: Eye },
                { text: "Recipe Management", onClick: () => router.push("/admin/recipe-management"), icon: List },
                { text: "Ingredient Management", onClick: () => router.push("/admin/ingredient-management"), icon: Package }
              ].map(({ text, onClick, icon: Icon }, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    onClick={onClick}
                    className="flex items-center gap-3 px-4 py-2 w-full rounded-md 
                         bg-secondary shadow-sm transition-all duration-300
                         hover:bg-primary hover:text-secondary hover:shadow-md"
                  >
                    <Icon className="size-5 text-gray-500 transition-colors" />
                    <span>{text}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}

