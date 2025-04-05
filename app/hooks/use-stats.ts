"use client"

import { useState, useEffect, useMemo } from "react"
import type { Flower } from "../types"
import { FlowerService } from "../services/flower-service"
import { ensureNumber } from "../lib/utils"

export function useStats() {
  const [flowers, setFlowers] = useState<Flower[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const loadedFlowers = FlowerService.getAll()
      setFlowers(loadedFlowers)
    } catch (error) {
      console.error("Error al cargar datos para estadísticas:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Calcular valor total del inventario
  const totalValue = useMemo(() => {
    return flowers.reduce((sum, flower) => {
      return sum + ensureNumber(flower.price) * ensureNumber(flower.quantity)
    }, 0)
  }, [flowers])

  // Calcular total de items en inventario
  const totalItems = useMemo(() => {
    return flowers.reduce((sum, flower) => {
      return sum + ensureNumber(flower.quantity)
    }, 0)
  }, [flowers])

  // Datos para gráfico de distribución por categoría
  const categoryData = useMemo(() => {
    return flowers.reduce((acc: { name: string; value: number }[], flower) => {
      const quantity = ensureNumber(flower.quantity)
      const existingCategory = acc.find((item) => item.name === flower.category)

      if (existingCategory) {
        existingCategory.value += quantity
      } else if (flower.category) {
        acc.push({ name: flower.category, value: quantity })
      }

      return acc
    }, [])
  }, [flowers])

  // Datos para gráfico de valor por flor
  const inventoryValueData = useMemo(() => {
    return flowers
      .map((flower) => ({
        name: flower.name,
        value: ensureNumber(flower.price) * ensureNumber(flower.quantity),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5) // Top 5 por valor
  }, [flowers])

  return {
    flowers,
    isLoading,
    totalValue,
    totalItems,
    categoryData,
    inventoryValueData,
  }
}

