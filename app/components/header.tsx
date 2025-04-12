import Link from "next/link"
import { BarChart } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">Flower Shop</Link>
        <div className="flex items-center space-x-4">
          <Link href="/stats" data-testid="stats-link">
            <div className="flex items-center">
              <BarChart className="h-5 w-5 mr-1" />
              <span>Estadísticas</span>
            </div>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

