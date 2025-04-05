"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

import { Header } from "../components/header"
import { StatCard } from "../components/stats/stat-card"
import { ChartCard } from "../components/stats/chart-card"
import { useStats } from "../hooks/use-stats"
import { formatPrice } from "../lib/utils"

// Colores para gráficos
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

export default function StatsPage() {
  const { isLoading, totalValue, totalItems, flowers, categoryData, inventoryValueData } = useStats()

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto p-4 md:p-6 flex items-center justify-center">
          <p>Cargando estadísticas...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Estadísticas de Inventario</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <StatCard title="Valor Total del Inventario" value={formatPrice(totalValue)} />

          <StatCard title="Total de Flores en Inventario" value={totalItems} />

          <StatCard title="Tipos de Flores" value={flowers.length} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ChartCard title="Distribución por Categoría" description="Cantidad de flores por categoría">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No hay datos suficientes</p>
              </div>
            )}
          </ChartCard>

          <ChartCard title="Top 5 Flores por Valor" description="Valor total en inventario">
            {inventoryValueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={inventoryValueData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip formatter={(value) => [`$${value}`, "Valor"]} />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No hay datos suficientes</p>
              </div>
            )}
          </ChartCard>
        </div>
      </main>
    </div>
  )
}

