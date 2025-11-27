import { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  PackageIcon, 
  TagIcon, 
  FolderIcon,
  ActivityIcon,
  TrendingUpIcon,
  RefreshCwIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsService } from "@/services/analytics.service";
import type { DashboardAnalytics } from "@/interfaces/analytics.interface";

// Import chart components
import { ProductTypeChart } from "@/components/charts/ProductTypeChart";
import { ProductGrowthChart } from "@/components/charts/ProductGrowthChart";
import { CategoryDistributionChart } from "@/components/charts/CategoryDistributionChart";
import { AssetCoverageChart } from "@/components/charts/AssetCoverageChart";
import { StoreViewChart } from "@/components/charts/StoreViewChart";
import { AttributeUsageChart } from "@/components/charts/AttributeUsageChart";
import { TimelineChart } from "@/components/charts/TimelineChart";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await AnalyticsService.getDashboard();
      
      if (response.success) {
        setAnalytics(response.data);
      } else {
        toast.error("Failed to load dashboard analytics");
      }
    } catch (err: unknown) {
      console.error("Dashboard error:", err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Failed to load dashboard: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <ActivityIcon className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading dashboard analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">No data available</p>
          <Button onClick={fetchDashboardData}>
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Real-time insights into your product information management system
          </p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" size="default" className="gap-2">
          <RefreshCwIcon className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="data-card group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              <PackageIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="metric-label">Total Products</p>
            <p className="metric-value">{analytics.summary.totalProducts.toLocaleString()}</p>
            {analytics.summary.productsLast7Days > 0 && (
              <div className="metric-trend-up">
                <TrendingUpIcon className="h-3 w-3" />
                <span>+{analytics.summary.productsLast7Days} last 7 days</span>
              </div>
            )}
          </div>
        </div>

        <div className="data-card group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-chart-2/20 text-chart-2 group-hover:bg-chart-2/30 transition-colors">
              <FolderIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="metric-label">Total Categories</p>
            <p className="metric-value">{analytics.summary.totalCategories.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              {analytics.topCategories.length} active categories
            </p>
          </div>
        </div>

        <div className="data-card group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-chart-3/20 text-chart-3 group-hover:bg-chart-3/30 transition-colors">
              <TagIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="metric-label">Total Attributes</p>
            <p className="metric-value">{analytics.summary.totalAttributes.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              Across all attribute sets
            </p>
          </div>
        </div>

        <div className="data-card group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-chart-4/20 text-chart-4 group-hover:bg-chart-4/30 transition-colors">
              <TrendingUpIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="metric-label">Store Views</p>
            <p className="metric-value">{analytics.summary.totalStoreViews.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              Multi-store coverage
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row 1: Product Type & Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductTypeChart data={analytics.productsByType} />
        <ProductGrowthChart data={analytics.productGrowth} />
      </div>

      {/* Charts Row 2: Categories & Product Completeness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryDistributionChart data={analytics.topCategories} />
        <AssetCoverageChart data={analytics.productCompleteness} />
      </div>

      {/* Charts Row 3: Attribute Usage & Store Views */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttributeUsageChart data={analytics.attributeUsage} />
        <StoreViewChart data={analytics.storeViewCoverage} />
      </div>

      {/* Charts Row 4: Timeline (Full Width) */}
      <div className="w-full">
        <TimelineChart data={analytics.timeline} />
      </div>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>System Health & Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {analytics.assetCoverage.withAssets}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Products with Assets</div>
              <div className="text-xs text-muted-foreground mt-1">
                {analytics.assetCoverage.withoutAssets} without
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {analytics.productCompleteness.complete}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Complete Products</div>
              <div className="text-xs text-muted-foreground mt-1">
                {analytics.productCompleteness.incomplete} incomplete
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {analytics.attributeTypeDistribution.length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Attribute Types</div>
              <div className="text-xs text-muted-foreground mt-1">
                In use across system
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
