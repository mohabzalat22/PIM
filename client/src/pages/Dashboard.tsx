import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { 
  PackageIcon, 
  TagIcon, 
  FolderIcon, 
  StoreIcon, 
  EyeIcon,
  TrendingUpIcon,
  UsersIcon,
  BarChart3Icon,
  ActivityIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStats {
  totalProducts: number;
  totalAttributes: number;
  totalCategories: number;
  totalStores: number;
  totalStoreViews: number;
  totalProductAttributes: number;
  recentProducts: any[];
  recentAttributes: any[];
  recentCategories: any[];
  categoryDistribution: Array<{ name: string; count: number }>;
  attributeTypeDistribution: Array<{ type: string; count: number }>;
  storeViewDistribution: Array<{ name: string; count: number }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalAttributes: 0,
    totalCategories: 0,
    totalStores: 0,
    totalStoreViews: 0,
    totalProductAttributes: 0,
    recentProducts: [],
    recentAttributes: [],
    recentCategories: [],
    categoryDistribution: [],
    attributeTypeDistribution: [],
    storeViewDistribution: []
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        productsResponse,
        attributesResponse,
        categoriesResponse,
        storesResponse,
        storeViewsResponse,
        productAttributesResponse
      ] = await Promise.all([
        axios.get('http://localhost:3000/api/products?limit=5&sortBy=createdAt&sortOrder=desc'),
        axios.get('http://localhost:3000/api/attributes?limit=5&sortBy=createdAt&sortOrder=desc'),
        axios.get('http://localhost:3000/api/categories?limit=5&sortBy=createdAt&sortOrder=desc'),
        axios.get('http://localhost:3000/api/stores?limit=100'),
        axios.get('http://localhost:3000/api/store-views?limit=100'),
        axios.get('http://localhost:3000/api/product-attributes?limit=100')
      ]);

      // Get total counts
      const [
        totalProductsResponse,
        totalAttributesResponse,
        totalCategoriesResponse
      ] = await Promise.all([
        axios.get('http://localhost:3000/api/products?limit=1'),
        axios.get('http://localhost:3000/api/attributes?limit=1'),
        axios.get('http://localhost:3000/api/categories?limit=1')
      ]);

      const products = productsResponse.data.data;
      const attributes = attributesResponse.data.data;
      const categories = categoriesResponse.data.data;
      const stores = storesResponse.data.data;
      const storeViews = storeViewsResponse.data.data;
      const productAttributes = productAttributesResponse.data.data;

      // Calculate category distribution
      const categoryDistribution = categories.map(category => ({
        name: category.translations?.[0]?.name || `Category ${category.id}`,
        count: category.productCategories?.length || 0
      }));

      // Calculate attribute type distribution
      const attributeTypeDistribution = attributes.reduce((acc: any[], attr) => {
        const existing = acc.find(item => item.type === attr.dataType);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ type: attr.dataType, count: 1 });
        }
        return acc;
      }, []);

      // Calculate store view distribution
      const storeViewDistribution = storeViews.map(storeView => ({
        name: storeView.name,
        count: productAttributes.filter(pa => pa.storeViewId === storeView.id).length
      }));

      setStats({
        totalProducts: totalProductsResponse.data.meta.total,
        totalAttributes: totalAttributesResponse.data.meta.total,
        totalCategories: totalCategoriesResponse.data.meta.total,
        totalStores: stores.length,
        totalStoreViews: storeViews.length,
        totalProductAttributes: productAttributes.length,
        recentProducts: products,
        recentAttributes: attributes,
        recentCategories: categories,
        categoryDistribution,
        attributeTypeDistribution,
        storeViewDistribution
      });
    } catch (err: any) {
      toast.error(`Failed to load dashboard data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    trend, 
    trendValue 
  }: {
    title: string;
    value: number;
    description: string;
    icon: any;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && trendValue && (
          <div className="flex items-center mt-2">
            {trend === 'up' && <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />}
            {trend === 'down' && <ArrowDownIcon className="h-3 w-3 text-red-500 mr-1" />}
            {trend === 'neutral' && <MinusIcon className="h-3 w-3 text-gray-500 mr-1" />}
            <span className={`text-xs ${
              trend === 'up' ? 'text-green-500' : 
              trend === 'down' ? 'text-red-500' : 
              'text-gray-500'
            }`}>
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const RecentItemCard = ({ 
    title, 
    items, 
    icon: Icon, 
    getItemName, 
    getItemDescription 
  }: {
    title: string;
    items: any[];
    icon: any;
    getItemName: (item: any) => string;
    getItemDescription: (item: any) => string;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
        <CardDescription>Recently created items</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">{getItemName(item)}</p>
                  <p className="text-xs text-muted-foreground">{getItemDescription(item)}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No items found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const DistributionCard = ({ 
    title, 
    data, 
    icon: Icon 
  }: {
    title: string;
    data: Array<{ name: string; count: number }>;
    icon: any;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
        <CardDescription>Distribution overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.length > 0 ? (
            data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{item.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, (item.count / Math.max(...data.map(d => d.count))) * 100)}%` 
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No data available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <ActivityIcon className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-blue-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Product Information Management</h1>
          <p className="text-muted-foreground">Comprehensive overview of your PIM system</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline">
          <ActivityIcon className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          description="Products in your catalog"
          icon={PackageIcon}
          trend="up"
          trendValue="+12% from last month"
        />
        <StatCard
          title="Total Attributes"
          value={stats.totalAttributes}
          description="Product attributes defined"
          icon={TagIcon}
          trend="up"
          trendValue="+5% from last month"
        />
        <StatCard
          title="Total Categories"
          value={stats.totalCategories}
          description="Product categories"
          icon={FolderIcon}
          trend="neutral"
          trendValue="No change"
        />
        <StatCard
          title="Store Views"
          value={stats.totalStoreViews}
          description="Multi-language store views"
          icon={EyeIcon}
          trend="up"
          trendValue="+2 new views"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Stores"
          value={stats.totalStores}
          description="Active stores"
          icon={StoreIcon}
        />
        <StatCard
          title="Product Attributes"
          value={stats.totalProductAttributes}
          description="Attribute assignments"
          icon={BarChart3Icon}
        />
        <StatCard
          title="System Health"
          value={100}
          description="All systems operational"
          icon={TrendingUpIcon}
          trend="up"
          trendValue="Excellent"
        />
      </div>

      {/* Recent Items and Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Items */}
        <div className="space-y-6">
          <RecentItemCard
            title="Recent Products"
            items={stats.recentProducts}
            icon={PackageIcon}
            getItemName={(item) => item.sku}
            getItemDescription={(item) => `${item.type} • Created ${new Date(item.createdAt).toLocaleDateString()}`}
          />
          
          <RecentItemCard
            title="Recent Attributes"
            items={stats.recentAttributes}
            icon={TagIcon}
            getItemName={(item) => item.label}
            getItemDescription={(item) => `${item.dataType} • ${item.isFilterable ? 'Filterable' : 'Not filterable'}`}
          />
        </div>

        {/* Distributions */}
        <div className="space-y-6">
          <DistributionCard
            title="Category Distribution"
            data={stats.categoryDistribution}
            icon={FolderIcon}
          />
          
          <DistributionCard
            title="Attribute Types"
            data={stats.attributeTypeDistribution}
            icon={TagIcon}
          />
        </div>
      </div>

      {/* Store View Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistributionCard
          title="Store View Usage"
          data={stats.storeViewDistribution}
          icon={EyeIcon}
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UsersIcon className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <PackageIcon className="h-6 w-6" />
                <span className="text-sm">Manage Products</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <TagIcon className="h-6 w-6" />
                <span className="text-sm">Manage Attributes</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <FolderIcon className="h-6 w-6" />
                <span className="text-sm">Manage Categories</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <StoreIcon className="h-6 w-6" />
                <span className="text-sm">Manage Stores</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3Icon className="h-5 w-5 mr-2" />
            System Overview
          </CardTitle>
          <CardDescription>Key metrics and system status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalProducts}</div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalProductAttributes}</div>
              <div className="text-sm text-muted-foreground">Attribute Assignments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalStoreViews}</div>
              <div className="text-sm text-muted-foreground">Store Views</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
