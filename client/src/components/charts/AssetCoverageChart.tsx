import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductCompleteness } from "@/interfaces/analytics.interface";

interface AssetCoverageChartProps {
  data: ProductCompleteness;
}

const COLORS = {
  complete: 'hsl(142 76% 36%)',   // Green - Complete
  incomplete: 'hsl(24 95% 53%)',  // Orange - Incomplete
  draft: 'hsl(240 5% 64%)'        // Gray - Draft
};

export function AssetCoverageChart({ data }: AssetCoverageChartProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Completeness</CardTitle>
          <CardDescription>Status of product data completeness</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    { name: 'Complete', value: data.complete, color: COLORS.complete },
    { name: 'Incomplete', value: data.incomplete, color: COLORS.incomplete },
    { name: 'Draft', value: data.draft, color: COLORS.draft },
  ].filter(item => item.value > 0);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Completeness</CardTitle>
          <CardDescription>Status of product data completeness</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No products found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Completeness</CardTitle>
        <CardDescription>Status of product data completeness</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label={(entry) => `${entry.name}: ${entry.value}`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
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
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
