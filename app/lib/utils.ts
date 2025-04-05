import type { Flower } from "../types"

/**
 * Asegura que un valor sea un número válido
 */
export function ensureNumber(value: string | number, defaultValue = 0): number {
  if (typeof value === "number") return value
  const parsed = Number.parseFloat(value)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * Normaliza los datos de una flor para asegurar que los valores numéricos sean correctos
 */
export function normalizeFlower(flower: Flower): Flower {
  return {
    ...flower,
    price: ensureNumber(flower.price),
    quantity: ensureNumber(flower.quantity),
  }
}

/**
 * Formatea un precio como string con 2 decimales
 */
export function formatPrice(price: string | number): string {
  return `$${ensureNumber(price).toFixed(2)}`
}

/**
 * Determina si una cantidad está baja en inventario
 */
export function isLowStock(quantity: string | number): boolean {
  return ensureNumber(quantity) <= 10
}

