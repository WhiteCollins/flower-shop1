"use client"

import { Card, CardContent } from "@/components/ui/card"

import { Header } from "./components/header"
import { FlowerCard } from "./components/flower-card"
import { CategoryTabs } from "./components/category-tabs"
import { SearchBar } from "./components/search-bar"
import { useFlowers } from "./hooks/use-flowers"

export default function Home() {
  const { flowers, categories, filters, updateFilters, deleteFlower } = useFlowers()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventario de Flores</h1>
            <p className="text-muted-foreground">Gestiona tu inventario de flores fácilmente.</p>
          </div>
          <SearchBar searchTerm={filters.searchTerm} onSearchChange={(value) => updateFilters({ searchTerm: value })} />
        </div>

        <CategoryTabs
          categories={categories}
          activeCategory={filters.category}
          onCategoryChange={(category) => updateFilters({ category })}
        >
          {flowers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {flowers.map((flower) => (
                <FlowerCard key={flower.id} flower={flower} onDelete={deleteFlower} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>No se encontraron flores con los criterios de búsqueda.</p>
              </CardContent>
            </Card>
          )}
        </CategoryTabs>
      </main>
    </div>
  )
}

