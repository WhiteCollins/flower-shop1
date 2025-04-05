"use client"

import { useState, useEffect, useMemo } from "react"
import type { Flower, FlowerFilters } from "../types"
import { FlowerService } from "../services/flower-service"

export function useFlowers(initialFilters: FlowerFilters = { searchTerm: "", category: "all" }) {
  const [flowers, setFlowers] = useState<Flower[]>([])
  const [filters, setFilters] = useState<FlowerFilters>(initialFilters)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar flores al montar el componente
  useEffect(() => {
    try {
      // Inicializar con datos de ejemplo si no hay datos
      FlowerService.initializeWithSampleData()

      // Cargar flores
      const loadedFlowers = FlowerService.getAll()
      setFlowers(loadedFlowers)
    } catch (error) {
      console.error("Error al cargar flores:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Filtrar flores según los criterios
  const filteredFlowers = useMemo(() => {
    return flowers.filter((flower) => {
      const { searchTerm, category } = filters

      const matchesSearch =
        flower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flower.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = category === "all" || flower.category === category

      return matchesSearch && matchesCategory
    })
  }, [flowers, filters])

  // Obtener categorías únicas para los filtros
  const categories = useMemo(() => {
    const uniqueCategories = ["all", ...new Set(flowers.map((flower) => flower.category))]
    return uniqueCategories
  }, [flowers])

  // Actualizar filtros
  const updateFilters = (newFilters: Partial<FlowerFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  // Eliminar una flor
  const deleteFlower = (id: string) => {
    try {
      FlowerService.delete(id)
      setFlowers((prev) => prev.filter((flower) => flower.id !== id))
    } catch (error) {
      console.error("Error al eliminar flor:", error)
    }
  }

  return {
    flowers: filteredFlowers,
    categories,
    filters,
    isLoading,
    updateFilters,
    deleteFlower,
  }
}

