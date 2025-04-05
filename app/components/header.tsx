import Link from "next/link"
import { Flower2 } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Flower2 className="h-6 w-6 text-rose-500" />
          <span>Mi Floristería</span>
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Inventario
          </Link>
          <Link
            href="/stats"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Estadísticas
          </Link>
        </nav>
      </div>
    </header>
  )
}

