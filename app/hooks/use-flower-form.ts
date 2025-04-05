"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { FlowerFormData } from "../types"
import { FlowerService } from "../services/flower-service"
import { INITIAL_FLOWER_DATA } from "../types"

interface UseFlowerFormProps {
  initialData?: FlowerFormData
  flowerId?: string
  onSuccess?: () => void
}

export function useFlowerForm({ initialData = INITIAL_FLOWER_DATA, flowerId, onSuccess }: UseFlowerFormProps = {}) {
  const router = useRouter()
  const [formData, setFormData] = useState<FlowerFormData>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditMode = Boolean(flowerId)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Función adicional para manejar cambios de imagen directamente
  const handleImageChange = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      image: imageUrl,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (isEditMode && flowerId) {
        FlowerService.update(flowerId, formData)
      } else {
        FlowerService.create(formData)
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ha ocurrido un error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/")
  }

  return {
    formData,
    isSubmitting,
    error,
    isEditMode,
    handleChange,
    handleImageChange,
    handleSelectChange,
    handleSubmit,
    handleCancel,
  }
}

