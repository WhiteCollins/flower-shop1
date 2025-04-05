export interface Flower {
  id: string
  name: string
  price: number | string
  quantity: number | string
  category: string
  description: string
  image: string
}

export type FlowerFormData = Omit<Flower, "id">

export interface FlowerFilters {
  searchTerm: string
  category: string
}

export const FLOWER_CATEGORIES = [
  { value: "roses", label: "Rosas" },
  { value: "tulips", label: "Tulipanes" },
  { value: "sunflowers", label: "Girasoles" },
  { value: "lilies", label: "Lirios" },
  { value: "orchids", label: "Orquídeas" },
  { value: "other", label: "Otros" },
]

export const INITIAL_FLOWER_DATA: FlowerFormData = {
  name: "",
  price: "",
  quantity: "",
  category: "",
  description: "",
  image: "/placeholder.svg?height=200&width=200",
}

