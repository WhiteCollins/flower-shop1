"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { FLOWER_CATEGORIES } from "../types"
import { useFlowerForm } from "../hooks/use-flower-form"
import type { FlowerFormData } from "../types"

interface FlowerFormProps {
  initialData?: FlowerFormData
  flowerId?: string
  title: string
  description: string
}

export function FlowerForm({ initialData, flowerId, title, description }: FlowerFormProps) {
  const { formData, isSubmitting, error, handleChange, handleImageChange, handleSelectChange, handleSubmit, handleCancel } = useFlowerForm(
    {
      initialData,
      flowerId,
    },
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Precio (€)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={formData.category.toString()} onValueChange={handleSelectChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {FLOWER_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Imagen</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  // Crear URL del objeto para la vista previa
                  const fileUrl = URL.createObjectURL(e.target.files[0]);
                  handleImageChange(fileUrl);
                }
              }}
            />
            {formData.image && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-1">Vista previa:</p>
                <img 
                  src={formData.image} 
                  alt="Vista previa" 
                  className="w-32 h-32 object-cover rounded-md" 
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : flowerId ? "Guardar Cambios" : "Guardar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

