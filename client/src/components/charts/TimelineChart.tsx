import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TimelineData } from "@/interfaces/analytics.interface";

interface TimelineChartProps {
  data: TimelineData[];
}

export function TimelineChart({ data }: TimelineChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Growth Timeline</CardTitle>
          <CardDescription>Overall system growth over the last 30 days</CardDescription>
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
        <CardTitle>System Growth Timeline</CardTitle>
        <CardDescription>Overall system growth over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(221 83% 53%)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(221 83% 53%)" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorCategories" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorAttributes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(262 83% 58%)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(262 83% 58%)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'currentColor', fontSize: 12 }}
              stroke="currentColor"
              style={{ color: 'hsl(var(--foreground))' }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
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
              labelFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString();
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="products" 
              stroke="hsl(221 83% 53%)" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorProducts)"
              name="Products"
            />
            <Area 
              type="monotone" 
              dataKey="categories" 
              stroke="hsl(142 76% 36%)" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCategories)"
              name="Categories"
            />
            <Area 
              type="monotone" 
              dataKey="attributes" 
              stroke="hsl(262 83% 58%)" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAttributes)"
              name="Attributes"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
