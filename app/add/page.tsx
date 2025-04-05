"use client"



import { Header } from "../components/header"
import { FlowerForm } from "../components/flower-form"



export default function AddFlowerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <FlowerForm
            title="Añadir Nueva Flor"
            description="Completa el formulario para añadir una nueva flor al inventario."
          />
        </div>
      </main>
    </div>
  )
}

