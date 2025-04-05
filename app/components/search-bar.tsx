"use client"

import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

export function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <div className="flex gap-2 w-full md:w-auto">
      <Input
        placeholder="Buscar flores..."
        className="max-w-[300px]"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Link href="/add">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Flor
        </Button>
      </Link>
    </div>
  )
}

