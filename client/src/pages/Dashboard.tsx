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
    <div className="max-w-full p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into your product information management system
          </p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" size="sm">
          <RefreshCwIcon className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <PackageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.summary.totalProducts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.summary.productsLast7Days > 0 && (
                <span className="text-green-600">
                  +{analytics.summary.productsLast7Days} last 7 days
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <FolderIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.summary.totalCategories.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.topCategories.length} active categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attributes</CardTitle>
            <TagIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.summary.totalAttributes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all attribute sets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Store Views</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.summary.totalStoreViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Multi-store coverage
            </p>
          </CardContent>
        </Card>
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
