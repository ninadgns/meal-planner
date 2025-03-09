"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  Utensils, BarChart, ShieldCheck, Eye, List, Package, ChefHat
} from "lucide-react" // Import icons

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
  scrollToView: () => void
}

export function AppSidebar({ scrollToUserDietAllergyTable, scrollToAllergy, scrollToRecipeDiet, scrollToChart, scrollToView }: AppSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState<string>("")

  // Update active section on scroll (only for in-page sections)
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "recipe-diet", ref: scrollToRecipeDiet },
        { id: "chart", ref: scrollToChart },
        { id: "user-diet-allergy", ref: scrollToUserDietAllergyTable },
        { id: "allergy", ref: scrollToAllergy },
        { id: "view", ref: scrollToView }
      ]

      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const menuItems = [
    { text: "Recipes based on diets", id: "recipe-diet", onClick: scrollToRecipeDiet, icon: Utensils },
    { text: "User to Diet Chart", id: "chart", onClick: scrollToChart, icon: BarChart },
    { text: "User Diet and Allergy Table", id: "user-diet-allergy", onClick: scrollToUserDietAllergyTable, icon: ShieldCheck },
    { text: "Allergy Safe Ingredients", id: "allergy", onClick: scrollToAllergy, icon: ShieldCheck },
    { text: "Database Views", id: "view", onClick: scrollToView, icon: Eye },
    { text: "Recipe Management", path: "/admin/recipe-management", icon: List },
    { text: "Ingredient Management", path: "/admin/ingredient-management", icon: Package }
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
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
              {menuItems.map(({ text, id, onClick, path, icon: Icon }, index) => {
                const isActive = path ? pathname === path : activeSection === id
                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton
                      onClick={path ? () => router.push(path) : onClick}
                      className={`flex items-center gap-3 px-4 py-2 w-full rounded-md shadow-sm transition-all duration-300
                          ${isActive ? "bg-primary text-secondary shadow-md" : "bg-secondary hover:bg-primary hover:text-secondary hover:shadow-md"}
                        `}
                    >
                      <Icon className={`size-5 transition-colors ${isActive ? "text-white" : "text-gray-500"}`} />
                      <span>{text}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
