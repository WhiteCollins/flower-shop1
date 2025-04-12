import Image from "next/image"
import Link from "next/link"
import { Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import type { Flower } from "../types"
import { DeleteFlowerDialog } from "./delete-flower-dialog"
import { formatPrice, isLowStock } from "../lib/utils"

interface FlowerCardProps {
  flower: Flower
  onDelete: (id: string) => void
}

export function FlowerCard({ flower, onDelete }: FlowerCardProps) {
  return (
    <Card className="overflow-hidden" data-testid="flower-card">
      <div className="aspect-square relative">
        <Image src={flower.image || "/placeholder.svg"} alt={flower.name} fill className="object-cover" />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{flower.name}</CardTitle>
          <Badge 
            variant={isLowStock(flower.quantity) ? "destructive" : "outline"}
            data-testid={isLowStock(flower.quantity) ? "low-stock-indicator" : "stock-indicator"}
          >
            {flower.quantity} en stock
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground text-sm line-clamp-2">{flower.description}</p>
        <p className="font-bold mt-2" data-testid="flower-price">{formatPrice(flower.price)}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between">
        <Link href={`/edit/${flower.id}`}>
          <Button variant="outline" size="sm" data-testid="edit-button">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </Link>
        <DeleteFlowerDialog flowerId={flower.id} onDelete={() => onDelete(flower.id)} />
      </CardFooter>
    </Card>
  )
}

