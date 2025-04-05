"use client"

import type React from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FLOWER_CATEGORIES } from "../types"

interface CategoryTabsProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  children: React.ReactNode
}



export function CategoryTabs({ categories, activeCategory, onCategoryChange, children }: CategoryTabsProps) {
  return (
    <Tabs value={activeCategory} onValueChange={onCategoryChange}>
      <TabsList className="mb-4">
        <TabsTrigger value="all">Todas</TabsTrigger>
        {categories
          .filter((category) => category !== "all")
          .map((category) => {
            const categoryInfo = FLOWER_CATEGORIES.find((c) => c.value === category)
            return (
              <TabsTrigger key={category} value={category} className="capitalize">
                {categoryInfo?.label || category}
              </TabsTrigger>
            )
          })}
      </TabsList>

      <TabsContent value={activeCategory} className="mt-0">
        {children}
      </TabsContent>
    </Tabs>
  )
}

