// Aquí definimos los tipos y constantes para la aplicación

// Tipos de datos para las flores
export interface Flower {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  description: string;
  image?: string;
}

export type FlowerFormData = Omit<Flower, 'id'>;

// Categorías de flores disponibles
export const FLOWER_CATEGORIES = [
  { value: "roses", label: "Rosas" },
  { value: "tulips", label: "Tulipanes" },
  { value: "lilies", label: "Lirios" },
  { value: "sunflowers", label: "Girasoles" },
  { value: "orchids", label: "Orquídeas" }
];
