"use client"

import { Users, Receipt, ChefHat } from "lucide-react"

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

interface AppSidebarProps {
  scrollToAllergy: () => void
  scrollToRecipeDiet: () => void
  scrollToUserDietAllergyTable: () => void
  scrollToChart: () => void
}

export function AppSidebar({ scrollToUserDietAllergyTable, scrollToAllergy, scrollToRecipeDiet, scrollToChart }: AppSidebarProps) {
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
              <SidebarMenuItem>
                <SidebarMenuButton onClick={scrollToRecipeDiet}>
                  <Receipt className="size-4" />
                  <span>Recipes based on diets</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={scrollToChart}>
                  <Receipt className="size-4" />
                  <span>User to Diet Chart</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={scrollToUserDietAllergyTable}>
                  <Receipt className="size-4" />
                  <span>User Diet and Allergy Table</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={scrollToAllergy}>
                  <Receipt className="size-4" />
                  <span>Allergy Safe Ingredients</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

