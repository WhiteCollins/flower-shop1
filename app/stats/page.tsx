"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "../components/header"
import { FlowerService } from "../services/flower-service"
import { formatPrice } from "../lib/utils"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from "recharts"

export default function StatsPage() {
  const [stats, setStats] = useState<{
    totalValue: number;
    totalItems: number;
    categoryDistribution: { name: string; value: number }[];
    inventoryValue: { name: string; value: number }[];
  }>({
    totalValue: 0,
    totalItems: 0,
    categoryDistribution: [],
    inventoryValue: []
  })

  useEffect(() => {
    const flowers = FlowerService.getAll()
    
    // Calcular el valor total del inventario
    const totalValue = flowers.reduce((total, flower) => {
      return total + (Number(flower.price) * Number(flower.quantity))
    }, 0)
    
    // Calcular el total de items
    const totalItems = flowers.reduce((total, flower) => {
      return total + Number(flower.quantity)
    }, 0)
    
    // Calcular la distribución por categoría
    const categoryMap: Record<string, number> = {}
    flowers.forEach(flower => {
      if (!categoryMap[flower.category]) {
        categoryMap[flower.category] = 0
      }
      categoryMap[flower.category] += Number(flower.quantity)
    })
    
    const categoryDistribution = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value
    }))
    
    // Preparar datos para el gráfico de valor de inventario por categoría
    const valueByCategory: Record<string, number> = {}
    flowers.forEach(flower => {
      if (!valueByCategory[flower.category]) {
        valueByCategory[flower.category] = 0
      }
      valueByCategory[flower.category] += Number(flower.price) * Number(flower.quantity)
    })
    
    const inventoryValue = Object.entries(valueByCategory).map(([name, value]) => ({
      name,
      value
    }))
    
    setStats({
      totalValue,
      totalItems,
      categoryDistribution,
      inventoryValue
    })
  }, [])
  
  // Colores para los gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6">Estadísticas del Inventario</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="total-value-card">
                {formatPrice(stats.totalValue)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="total-items-card">
                {stats.totalItems}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tipos de Flores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="flower-types-card">
                {stats.categoryDistribution.length}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80" data-testid="category-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {stats.categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} unidades`, 'Cantidad']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Valor de Inventario por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80" data-testid="inventory-value-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.inventoryValue}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatPrice(value)} />
                    <Bar dataKey="value" fill="#8884d8">
                      {stats.inventoryValue.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

