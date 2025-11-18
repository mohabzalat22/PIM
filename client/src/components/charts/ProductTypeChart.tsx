import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductByType } from "@/interfaces/analytics.interface";

interface ProductTypeChartProps {
  data: ProductByType[];
}

export function ProductTypeChart({ data }: ProductTypeChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Products by Type</CardTitle>
          <CardDescription>Distribution of products across different types</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products by Type</CardTitle>
        <CardDescription>Distribution of products across different types</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="type" 
              tick={{ fill: 'currentColor', fontSize: 12 }}
              stroke="currentColor"
              style={{ color: 'hsl(var(--foreground))' }}
            />
            <YAxis 
              tick={{ fill: 'currentColor', fontSize: 12 }}
              stroke="currentColor"
              style={{ color: 'hsl(var(--foreground))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))'
              }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
            />
            <Legend />
            <Bar 
              dataKey="count" 
              fill="hsl(142 76% 36%)" 
              name="Products"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
