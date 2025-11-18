import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AttributeUsage } from "@/interfaces/analytics.interface";

interface AttributeUsageChartProps {
  data: AttributeUsage[];
}

export function AttributeUsageChart({ data }: AttributeUsageChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Most Used Attributes</CardTitle>
          <CardDescription>Attributes with the highest usage count</CardDescription>
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
        <CardTitle>Most Used Attributes</CardTitle>
        <CardDescription>Attributes with the highest usage count</CardDescription>
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
              width={100}
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
              formatter={(value: number) => [value, 'Usage Count']}
            />
            <Legend />
            <Bar 
              dataKey="usageCount" 
              fill="hsl(346 77% 50%)" 
              name="Usage Count"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
