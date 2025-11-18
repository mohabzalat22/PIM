// Analytics Interfaces for Dashboard

export interface ProductByType {
  type: string;
  count: number;
}

export interface ProductGrowth {
  date: string;
  count: number;
}

export interface ProductCompleteness {
  complete: number;
  incomplete: number;
  draft: number;
}

export interface TopCategory {
  id: number;
  name: string;
  productCount: number;
  percentage: number;
}

export interface AttributeUsage {
  id: number;
  name: string;
  usageCount: number;
  dataType: string;
}

export interface AssetByType {
  type: string;
  count: number;
}

export interface AssetCoverage {
  withAssets: number;
  withoutAssets: number;
  byType: AssetByType[];
}

export interface StoreViewCoverage {
  id: number;
  name: string;
  code: string;
  productsWithValues: number;
}

export interface TimelineData {
  date: string;
  products: number;
  categories: number;
  attributes: number;
}

export interface AttributeTypeDistribution {
  type: string;
  count: number;
}

export interface AnalyticsSummary {
  totalProducts: number;
  totalCategories: number;
  totalAttributes: number;
  totalStoreViews: number;
  productsLast7Days: number;
}

export interface DashboardAnalytics {
  productsByType: ProductByType[];
  productGrowth: ProductGrowth[];
  productCompleteness: ProductCompleteness;
  topCategories: TopCategory[];
  attributeUsage: AttributeUsage[];
  assetCoverage: AssetCoverage;
  storeViewCoverage: StoreViewCoverage[];
  timeline: TimelineData[];
  attributeTypeDistribution: AttributeTypeDistribution[];
  summary: AnalyticsSummary;
}

