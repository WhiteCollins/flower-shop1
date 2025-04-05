import { v4 as uuidv4 } from "uuid"
import type { Flower, FlowerFormData } from "../types"
import { normalizeFlower } from "../lib/utils"

const STORAGE_KEY = "flowers"


/**
 * Servicio para manejar las operaciones CRUD de flores en localStorage
 */
export const FlowerService = {

  getAll(): Flower[] {
    try {
      const storedFlowers = localStorage.getItem(STORAGE_KEY)
      if (!storedFlowers) return []

      const flowers: Flower[] = JSON.parse(storedFlowers)
      return flowers.map(normalizeFlower)
    } catch (error) {
      console.error("Error al obtener flores:", error)
      return []
    }
  },

  /**
   * Obtiene una flor por su ID
   */
  getById(id: string): Flower | null {
    try {
      const flowers = this.getAll()
      return flowers.find((flower) => flower.id === id) || null
    } catch (error) {
      console.error(`Error al obtener flor con ID ${id}:`, error)
      return null
    }
  },

  /**
   * Crea una nueva flor
   */
  create(flowerData: FlowerFormData): Flower {
    try {
      const flowers = this.getAll()

      const newFlower: Flower = {
        ...flowerData,
        id: uuidv4(),
      }

      const normalizedFlower = normalizeFlower(newFlower)
      const updatedFlowers = [...flowers, normalizedFlower]

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFlowers))
      return normalizedFlower
    } catch (error) {
      console.error("Error al crear flor:", error)
      throw new Error("No se pudo crear la flor")
    }
  },

  /**
   * Actualiza una flor existente
   */
  update(id: string, flowerData: FlowerFormData): Flower {
    try {
      const flowers = this.getAll()
      const flowerIndex = flowers.findIndex((flower) => flower.id === id)

      if (flowerIndex === -1) {
        throw new Error(`No se encontró flor con ID ${id}`)
      }

      const updatedFlower: Flower = {
        ...flowerData,
        id,
      }

      const normalizedFlower = normalizeFlower(updatedFlower)
      flowers[flowerIndex] = normalizedFlower

      localStorage.setItem(STORAGE_KEY, JSON.stringify(flowers))
      return normalizedFlower
    } catch (error) {
      console.error(`Error al actualizar flor con ID ${id}:`, error)
      throw new Error("No se pudo actualizar la flor")
    }
  },

  /**
   * Elimina una flor
   */
  delete(id: string): void {
    try {
      const flowers = this.getAll()
      const updatedFlowers = flowers.filter((flower) => flower.id !== id)

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFlowers))
    } catch (error) {
      console.error(`Error al eliminar flor con ID ${id}:`, error)
      throw new Error("No se pudo eliminar la flor")
    }
  },

  /**
   * Inicializa el almacenamiento con datos de ejemplo si está vacío
   */
  initializeWithSampleData(): void {
    if (this.getAll().length > 0) return

    const sampleFlowers: FlowerFormData[] = [
      {
        name: "Rosa Roja",
        price: 5.99,
        quantity: 25,
        category: "roses",
        description: "Hermosa rosa roja, perfecta para ocasiones románticas.",
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        name: "Tulipán Amarillo",
        price: 3.99,
        quantity: 30,
        category: "tulips",
        description: "Tulipán amarillo brillante, ideal para alegrar cualquier espacio.",
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        name: "Girasol",
        price: 4.5,
        quantity: 15,
        category: "sunflowers",
        description: "Girasol grande y radiante, perfecto para decoración.",
        image: "/placeholder.svg?height=200&width=200",
      },
    ]

    sampleFlowers.forEach((flower) => this.create(flower))
  },
}

