# Mi Floristería - Documentación

## Descripción General

Mi Floristería es una aplicación web para la gestión de inventario de una tienda de flores. Permite a los usuarios administrar el catálogo de flores, realizar un seguimiento del stock, categorizar los productos y visualizar estadísticas sobre el inventario.

## Tecnologías Utilizadas

- **Frontend**: Next.js, React, TypeScript
- **UI**: Tailwind CSS, Shadcn UI
- **Gráficos**: Recharts
- **Formularios**: React Hook Form
- **Validación**: Zod

## Estructura del Proyecto

```
flower-shop/
├── app/                    # Aplicación principal
│   ├── add/                # Página para añadir flores
│   ├── edit/               # Página para editar flores
│   ├── stats/              # Página de estadísticas
│   ├── components/         # Componentes específicos de la aplicación
│   │   ├── flower-card.tsx # Tarjeta para mostrar información de la flor
│   │   ├── flower-form.tsx # Formulario para añadir/editar flores
│   │   ├── header.tsx      # Encabezado de la aplicación
│   │   └── ...
│   ├── hooks/              # Hooks personalizados
│   ├── lib/                # Utilidades y funciones auxiliares
│   ├── services/           # Servicios para comunicación con datos
│   ├── types/              # Definiciones de tipos
│   └── globals.css         # Estilos globales
├── components/             # Componentes UI reutilizables
│   └── ui/                 # Componentes de interfaz de usuario
├── hooks/                  # Hooks globales
├── lib/                    # Utilidades globales
├── public/                 # Archivos estáticos
└── ...
```

## Características Principales

### Gestión de Inventario
- Añadir nuevas flores al inventario
- Editar información de flores existentes
- Eliminar flores del inventario
- Visualizar detalles de cada flor

### Categorización
- Filtrar flores por categoría
- Organizar el inventario de manera eficiente

### Analíticas
- Ver estadísticas sobre el inventario
- Gráficos de distribución por categoría
- Información sobre stock y precios

## Guía de Instalación

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd flower-shop
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre tu navegador en [http://localhost:3000](http://localhost:3000)

## Uso de la Aplicación

### Añadir una Flor

1. Navega a la página "Añadir Nueva Flor"
2. Completa el formulario con la información requerida:
   - Nombre de la flor
   - Descripción
   - Precio
   - Cantidad en stock
   - Categoría
   - Imagen (opcional)
3. Haz clic en "Guardar"

### Editar una Flor

1. Desde la página principal, selecciona la flor que deseas editar
2. Haz clic en el botón de edición
3. Modifica los campos necesarios
4. Guarda los cambios

### Ver Estadísticas

1. Navega a la sección "Estadísticas"
2. Visualiza los gráficos y datos sobre el inventario

## Estructura de Datos

### Flor
```typescript
interface Flower {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
}
```

## Convenciones de Desarrollo

### Ramas de Git
- `main`: Código de producción
- `developer`: Código en desarrollo
- `qa`: Código en pruebas
- `feature/{nombre_feature}`: Nuevas características

### Convenciones de Código
- Nombres de componentes en PascalCase
- Nombres de funciones en camelCase
- Nombres de archivos en kebab-case
- Uso de interfaces para definir tipos

## Contribución

Para contribuir al proyecto:
1. Crea una rama a partir de `developer`
2. Realiza tus cambios
3. Envía un pull request a `developer`

## Roadmap

Características planificadas para futuras versiones:
- Sistema de alertas de inventario
- Módulo de ventas
- Analíticas avanzadas
- Gestión de proveedores
- Importación/exportación de datos


## Contacto

Collinsjcwhite@gmail.com
```

Este README proporciona una documentación completa del proyecto Mi Floristería, incluyendo su estructura, características, guías de instalación y uso, y otra información relevante para desarrolladores y usuarios.
