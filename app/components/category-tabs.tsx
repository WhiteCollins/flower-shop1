"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FLOWER_CATEGORIES } from "../types"

interface CategoryTabsProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
  children: React.ReactNode
}

export function CategoryTabs({ activeCategory, onCategoryChange, children }: CategoryTabsProps) {
  return (
    <Tabs defaultValue={activeCategory} onValueChange={onCategoryChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
        <TabsTrigger value="all" data-testid="category-tab">Todas</TabsTrigger>
        {FLOWER_CATEGORIES.map((category) => (
          <TabsTrigger key={category.value} value={category.value} data-testid="category-tab">
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={activeCategory} className="w-full">
        {children}
      </TabsContent>
    </Tabs>
  )
}

