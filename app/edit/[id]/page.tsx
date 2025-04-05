"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"

import { Header } from "../../components/header"
import { FlowerForm } from "../../components/flower-form"
import { FlowerService } from "../../services/flower-service"
import type { FlowerFormData } from "../../types"

export default function EditFlowerPage() {
  const params = useParams()
  const id = params.id as string

  const [flowerData, setFlowerData] = useState<FlowerFormData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFlower = async () => {
      try {
        const flower = FlowerService.getById(id)
        if (!flower) {
          return notFound()
        }
        setFlowerData(flower)
      } catch (error) {
        console.error("Error al cargar la flor:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    loadFlower()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto p-4 md:p-6 flex items-center justify-center">
          <p>Cargando...</p>
        </main>
      </div>
    )
  }

  if (!flowerData) {
    return notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <FlowerForm
            initialData={flowerData}
            flowerId={id}
            title="Editar Flor"
            description="Actualiza la información de esta flor."
          />
        </div>
      </main>
    </div>
  )
}

