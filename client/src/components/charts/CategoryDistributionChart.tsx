import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TopCategory } from "@/interfaces/analytics.interface";

interface CategoryDistributionChartProps {
  data: TopCategory[];
}

const COLORS = [
  'hsl(142 76% 36%)', // Green
  'hsl(221 83% 53%)', // Blue
  'hsl(262 83% 58%)', // Purple
  'hsl(346 77% 50%)', // Red
  'hsl(24 95% 53%)',  // Orange
  'hsl(199 89% 48%)', // Cyan
  'hsl(271 91% 65%)', // Violet
  'hsl(142 71% 45%)', // Teal
  'hsl(48 96% 53%)',  // Yellow
  'hsl(339 90% 51%)', // Pink
];

export function CategoryDistributionChart({ data }: CategoryDistributionChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Categories</CardTitle>
          <CardDescription>Categories with the most products</CardDescription>
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
        <CardTitle>Top Categories</CardTitle>
        <CardDescription>Categories with the most products</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              type="number"
              tick={{ fill: 'currentColor', fontSize: 12 }}
              stroke="currentColor"
              style={{ color: 'hsl(var(--foreground))' }}
            />
            <YAxis 
              type="category"
              dataKey="name" 
              tick={{ fill: 'currentColor', fontSize: 12 }}
              stroke="currentColor"
              style={{ color: 'hsl(var(--foreground))' }}
              width={120}
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
              dataKey="productCount" 
              name="Product Count"
              radius={[0, 8, 8, 0]}
            >
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
